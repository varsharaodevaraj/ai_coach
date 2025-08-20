// utils/mailer.js
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,  // your gmail
    pass: process.env.EMAIL_PASS   // app password (not your real gmail pwd!)
  }
});

async function sendReminderMail(to, subject, text) {
  try {
    await transporter.sendMail({
      from: `"DSAMate" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text
    });
    console.log(`📩 Reminder sent to ${to}`);
  } catch (err) {
    console.error("❌ Mail error:", err);
  }
}

module.exports = { sendReminderMail };