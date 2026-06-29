const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASS,
  },
});

// Verify SMTP connection when the server starts
transporter.verify((error) => {
  if (error) {
    console.error("Mail Server Error:", error.message);
  } else {
    console.log("Mail Server Ready");
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

    console.log(`Email sent to ${to}`);
    return info;

  } catch (error) {
    console.error("Email Error:", error.message);
    throw error;
  }
};

module.exports = sendEmail;