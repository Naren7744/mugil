const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,          // TLS
  requireTLS: true,

  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASS,
  },

  family: 4, // Force IPv4
});

// Verify SMTP connection
transporter.verify((error, success) => {
  if (error) {
    console.error("Mail Server Error:", error);
  } else {
    console.log("✅ Mail Server Ready");
  }
});

const sendEmail = async ({ to, subject, html }) => {
  try {
    const info = await transporter.sendMail({
      from: `"Mugil SP Fitness" <${process.env.GMAIL_USER}>`,
      to,
      subject,
      html,
    });

    console.log("✅ Email Sent:", info.messageId);

    return info;
  } catch (error) {
    console.error("❌ Email Error:", error);

    throw error;
  }
};

module.exports = sendEmail;