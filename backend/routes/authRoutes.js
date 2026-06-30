const express = require("express");
const router = express.Router();

const {
  adminLogin,
  forgotPassword,
  resetPassword,
} = require("../controllers/authController"); 

router.post("/login", adminLogin);

// ── New: Password Reset Flow ──
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

module.exports = router;