# Secure-Share Platform: Comprehensive Project Report

## 1. Executive Summary
Secure-Share is an enterprise-grade, zero-trust file-sharing platform designed for maximum data protection, forensic accountability, and dynamic access control. It combines industry-standard encryption, cloud storage, PostgreSQL relational databases, and unique security features such as "Burn After Reading" and dynamic, identity-based watermarking.

This document serves as a comprehensive technical report outlining the architecture, features, implementation details, and step-by-step testing procedures.

---

## 2. Platform Architecture & File Structure

### Tech Stack
*   **Frontend:** React (Vite), Tailwind CSS, Lucide Icons, React Router DOM
*   **Backend:** Node.js, Express.js
*   **Database:** PostgreSQL (Neon.tech) with `pg` driver
*   **Storage:** Cloudinary (Dynamic API)
*   **Authentication:** JWT (JSON Web Tokens), bcrypt (Password Hashing)
*   **Email:** Nodemailer (SMTP)

### Key File Structure
*   **`/src/`** (Frontend Code)
    *   `main.jsx` & `App.jsx`: Application entry points and routing logic.
    *   `/pages/`: Contains all main dashboard views (`DashboardPage`, `MyFilesPage`, `ShareFilePage`, `SharedWithMePage`, `UploadPage`, `AuditLogPage`, `VerifyFilePage`).
    *   `/context/AuthContext.jsx`: Manages global JWT state and user sessions.
    *   `/components/`: Reusable UI components (`DashboardLayout`, `Sidebar`, `Logo`).
    *   `index.css`: Global Tailwind configurations and custom glassmorphism styles.
*   **`/server/`** (Backend Code)
    *   `index.js`: Express app initialization, static file serving, and global error handling.
    *   `db.js`: PostgreSQL connection pool setup and automatic table schema generation.
    *   `/routes/auth.js`: Registration, login, and JWT generation endpoints.
    *   `/routes/files.js`: Core logic for uploading to Cloudinary, sharing, secure downloading, watermarking, and audit logging.
    *   `/middleware/auth.js`: JWT verification interceptor for protected routes.
*   **`/api/`** (Deployment)
    *   `index.js`: Vercel Serverless Function entry point bridging the Express app.

---

## 3. Core Features & Implementation Details

### Feature 1: Role-Based Authentication & Sessions
**Logic:**
*   Users register via `/api/auth/register`. Their passwords are encrypted using `bcrypt.hash()` with a 10-round salt before being stored in PostgreSQL.
*   Upon login, `bcrypt.compare()` verifies the hash. A JSON Web Token (JWT) is issued, containing the `user.id`.
*   The frontend stores the JWT in `localStorage` and attaches it as a `Bearer` token in the `Authorization` header for all subsequent API calls.
*   The `server/middleware/auth.js` intercepts requests, verifies the JWT signature, and injects `req.user` into the request lifecycle.

### Feature 2: Secure File Upload & Integrity Hashing
**Logic:**
*   Files are uploaded via `UploadPage.jsx`. Before transmission, the frontend uses the Web Crypto API (`crypto.subtle.digest('SHA-256')`) to calculate a cryptographic hash of the file's binary buffer.
*   The file and hash are sent to the `/api/files/upload` endpoint.
*   The backend uses `multer` to handle the multipart form data, then streams the buffer directly to Cloudinary using `cloudinary.uploader.upload_stream`.
*   The resulting secure URL, original filename, size, and SHA-256 hash are saved to the `users_files` table in PostgreSQL.

### Feature 3: Dynamic Identity-Based Watermarking (View Only)
**Logic:**
*   When a user shares a file with "View Only" permissions, the system prevents raw file downloads.
*   In `SharedWithMePage.jsx`, clicking "View Securely" triggers a POST request to `/api/files/download-shared/:id`.
*   The backend validates permissions. For "View Only" images, it dynamically generates a Cloudinary transformation URL.
*   It retrieves the recipient's email from the database, URL-encodes it, and applies it as a 45-degree angled, semi-transparent text overlay (`l_text:Arial_45_bold_white:...`) directly onto the image pixels via Cloudinary's rendering engine.

