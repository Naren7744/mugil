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

router.post("/", verifyToken, createMember);

router.get("/", verifyToken, getAllMembers);

router.get("/stats", verifyToken, getDashboardStats);

router.get("/:id", verifyToken, getMemberById);

router.put("/:id", verifyToken, updateMember);

router.delete("/:id", verifyToken, deleteMember);

/* ================= PAYMENT ================= */

router.put("/collect-payment/:id", verifyToken, collectPayment);

router.put("/renew/:id", verifyToken, renewMember);

module.exports = router;