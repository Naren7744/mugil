const Settings = require("../models/Settings");

// ======================================
// GET SETTINGS
// ======================================
const getSettings = async (req, res) => {
  try {
    // Always return one doc; create with defaults if missing
    let settings = await Settings.findOne();

    if (!settings) {
      settings = await Settings.create({});
    }

    return res.status(200).json({
      success: true,
      data: settings,
    });
  } catch (error) {
    console.error("getSettings error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch settings.",
    });
  }
};

// ======================================
// UPDATE SETTINGS
// ======================================
const updateSettings = async (req, res) => {
  try {
    const {
      // Gym Info
      gymName,
      phone,
      email,
      gst,
      currency,
      timezone,

      // Admin / Security
      adminName,
      adminEmail,
      sessionTimeout,
      twoFactorAuth,

      // Finance
      upiId,
      lateFee,
      invoicePrefix,
      gstSlab,
      convenienceFee,

      // Notifications (nested)
      notifications,
    } = req.body;

    // Build update payload — only include defined fields
    const updatePayload = {};

    if (gymName     !== undefined) updatePayload.gymName     = gymName;
    if (phone       !== undefined) updatePayload.phone       = phone;
    if (email       !== undefined) updatePayload.email       = email;
    if (gst         !== undefined) updatePayload.gst         = gst;
    if (currency    !== undefined) updatePayload.currency    = currency;
    if (timezone    !== undefined) updatePayload.timezone    = timezone;

    if (adminName      !== undefined) updatePayload.adminName      = adminName;
    if (adminEmail     !== undefined) updatePayload.adminEmail     = adminEmail;
    if (sessionTimeout !== undefined) updatePayload.sessionTimeout = Number(sessionTimeout);
    if (twoFactorAuth  !== undefined) updatePayload.twoFactorAuth  = twoFactorAuth;

    if (upiId          !== undefined) updatePayload.upiId          = upiId;
    if (lateFee        !== undefined) updatePayload.lateFee        = Number(lateFee);
    if (invoicePrefix  !== undefined) updatePayload.invoicePrefix  = invoicePrefix;
    if (gstSlab        !== undefined) updatePayload.gstSlab        = Number(gstSlab);
    if (convenienceFee !== undefined) updatePayload.convenienceFee = Number(convenienceFee);

    // Merge notifications object safely
    if (notifications && typeof notifications === "object") {
      const notifFields = [
        "expiryReminderSMS",
        "expiryReminderWA",
        "paymentReminderSMS",
        "paymentReminderEmail",
        "welcomeMessageWA",
        "birthdayWishesWA",
      ];
      notifFields.forEach((key) => {
        if (notifications[key] !== undefined) {
          updatePayload[`notifications.${key}`] = notifications[key];
        }
      });
    }

    const updated = await Settings.findOneAndUpdate(
      {},
      { $set: updatePayload },
      {
        new: true,       // return updated doc
        upsert: true,    // create if not found
        runValidators: true,
      }
    );

    return res.status(200).json({
      success: true,
      message: "Settings updated successfully.",
      data: updated,
    });
  } catch (error) {
    console.error("updateSettings error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to update settings.",
    });
  }
};

module.exports = {
  getSettings,
  updateSettings,
};