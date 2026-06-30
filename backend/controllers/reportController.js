const Member = require("../models/Member");
const Branch = require("../models/Branch");
const getMemberStatus = require("../utils/memberStatus");
const { isDateInPeriod } = require("../utils/dateFilter");

const { calculateFinance } = require("../utils/financeSummary");


// ─── Shared Helpers ───────────────────────────────────────────────────────────


const buildMemberFilter = (branch) => {
  const filter = {};

  // Branch Filter
  if (branch && branch !== "ALL_BRANCHES") {
    filter.branch = branch;
  }


  return filter;
};

const buildBranchFilter = (branch) => {
  const filter = {
    isDeleted: false,
    status: "Active",
  };

  // Branch Filter
  if (branch && branch !== "ALL_BRANCHES") {
    filter.branchCode = branch;
  }

  return filter;
};


// ─── Dashboard Metrics ────────────────────────────────────────────────────────

const getDashboardMetrics = async (req, res) => {
  try {
    const { branch, period = "overall" } = req.query;

    const now = new Date();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayEnd = new Date(today);
    todayEnd.setHours(23, 59, 59, 999);

    const monthStart = new Date(
      now.getFullYear(),
      now.getMonth(),
      1,
      0,
      0,
      0,
      0
    );

    const threeMonthStart = new Date(
      now.getFullYear(),
      now.getMonth() - 2,
      1,
      0,
      0,
      0,
      0
    );

    const memberFilter = buildMemberFilter(branch);
    const members = await Member.find(memberFilter).lean();

    // ================= ACTIVE MEMBERS =================
const activeMemberList = members.filter(
  (member) => getMemberStatus(member.expiryDate) === "Active"
);

const activeMembers = activeMemberList.length;

const finance = calculateFinance(
  members,
  period
);

const totalRevenue =
finance.collection;



    const pendingPayments =
finance.outstanding;

    // ================= EXPIRING MEMBERS =================
    const expiringMembers = members.filter((member) => {
      if (!member.expiryDate) return false;

      const diffDays = Math.ceil(
        (new Date(member.expiryDate) - today) / 86400000
      );

      return diffDays >= 0 && diffDays <= 7;
    }).length;

    // ================= ACTIVE BRANCHES =================
    const branchesReporting = await Branch.countDocuments(
      buildBranchFilter(branch)
    );

    // ================= COLLECTION =================


const todayCollection =
finance.collection;


    // ================= NEW MEMBERS =================
    let newMembers = 0;

    members.forEach((member) => {
      const created = new Date(member.createdAt);

      switch (period) {
        case "today":
          if (
            created >= today &&
            created <= todayEnd
          ) {
            newMembers++;
          }
          break;

        case "thisMonth":
          if (
            created >= monthStart &&
            created <= now
          ) {
            newMembers++;
          }
          break;

        case "last3Months":
          if (
            created >= threeMonthStart &&
            created <= now
          ) {
            newMembers++;
          }
          break;

        case "overall":
        default:
          newMembers++;
      }
    });

    res.status(200).json({
      success: true,
      data: {
        totalRevenue,
        pendingPayments,
        activeMembers,
        expiringMembers,
        branchesReporting,
        todayCollection,
        newMembers,
      },
    });
  } catch (error) {
    console.error("[getDashboardMetrics]", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ─── Chart Data ───────────────────────────────────────────────────────────────

const getChartData = async (req, res) => {
  try {
    const { branch, period = "overall" } = req.query;

    const now = new Date();

    let weeks;

    switch (period) {
      case "today":
        weeks = 1;
        break;

      case "thisMonth":
        weeks = 4;
        break;

      case "last3Months":
      case "overall":
      default:
        weeks = 12;
        break;
    }

    const filter = {};

    if (branch && branch !== "ALL_BRANCHES") {
      filter.branch = branch;
    }

    // Fetch members only once
    const members = await Member.find(filter).lean();

    const revenueChart = [];
    const membershipChart = [];

    for (let w = weeks - 1; w >= 0; w--) {

      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - (w * 7 + 6));
      weekStart.setHours(0, 0, 0, 0);

      const weekEnd = new Date(now);
      weekEnd.setDate(now.getDate() - (w * 7));
      weekEnd.setHours(23, 59, 59, 999);

      const lastWeekStart = new Date(weekStart);
      lastWeekStart.setDate(lastWeekStart.getDate() - 7);

      const lastWeekEnd = new Date(weekEnd);
      lastWeekEnd.setDate(lastWeekEnd.getDate() - 7);

      let thisWeekRevenue = 0;
      let lastWeekRevenue = 0;
      let totalMembers = 0;
      let newMembers = 0;

      members.forEach((member) => {

        const createdAt = new Date(member.createdAt);

        // Members created during this week
        if (
          createdAt >= weekStart &&
          createdAt <= weekEnd
        ) {
          totalMembers++;
          newMembers++;
        }

        // Revenue
        (member.paymentHistory || []).forEach((payment) => {

          

          const paymentDate = new Date(payment.paymentDate);

          if (
            paymentDate >= weekStart &&
            paymentDate <= weekEnd
          ) {
            thisWeekRevenue += Number(payment.amount || 0);
          }

          if (
            paymentDate >= lastWeekStart &&
            paymentDate <= lastWeekEnd
          ) {
            lastWeekRevenue += Number(payment.amount || 0);
          }

        });

      });

      let label;

      switch (period) {
        case "today":
          label = "Today";
          break;

        case "thisMonth":
          label = `Week ${weeks - w}`;
          break;

        case "last3Months":
          label = `Week ${weeks - w}`;
          break;

        case "overall":
        default:
          label = `Week ${weeks - w}`;
          break;
      }

      revenueChart.push({
        day: label,
        thisWeek: thisWeekRevenue,
        lastWeek: lastWeekRevenue,
      });

      membershipChart.push({
        day: label,
        totalMembers,
        newMembers,
      });

    }

    res.status(200).json({
      success: true,
      revenueChart,
      membershipChart,
    });

  } catch (error) {
    console.error("[getChartData]", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// ─── Expiring Members ─────────────────────────────────────────────────────────

const getExpiringMembersReport = async (req, res) => {
  try {
    const { branch } = req.query;

   const filter = {};

    if (branch && branch !== "ALL_BRANCHES") {
      filter.branch = branch;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const members = (await Member.find(filter).lean())
      .filter((member) => {
        if (!member.expiryDate) return false;

        const expiryDate = new Date(member.expiryDate);
        expiryDate.setHours(0, 0, 0, 0);

        const diffDays = Math.ceil(
          (expiryDate - today) / 86400000
        );

        return diffDays >= 0 && diffDays <= 7;
      })
      .sort(
        (a, b) =>
          new Date(a.expiryDate) -
          new Date(b.expiryDate)
      )
      .map((member) => ({
        memberId: member.memberId,
        fullName: member.fullName,
        mobile: member.mobile,
        branch: member.branch,
        expiryDate: member.expiryDate,
      status: getMemberStatus(member.expiryDate),
      }));

    res.status(200).json({
      success: true,
      count: members.length,
      data: members,
    });
  } catch (error) {
    console.error(
      "[getExpiringMembersReport]",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// ─── Pending Fees ─────────────────────────────────────────────────────────────

const getPendingFeesReport = async (req, res) => {
  try {
    const { branch, period = "overall" } = req.query;

    const filter = {
      balanceAmount: {
        $exists: true,
        $gt: 0,
      },
    };

    if (branch && branch !== "ALL_BRANCHES") {
      filter.branch = branch;
    }

    const now = new Date();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayEnd = new Date(today);
    todayEnd.setHours(23, 59, 59, 999);

    const monthStart = new Date(
      now.getFullYear(),
      now.getMonth(),
      1,
      0,
      0,
      0,
      0
    );

    const threeMonthStart = new Date(
      now.getFullYear(),
      now.getMonth() - 2,
      1,
      0,
      0,
      0,
      0
    );

    const members = (await Member.find(filter).lean())
      .filter((member) => {
if (getMemberStatus(member.expiryDate) === "Expired") {
    return false;
}

        if (period === "overall") return true;

return (member.paymentHistory || []).some((payment) =>
    isDateInPeriod(payment.paymentDate, period)
);
      })
      .sort(
        (a, b) =>
          Number(b.balanceAmount || 0) -
          Number(a.balanceAmount || 0)
      )
      .map((member) => ({
        memberId: member.memberId,
        fullName: member.fullName,
        mobile: member.mobile,
        branch: member.branch,
        amountPaid: member.amountPaid,
        balanceAmount: member.balanceAmount,
        paymentMethod: member.paymentMethod,
        expiryDate: member.expiryDate,
      }));

    res.status(200).json({
      success: true,
      count: members.length,
      data: members,
    });
  } catch (error) {
    console.error("[getPendingFeesReport]", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// ─── Today's Collection ───────────────────────────────────────────────────────

const getTodayCollectionReport = async (req, res) => {
  try {
    const { branch, period = "overall" } = req.query;

    const filter = {};

    if (branch && branch !== "ALL_BRANCHES") {
      filter.branch = branch;
    }

    const members = await Member.find(filter).lean();

    const now = new Date();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayEnd = new Date(today);
    todayEnd.setHours(23, 59, 59, 999);

    const monthStart = new Date(
      now.getFullYear(),
      now.getMonth(),
      1,
      0,
      0,
      0,
      0
    );

    const threeMonthStart = new Date(
      now.getFullYear(),
      now.getMonth() - 2,
      1,
      0,
      0,
      0,
      0
    );

    const collections = [];

    members.forEach((member) => {
      (member.paymentHistory || []).forEach((payment) => {
        const paymentDate = new Date(payment.paymentDate);

if (isDateInPeriod(payment.paymentDate, period)) {

    collections.push({

        memberId: member.memberId,
        fullName: member.fullName,
        mobile: member.mobile,
        branch: member.branch,
        paymentDate: payment.paymentDate,
        paymentMode:
            payment.paymentMethod ||
            payment.paymentMode,
        amount: Number(payment.amount || 0),

    });

}

   
      });
    });

    collections.sort(
      (a, b) =>
        new Date(b.paymentDate) -
        new Date(a.paymentDate)
    );

   

    const finance =
calculateFinance(
members,
period
);

const totalCollection =
finance.collection;
    res.status(200).json({
      success: true,
      count: collections.length,
      totalCollection,
      data: collections,
    });
  } catch (error) {
    console.error(
      "[getTodayCollectionReport]",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// ─── Branch Revenue ───────────────────────────────────────────────────────────

const getBranchRevenueReport = async (req, res) => {
  try {
    const { branch, period = "overall" } = req.query;

    const now = new Date();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayEnd = new Date(today);
    todayEnd.setHours(23, 59, 59, 999);

    const monthStart = new Date(
      now.getFullYear(),
      now.getMonth(),
      1,
      0,
      0,
      0,
      0
    );

    const threeMonthStart = new Date(
      now.getFullYear(),
      now.getMonth() - 2,
      1,
      0,
      0,
      0,
      0
    );

    const branches = await Branch.find(
      buildBranchFilter(branch)
    ).lean();

    const report = await Promise.all(
      branches.map(async (b) => {
        const members = await Member.find({
          branch: b.branchCode,
        }).lean();

        // ================= ACTIVE MEMBERS =================
const activeMembers = members.filter(
    member => getMemberStatus(member.expiryDate) === "Active"
);

const finance = calculateFinance(
    members,
    period
);

const totalRevenue = finance.collection;

const pendingAmount = finance.outstanding;
   

        return {
          branchCode: b.branchCode,
          branchName: b.branchName,
          ownerName: b.ownerName,
          totalMembers: members.length,
          activeMembers: activeMembers.length,
          totalRevenue,
          pendingAmount,
        };
      })
    );

    const grandRevenue = report.reduce(
      (sum, branch) => sum + branch.totalRevenue,
      0
    );

    const grandPending = report.reduce(
      (sum, branch) => sum + branch.pendingAmount,
      0
    );

    res.status(200).json({
      success: true,
      totalBranches: report.length,
      grandRevenue,
      grandPending,
      data: report,
    });
  } catch (error) {
    console.error("[getBranchRevenueReport]", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }

  const finance = calculateFinance(members, period);

console.log("==================================");
console.log("Branch:", b.branchCode);
console.log("Period:", period);
console.log("Revenue:", finance.collection);
console.log(
  "Payments:",
  members.flatMap(m => m.paymentHistory || []).map(p => ({
    amount: p.amount,
    date: p.paymentDate,
    method: p.paymentMethod,
  }))
);
console.log("==================================");
};

// ─── Active Branches ──────────────────────────────────────────────────────────

const getActiveBranchesReport = async (req, res) => {
  try {
    const { branch, period = "overall" } = req.query;

    const now = new Date();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayEnd = new Date(today);
    todayEnd.setHours(23, 59, 59, 999);

    const monthStart = new Date(
      now.getFullYear(),
      now.getMonth(),
      1,
      0,
      0,
      0,
      0
    );

    const threeMonthStart = new Date(
      now.getFullYear(),
      now.getMonth() - 2,
      1,
      0,
      0,
      0,
      0
    );

    const branches = await Branch.find(buildBranchFilter(branch))
      .sort({ createdAt: -1 })
      .lean();

    const result = await Promise.all(
      branches.map(async (b) => {
const allMembers = await Member.find({
  branch: b.branchCode,
}).lean();

const activeMembers = allMembers.filter(
  (member) => getMemberStatus(member.expiryDate) === "Active"
);



        // let totalRevenue = 0;
const finance =
calculateFinance(
allMembers,
period
);


const totalRevenue =
finance.collection;

const pendingAmount =
finance.outstanding;



 
    return {
  branchName: b.branchName,
  branchCode: b.branchCode,
  ownerName: b.ownerName,
  status: b.status,

  totalMembers: allMembers.length,
  activeMembers: activeMembers.length,

  totalRevenue,
  pendingAmount,
};
      })
    );

    res.status(200).json({
      success: true,
      count: result.length,
      data: result,
    });
  } catch (error) {
    console.error("[getActiveBranchesReport]", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ─── All Members Directory ────────────────────────────────────────────────────

const getAllMembersReport = async (req, res) => {
  try {
    const { branch, period = "overall" } = req.query;

    const filter = buildMemberFilter(branch);

    const now = new Date();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayEnd = new Date(today);
    todayEnd.setHours(23, 59, 59, 999);

    const monthStart = new Date(
      now.getFullYear(),
      now.getMonth(),
      1,
      0,
      0,
      0,
      0
    );

    const threeMonthStart = new Date(
      now.getFullYear(),
      now.getMonth() - 2,
      1,
      0,
      0,
      0,
      0
    );

    const members = (await Member.find(filter)
      .sort({ createdAt: -1 })
      .lean())
      .filter((member) => {
        const createdAt = new Date(member.createdAt);

        switch (period) {
          case "today":
            return (
              createdAt >= today &&
              createdAt <= todayEnd
            );

          case "thisMonth":
            return (
              createdAt >= monthStart &&
              createdAt <= now
            );

          case "last3Months":
            return (
              createdAt >= threeMonthStart &&
              createdAt <= now
            );

          case "overall":
          default:
            return true;
        }
      })
      .map((member) => ({
        memberId: member.memberId,
        fullName: member.fullName,
        mobile: member.mobile,
        branch: member.branch,
        status: getMemberStatus(member.expiryDate),
        amountPaid: Number(member.amountPaid || 0),
        balanceAmount: Number(member.balanceAmount || 0),
        paymentMethod: member.paymentMethod,
        expiryDate: member.expiryDate,
      }));

    res.status(200).json({
      success: true,
      count: members.length,
      data: members,
    });
  } catch (error) {
    console.error("[getAllMembersReport]", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// ─── Exports ──────────────────────────────────────────────────────────────────

module.exports = {
  getDashboardMetrics,
  getChartData,
  getExpiringMembersReport,
  getPendingFeesReport,
  getTodayCollectionReport,
  getBranchRevenueReport,
  getActiveBranchesReport,
  getAllMembersReport,
};