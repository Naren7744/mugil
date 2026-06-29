const mongoose = require("mongoose");

const memberSchema = new mongoose.Schema(
  {
    // Basic Details
    memberId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },

    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    dob: {
      type: String,
      default: "",
    },

    gender: {
      type: String,
      default: "",
    },

    mobile: {
      type: String,
      required: true,
      trim: true,
    },

    altMobile: {
      type: String,
      default: "",
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: "",
    },

    address: {
      type: String,
      default: "",
    },

    // Membership Details
    planType: {
      type: String,
      default: "",
    },

  selectedPlanId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Plan",
},

    duration: {
      type: String,
      default: "",
    },

 joinDate: {
  type: Date,
  default: Date.now,
},

expiryDate: {
  type: Date,
},

    totalDays: {
      type: Number,
      default: 0,
    },

    branch: {
      type: String,
      default: "MUGIL_FITNESS",
    },

    // Payment Details
    membershipFee: {
      type: Number,
      default: 0,
    },

    admissionFee: {
      type: Number,
      default: 0,
    },

    offerPrice: {
      type: Number,
      default: 0,
    },

    totalAmount: {
      type: Number,
      default: 0,
    },

    discount: {
      type: Number,
      default: 0,
    },

    amountPaid: {
      type: Number,
      default: 0,
    },

    balanceAmount: {
      type: Number,
      default: 0,
    },

paymentStatus: {
  type: String,
 enum: [
  "Balance Pending",
  "Fully Paid"
],
  default: "Balance Pending",
},

paymentMethod:{
type:String,
enum:[
"Cash",
"UPI",
"Card"
],
default:"Cash"
},

dueDate: {
  type: Date,
},

    paymentNote: {
      type: String,
      default: "",
    },
    paymentHistory: [
  {
    receiptNo: {
  type: String,
},
remarks: {
  type: String,
  default: "",
},

    amount: {
      type: Number,
      required: true,
    },

paymentMethod: {
  type: String,
  enum: ["Cash", "UPI", "Card"],
  default: "Cash",
},

    paymentDate: {
      type: Date,
      default: Date.now,
    },

    collectedBy: {
      type: String,
      default: "Admin",
    },

    note: {
      type: String,
      default: "",
    },
    balanceAfterPayment:{
type:Number,
default:0
}

  },
],

    // Fitness Details
    weight: {
      type: Number,
      default: 0,
    },

    height: {
      type: Number,
      default: 0,
    },

    bmi: {
      type: Number,
      default: 0,
    },

    bodyFat: {
  type: Number,
  default: 0,
},

    fitnessGoal: {
      type: String,
      default: "",
    },

    medicalCondition: {
      type: String,
      default: "",
    },

    trainerAssigned: {
      type: String,
      default: "",
    },

    // Attendance
    totalAttendance: {
      type: Number,
      default: 0,
    },

renewalHistory: [
{
planId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Plan",
},

  planName: {
    type: String,
    default: "",
  },

  duration: {
    type: String,
    default: "",
  },

oldExpiryDate: {
  type: Date,
},

newExpiryDate: {
  type: Date,
},

  amount: {
    type: Number,
    default: 0,
  },

paymentMethod: {
  type: String,
  enum: ["Cash", "UPI", "Card"],
  default: "Cash",
},

  renewedOn: {
    type: Date,
    default: Date.now,
  },

  renewedBy: {
    type: String,
    default: "Admin",
  },
  receiptNo: {
  type: String,
  default: "",
},
remarks:{
type:String,
default:""
},
balanceAfterRenewal: {
  type: Number,
  default: 0,
},

},
],

renewalCount: {
  type: Number,
  default: 0,
},

lastRenewalDate: {
  type: Date,
  default: null,
},


    // System Status
 status: {
  type: String,
  enum: [
    "Active",
    "Expiring Soon",
    "Expired",
    "Inactive",
  ],
  default: "Active",
},
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Member", memberSchema);