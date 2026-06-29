const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");

const {
  getSettings,
  updateSettings,
} = require("../controllers/settingsController");

/* ================= SETTINGS ROUTES ================= */

// Get Settings
// GET /api/v1/settings
router.get("/", verifyToken, getSettings);

// Update Settings
// PUT /api/v1/settings
router.put("/", verifyToken, updateSettings);

module.exports = router;