const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");

const {
  createMember,
  getAllMembers,
  getMemberById,
  updateMember,
  deleteMember,
  collectPayment,
  renewMember,
  getDashboardStats,
} = require("../controllers/memberController");

/* ================= MEMBER CRUD ================= */

// Create Member
router.post("/", verifyToken, createMember);

// Get All Members
router.get("/", verifyToken, getAllMembers);

// Dashboard Stats
router.get("/stats", verifyToken, getDashboardStats);

// Get Single Member
router.get("/:id", verifyToken, getMemberById);

// Update Member
router.put("/:id", verifyToken, updateMember);

// Delete Member
router.delete("/:id", verifyToken, deleteMember);

/* ================= PAYMENT ================= */

// Collect Payment
router.put("/collect-payment/:id", verifyToken, collectPayment);

// Renew Membership
router.put("/renew/:id", verifyToken, renewMember);

module.exports = router;