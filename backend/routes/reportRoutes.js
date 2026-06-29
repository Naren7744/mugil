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

// Dashboard Metrics
// GET /api/v1/reports/dashboard
router.get("/dashboard", verifyToken, getDashboardMetrics);

// Dashboard Charts
// GET /api/v1/reports/charts
router.get("/charts", verifyToken, getChartData);

/* ================= REPORTS ================= */

// Expiring Members
// GET /api/v1/reports/expiring-members
router.get(
  "/expiring-members",
  verifyToken,
  getExpiringMembersReport
);

// Pending Fees
// GET /api/v1/reports/pending-fees
router.get(
  "/pending-fees",
  verifyToken,
  getPendingFeesReport
);

// Today Collection
// GET /api/v1/reports/today-collection
router.get(
  "/today-collection",
  verifyToken,
  getTodayCollectionReport
);

// Branch Revenue
// GET /api/v1/reports/branch-revenue
router.get(
  "/branch-revenue",
  verifyToken,
  getBranchRevenueReport
);

// Active Branches
// GET /api/v1/reports/active-branches
router.get(
  "/active-branches",
  verifyToken,
  getActiveBranchesReport
);

// All Members Report
// GET /api/v1/reports/all-members
router.get(
  "/all-members",
  verifyToken,
  getAllMembersReport
);

module.exports = router;