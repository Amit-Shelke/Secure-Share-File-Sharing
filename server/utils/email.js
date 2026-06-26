const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const sendShareEmail = async (toEmail, fromName, fileName) => {
  try {
    const loginUrl = 'http://localhost:5173/login'; // Frontend URL

    const mailOptions = {
      from: `"Secure Share" <${process.env.SMTP_USER}>`,
      to: toEmail,
      subject: `Secure Share: ${fromName} shared a file with you`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h2 style="color: #6C63FF;">Secure Share</h2>
          </div>
          <p style="font-size: 16px; color: #333;">Hello,</p>
          <p style="font-size: 16px; color: #333;">
            <strong>${fromName}</strong> has securely shared a file with you: <strong>${fileName}</strong>.
          </p>
          <p style="font-size: 16px; color: #333;">
            For security reasons, this file is encrypted and securely stored on our platform. To access it, please log in to your Secure Share account.
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${loginUrl}" style="background-color: #6C63FF; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 16px;">
              Access Your File
            </a>
          </div>
          <p style="font-size: 14px; color: #777;">
            If you do not have an account, you will need to register using this email address to view the file.
          </p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="font-size: 12px; color: #aaa; text-align: center;">
            This is an automated message from Secure Share. Please do not reply.
          </p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Message sent: %s', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};

module.exports = { sendShareEmail };
