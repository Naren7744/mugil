const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");

const {
  createBranch,
  getAllBranches,
  getBranchById,
  updateBranch,
  deleteBranch,
  getBranchStats,
  getNextBranchCode,
} = require("../controllers/branchController");

/* ================= BRANCH ROUTES ================= */

router.post("/", verifyToken, createBranch);

router.get("/stats", verifyToken, getBranchStats);

router.get("/", verifyToken, getAllBranches);

router.get("/next-code", verifyToken, getNextBranchCode);

router.get("/:id", verifyToken, getBranchById);

router.put("/:id", verifyToken, updateBranch);

router.delete("/:id", verifyToken, deleteBranch);

module.exports = router;