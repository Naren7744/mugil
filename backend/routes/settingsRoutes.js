const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");

const {
  getSettings,
  updateSettings,
} = require("../controllers/settingsController");

/* ================= SETTINGS ROUTES ================= */


router.get("/", verifyToken, getSettings);


router.put("/", verifyToken, updateSettings);

module.exports = router;