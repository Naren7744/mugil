const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");

const {
  getDashboardMetrics,
  getChartData,
  getExpiringMembersReport,
  getPendingFeesReport,
  getTodayCollectionReport,
  getBranchRevenueReport,
  getActiveBranchesReport,
  getAllMembersReport,
} = require("../controllers/reportController");

/* ================= DASHBOARD REPORTS ================= */


router.get("/dashboard", verifyToken, getDashboardMetrics);


router.get("/charts", verifyToken, getChartData);

/* ================= REPORTS ================= */


router.get(
  "/expiring-members",
  verifyToken,
  getExpiringMembersReport
);


router.get(
  "/pending-fees",
  verifyToken,
  getPendingFeesReport
);


router.get(
  "/today-collection",
  verifyToken,
  getTodayCollectionReport
);


router.get(
  "/branch-revenue",
  verifyToken,
  getBranchRevenueReport
);


router.get(
  "/active-branches",
  verifyToken,
  getActiveBranchesReport
);

router.get(
  "/all-members",
  verifyToken,
  getAllMembersReport
);

module.exports = router;