### Feature 4: Zero-Trust Secure Viewer Modal
**Logic:**
*   To enforce "View Only" constraints, the frontend does not open the image in a new tab. Instead, it renders a custom React modal (`SharedWithMePage.jsx`).
*   This modal implements aggressive UI hardening:
    *   `onContextMenu={(e) => e.preventDefault()}` blocks right-click "Save Image As" menus.
    *   `draggable="false"` prevents drag-and-drop extraction.
    *   An absolute-positioned transparent `<div>` covers the entire image, intercepting all physical clicks.

### Feature 5: "Burn After Reading" (One-Time Downloads)
**Logic:**
*   During sharing (`ShareFilePage.jsx`), the sender can toggle the `is_one_time` boolean flag.
*   When the recipient accesses the file via `/api/files/download-shared/:id`, the backend checks this flag.
*   If `is_one_time` is true, the backend executes an atomic SQL `DELETE` query immediately after retrieving the URL, permanently erasing the share record.
*   Subsequent attempts to access the file will return a 404/403 error.

### Feature 6: Forensic Audit Trail & Real-Time Email Notifications
**Logic:**
*   Every critical action (Upload, Share, Access, Burn) is intercepted by the backend and logged into the `audit_logs` PostgreSQL table, associating the `user_id`, `action`, `file_name`, and timestamp.
*   When a file is successfully shared, the backend utilizes `nodemailer` to connect to Gmail's SMTP servers and dispatches a professional HTML email notification to the recipient, containing their unique access instructions and optional PINs.

---

## 4. Comprehensive Testing Guide

Follow these steps to manually verify the platform's security and functionality.

### Test Case 1: Authentication & Registration
1. Navigate to `/register`. Attempt to register an account.
2. Verify that the database `users` table contains the new record and the password is encrypted.
3. Logout and login. Verify the JWT token is successfully stored in the browser's Local Storage.

### Test Case 2: File Upload & Integrity Checking
1. Login as User A. Navigate to **Upload File**.
2. Select a PDF or Image. Note the SHA-256 hash displayed in the success message.
3. Navigate to **My Files** and verify the file appears with its corresponding size and hash.
4. Navigate to **Verify File**. Re-upload the exact same file from your computer. The system should confirm the SHA-256 hash matches the blockchain registry.

### Test Case 3: Standard Sharing & Email Delivery
1. Login as User A. Navigate to **Share File**.
2. Select a file, enter User B's email address, select "Download" permission, and set a PIN (e.g., `1234`).
3. Check User B's email inbox. Verify the HTML email arrived containing the correct file name and sender details.

### Test Case 4: PIN Verification & Download
1. Login as User B (the recipient). Navigate to **Shared With Me**.
2. Locate the file. Attempt to download it *without* entering the PIN. The system should reject the request.
3. Enter `1234` in the PIN field and click Download. The file should successfully download to your local machine.

### Test Case 5: View-Only Watermarking & Secure Modal
1. Login as User A. Share an image file with User B, selecting **"View Only"** permission.
2. Login as User B. Navigate to **Shared With Me**.
3. Notice the button says **"View Securely"**. Click it.
4. The Secure Viewer Modal will open. Verify that User B's email address is diagonally stamped across the image.
5. Attempt to right-click the image. Verify the context menu does not appear.
6. Attempt to click and drag the image to your desktop. Verify it is blocked by the transparent overlay.

### Test Case 6: Burn After Reading (Self-Destruct)
1. Login as User A. Share a file with User B, check the **"Burn After Reading"** toggle.
2. Login as User B. Navigate to **Shared With Me**. The file should display a red "One-Time Link" badge.
3. Click to download or view the file. Close the modal or finish the download.
4. Refresh the **Shared With Me** page. The file should permanently disappear from the list.
5. Check the `audit_logs` in the database (or **Audit Trail** page as User A) to verify a "BURN_AFTER_READING" or "DOWNLOADED" event was logged.

---

## 5. Security Summary & Conclusion
By enforcing zero-trust data retrieval (never exposing raw URLs to the frontend without backend proxy validation) and utilizing dynamic Cloudinary transformations, Secure-Share guarantees that data owners retain complete sovereignty over their assets even after they leave their local environment. The implementation of SHA-256 integrity checks ensures protection against man-in-the-middle data tampering.
