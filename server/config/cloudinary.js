const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
require('dotenv').config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'secureshare_docs', // Folder name in Cloudinary
    allowed_formats: ['jpg', 'jpeg', 'png', 'pdf', 'docx', 'txt'], // Allowed document/image types
    resource_type: 'auto' // Important for pdfs/docs to be uploaded correctly
  },
});

const upload = multer({ storage: storage });

module.exports = { cloudinary, upload };
