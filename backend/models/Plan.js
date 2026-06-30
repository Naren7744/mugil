const mongoose = require("mongoose");

const planSchema = new mongoose.Schema(
{
  // Basic Details
  planId: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true,
  },

  name: {
    type: String,
    required: true,
    trim: true,
  },

  planType: {
    type: String,
    required: true,
  },

  description: {
    type: String,
    default: "",
  },

  // Duration
  duration: {
    type: String,
    required: true,
  },

  durationDays: {
    type: Number,
    default: 30,
  },

  // Pricing
  price: {
    type: Number,
    required: true,
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

  discountAmount: {
    type: Number,
    default: 0,
  },

  finalPrice: {
    type: Number,
    default: 0,
  },

  // Offer
  offerStartDate: {
    type: String,
    default: "",
  },

  offerEndDate: {
    type: String,
    default: "",
  },

  // Features
  features: [
    {
      type: String,
    },
  ],

  // Gym Benefits
  dietPlanIncluded: {
    type: Boolean,
    default: false,
  },

  trainerSupport: {
    type: Boolean,
    default: false,
  },

  lockerIncluded: {
    type: Boolean,
    default: false,
  },

  cardioIncluded: {
    type: Boolean,
    default: false,
  },

  steamBathIncluded: {
    type: Boolean,
    default: false,
  },

  personalTrainingIncluded: {
    type: Boolean,
    default: false,
  },

  // Branch
  branch: {
    type: String,
    enum: [
      "MUGIL_FITNESS",
      "SP_FITNESS",
      "ALL_BRANCHES",
    ],
    default: "ALL_BRANCHES",
  },

  // Dashboard Analytics
  memberCount: {
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

  revenue: {
    type: Number,
    default: 0,
  },

  totalCollections: {
    type: Number,
    default: 0,
  },

  // Display
  badgeText: {
    type: String,
    default: "",
  },

  badgeColor: {
    type: String,
    default: "#4d3df7",
  },

  isFeatured: {
    type: Boolean,
    default: false,
  },

  // Status
  status: {
    type: String,
    enum: [
      "Active",
      "Inactive",
      "Offer",
      "Expired",
    ],
    default: "Active",
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

  isDeleted: {
    type: Boolean,
    default: false,
  },
},
{
  timestamps: true,
}
);

planSchema.pre("save", function () {

  switch (this.duration) {

    case "1 Month":
      this.durationDays = 30;
      break;

    case "3 Months":
      this.durationDays = 90;
      break;

    case "6 Months":
      this.durationDays = 180;
      break;

    case "12 Months":
      this.durationDays = 365;
      break;

    default:
      this.durationDays = 30;
  }

  const offer = Number(this.offerPrice || 0);
  const original = Number(this.price || 0);

  if (offer > 0) {
    this.finalPrice = offer;
    this.discountAmount = original - offer;
  } else {
    this.finalPrice = original;
    this.discountAmount = 0;
  }

});
module.exports =
mongoose.model("Plan", planSchema);