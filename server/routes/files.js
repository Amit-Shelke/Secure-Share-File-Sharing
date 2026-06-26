const express = require('express');
const { pool } = require('../db');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

// Get dashboard stats
router.get('/stats', authMiddleware, async (req, res) => {
  try {
    const totalFiles = await pool.query('SELECT COUNT(*) FROM files WHERE user_id = $1', [req.user.id]);
    const filesSharedByMe = await pool.query('SELECT COUNT(DISTINCT file_id) FROM shared_files WHERE shared_by = $1', [req.user.id]);
    const filesSharedWithMe = await pool.query('SELECT COUNT(*) FROM shared_files WHERE shared_with = (SELECT email FROM users WHERE id = $1)', [req.user.id]);
    
    // For total storage we would normally sum sizes, here we just return a placeholder or calculate if we stored bytes
    res.json({
      totalFiles: parseInt(totalFiles.rows[0].count),
      filesShared: parseInt(filesSharedByMe.rows[0].count),
      filesReceived: parseInt(filesSharedWithMe.rows[0].count),
      totalStorage: '245 MB' // Placeholder for now
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Get user's audit logs (Feature 3)
router.get('/audit', authMiddleware, async (req, res) => {
  try {
    const logs = await pool.query(`
      SELECT a.id, a.action, a.details, a.created_at as "timestamp", f.name as "fileName"
      FROM audit_logs a
      JOIN files f ON a.file_id = f.id
      WHERE f.user_id = $1
      ORDER BY a.created_at DESC
    `, [req.user.id]);
    res.json(logs.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Get user's recent files
router.get('/recent', authMiddleware, async (req, res) => {
  try {
    const files = await pool.query('SELECT id, name, size, hash, cloudinary_url as "url", upload_date as "uploadedDate" FROM files WHERE user_id = $1 ORDER BY upload_date DESC LIMIT 5', [req.user.id]);
    res.json(files.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Get all user's files
router.get('/my-files', authMiddleware, async (req, res) => {
  try {
    const files = await pool.query('SELECT id, name, size, hash, cloudinary_url as "url", upload_date as "uploadDate" FROM files WHERE user_id = $1 ORDER BY upload_date DESC', [req.user.id]);
    res.json(files.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

const { upload } = require('../config/cloudinary');

// Upload a file to Cloudinary and save to DB
router.post('/upload', authMiddleware, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const { originalname, size, path } = req.file;
    // We can use a generated hash or let the frontend send one. Since it's for secure sharing,
    // we'll accept a hash from frontend or generate a dummy one if not provided
    const hash = req.body.hash || `hash_${Date.now()}`; 
    const fileSize = (size / 1024 / 1024).toFixed(2) + ' MB';

    const newFile = await pool.query(
      'INSERT INTO files (user_id, name, size, hash, cloudinary_url) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [req.user.id, originalname, fileSize, hash, path]
    );
    res.json(newFile.rows[0]);
  } catch (err) {
    console.error('Upload Error:', err.message);
    res.status(500).send('Server Error');
  }
});

// Get files shared with user
router.get('/shared-with-me', authMiddleware, async (req, res) => {
  try {
    const query = `
      SELECT sf.id, f.name as "fileName", 
             u.name as "sharedBy", sf.permission, sf.shared_date as "sharedDate",
             sf.expires_at as "expiresAt", sf.is_one_time as "isOneTime",
             CASE WHEN sf.expires_at IS NOT NULL AND sf.expires_at < NOW() THEN true ELSE false END as "isExpired",
             CASE WHEN sf.pin IS NOT NULL AND sf.pin != '' THEN true ELSE false END as "requiresPin"
      FROM shared_files sf
      JOIN files f ON sf.file_id = f.id
      JOIN users u ON sf.shared_by = u.id
      WHERE sf.shared_with = (SELECT email FROM users WHERE id = $1)
    `;
    const sharedFiles = await pool.query(query, [req.user.id]);
    res.json(sharedFiles.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Verify PIN and get download URL
router.post('/download-shared/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { pin } = req.body;
  try {
    const share = await pool.query(`
      SELECT sf.pin, sf.expires_at, sf.is_one_time, sf.permission, sf.shared_with as "recipientEmail", f.cloudinary_url as "url", f.name as "fileName", f.id as "file_id"
      FROM shared_files sf
      JOIN files f ON sf.file_id = f.id
      WHERE sf.id = $1 AND sf.shared_with = (SELECT email FROM users WHERE id = $2)
    `, [id, req.user.id]);

    if (share.rows.length === 0) return res.status(404).json({ message: 'File not found' });
    const file = share.rows[0];

    if (file.expires_at && new Date(file.expires_at) < new Date()) {
      return res.status(403).json({ message: 'This file access has expired.' });
    }

    if (file.pin && file.pin !== pin) {
      return res.status(401).json({ message: 'Invalid Security PIN.' });
    }

    // Dynamic Watermarking for "View Only"
    let downloadUrl = file.url;
    if (file.permission === 'View Only' && downloadUrl.includes('/upload/')) {
      const emailText = encodeURIComponent(file.recipientEmail);
      // Correct Cloudinary text overlay syntax
      downloadUrl = downloadUrl.replace('/upload/', `/upload/l_text:Arial_35_bold:${emailText},co_white,o_50,a_45/`);
    }

    // Log successful access to audit trail
    await pool.query(
      'INSERT INTO audit_logs (file_id, user_id, action, details) VALUES ($1, $2, $3, $4)',
      [file.file_id, req.user.id, 'ACCESSED', 'Recipient securely accessed the file']
    );

    // One-Time Download logic
    if (file.is_one_time) {
      await pool.query('DELETE FROM shared_files WHERE id = $1', [id]);
      await pool.query(
        'INSERT INTO audit_logs (file_id, user_id, action, details) VALUES ($1, $2, $3, $4)',
        [file.file_id, req.user.id, 'DESTROYED', 'File access auto-destroyed after one-time view']
      );
    }

    res.json({ url: downloadUrl, fileName: file.fileName, permission: file.permission });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Get files shared by user
router.get('/shared-by-me', authMiddleware, async (req, res) => {
  try {
    const query = `
      SELECT sf.id, f.name as "fileName", f.cloudinary_url as "url", sf.shared_with as "sharedWith", sf.permission, sf.shared_date as "sharedDate"
      FROM shared_files sf
      JOIN files f ON sf.file_id = f.id
      WHERE sf.shared_by = $1
    `;
    const sharedFiles = await pool.query(query, [req.user.id]);
    res.json(sharedFiles.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Share a file
router.post('/share', authMiddleware, async (req, res) => {
  const { fileId, email, permission, expiry, pin, isOneTime } = req.body;
  try {
    let expiresAt = null;
    if (expiry === '1hour') expiresAt = new Date(Date.now() + 60 * 60 * 1000);
    else if (expiry === '24hours') expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
    else if (expiry === '7days') expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    const newShare = await pool.query(
      'INSERT INTO shared_files (file_id, shared_by, shared_with, permission, expires_at, pin, is_one_time) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [fileId, req.user.id, email, permission, expiresAt, pin || null, isOneTime || false]
    );

    // Log to audit trail (Feature 3)
    await pool.query(
      'INSERT INTO audit_logs (file_id, user_id, action, details) VALUES ($1, $2, $3, $4)',
      [fileId, req.user.id, 'SHARED', `Shared with ${email} (Permission: ${permission}, Expiry: ${expiry}, One-Time: ${isOneTime})`]
    );

    // Send email notification
    try {
      const fileResult = await pool.query('SELECT name FROM files WHERE id = $1', [fileId]);
      const userResult = await pool.query('SELECT name FROM users WHERE id = $1', [req.user.id]);
      
      if (fileResult.rows.length > 0 && userResult.rows.length > 0) {
        const fileName = fileResult.rows[0].name;
        const fromName = userResult.rows[0].name;
        const { sendShareEmail } = require('../utils/email');
        await sendShareEmail(email, fromName, fileName);
      }
    } catch (emailErr) {
      console.error('Failed to send email notification:', emailErr);
      // Don't throw error to user if email fails, share still succeeds
    }

    res.json(newShare.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Revoke file access
router.delete('/share/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM shared_files WHERE id = $1 AND shared_by = $2', [id, req.user.id]);
    res.json({ message: 'Access revoked' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Verify file hash (simulate blockchain lookup)
router.get('/verify/:hash', authMiddleware, async (req, res) => {
  try {
    const { hash } = req.params;
    const file = await pool.query('SELECT name, upload_date as "uploadDate" FROM files WHERE hash = $1', [hash]);
    
    if (file.rows.length > 0) {
      res.json({ authentic: true, file: file.rows[0] });
    } else {
      res.json({ authentic: false });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
