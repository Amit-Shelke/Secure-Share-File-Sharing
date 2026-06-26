# Secure-Share Local Setup Guide

This guide provides step-by-step instructions for setting up the Secure-Share platform on your local machine.

## Prerequisites
Before you begin, ensure you have the following installed:
1. **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
2. **PostgreSQL** (or a free Neon.tech cloud database)
3. A **Cloudinary** Account (for secure media storage)
4. A **Gmail** Account (for sending automated emails)

---

## Step 1: Extract and Open the Project
1. Extract the downloaded `Secure-Share-File-Sharing.zip` file to your desired folder.
2. Open the extracted folder in your code editor (e.g., VS Code).
3. Open a new terminal window inside the root directory.

---

## Step 2: Install Dependencies
The project contains both a React frontend (Vite) and a Node.js Express backend. You need to install dependencies for both.

**Install Frontend Dependencies:**
```bash
npm install
```

**Install Backend Dependencies:**
```bash
cd server
npm install
cd ..
```

---

## Step 3: Configure Environment Variables
You must configure the backend to connect to your database, cloud storage, and email services.

1. Navigate to the `server/` directory and create a new file named `.env`.
2. Paste the following template into the `.env` file and replace the values with your actual credentials:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Neon PostgreSQL Database
DATABASE_URL=postgresql://<username>:<password>@<host>/<database>?sslmode=require

# Security Secret
JWT_SECRET=your_super_secret_jwt_key_here

# Cloudinary Storage
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# SMTP Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_16_character_app_password
```

---

## Step 4: Run the Application

The project is configured to run both the frontend and backend simultaneously for development.

1. From the root directory (`Secure-Share-File-Sharing`), run:
```bash
npm run dev
```
*(If this command fails, you can run the frontend in one terminal with `npm run dev`, and the backend in another terminal with `cd server && node index.js`)*

2. Open your browser and navigate to:
**http://localhost:5173**

---

## Step 5: Initial Setup & Verification
1. **Create an Account:** Click on "Register" and create your first account.
2. **Verify Database:** The application will automatically create all necessary tables (`users`, `shared_files`, `audit_logs`) upon the first startup.
3. **Test Uploads:** Upload a test image file and verify that the SHA-256 hash is generated and the file appears in "My Files".

You are now ready to use the Secure-Share platform locally!
