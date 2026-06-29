const Contact = require("../models/Contact");
const sendEmail = require("../utils/sendEmail");

// ==========================================
// CREATE NEW CONTACT ENQUIRY
// ==========================================
const createContact = async (req, res) => {
  try {
    const { name, phone, email, goal, message } = req.body;

    // -------------------------
    // Validation
    // -------------------------
    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: "Name is required." });
    }

    if (!phone || !phone.trim()) {
      return res.status(400).json({ success: false, message: "Phone number is required." });
    }

    const cleanPhone = phone.replace(/\D/g, "");

    if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
      return res.status(400).json({ success: false, message: "Invalid phone number." });
    }

    if (email && email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return res.status(400).json({ success: false, message: "Invalid email address." });
    }

    // -------------------------
    // Save Enquiry
    // -------------------------
    const enquiry = await Contact.create({
      name: name.trim(),
      phone: cleanPhone,
      email: email?.trim() || "",
      goal: goal?.trim() || "",
      message: message?.trim() || "",
    });

    // -------------------------
    // Send Admin Notification
    // -------------------------
    try {
      await sendEmail({
        to: process.env.ADMIN_EMAIL,
        subject: "New Contact Enquiry - Mugil SP Fitness",
        html: `
          <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8"/>
            <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
            <title>New Enquiry</title>
          </head>
          <body style="margin:0;padding:0;background-color:#f3f4f6;font-family:'Segoe UI',Arial,sans-serif;">

            <table width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f6;padding:40px 20px;">
              <tr>
                <td align="center">
                  <table width="620" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e5e7eb;">

                    <!-- BANNER -->
                    <tr>
                      <td style="background:#111827;padding:40px 48px 36px;text-align:center;position:relative;">
                        <div style="display:inline-block;background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.12);border-radius:50px;padding:5px 18px;margin-bottom:14px;">
                          <span style="color:#9ca3af;font-size:11px;letter-spacing:3px;text-transform:uppercase;font-weight:700;">Admin Notification</span>
                        </div>
                        <h1 style="margin:0;color:#ffffff;font-size:26px;font-weight:800;letter-spacing:-0.5px;">
                          Mugil <span style="color:#f59e0b;">SP</span> Fitness
                        </h1>
                        <p style="margin:8px 0 0;color:#6b7280;font-size:11px;letter-spacing:2px;text-transform:uppercase;">New Enquiry Received</p>
                        <div style="height:4px;background:linear-gradient(90deg,#f59e0b,#f97316,#ef4444);margin-top:28px;margin-left:-48px;margin-right:-48px;"></div>
                      </td>
                    </tr>

                    <!-- ALERT STRIP -->
                    <tr>
                      <td style="background:#fffbeb;border-bottom:1px solid #fde68a;padding:13px 40px;">
                        <table width="100%" cellpadding="0" cellspacing="0">
                          <tr>
                            <td style="color:#92400e;font-size:13px;font-weight:600;">⚡ New lead just arrived on your website!</td>
                            <td align="right"><span style="background:#f59e0b;color:#fff;font-size:10px;font-weight:800;padding:3px 12px;border-radius:20px;letter-spacing:1px;">NEW</span></td>
                          </tr>
                        </table>
                      </td>
                    </tr>

                    <!-- BODY -->
                    <tr>
                      <td style="padding:32px 40px;">

                        <!-- Section Label -->
                        <p style="margin:0 0 14px;color:#9ca3af;font-size:10px;font-weight:700;letter-spacing:3px;text-transform:uppercase;">Contact Information</p>

                        <!-- 2-col grid via nested table -->
                        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
                          <tr>
                            <td width="48%" style="padding-right:8px;vertical-align:top;">
                              <!-- Name -->
                              <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:10px;padding:14px 16px;margin-bottom:10px;">
                                <div style="color:#9ca3af;font-size:10px;text-transform:uppercase;letter-spacing:1px;margin-bottom:4px;">Full Name</div>
                                <div style="color:#111827;font-size:14px;font-weight:700;">${enquiry.name}</div>
                              </div>
                              <!-- Email -->
                              <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:10px;padding:14px 16px;">
                                <div style="color:#9ca3af;font-size:10px;text-transform:uppercase;letter-spacing:1px;margin-bottom:4px;">Email Address</div>
                                <div style="color:#111827;font-size:14px;font-weight:700;">${enquiry.email || "—"}</div>
                              </div>
                            </td>
                            <td width="4%"></td>
                            <td width="48%" style="vertical-align:top;">
                              <!-- Phone -->
                              <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:10px;padding:14px 16px;margin-bottom:10px;">
                                <div style="color:#9ca3af;font-size:10px;text-transform:uppercase;letter-spacing:1px;margin-bottom:4px;">Phone Number</div>
                                <div style="color:#111827;font-size:14px;font-weight:700;">${enquiry.phone}</div>
                              </div>
                              <!-- Goal -->
                              <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:10px;padding:14px 16px;">
                                <div style="color:#9ca3af;font-size:10px;text-transform:uppercase;letter-spacing:1px;margin-bottom:4px;">Fitness Goal</div>
                                <div style="color:#d97706;font-size:14px;font-weight:700;">${enquiry.goal || "—"}</div>
                              </div>
                            </td>
                          </tr>
                        </table>

                        <!-- Message -->
                        <p style="margin:0 0 12px;color:#9ca3af;font-size:10px;font-weight:700;letter-spacing:3px;text-transform:uppercase;">Message</p>
                        <div style="background:#f9fafb;border-left:4px solid #111827;border-radius:0 10px 10px 0;padding:16px 20px;margin-bottom:28px;">
                          <p style="margin:0;color:#4b5563;font-size:14px;line-height:1.8;">${enquiry.message || "No message provided."}</p>
                        </div>

                        <!-- CTA -->
                        <div style="text-align:center;">
                          <p style="margin:0 0 14px;color:#9ca3af;font-size:12px;">Respond quickly to maximize conversion.</p>
                          <a href="tel:${enquiry.phone}" style="display:inline-block;background:#111827;color:#ffffff;font-weight:700;font-size:13px;padding:13px 36px;border-radius:50px;text-decoration:none;letter-spacing:0.5px;">📞 Call Now</a>
                        </div>

                      </td>
                    </tr>

                    <!-- TIMESTAMP -->
                    <tr>
                      <td style="background:#f9fafb;border-top:1px solid #f3f4f6;padding:12px 40px;text-align:center;">
                        <p style="margin:0;color:#9ca3af;font-size:11px;">⏰ Received on <strong style="color:#6b7280;">${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata", dateStyle: "full", timeStyle: "short" })}</strong></p>
                      </td>
                    </tr>

                    <!-- FOOTER -->
                    <tr>
                      <td style="background:#f3f4f6;border-top:1px solid #e5e7eb;padding:22px 40px;text-align:center;">
                        <p style="margin:0;color:#111827;font-size:13px;font-weight:700;">Mugil SP Fitness</p>
                        <p style="margin:4px 0 0;color:#9ca3af;font-size:12px;">Salem, Tamil Nadu &nbsp;|&nbsp; Admin Notification System</p>
                      </td>
                    </tr>

                  </table>
                </td>
              </tr>
            </table>

          </body>
          </html>
        `,
      });
    } catch (mailError) {
      console.error("Admin Email Error:", mailError.message);
    }

    // -------------------------
    // Send Customer Thank You Email
    // -------------------------
