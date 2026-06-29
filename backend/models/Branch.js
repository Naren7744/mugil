const mongoose = require("mongoose");

const branchSchema = new mongoose.Schema(
  {
    // Branch ID
    branchId: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },

    // Basic Details
 branchName: {
  type: String,
  required: true,
  trim: true,
  unique: true,
},

    branchCode: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },

    branchType: {
      type: String,
      enum: [
        "Head Branch",
        "Branch",
      ],
      default: "Branch",
    },

    // Owner Details
    ownerName: {
      type: String,
      required: true,
      trim: true,
    },

mobile: {
  type: String,
  trim: true,
  default: "",
},

email: {
  type: String,
  default: "",
  lowercase: true,
  trim: true,
},
    // Address
    address: {
      type: String,
      default: "",
    },

    city: {
      type: String,
      default: "",
    },

    state: {
      type: String,
      default: "Tamil Nadu",
    },

    pincode: {
      type: String,
      default: "",
    },

    // Gym Details
    openingTime: {
      type: String,
      default: "",
    },

    closingTime: {
      type: String,
      default: "",
    },

 logo: {
  type: String,
  default: "",
},

coverImage: {
  type: String,
  default: "",
},

    description: {
      type: String,
      default: "",
    },

    // Statistics
    totalMembers: {
      type: Number,
      default: 0,
    },

    activeMembers: {
      type: Number,
      default: 0,
    },

    expiredMembers: {
      type: Number,
      default: 0,
    },

    monthlyRevenue: {
      type: Number,
      default: 0,
    },

    totalRevenue: {
      type: Number,
      default: 0,
    },

    // Status
    status: {
      type: String,
      enum: [
        "Active",
        "Inactive",
      ],
      default: "Active",
    },

    // Display
color: {
  type: String,
  default: "#4d3df7",
},

    // Soft Delete
    isDeleted: {
      type: Boolean,
      default: false,
    },

    newMembersThisMonth: {
  type: Number,
  default: 0,
},

membershipPlans: {
  type: Number,
  default: 0,
},

establishedDate: {
  type: Date,
},

mapLocation: {
  type: String,
  default: "",
},

    // Audit
    createdBy: {
      type: String,
      default: "Admin",
    },

    updatedBy: {
      type: String,
      default: "Admin",
    },

    
  },
  {
    timestamps: true,
  }
);

module.exports =
mongoose.model(
  "Branch",
  branchSchema
);