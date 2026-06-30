const Branch = require("../models/Branch");
const mongoose = require("mongoose");
const Member = require("../models/Member");


const createBranch = async (req, res) => {
  try {
    const {
      branchId,
      branchName,
      branchCode,
      ownerName,
    } = req.body;

    if (
      !branchId ||
      !branchName ||
      !branchCode ||
      !ownerName
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Branch ID, Name, Code and Owner Name are required",
      });
    }

    req.body.branchId =
      req.body.branchId.trim().toUpperCase();

    req.body.branchCode =
      req.body.branchCode.trim().toUpperCase();

    req.body.branchName =
      req.body.branchName.trim();

    req.body.ownerName =
      req.body.ownerName.trim();

    const existingBranch =
      await Branch.findOne({
        isDeleted: false,
        $or: [
          {
            branchId: req.body.branchId,
          },
          {
            branchCode: req.body.branchCode,
          },
          {
            branchName: {
              $regex: `^${req.body.branchName}$`,
              $options: "i",
            },
          },
        ],
      });

    if (existingBranch) {
      return res.status(400).json({
        success: false,
        message:
          "Branch ID, Branch Code or Branch Name already exists",
      });
    }

    const branch =
      await Branch.create(req.body);

    res.status(201).json({
      success: true,
      message:
        "Branch Created Successfully",
      data: branch,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


const getAllBranches = async (
  req,
  res
) => {
  try {
    const period =
      req.query.period ||
      "thisMonth";

    let startDate =
      new Date();
    let endDate = null;

    if (
      period === "thisMonth"
    ) {

      startDate =
        new Date(
          new Date().getFullYear(),
          new Date().getMonth(),
          1
        );

    }

    if (
      period === "lastMonth"
    ) {

      startDate =
        new Date(
          new Date().getFullYear(),
          new Date().getMonth() - 1,
          1
        );

      endDate =
        new Date(
          new Date().getFullYear(),
          new Date().getMonth(),
          1
        );

    }

    if (
      period === "last3Months"
    ) {

      startDate =
        new Date();

      startDate.setMonth(
        startDate.getMonth() - 3
      );

    }

    const branches =
      await Branch.find({
        isDeleted: false,
      }).sort({
        createdAt: -1,
      });

    const liveBranches =
      await Promise.all(

        branches.map(
          async (branch) => {

            const memberFilter = {
              branch: branch.branchCode,
              status: {
                $ne: "Inactive",
              },
            };



            const totalMembers =
              await Member.countDocuments(
                memberFilter
              );

            const revenuePipeline = [
              {
                $match: memberFilter,
              },

              {
                $unwind: "$paymentHistory",
              },
            ];

            if (endDate) {
              revenuePipeline.push({
                $match: {
                  "paymentHistory.paymentDate": {
                    $gte: startDate,
                    $lt: endDate,
                  },
                },
              });
            } else {
              revenuePipeline.push({
                $match: {
                  "paymentHistory.paymentDate": {
                    $gte: startDate,
                  },
                },
              });
            }

            revenuePipeline.push({
              $group: {
                _id: null,
                totalRevenue: {
                  $sum: "$paymentHistory.amount",
                },
              },
            });

            const revenueData =
              await Member.aggregate(
                revenuePipeline
              );
            const totalRevenue =
              revenueData[0]
                ?.totalRevenue || 0;
            return {
              ...branch.toObject(),

              totalMembers,

              totalRevenue,
            };
          }
        )

      );

    res.status(200).json({
      success: true,
      count:
        liveBranches.length,
      data: liveBranches,
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message:
        error.message,
    });

  }
};

const getBranchById = async (

  req,
  res
) => {
  try {

    if (
      !mongoose.Types.ObjectId.isValid(
        req.params.id
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid Branch ID",
      });
    }
    const branch =
      await Branch.findOne({
        _id: req.params.id,
        isDeleted: false,
      });

    if (!branch) {
      return res.status(404).json({
        success: false,
        message:
          "Branch Not Found",
      });
    }

    res.status(200).json({
      success: true,
      data: branch,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


const updateBranch = async (
  req,
  res
) => {
  try {
    if (
      !mongoose.Types.ObjectId.isValid(
        req.params.id
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid Branch ID",
      });
    }
    const branch =
      await Branch.findOne({
        _id: req.params.id,
        isDeleted: false,
      });

    if (!branch) {
      return res.status(404).json({
        success: false,
        message:
          "Branch Not Found",
      });
    }


    if (req.body.branchName) {
      req.body.branchName =
        req.body.branchName.trim();
      const existingName =
        await Branch.findOne({
          branchName: {
            $regex: `^${req.body.branchName}$`,
            $options: "i",
          },
          _id: {
            $ne: req.params.id,
          },
          isDeleted: false,
        });

      if (existingName) {
        return res.status(400).json({
          success: false,
          message:
            "Branch Name already exists",
        });
      }
    }

    if (req.body.branchCode) {

      req.body.branchCode =
        req.body.branchCode
          .trim()
          .toUpperCase();

      const existingCode =
        await Branch.findOne({
          branchCode:
            req.body.branchCode,
          _id: {
            $ne: req.params.id,
          },
          isDeleted: false,
        });

      if (existingCode) {
        return res.status(400).json({
          success: false,
          message:
            "Branch Code already exists",
        });
      }
    }
    Object.assign(
      branch,
      req.body
    );

    await branch.save();

    res.status(200).json({
      success: true,
      message:
        "Branch Updated Successfully",
      data: branch,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


const deleteBranch = async (
  req,
  res
) => {
  try {
    if (
      !mongoose.Types.ObjectId.isValid(
        req.params.id
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid Branch ID",
      });
    }
    const branch =
      await Branch.findOneAndUpdate(
        {
          _id: req.params.id,
          isDeleted: false,
        },
        {
          isDeleted: true,
          status: "Inactive",
        },
        {
          returnDocument:
            "after",
        }
      );

    if (!branch) {
      return res.status(404).json({
        success: false,
        message:
          "Branch Not Found",
      });
    }

    res.status(200).json({
      success: true,
      message:
        "Branch Deleted Successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


const getBranchStats = async (
  req,
  res
) => {
  try {

    const branches =
      await Branch.find({
        isDeleted: false,
      });

    const totalBranches =
      req.query.branch &&
        req.query.branch !==
        "ALL_BRANCHES"
        ? 1
        : branches.length;

    const activeBranches =
      req.query.branch &&
        req.query.branch !==
        "ALL_BRANCHES"
        ? 1
        : branches.filter(
          (b) =>
            b.status ===
            "Active"
        ).length;

    let memberFilter = {
      status: {
        $ne: "Inactive",
      },
    };

    if (
      req.query.branch &&
      req.query.branch !==
      "ALL_BRANCHES"
    ) {
      memberFilter.branch =
        req.query.branch;
    }

    const totalMembers =
      await Member.countDocuments(
        memberFilter
      );

    const revenueData = await Member.aggregate([
      {
        $match: memberFilter,
      },
      {
        $unwind: "$paymentHistory",
      },
      {
        $group: {
          _id: null,
          totalRevenue: {
            $sum: "$paymentHistory.amount",
          },
        },
      },
    ]);

    const totalRevenue =
      revenueData[0]
        ?.totalRevenue || 0;

    res.status(200).json({
      success: true,
      data: {
        totalBranches,
        activeBranches,
        totalMembers,
        totalRevenue,
      },
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getNextBranchCode = async (req, res) => {
  try {
    const branches =
      await Branch.find({
        isDeleted: false,
        branchCode: {
          $regex: "^BRANCH",
        },
      });

    let maxNumber = 0;

    branches.forEach((branch) => {
      const num = parseInt(
        branch.branchCode.replace(
          "BRANCH",
          ""
        )
      );

      if (!isNaN(num) && num > maxNumber) {
        maxNumber = num;
      }
    });

    const nextCode =
      "BRANCH" +
      String(maxNumber + 1).padStart(3, "0");

    res.status(200).json({
      success: true,
      nextCode,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createBranch,
  getAllBranches,
  getBranchById,
  updateBranch,
  deleteBranch,
  getBranchStats,
  getNextBranchCode,
};