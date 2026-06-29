const mongoose = require("mongoose");

const settingsSchema = new mongoose.Schema(
  {
    // --------------------------
    // Gym Information
    // --------------------------
    gymName: {
      type: String,
      default: "",
      trim: true,
    },

phone: {
  type: String,
  default: "",
  trim: true,
  match: /^[6-9]\d{9}$/,
},

email: {
  type: String,
  default: "",
  lowercase: true,
  trim: true,
  match: /^\S+@\S+\.\S+$/,
},

    gst: {
      type: String,
      default: "",
      uppercase: true,
      trim: true,
      maxlength: 15,
    },

    currency: {
      type: String,
      default: "INR (₹)",
    },

    timezone: {
      type: String,
      default: "IST (UTC+05:30)",
    },

    // --------------------------
    // Admin
    // --------------------------

    adminName: {
      type: String,
      default: "",
      trim: true,
    },

    adminEmail: {
      type: String,
      default: "",
      lowercase: true,
      trim: true,
      match: /^\S+@\S+\.\S+$/,
    },

    sessionTimeout: {
      type: Number,
      default: 30,
      min: 5,
max: 120,
    },

    twoFactorAuth: {
      type: Boolean,
      default: true,
    },

    // --------------------------
    // Finance
    // --------------------------

    upiId: {
      type: String,
      default: "",
      trim: true,
      lowercase: true,
    },

    lateFee: {
      type: Number,
      default: 0,
      min: 0,
    },

    invoicePrefix: {
      type: String,
      default: "MF-INV-",
      trim: true,
    },

    gstSlab: {
      type: Number,
      default: 18,
    },

    convenienceFee: {
      type: Number,
      default: 0,
    },

    // --------------------------
    // Notifications
    // --------------------------

    notifications: {

      expiryReminderSMS: {
        type: Boolean,
        default: true,
      },

      expiryReminderWA: {
        type: Boolean,
        default: true,
      },

      paymentReminderSMS: {
        type: Boolean,
        default: true,
      },

      paymentReminderEmail: {
        type: Boolean,
        default: true,
      },

      welcomeMessageWA: {
        type: Boolean,
        default: true,
      },

      birthdayWishesWA: {
        type: Boolean,
        default: true,
      },

    },

  },
  {
    timestamps: true,
  }
);


module.exports = mongoose.model(
  "Settings",
  settingsSchema
);