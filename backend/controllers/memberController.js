const Member = require("../models/Member");
const Plan = require("../models/Plan");

/* ===========================
   CREATE MEMBER
=========================== */
const createMember = async (req, res) => {
  try {

    const initialAmountPaid =
      Number(req.body.amountPaid || 0);

    const totalAmount =
      Number(req.body.totalAmount || 0);

    if (
      initialAmountPaid > totalAmount
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Amount exceeds total amount",
      });
    }

    const member =
      await Member.create(req.body);

    // Update Plan Member Count
    if (req.body.selectedPlanId) {
      await Plan.findByIdAndUpdate(
        req.body.selectedPlanId,
        {
          $inc: {
            memberCount: 1,
            activeMembers: 1,
          },
        }
      );
    }

    // Initial Payment Entry
    if (initialAmountPaid > 0) {

      if (req.body.selectedPlanId) {
        await Plan.findByIdAndUpdate(
          req.body.selectedPlanId,
          {
            $inc: {
              revenue: initialAmountPaid,
              totalCollections:
                initialAmountPaid,
            },
          }
        );
      }

      member.paymentHistory.push({
        receiptNo:
          `TXN-${new Date()
            .toISOString()
            .slice(0, 10)
            .replace(/-/g, "")}-${Date.now()
            .toString()
            .slice(-6)}`,

        amount: initialAmountPaid,

        paymentMethod:
          req.body.paymentMethod ||
          "Cash",

        note:
          "Registration Payment",

        collectedBy: "Admin",

  paymentDate: new Date(),
  balanceAfterPayment: totalAmount - initialAmountPaid,
      });

      await member.save();
    }

    res.status(201).json({
      success: true,
      message:
        "Member Added Successfully",
      data: member,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

/* ===========================
   GET ALL MEMBERS
=========================== */
const getAllMembers = async (req, res) => {
  try {
    const members = await Member.find().sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: members.length,
      data: members,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ===========================
   GET SINGLE MEMBER
=========================== */
const getMemberById = async (req, res) => {
  try {
    const member = await Member.findById(req.params.id);

    if (!member) {
      return res.status(404).json({
        success: false,
        message: "Member Not Found",
      });
    }

    res.status(200).json({
      success: true,
      data: member,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ===========================
   UPDATE MEMBER
=========================== */
const updateMember = async (req, res) => {
  try {
    const existingMember = await Member.findById(req.params.id);

    if (!existingMember) {
      return res.status(404).json({
        success: false,
        message: "Member Not Found",
      });
    }

    const oldAmountPaid = Number(existingMember.amountPaid || 0);
    const newAmountPaid =
      req.body.amountPaid !== undefined
        ? Number(req.body.amountPaid)
        : oldAmountPaid;
        
if (req.body.amountPaid !== undefined) {
  const totalAmount =
    Number(existingMember.totalAmount || 0);

  const amountPaid =
    Number(req.body.amountPaid || 0);
    if (amountPaid < 0) {
  return res.status(400).json({
    success: false,
    message: "Invalid amount",
  });
}
    if (amountPaid > totalAmount) {
  return res.status(400).json({
    success: false,
    message:
      "Amount exceeds total amount",
  });
}

  req.body.balanceAmount =
    totalAmount - amountPaid;

  req.body.paymentStatus =
    req.body.balanceAmount <= 0
      ? "Fully Paid"
      : "Balance Pending";
}

    const member = await Member.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

if (newAmountPaid > oldAmountPaid) {

  const diff =
    newAmountPaid - oldAmountPaid;

  member.paymentHistory.push({
    receiptNo: `TXN-${new Date()
      .toISOString()
      .slice(0, 10)
      .replace(/-/g, "")}-${Date.now()
      .toString()
      .slice(-6)}`,

    amount: diff,

    paymentMethod:
      req.body.paymentMethod || "Cash",

    note: "Balance Payment",

    collectedBy: "Admin",

    paymentDate: new Date(),
    balanceAfterPayment:
member.balanceAmount
  });

  if (member.selectedPlanId) {
    await Plan.findByIdAndUpdate(
      member.selectedPlanId,
      {
        $inc: {
          revenue: diff,
          totalCollections: diff,
        },
      }
    );
  }

  await member.save();
}
    res.status(200).json({
      success: true,
      message: "Member Updated Successfully",
      data: member,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ===========================
   DELETE MEMBER
=========================== */
const deleteMember = async (req, res) => {
  try {
const member =
  await Member.findById(req.params.id);

if (!member) {
  return res.status(404).json({
    success: false,
    message: "Member Not Found",
  });
}

if (member.selectedPlanId) {
  await Plan.findByIdAndUpdate(
    member.selectedPlanId,
    {
      $inc: {
        memberCount: -1,
        activeMembers:
          member.status === "Active"
            ? -1
            : 0,
      },
    }
  );
}

await member.deleteOne();

    res.status(200).json({
      success: true,
      message: "Member Deleted Successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ===========================
   COLLECT PAYMENT
=========================== */
const collectPayment = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      amount,
      paymentMethod,
      note,
      collectedBy,
    } = req.body;

    const paymentAmount = Number(amount);

    if (!paymentAmount || paymentAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment amount",
      });
    }

    const member = await Member.findById(id);

    if (!member) {
      return res.status(404).json({
        success: false,
        message: "Member not found",
      });
    }

    const currentPaid =
      Number(member.amountPaid || 0);

    const totalAmount =
      Number(member.totalAmount || 0);

    const newAmountPaid =
      currentPaid + paymentAmount;

    if (totalAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid member total amount",
      });
    }

    if (newAmountPaid > totalAmount) {
      return res.status(400).json({
        success: false,
        message:
          "Payment exceeds total amount",
      });
    }

    member.amountPaid = newAmountPaid;

    member.balanceAmount =
      totalAmount - newAmountPaid;

    member.paymentStatus =
      member.balanceAmount <= 0
        ? "Fully Paid"
        : "Balance Pending";

    member.paymentHistory.push({
      receiptNo:
        `TXN-${new Date()
          .toISOString()
          .slice(0, 10)
          .replace(/-/g, "")}-${Date.now()
          .toString()
          .slice(-6)}`,

      amount: paymentAmount,

      paymentMethod:
        paymentMethod || "Cash",

      note: note || "",

      collectedBy:
        collectedBy || "Admin",

      paymentDate: new Date(),
      balanceAfterPayment:
member.balanceAmount
    });
    if (member.selectedPlanId) {
  await Plan.findByIdAndUpdate(
    member.selectedPlanId,
    {
      $inc: {
        revenue: paymentAmount,
        totalCollections: paymentAmount,
      },
    }
  );
}

    await member.save();

    res.status(200).json({
      success: true,
      message:
        "Payment collected successfully",
      data: member,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const renewMember = async (req, res) => {
  try {
    const member = await Member.findById(req.params.id);

    if (!member) {
      return res.status(404).json({
        success: false,
        message: "Member Not Found",
      });
    }

    // Don't allow renewal if previous membership has pending balance
    if (Number(member.balanceAmount || 0) > 0) {
      return res.status(400).json({
        success: false,
        message:
          "Please collect pending balance before renewing membership.",
      });
    }

    const plan = await Plan.findById(req.body.selectedPlanId);

    if (!plan) {
      return res.status(404).json({
        success: false,
        message: "Plan Not Found",
      });
    }

    const paidAmount = Number(req.body.amountPaid || 0);

    if (paidAmount < 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid amount",
      });
    }

    if (paidAmount > Number(plan.finalPrice)) {
      return res.status(400).json({
        success: false,
        message: "Amount exceeds plan price",
      });
    }

    // ================= DATE CALCULATION =================

    const today = new Date();

   const oldExpiryDate =
  member.expiryDate || null;

    const baseDate =
      member.expiryDate &&
      new Date(member.expiryDate) > today
        ? new Date(member.expiryDate)
        : today;

    const newExpiry = new Date(baseDate);

    newExpiry.setDate(
      newExpiry.getDate() + Number(plan.durationDays)
    );

  const dueDate = new Date(newExpiry);

    

    dueDate.setDate(dueDate.getDate() - 7);

    // Receipt
    const receiptNo = `REN-${new Date()
      .toISOString()
      .slice(0, 10)
      .replace(/-/g, "")}-${Date.now()
      .toString()
      .slice(-6)}`;

    // ================= UPDATE MEMBER =================

    member.selectedPlanId = plan._id;
    member.planType = plan.name;
    member.duration = plan.duration;


member.expiryDate = newExpiry;

member.dueDate = dueDate;

    member.totalDays = plan.durationDays;

    member.membershipFee = plan.price;

    member.offerPrice = plan.offerPrice || 0;

    member.discount = plan.discount || 0;

    member.totalAmount = plan.finalPrice;

    member.amountPaid = paidAmount;

    member.balanceAmount =
      Number(plan.finalPrice) - paidAmount;

    member.paymentStatus =
      member.balanceAmount <= 0
        ? "Fully Paid"
        : "Balance Pending";

    member.paymentMethod =
      req.body.paymentMethod || "Cash";

    member.status = "Active";

    member.renewalCount += 1;

    member.lastRenewalDate = today;

    // ================= RENEWAL HISTORY =================

    member.renewalHistory.push({
      receiptNo,

      planId: plan._id,

      planName: plan.name,

      duration: plan.duration,

      oldExpiryDate,

    newExpiryDate: newExpiry,

      amount: paidAmount,

      paymentMethod:
        req.body.paymentMethod || "Cash",

      remarks:
        req.body.remarks || "",

      renewedOn: today,

      renewedBy: "Admin",
    });

    // ================= PAYMENT HISTORY =================

    member.paymentHistory.push({
      receiptNo,

      amount: paidAmount,

      paymentMethod:
        req.body.paymentMethod || "Cash",

      paymentDate: today,

      collectedBy: "Admin",

      note: "Membership Renewal",
  balanceAfterPayment:
member.balanceAmount
    });

    // ================= PLAN REVENUE =================

    await Plan.findByIdAndUpdate(plan._id, {
      $inc: {
        revenue: paidAmount,
        totalCollections: paidAmount,
      },
    });

    await member.save();

    return res.status(200).json({
      success: true,
      message: "Membership Renewed Successfully",
      data: member,
    });
  } catch (error) {
    console.error("[renewMember]", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getDashboardStats = async (
  req,
  res
) => {
  try {

    const totalMembers =
      await Member.countDocuments();

const members = await Member.find(
  {},
  {
    paymentHistory: 1,
  }
).lean();

let totalRevenue = 0;

members.forEach((member) => {
  (member.paymentHistory || []).forEach((payment) => {
    totalRevenue += Number(payment.amount || 0);
  });
});
   

    res.status(200).json({
      success: true,
      data: {
        totalMembers,
        totalRevenue,
      },
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};


module.exports = {
  createMember,
  getAllMembers,
  getMemberById,
  updateMember,
  deleteMember,
  collectPayment,
  renewMember,
   getDashboardStats,
};