const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");

const {
  createPlan,
  getAllPlans,
  getDeletedPlans,
  getPlanById,
  updatePlan,
  deletePlan,
  restorePlan,
  toggleFeaturedPlan,
  getPlanStats,
  getNextPlanId,
} = require("../controllers/planController");

/* ================= PLAN ROUTES ================= */

router.get("/public", getAllPlans);
// Create Plan
router.post("/", verifyToken, createPlan);

// Get All Plans
router.get("/", verifyToken, getAllPlans);

// Plan Statistics
router.get("/stats", verifyToken, getPlanStats);

// Next Plan ID
router.get("/next-id", verifyToken, getNextPlanId);

// Get Deleted Plans
router.get("/deleted", verifyToken, getDeletedPlans);

// Restore Deleted Plan
router.put("/restore/:id", verifyToken, restorePlan);

// Toggle Featured Plan
router.put("/featured/:id", verifyToken, toggleFeaturedPlan);

// Get Single Plan
router.get("/:id", verifyToken, getPlanById);

// Update Plan
router.put("/:id", verifyToken, updatePlan);

// Delete Plan
router.delete("/:id", verifyToken, deletePlan);

module.exports = router;