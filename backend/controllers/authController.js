const Admin = require('../models/Admin');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

// ── EXISTING: Admin Login (unchanged) ──
exports.adminLogin = async (req, res) => {
  try {
    const { email, password } = req.value || req.body;

    const admin = await Admin.findOne({ email: email.toUpperCase() });
    if (!admin) {
      return res.status(401).json({ success: false, message: "INVALID ACCESS CREDENTIALS" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "INVALID ACCESS CREDENTIALS" });
    }

    const token = jwt.sign(
      { id: admin._index || admin._id, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(200).json({
      success: true,
      token,
      role: admin.role,
      admin: {
        id: admin._id,
        email: admin.email,
        role: admin.role,
      },
    });

  } catch (error) {
    res.status(500).json({ success: false, message: "SERVER ERROR" });
  }
};


// ── NEW: Forgot Password — Send reset link to registered email ──
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required." });
    }

    // Find admin by email (uppercase match — உங்க schema uppercase: true)
    const admin = await Admin.findOne({ email: email.toUpperCase().trim() });

    // Security: don't reveal if email exists or not
    if (!admin) {
      return res.status(200).json({
        message: "If this email is registered, a reset link has been sent.",
      });
    }

    // Generate secure random token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenHash = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // Save hashed token + 15 min expiry
    admin.resetPasswordToken = resetTokenHash;
    admin.resetPasswordExpiry = Date.now() + 15 * 60 * 1000;
    await admin.save();

    // Reset URL — frontend page
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    // Gmail transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Mugil SP Fitness" <${process.env.GMAIL_USER}>`,
      to: admin.email,
      subject: "Password Reset Request — Mugil SP Fitness",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; background: #0d0d11; color: #e2e8f0; border-radius: 16px; overflow: hidden;">
          <div style="background: #ff4a4a; padding: 24px 32px;">
            <h1 style="margin: 0; color: white; font-size: 18px; font-weight: 900; letter-spacing: 2px;">MUGIL SP FITNESS</h1>
            <p style="margin: 4px 0 0; color: rgba(255,255,255,0.7); font-size: 11px; text-transform: uppercase; letter-spacing: 1px;">Admin Password Reset</p>
          </div>
          <div style="padding: 32px;">
            <p style="color: #94a3b8; font-size: 13px; line-height: 1.6; margin: 0 0 24px;">
              We received a request to reset the password for your admin account. Click the button below to set a new password.
            </p>
            <a href="${resetUrl}" style="display: inline-block; background: #ff4a4a; color: white; text-decoration: none; padding: 14px 28px; border-radius: 10px; font-weight: 700; font-size: 13px; letter-spacing: 1px; text-transform: uppercase;">
              Reset My Password
            </a>
            <p style="color: #64748b; font-size: 11px; margin: 24px 0 0; line-height: 1.6;">
              This link expires in <strong style="color: #e2e8f0;">15 minutes</strong>. If you didn't request this, you can safely ignore this email.
            </p>
            <p style="color: #64748b; font-size: 11px; margin: 12px 0 0;">
              Or copy this link:<br/>
              <span style="color: #94a3b8; word-break: break-all;">${resetUrl}</span>
            </p>
          </div>
          <div style="padding: 16px 32px; border-top: 1px solid #1e1e2e; text-align: center;">
            <p style="color: #334155; font-size: 10px; margin: 0; text-transform: uppercase; letter-spacing: 1px;">Mugil Fitness CRM © 2026</p>
          </div>
        </div>
      `,
    });

    return res.status(200).json({
      message: "Password reset link sent to your registered email.",
    });

  } catch (error) {
    console.error("Forgot password error:", error);
    return res.status(500).json({ message: "Something went wrong. Please try again." });
  }
};


// ── NEW: Reset Password — Verify token and update password ──
exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters." });
    }

    // Hash the token from URL to match stored hash
    const tokenHash = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    // Find admin with valid token that hasn't expired
    const admin = await Admin.findOne({
      resetPasswordToken: tokenHash,
      resetPasswordExpiry: { $gt: Date.now() },
    });

    if (!admin) {
      return res.status(400).json({
        message: "This reset link is invalid or has expired. Please request a new one.",
      });
    }

    // NOTE: Admin schema-ல் pre('save') hook password hash பண்ணுது
    // அதனால direct assign பண்ணா போதும் — bcrypt manually call தேவையில்லை
    admin.password = newPassword;

    // Clear reset token
    admin.resetPasswordToken = undefined;
    admin.resetPasswordExpiry = undefined;

    await admin.save();

    return res.status(200).json({
      message: "Password updated successfully. You can now sign in.",
    });

  } catch (error) {
    console.error("Reset password error:", error);
    return res.status(500).json({ message: "Something went wrong. Please try again." });
  }
};