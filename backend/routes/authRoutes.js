const express = require("express");
const router = express.Router();

const {
  adminLogin,
  forgotPassword,
  resetPassword,
} = require("../controllers/authController"); // உங்க controller path check பண்ணு

// ── Existing ──
router.post("/login", adminLogin);

// ── New: Password Reset Flow ──
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

module.exports = router;