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

// Create Branch
router.post("/", verifyToken, createBranch);

// Branch Statistics
router.get("/stats", verifyToken, getBranchStats);

// Get All Branches
router.get("/", verifyToken, getAllBranches);

// Get Next Branch Code
router.get("/next-code", verifyToken, getNextBranchCode);

// Get Single Branch
router.get("/:id", verifyToken, getBranchById);

// Update Branch
router.put("/:id", verifyToken, updateBranch);

// Delete Branch
router.delete("/:id", verifyToken, deleteBranch);

module.exports = router;