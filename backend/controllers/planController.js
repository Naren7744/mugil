const Plan = require("../models/Plan");

/* =================================
   CREATE PLAN
================================= */
const createPlan = async (req, res) => {
  try {
    const {
      planId,
      name,
      duration,
      planType,
      branch,
      price,
    } = req.body || {};

    if (!planId || !name || !duration || price === undefined) {
      return res.status(400).json({
        success: false,
        message: "Plan ID, Name, Duration and Price are required",
      });
    }

    if (!["1 Month", "3 Months", "6 Months", "12 Months"].includes(duration)) {
      return res.status(400).json({
        success: false,
        message: "Invalid duration",
      });
    }

    if (Number(price) <= 0) {
      return res.status(400).json({
        success: false,
        message: "Price must be greater than 0",
      });
    }

    req.body.planId = req.body.planId.trim().toUpperCase();

    const existingPlan = await Plan.findOne({
      planId: planId.trim().toUpperCase(),
    });

    const existingName = await Plan.findOne({
      name: { $regex: `^${name}$`, $options: "i" },
      isDeleted: false,
    });

    if (existingName) {
      return res.status(400).json({
        success: false,
        message: "Plan name already exists",
      });
    }

    if (existingPlan) {
      return res.status(400).json({
        success: false,
        message: "Plan ID already exists",
      });
    }

    const plan = await Plan.create(req.body);

    return res.status(201).json({
      success: true,
      message: "Plan Created Successfully",
      data: plan,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =================================
   GET ALL PLANS
================================= */
const getAllPlans = async (req, res) => {
  try {
    const { search, status, branch, planType } = req.query;

    let filter = { isDeleted: false };

    if (status) filter.status = status;
    if (branch) filter.branch = branch;
    if (planType) filter.planType = planType;

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { planId: { $regex: search, $options: "i" } },
      ];
    }

    const plans = await Plan.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: plans.length,
      data: plans,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/* =================================
   GET DELETED PLANS
================================= */
const getDeletedPlans = async (req, res) => {
  try {
    const plans = await Plan.find({ isDeleted: true }).sort({ updatedAt: -1 });

    res.status(200).json({
      success: true,
      count: plans.length,
      data: plans,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/* =================================
   GET SINGLE PLAN
================================= */
const getPlanById = async (req, res) => {
  try {
    const plan = await Plan.findOne({ _id: req.params.id, isDeleted: false });

    if (!plan) {
      return res.status(404).json({ success: false, message: "Plan Not Found" });
    }

    res.status(200).json({ success: true, data: plan });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/* =================================
   UPDATE PLAN
================================= */
const updatePlan = async (req, res) => {
  try {
    const plan = await Plan.findOne({ _id: req.params.id, isDeleted: false });

    if (!plan) {
      return res.status(404).json({ success: false, message: "Plan Not Found" });
    }

    if (
      req.body.duration &&
      !["1 Month", "3 Months", "6 Months", "12 Months"].includes(req.body.duration)
    ) {
      return res.status(400).json({ success: false, message: "Invalid duration" });
    }

    if (req.body.price !== undefined && Number(req.body.price) <= 0) {
      return res.status(400).json({
        success: false,
        message: "Price must be greater than 0",
      });
    }

    Object.assign(plan, req.body);
    await plan.save();

    res.status(200).json({
      success: true,
      message: "Plan Updated Successfully",
      data: plan,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/* =================================
   DELETE PLAN (SOFT DELETE)
================================= */
const deletePlan = async (req, res) => {
  try {
    const plan = await Plan.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      { isDeleted: true, status: "Inactive" },
      { returnDocument: "after" }
    );

    if (!plan) {
      return res.status(404).json({ success: false, message: "Plan Not Found" });
    }

    return res.status(200).json({
      success: true,
      message: "Plan Deleted Successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

/* =================================
   RESTORE DELETED PLAN
================================= */
const restorePlan = async (req, res) => {
  try {
    const plan = await Plan.findOneAndUpdate(
      { _id: req.params.id, isDeleted: true },
      { isDeleted: false, status: "Active" },
      { new: true }
    );

    if (!plan) {
      return res.status(404).json({
        success: false,
        message: "Deleted plan not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Plan Restored Successfully",
      data: plan,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

/* =================================
   TOGGLE FEATURED PLAN
================================= */
const toggleFeaturedPlan = async (req, res) => {
  try {
    const plan = await Plan.findOne({ _id: req.params.id, isDeleted: false });

    if (!plan) {
      return res.status(404).json({ success: false, message: "Plan Not Found" });
    }

    plan.isFeatured = !plan.isFeatured;
    await plan.save();

    res.status(200).json({
      success: true,
      message: "Featured Status Updated",
      data: plan,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/* =================================
   PLAN DASHBOARD STATS
================================= */
const getPlanStats = async (req, res) => {
  try {
    const plans = await Plan.find({ isDeleted: false });

    const totalPlans    = plans.length;
    const activePlans   = plans.filter((p) => p.status === "Active").length;
    const offerPlans    = plans.filter((p) => p.status === "Offer").length;
    const featuredPlans = plans.filter((p) => p.isFeatured).length;
    const totalRevenue  = plans.reduce((sum, p) => sum + Number(p.revenue || 0), 0);

    res.status(200).json({
      success: true,
      data: { totalPlans, activePlans, offerPlans, featuredPlans, totalRevenue },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/* =================================
   GET NEXT PLAN ID
================================= */
const getNextPlanId = async (req, res) => {
  try {
    const { prefix } = req.query;

    const plans = await Plan.find({ planId: { $regex: `^${prefix}` } });

    let maxNumber = 0;
    plans.forEach((plan) => {
      const num = parseInt(plan.planId.replace(prefix, ""));
      if (!isNaN(num) && num > maxNumber) maxNumber = num;
    });

    const nextId = prefix + String(maxNumber + 1).padStart(3, "0");

    res.status(200).json({ success: true, nextId });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
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
};