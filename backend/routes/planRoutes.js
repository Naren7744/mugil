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
router.post("/", verifyToken, createPlan);

router.get("/", verifyToken, getAllPlans);

router.get("/stats", verifyToken, getPlanStats);

router.get("/next-id", verifyToken, getNextPlanId);

router.get("/deleted", verifyToken, getDeletedPlans);

router.put("/restore/:id", verifyToken, restorePlan);

router.put("/featured/:id", verifyToken, toggleFeaturedPlan);

router.get("/:id", verifyToken, getPlanById);

router.put("/:id", verifyToken, updatePlan);

router.delete("/:id", verifyToken, deletePlan);

module.exports = router;