if (enquiry.email?.trim()) {
  try {
    await sendEmail({
      to: enquiry.email,
      subject: "Thank You for Contacting Mugil SP Fitness",
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8"/>
          <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
          <title>Thank You</title>
        </head>
        <body style="margin:0;padding:0;background-color:#f3f4f6;font-family:'Segoe UI',Arial,sans-serif;">

          <table width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f6;padding:40px 20px;">
            <tr>
              <td align="center">
                <table width="620" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e5e7eb;">

                  <!-- BANNER -->
                  <tr>
                    <td style="background:#111827;padding:40px 48px 36px;text-align:center;">
                      <table cellpadding="0" cellspacing="0" style="margin:0 auto 14px;">
                        <tr>
                          <td style="background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.12);border-radius:50px;padding:5px 18px;">
                            <span style="color:#9ca3af;font-size:11px;letter-spacing:3px;text-transform:uppercase;font-weight:700;">Thank You</span>
                          </td>
                        </tr>
                      </table>
                      <h1 style="margin:0;color:#ffffff;font-size:26px;font-weight:800;letter-spacing:-0.5px;">
                        Mugil <span style="color:#34d399;">SP</span> Fitness
                      </h1>
                      <p style="margin:8px 0 0;color:#6b7280;font-size:11px;letter-spacing:2px;text-transform:uppercase;">Salem, Tamil Nadu</p>
                      <table cellpadding="0" cellspacing="0" style="margin:16px auto 0;">
                        <tr>
                          <td style="background:rgba(52,211,153,0.15);border:1px solid rgba(52,211,153,0.3);border-radius:50px;padding:6px 20px;">
                            <span style="color:#34d399;font-size:12px;font-weight:700;">&#10003; Enquiry Received Successfully</span>
                          </td>
                        </tr>
                      </table>
                      <div style="height:4px;background:linear-gradient(90deg,#10b981,#3b82f6,#8b5cf6);margin-top:28px;margin-left:-48px;margin-right:-48px;"></div>
                    </td>
                  </tr>

                  <!-- BODY -->
                  <tr>
                    <td style="padding:32px 40px;">

                      <!-- Greeting -->
                      <h2 style="margin:0 0 10px;color:#111827;font-size:19px;font-weight:700;">Hello, ${enquiry.name}!</h2>
                      <p style="margin:0;color:#6b7280;font-size:14px;line-height:1.8;">
                        Thank you for reaching out to <strong style="color:#111827;">Mugil SP Fitness</strong>. We've received your enquiry and our team will get in touch with you <strong style="color:#111827;">as soon as possible</strong>.
                      </p>

                      <!-- Divider -->
                      <div style="border-top:1px solid #f3f4f6;margin:24px 0;"></div>

                      <!-- Card -->
                      <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:14px;padding:28px;">
                        <div style="font-size:32px;margin-bottom:14px;">&#128236;</div>
                        <h3 style="margin:0 0 10px;color:#111827;font-size:17px;font-weight:700;">We'll be in touch soon!</h3>
                        <p style="margin:0 0 22px;color:#6b7280;font-size:14px;line-height:1.8;">
                          Our team will call you shortly to discuss your fitness goals and help you get started on your transformation journey.
                        </p>
                        <table cellpadding="0" cellspacing="0">
                          <tr>
                            <td style="background:#111827;border-radius:50px;padding:11px 26px;">
                              <span style="color:#ffffff;font-size:13px;font-weight:700;">&#128222; Expect a callback soon</span>
                            </td>
                          </tr>
                        </table>
                      </div>

                      <!-- Quote -->
                      <div style="margin-top:16px;border:1px solid #e5e7eb;border-radius:12px;padding:22px 24px;">
                        <p style="margin:0 0 8px;color:#111827;font-size:14px;font-weight:700;font-style:italic;line-height:1.6;">"Every champion was once a contender that refused to give up."</p>
                        <p style="margin:0;color:#9ca3af;font-size:12px;">&#127942; Your transformation starts today.</p>
                      </div>

                    </td>
                  </tr>

                  <!-- FOOTER -->
                  <tr>
                    <td style="background:#f3f4f6;border-top:1px solid #e5e7eb;padding:22px 40px;text-align:center;">
                      <p style="margin:0;color:#111827;font-size:13px;font-weight:700;">Mugil SP Fitness</p>
                      <p style="margin:4px 0 0;color:#9ca3af;font-size:12px;">Salem, Tamil Nadu &nbsp;|&nbsp; &#128222; +91 80987 12009</p>
                      <p style="margin:10px 0 0;color:#d1d5db;font-size:11px;">This is an automated email. Please do not reply.</p>
                    </td>
                  </tr>

                </table>
              </td>
            </tr>
          </table>

        </body>
        </html>
      `,
    });
  } catch (mailError) {
    console.error("Customer Email Error:", mailError.message);
  }
}

    return res.status(201).json({
      success: true,
      message: "Enquiry submitted successfully.",
      data: enquiry,
    });

  } catch (error) {
    console.error("Create Contact Error:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error." });
  }
};

// ==========================================
// GET ALL CONTACT ENQUIRIES
// ==========================================
const getAllContacts = async (req, res) => {
  try {
    const enquiries = await Contact.find().sort({ createdAt: -1 });
    return res.status(200).json({ success: true, count: enquiries.length, data: enquiries });
  } catch (error) {
    console.error("Get Contacts Error:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error." });
  }
};

// ==========================================
// GET CONTACT BY ID
// ==========================================
const getContactById = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
      return res.status(404).json({ success: false, message: "Contact enquiry not found." });
    }
    return res.status(200).json({ success: true, data: contact });
  } catch (error) {
    console.error("Get Contact Error:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error." });
  }
};

// ==========================================
// UPDATE CONTACT STATUS
// ==========================================
const updateContactStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const allowedStatus = ["New", "Contacted", "Joined", "Closed"];

    if (!allowedStatus.includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status." });
    }

    const updated = await Contact.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: "Contact enquiry not found." });
    }

    return res.status(200).json({ success: true, message: "Status updated successfully.", data: updated });
  } catch (error) {
    console.error("Update Contact Error:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error." });
  }
};

// ==========================================
// DELETE CONTACT
// ==========================================
const deleteContact = async (req, res) => {
  try {
    const deleted = await Contact.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ success: false, message: "Contact enquiry not found." });
    }

    return res.status(200).json({ success: true, message: "Contact enquiry deleted successfully." });
  } catch (error) {
    console.error("Delete Contact Error:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error." });
  }
};

module.exports = {
  createContact,
  getAllContacts,
  getContactById,
  updateContactStatus,
  deleteContact,
};