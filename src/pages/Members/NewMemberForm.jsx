import React, { useState, useEffect } from "react";
import api from "../../services/api";
import PageHeader from "../../components/dashboard/PageHeader";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { successAlert, errorAlert, loadingAlert } from "../../utils/alerts";
import {
  FiUser,
  FiCreditCard,
  FiDollarSign,
  FiActivity,
  FiSave,
  FiPrinter,
  FiInfo,
  FiCheckCircle,
  FiTag,
  FiStar,
  FiZap,
  FiAlertCircle,
  FiFileText,
} from "react-icons/fi";

function NewMemberForm({ onBack }) {
  const [errors, setErrors] = useState({});
  const [membershipPlans, setMembershipPlans] = useState([]);
  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const res = await api.get("/plans");

      console.log("PLANS =>", res.data);

      setMembershipPlans(res.data.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  // ─── MASTER FORM STATE ───────────────────────────────────────────────────────
  const [formData, setFormData] = useState({
    memberId: "",
    fullName: "",
    dob: "",
    gender: "",
    mobile: "",
    altMobile: "",
    email: "",
    address: "",

    // Plan Selection
    planType: "Weight Gain",
    selectedPlanId: "",

    // Derived from selected plan
    duration: "1 Month",
    joinDate: new Date().toISOString().split("T")[0],
    expiryDate: "",
    totalDays: 30,
    branch: "MUGIL_FITNESS",

    membershipFee: 0,
    admissionFee: 250,
    offerPrice: 0,
    totalAmount: 0,

    discount: 0,
    amountPaid: 0,
    paymentStatus: "Balance Pending",
    paymentMethod: "Cash",
    dueDate: "",
    paymentNote: "",

    weight: "",
    height: "",
    bmi: "0.0",
    fitnessGoal: "",
    medicalCondition: "None",
    trainerAssigned: "",
  });

  // ─── FILTERED PLANS BY TYPE ──────────────────────────────────────────────────
  const plansByType = membershipPlans.filter(
    (p) => p.planType === formData.planType && p.status !== "Inactive",
  );

  // ─── MEMBER ID GENERATOR ─────────────────────────────────────────────────────
  const generateMemberId = (branch) => {
    const prefix = branch === "MUGIL_FITNESS" ? "MF" : "SP";
    const key = `${prefix}_COUNTER`;
    const counter = Number(localStorage.getItem(key)) || 1;
    return `${prefix}${String(counter).padStart(4, "0")}`;
  };

  const getFormErrors = () => {
    const newErrors = {};

    if (!formData.fullName.trim() || formData.fullName.trim().length < 3) {
      newErrors.fullName = true;
    }

    if (!formData.dob) {
      newErrors.dob = true;
    } else {
      const today = new Date();
      const dob = new Date(formData.dob);
      let age = today.getFullYear() - dob.getFullYear();
      const monthDiff = today.getMonth() - dob.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate()))
        age--;
      if (age < 14) newErrors.dob = true;
    }

    if (!formData.gender) newErrors.gender = true;

    if (!formData.mobile || formData.mobile.length !== 10)
      newErrors.mobile = true;

    if (
      formData.altMobile &&
      (formData.altMobile.length !== 10 ||
        formData.altMobile === formData.mobile)
    ) {
      newErrors.altMobile = true;
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = true;
    }

    if (!formData.address.trim() || formData.address.trim().length < 10) {
      newErrors.address = true;
    }

    const todays = new Date().toISOString().split("T")[0];
    if (!formData.joinDate || formData.joinDate > todays)
      newErrors.joinDate = true;

    if (!formData.selectedPlanId) newErrors.selectedPlanId = true;

    if (!formData.branch) newErrors.branch = true;

    if (Number(formData.amountPaid) < 0) newErrors.amountPaid = true;

    if (Number(formData.discount) > Number(formData.totalAmount))
      newErrors.discount = true;

    const finalAmt =
      Number(formData.totalAmount) - Number(formData.discount || 0);
    if (Number(formData.amountPaid) > finalAmt) newErrors.amountPaid = true;

    if (balanceAmount > 0 && !formData.dueDate) newErrors.dueDate = true;

    if (
      balanceAmount > 0 &&
      formData.dueDate &&
      new Date(formData.dueDate) < new Date(formData.joinDate)
    ) {
      newErrors.dueDate = true;
    }

    return newErrors;
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim() || formData.fullName.trim().length < 3) {
      newErrors.fullName = true;
    }

    if (!formData.dob) {
      newErrors.dob = true;
    } else {
      const today = new Date();
      const dob = new Date(formData.dob);
      let age = today.getFullYear() - dob.getFullYear();
      const monthDiff = today.getMonth() - dob.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate()))
        age--;
      if (age < 14) newErrors.dob = true;
    }

    if (!formData.gender) newErrors.gender = true;

    if (!formData.mobile || formData.mobile.length !== 10)
      newErrors.mobile = true;

    if (
      formData.altMobile &&
      (formData.altMobile.length !== 10 ||
        formData.altMobile === formData.mobile)
    ) {
      newErrors.altMobile = true;
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = true;
    }

    if (!formData.address.trim() || formData.address.trim().length < 10) {
      newErrors.address = true;
    }

    const todays = new Date().toISOString().split("T")[0];
    if (!formData.joinDate || formData.joinDate > todays)
      newErrors.joinDate = true;

    if (!formData.selectedPlanId) newErrors.selectedPlanId = true;

    if (!formData.branch) newErrors.branch = true;

    if (Number(formData.amountPaid) < 0) newErrors.amountPaid = true;

    if (Number(formData.discount) > Number(formData.totalAmount))
      newErrors.discount = true;

    const finalAmt =
      Number(formData.totalAmount) - Number(formData.discount || 0);
    if (Number(formData.amountPaid) > finalAmt) newErrors.amountPaid = true;

    if (balanceAmount > 0 && !formData.dueDate) newErrors.dueDate = true;

    if (
      balanceAmount > 0 &&
      formData.dueDate &&
      new Date(formData.dueDate) < new Date(formData.joinDate)
    ) {
      newErrors.dueDate = true;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Init member ID on mount
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      memberId: generateMemberId(prev.branch),
    }));
  }, []);

  // Regenerate member ID on branch change
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      memberId: generateMemberId(prev.branch),
    }));
  }, [formData.branch]);

  // ─── AUTO-SELECT FIRST PLAN WHEN PLAN TYPE CHANGES ──────────────────────────
  // ─── AUTO-SELECT FIRST PLAN WHEN PLAN TYPE CHANGES ──────────────────────────
  useEffect(() => {
    const filtered = membershipPlans.filter(
      (p) => p.planType === formData.planType && p.status !== "Inactive",
    );

    if (filtered.length > 0) {
      applyPlanData(filtered[0]);
    } else {
      setFormData((prev) => ({
        ...prev,
        selectedPlanId: "",
        membershipFee: 0,
        admissionFee: 0,
        offerPrice: 0,
        totalAmount: 0,
        expiryDate: "",
        totalDays: 0,
      }));
    }
  }, [formData.planType, membershipPlans]);

  const finalAmount =
    Number(formData.totalAmount || 0) - Number(formData.discount || 0);

  // ─── APPLY PLAN DATA WHEN PLAN IS SELECTED ───────────────────────────────────
  const applyPlanData = (plan) => {
    const effectivePrice = plan.offerPrice > 0 ? plan.offerPrice : plan.price;
    const admissionFee = plan.admissionFee || 0;

    // Calculate expiry
    const joinDate = new Date(formData.joinDate);
    let months = 1;
    if (plan.duration === "3 Months") months = 3;
    if (plan.duration === "6 Months") months = 6;
    if (plan.duration === "12 Months" || plan.duration === "1 Year")
      months = 12;

    const expiryDate = new Date(joinDate);
    expiryDate.setMonth(expiryDate.getMonth() + months);
    const totalDays = Math.round(
      (expiryDate - joinDate) / (1000 * 60 * 60 * 24),
    );

    setFormData((prev) => ({
      ...prev,
      selectedPlanId: plan._id,
      duration: plan.duration,
      membershipFee: effectivePrice,
      admissionFee: admissionFee,
      offerPrice: plan.offerPrice || 0,
      totalAmount: effectivePrice + admissionFee,
      expiryDate: expiryDate.toISOString().split("T")[0],
      totalDays,
    }));
  };

  // ─── RECALCULATE EXPIRY ON JOIN DATE CHANGE ──────────────────────────────────
  useEffect(() => {
    if (!formData.selectedPlanId) return;
    const plan = membershipPlans.find((p) => p._id === formData.selectedPlanId);
    if (!plan) return;

    const joinDate = new Date(formData.joinDate);
    let months = 1;
    if (plan.duration === "3 Months") months = 3;
    if (plan.duration === "6 Months") months = 6;
    if (plan.duration === "12 Months" || plan.duration === "1 Year")
      months = 12;

    const expiryDate = new Date(joinDate);
    expiryDate.setMonth(expiryDate.getMonth() + months);
    const totalDays = Math.round(
      (expiryDate - joinDate) / (1000 * 60 * 60 * 24),
    );

    setFormData((prev) => ({
      ...prev,
      expiryDate: expiryDate.toISOString().split("T")[0],
      totalDays,
    }));
  }, [formData.joinDate]);

  // ─── BMI CALCULATOR ──────────────────────────────────────────────────────────
  useEffect(() => {
    const weight = parseFloat(formData.weight);
    const height = parseFloat(formData.height);

    if (!isNaN(weight) && !isNaN(height) && weight > 0 && height > 0) {
      const heightInMeters = height / 100;
      const bmi = (weight / (heightInMeters * heightInMeters)).toFixed(1);
      setFormData((prev) => (prev.bmi === bmi ? prev : { ...prev, bmi }));
    } else {
      setFormData((prev) =>
        prev.bmi === "0.0" ? prev : { ...prev, bmi: "0.0" },
      );
    }
  }, [formData.weight, formData.height]);

  // ─── PAYMENT STATUS AUTO-CALC ────────────────────────────────────────────────
  useEffect(() => {
    const total =
      Number(formData.totalAmount || 0) - Number(formData.discount || 0);

    const paid = Number(formData.amountPaid || 0);

    const balance = total - paid;

    let status = "Balance Pending";

    if (total > 0 && balance <= 0) {
      status = "Fully Paid";
    }
    setFormData((prev) => ({
      ...prev,
      paymentStatus: status,
    }));
  }, [formData.amountPaid, formData.discount, formData.totalAmount]);

  // ─── BALANCE AMOUNT ──────────────────────────────────────────────────────────
  const balanceAmount = Math.max(
    0,
    finalAmount - Number(formData.amountPaid || 0),
  );

  // ─── INPUT HANDLER ───────────────────────────────────────────────────────────
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;

    if (name === "fullName") {
      newValue = value
        .replace(/[^A-Za-z\u0B80-\u0BFF ]/g, "")
        .replace(/\s{2,}/g, " ")
        .toUpperCase();
    }
    if (name === "mobile" || name === "altMobile") {
      newValue = value.replace(/\D/g, "").slice(0, 10);
    }
    if (name === "email") {
      newValue = value.trim().toLowerCase();
    }
    if (name === "address") {
      newValue = value.toUpperCase();
    }
    if (name === "weight" || name === "height") {
      newValue = value.replace(/[^\d.]/g, "").slice(0, 5);
    }
    if (name === "discount" || name === "amountPaid") {
      newValue = value === "" ? "" : Math.max(0, Number(value));
    }
    if (name === "paymentNote") {
      newValue = value.slice(0, 200);
    }

    setFormData((prev) => ({ ...prev, [name]: newValue }));

    // field fill panna udane andha field oda red border clear aagum
    if (errors[name]) {
      setErrors((prev) => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }
  };

  // ─── FORM SUBMIT ─────────────────────────────────────────────────────────────
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const isValid = validateForm();
    if (!isValid) return; // red border kaattividum, alert venam

    const prefix = formData.branch === "MUGIL_FITNESS" ? "MF" : "SP";
    const key = `${prefix}_COUNTER`;
    const currentCounter = Number(localStorage.getItem(key)) || 1;
    loadingAlert(
      "Saving Member...",
      "Please wait while we register the member.",
    );

    try {
      const response = await api.post("/members", {
        ...formData,
        totalAmount:
          Number(formData.totalAmount || 0) - Number(formData.discount || 0),
        balanceAmount,
      });

      console.log(response.data);
      localStorage.setItem(key, currentCounter + 1);

      await successAlert(
        "Member Registered Successfully",
        `Member ID : ${formData.memberId}`,
      );

      setFormData({
        memberId: generateMemberId(formData.branch),
        fullName: "",
        dob: "",
        gender: "",
        mobile: "",
        altMobile: "",
        email: "",
        address: "",
        planType: "Weight Gain",
        selectedPlanId: "",
        duration: "1 Month",
        joinDate: new Date().toISOString().split("T")[0],
        expiryDate: "",
        totalDays: 30,
        branch: formData.branch,
        membershipFee: 0,
        admissionFee: 250,
        offerPrice: 0,
        totalAmount: 0,
        discount: 0,
        amountPaid: 0,
        paymentStatus: "Balance Pending",
        paymentMethod: "Cash",
        dueDate: "",
        paymentNote: "",
        weight: "",
        height: "",
        bmi: "0.0",
        fitnessGoal: "",
        medicalCondition: "None",
        trainerAssigned: "",
      });
      setErrors({});
    } catch (error) {
      console.error(error);
      await errorAlert(
        "Registration Failed",
        error.response?.data?.message || "Failed to save member",
      );
      return;
    }
  };

  const isFormValid = Object.keys(getFormErrors()).length === 0;
  const handlePrintClick = () => {
    const isValid = validateForm();
    if (!isValid) return; // red border kaattividum
    window.print();
  };

  // const isFormValid =
  //   formData.fullName.trim().length >= 3 &&
  //   formData.mobile.length === 10 &&
  //   formData.address.trim().length >= 10 &&
  //   formData.gender &&
  //   formData.dob &&
  //   formData.selectedPlanId &&
  //   formData.branch &&
  //   formData.joinDate &&
  //   formData.expiryDate;

  // ─── SELECTED PLAN OBJECT ─────────────────────────────────────────────────────
  const selectedPlan = membershipPlans.find(
    (p) => p._id === formData.selectedPlanId,
  );

  const getBmiCategory = (bmi) => {
    const b = parseFloat(bmi);
    if (isNaN(b) || b === 0) return { label: "—", color: "text-slate-400" };
    if (b < 18.5) return { label: "Underweight", color: "text-blue-500" };
    if (b < 25) return { label: "Normal", color: "text-emerald-500" };
    if (b < 30) return { label: "Overweight", color: "text-amber-500" };
    return { label: "Obese", color: "text-red-500" };
  };
  const bmiCategory = getBmiCategory(formData.bmi);

  return (
    <div className=" font-sans w-full text-slate-800 animate-fade-in select-none font-sans min-h-screen pb-16 bg-[#f8fafc]/40">
      <PageHeader
        title="Add New Member"
        description="Fill in the details to register a new member."
      />

      <form
        onSubmit={handleFormSubmit}
        className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start"
      >
        <div className="xl:col-span-3 space-y-6">
          {/* ════════════════════════════════════════════════════════
              SECTION 1 · PERSONAL INFORMATION
          ════════════════════════════════════════════════════════ */}
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="text-xs font-black text-[#4d3df7] uppercase tracking-widest flex items-center gap-2">
              <FiUser size={14} /> 1. Personal Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Member ID */}
              <div className="space-y-1 md:col-span-2">
                <label className="text-slate-500 text-[10px] uppercase font-black tracking-wider block">
                  Member ID (Auto)
                </label>
                <input
                  type="text"
                  readOnly
                  value={formData.memberId}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-400 outline-none font-mono"
                />
              </div>

              {/* Full Name */}
              <div className="space-y-1">
                <label className="text-slate-500 text-[10px] uppercase font-black tracking-wider block">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  minLength={3}
                  maxLength={50}
                  placeholder="ENTER FULL NAME"
                  className={`w-full bg-white border rounded-xl px-3 py-2.5 text-xs font-bold text-slate-800 uppercase outline-none transition-all ${
                    errors.fullName
                      ? "border-red-400 ring-1 ring-red-100"
                      : "border-slate-200 focus:border-[#4d3df7]"
                  }`}
                />
              </div>

              {/* DOB */}
              <div className="space-y-1">
                <label className="text-slate-500 text-[10px] uppercase font-black tracking-wider block">
                  Date of Birth <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleInputChange}
                  className={`w-full bg-white border rounded-xl px-3 py-2.5 text-xs font-bold text-slate-700 outline-none font-mono ${
                    errors.dob
                      ? "border-red-400 ring-1 ring-red-100"
                      : "border-slate-200 focus:border-[#4d3df7]"
                  }`}
                />
              </div>

              {/* Gender */}
              <div className="space-y-1">
                <label className="text-slate-500 text-[10px] uppercase font-black tracking-wider block">
                  Gender <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className={`w-full bg-white border rounded-xl px-3 py-2.5 text-xs font-bold text-slate-700 outline-none ${
                    errors.gender
                      ? "border-red-400 ring-1 ring-red-100"
                      : "border-slate-200 focus:border-[#4d3df7]"
                  }`}
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Mobile */}
              <div className="space-y-1">
                <label className="text-slate-500 text-[10px] uppercase font-black tracking-wider block">
                  Mobile Number <span className="text-red-500">*</span>
                </label>
                <div
                  className={`flex rounded-xl overflow-hidden border transition-all ${
                    errors.mobile
                      ? "border-red-400 ring-1 ring-red-100"
                      : "border-slate-200 focus-within:border-[#4d3df7]"
                  }`}
                >
                  <span className="bg-slate-50 border-r border-slate-200 px-3 flex items-center text-xs font-bold text-slate-400 font-mono">
                    +91
                  </span>
                  <input
                    required
                    type="tel"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleInputChange}
                    maxLength={10}
                    placeholder="9876543210"
                    className="w-full px-3 py-2.5 text-xs font-bold text-slate-800 outline-none font-mono"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1 md:col-span-2">
                <label className="text-slate-500 text-[10px] uppercase font-black tracking-wider block">
                  Email ID
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="member@gmail.com"
                  className={`w-full bg-white border rounded-xl px-3 py-2.5 text-xs font-bold lowercase text-slate-800 outline-none font-mono ${
                    errors.email
                      ? "border-red-400 ring-1 ring-red-100"
                      : "border-slate-200 focus:border-[#4d3df7]"
                  }`}
                />
              </div>

              {/* Address */}
              <div className="space-y-1 md:col-span-2">
                <label className="text-slate-500 text-[10px] uppercase font-black tracking-wider block">
                  Address <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  minLength={10}
                  maxLength={250}
                  placeholder="ENTER COMPLETE ADDRESS"
                  className={`w-full bg-white border rounded-xl px-3 py-2.5 text-xs font-bold uppercase text-slate-800 outline-none transition-all ${
                    errors.address
                      ? "border-red-400 ring-1 ring-red-100"
                      : "border-slate-200 focus:border-[#4d3df7]"
                  }`}
                />
              </div>
            </div>
          </div>

          {/* ════════════════════════════════════════════════════════
              SECTION 2 · MEMBERSHIP DETAILS — PLAN PICKER
          ════════════════════════════════════════════════════════ */}
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-5">
            <h3 className="text-xs font-black text-[#4d3df7] uppercase tracking-widest flex items-center gap-2">
              <FiCreditCard size={14} /> 2. Membership Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Plan Type */}
              <div className="space-y-1">
                <label className="text-slate-500 text-[10px] uppercase font-black tracking-wider block">
                  Plan Type
                </label>
                <select
                  name="planType"
                  value={formData.planType}
                  onChange={handleInputChange}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-700 focus:border-[#4d3df7] outline-none"
                >
                  {[
                    "Weight Gain",
                    "Weight Loss",
                    "Personal Training",
                    "Crossfit",
                    "Others",
                  ].map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              {/* Join Date */}
              <div className="space-y-1">
                <label className="text-slate-500 text-[10px] uppercase font-black tracking-wider block">
                  Join Date
                </label>
                <input
                  type="date"
                  name="joinDate"
                  value={formData.joinDate}
                  onChange={handleInputChange}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-700 focus:border-[#4d3df7] outline-none font-mono"
                />
              </div>
            </div>

            {/* ── PLAN CARDS PICKER ── */}
            <div>
              <label className="text-slate-500 text-[10px] uppercase font-black tracking-wider block mb-3">
                Select Plan <span className="text-red-500">*</span>
              </label>

              {plansByType.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-200 p-6 text-center text-xs text-slate-400 font-semibold">
                  No active plans found for this type. Please create plans in
                  Subscription Plans.
                </div>
              ) : (
                <div
                  className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 rounded-2xl transition-all ${
                    errors.selectedPlanId
                      ? "ring-2 ring-red-300 ring-offset-2 p-2"
                      : ""
                  }`}
                >
                  {plansByType.map((plan) => {
                    const isSelected = formData.selectedPlanId === plan._id;
                    const hasOffer = plan.offerPrice > 0;
                    const effectivePrice = hasOffer
                      ? plan.offerPrice
                      : plan.price;

                    return (
                      <button
                        key={plan._id}
                        type="button"
                        onClick={() => applyPlanData(plan)}
                        className={`relative text-left rounded-[18px] border-2 p-4 transition-all duration-200 group focus:outline-none ${
                          isSelected
                            ? "border-[#4d3df7] bg-indigo-50/60 shadow-md shadow-indigo-500/10"
                            : "border-slate-200 bg-white hover:border-indigo-200 hover:bg-indigo-50/30"
                        }`}
                      >
                        {/* Offer badge */}
                        {hasOffer && (
                          <span className="absolute top-3 right-3 flex items-center gap-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[8px] font-black uppercase px-2 py-0.5 rounded-full">
                            <FiZap size={8} /> Offer
                          </span>
                        )}

                        {/* Selected indicator */}
                        {isSelected && (
                          <div className="absolute top-3 right-3">
                            <div className="w-5 h-5 rounded-full bg-[#4d3df7] flex items-center justify-center">
                              <FiCheckCircle size={11} className="text-white" />
                            </div>
                          </div>
                        )}

                        {/* Plan ID chip */}
                        <span className="text-[9px] font-black font-mono text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-md">
                          {plan.planId}
                        </span>

                        {/* Plan name */}
                        <p
                          className={`mt-2 text-[11px] font-black leading-tight ${isSelected ? "text-[#4d3df7]" : "text-slate-800"}`}
                        >
                          {plan.name}
                        </p>

                        {/* Duration */}
                        <p className="text-[10px] text-slate-400 font-bold mt-0.5 uppercase tracking-wide">
                          {plan.duration}
                        </p>

                        {/* Price */}
                        <div className="mt-3 pt-3 border-t border-slate-100">
                          {hasOffer ? (
                            <div>
                              <p className="text-[10px] text-slate-400 line-through font-bold font-mono">
                                ₹{plan.price.toLocaleString("en-IN")}
                              </p>
                              <p
                                className={`text-base font-black font-mono ${isSelected ? "text-[#4d3df7]" : "text-emerald-600"}`}
                              >
                                ₹{plan.offerPrice.toLocaleString("en-IN")}
                              </p>
                            </div>
                          ) : (
                            <p
                              className={`text-base font-black font-mono ${isSelected ? "text-[#4d3df7]" : "text-slate-800"}`}
                            >
                              ₹{plan.price.toLocaleString("en-IN")}
                            </p>
                          )}
                          {plan.admissionFee > 0 && (
                            <p className="text-[9px] text-slate-400 font-semibold mt-0.5">
                              + ₹{plan.admissionFee} admission
                            </p>
                          )}
                        </div>

                        {/* Features preview */}
                        {plan.features?.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-1">
                            {plan.features.slice(0, 2).map((f, i) => (
                              <span
                                key={i}
                                className="text-[8px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded-md"
                              >
                                {f}
                              </span>
                            ))}
                            {plan.features.length > 2 && (
                              <span className="text-[8px] font-bold text-indigo-500 bg-indigo-50 px-1.5 py-0.5 rounded-md">
                                +{plan.features.length - 2}
                              </span>
                            )}
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* ── SELECTED PLAN SUMMARY ── */}
            {selectedPlan && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                {/* Expiry Date */}
                <div className="space-y-1">
                  <label className="text-slate-500 text-[10px] uppercase font-black tracking-wider block">
                    Expiry Date
                  </label>
                  <input
                    readOnly
                    type="date"
                    value={formData.expiryDate}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-500 outline-none font-mono"
                  />
                </div>

                {/* Validity Banner */}
                <div className="space-y-1">
                  <label className="text-slate-500 text-[10px] uppercase font-black tracking-wider block">
                    Membership Validity
                  </label>
                  <div className="bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-2.5 flex items-center justify-between">
                    <p className="text-[10px] uppercase tracking-widest font-black text-emerald-500">
                      Total Days
                    </p>
                    <p className="text-lg font-black text-emerald-600 font-mono">
                      {formData.totalDays} Days
                    </p>
                  </div>
                </div>

                {/* Selected plan features */}
                {selectedPlan.features?.length > 0 && (
                  <div className="md:col-span-2">
                    <label className="text-slate-500 text-[10px] uppercase font-black tracking-wider block mb-2">
                      Included in this Plan
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {selectedPlan.features.map((feat, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center gap-1.5 bg-indigo-50 border border-indigo-100 text-indigo-700 text-[10px] font-bold px-2.5 py-1 rounded-lg"
                        >
                          <FiCheckCircle
                            className="text-indigo-400"
                            size={10}
                          />
                          {feat}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Branch */}
            <div className="space-y-1">
              <label className="text-slate-500 text-[10px] uppercase font-black tracking-wider block">
                Branch
              </label>
              <select
                name="branch"
                value={formData.branch}
                onChange={handleInputChange}
                className={`w-full bg-white border rounded-xl px-3 py-2.5 text-xs font-black text-slate-700 outline-none ${
                  errors.branch
                    ? "border-red-400 ring-1 ring-red-100"
                    : "border-slate-200 focus:border-[#4d3df7]"
                }`}
              >
                <option value="MUGIL_FITNESS">Mugil Fitness</option>
                <option value="SP_FITNESS">SP Fitness</option>
              </select>
            </div>
          </div>

          {/* ════════════════════════════════════════════════════════
              SECTION 3 · PAYMENT INFORMATION
          ════════════════════════════════════════════════════════ */}
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-5">
            <h3 className="text-xs font-black text-[#4d3df7] uppercase tracking-widest flex items-center gap-2">
              <FiDollarSign size={14} /> 3. Payment Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-slate-500 text-[10px] uppercase font-black tracking-wider block mb-1">
                  Membership Fee
                </label>
                <input
                  readOnly
                  value={`₹${formData.membershipFee}`}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-black text-slate-600"
                />
              </div>

              <div>
                <label className="text-slate-500 text-[10px] uppercase font-black tracking-wider block mb-1">
                  Admission Fee
                </label>
                <input
                  readOnly
                  value={`₹${formData.admissionFee}`}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-black text-slate-600"
                />
              </div>

              <div>
                <label className="text-slate-500 text-[10px] uppercase font-black tracking-wider block mb-1">
                  Total Amount
                </label>
                <input
                  readOnly
                  value={`₹${formData.totalAmount}`}
                  className="w-full bg-violet-50 border border-violet-200 rounded-xl px-3 py-2.5 text-xs font-black text-violet-600"
                />
              </div>

              <div>
                <label className="text-slate-500 text-[10px] uppercase font-black tracking-wider block mb-1">
                  Discount
                </label>
                <input
                  type="number"
                  name="discount"
                  value={formData.discount === 0 ? "" : formData.discount}
                  placeholder="0"
                  onChange={handleInputChange}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-black focus:border-[#4d3df7] outline-none"
                />
              </div>

              <div>
                <label className="text-slate-500 text-[10px] uppercase font-black tracking-wider block mb-1">
                  Amount Paid
                </label>
                <input
                  type="number"
                  name="amountPaid"
                  value={formData.amountPaid}
                  onChange={handleInputChange}
                  className={`w-full bg-white border rounded-xl px-3 py-2.5 text-xs font-black outline-none ${
                    errors.amountPaid
                      ? "border-red-400 ring-1 ring-red-100"
                      : "border-slate-200 focus:border-[#4d3df7]"
                  }`}
                />
              </div>

              <div>
                <label className="text-slate-500 text-[10px] uppercase font-black tracking-wider block mb-1">
                  Balance Amount
                </label>
                <input
                  readOnly
                  value={`₹${balanceAmount}`}
                  className={`w-full rounded-xl px-3 py-2.5 text-xs font-black border ${
                    balanceAmount > 0
                      ? "bg-red-50 border-red-200 text-red-600"
                      : "bg-emerald-50 border-emerald-200 text-emerald-600"
                  }`}
                />
              </div>

              <div>
                <label className="text-slate-500 text-[10px] uppercase font-black tracking-wider block mb-1">
                  Payment Status
                </label>
                <input
                  readOnly
                  value={formData.paymentStatus}
                  className="w-full bg-blue-50 border border-blue-200 rounded-xl px-3 py-2.5 text-xs font-black text-blue-600"
                />
              </div>

              <div>
                <label className="text-slate-500 text-[10px] uppercase font-black tracking-wider block mb-1">
                  Payment Method
                </label>
                <select
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleInputChange}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold focus:border-[#4d3df7] outline-none"
                >
                  <option>Cash</option>
                  <option>UPI</option>
                  <option>Card</option>
                  <option>Bank Transfer</option>
                </select>
              </div>

              {balanceAmount > 0 && (
                <div>
                  <label className="text-slate-500 text-[10px] uppercase font-black tracking-wider block mb-1">
                    Balance Due Date
                  </label>
                  <input
                    type="date"
                    name="dueDate"
                    value={formData.dueDate}
                    onChange={handleInputChange}
                    className={`w-full bg-white border rounded-xl px-3 py-2.5 text-xs font-bold outline-none ${
                      errors.dueDate
                        ? "border-red-400 ring-1 ring-red-100"
                        : "border-slate-200 focus:border-[#4d3df7]"
                    }`}
                  />
                </div>
              )}
            </div>

            <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 text-[11px] font-bold text-blue-600">
              System automatically calculates Membership Fee, Admission Fee,
              Expiry Date, Total Amount, Balance Amount and Payment Status based
              on the selected plan.
            </div>
          </div>

          {/* ════════════════════════════════════════════════════════
              SECTION 4 · FITNESS INFORMATION
          ════════════════════════════════════════════════════════ */}
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="text-xs font-black text-[#4d3df7] uppercase tracking-widest flex items-center gap-2">
              <FiActivity size={14} /> 4. Fitness Information
              <span className="text-[10px] font-medium text-slate-400 capitalize normal-case">
                (Optional)
              </span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-1">
                <label className="text-slate-500 text-[10px] uppercase font-black tracking-wider block">
                  Weight (kg)
                </label>
                <input
                  type="number"
                  name="weight"
                  value={formData.weight}
                  onChange={handleInputChange}
                  placeholder="Enter weight"
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-800 outline-none font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-500 text-[10px] uppercase font-black tracking-wider block">
                  Height (cm)
                </label>
                <input
                  type="number"
                  name="height"
                  value={formData.height}
                  onChange={handleInputChange}
                  placeholder="Enter height"
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-800 outline-none font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-500 text-[10px] uppercase font-black tracking-wider block">
                  BMI (Auto)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    readOnly
                    value={formData.bmi}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-black text-slate-500 outline-none font-mono text-center"
                  />
                  {formData.bmi !== "0.0" && (
                    <span
                      className={`absolute right-2 top-1/2 -translate-y-1/2 text-[8px] font-black uppercase ${bmiCategory.color}`}
                    >
                      {bmiCategory.label}
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-500 text-[10px] uppercase font-black tracking-wider block">
                  Fitness Goal
                </label>
                <select
                  name="fitnessGoal"
                  value={formData.fitnessGoal}
                  onChange={handleInputChange}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-700 outline-none"
                >
                  <option value="">Select Goal</option>
                  <option value="Muscle Building">Muscle Building</option>
                  <option value="Fat Loss">Fat Loss</option>
                  <option value="Conditioning">Fitness</option>
                </select>
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="text-slate-500 text-[10px] uppercase font-black tracking-wider block">
                  Any Medical Condition?
                </label>
                <select
                  name="medicalCondition"
                  value={formData.medicalCondition}
                  onChange={handleInputChange}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-700 outline-none"
                >
                  <option value="None">None</option>
                  <option value="Hypertension">Hypertension</option>
                  <option value="Diabetes">Diabetes</option>
                </select>
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="text-slate-500 text-[10px] uppercase font-black tracking-wider block">
                  Trainer Assigned
                </label>
                <select
                  name="trainerAssigned"
                  value={formData.trainerAssigned}
                  onChange={handleInputChange}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-700 outline-none"
                >
                  <option value="">Select Trainer</option>
                  <option value="Udhaya Suryan">
                    Udhaya Suryan (Head Trainer)
                  </option>
                </select>
              </div>

              <div className="md:col-span-4 bg-blue-50/60 border border-blue-100/60 rounded-xl p-3 flex items-center gap-2 text-[10px] font-bold text-blue-500">
                <FiInfo size={14} className="shrink-0" />
                <span>
                  BMI will be calculated automatically based on weight and
                  height.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ════════════════════════════════════════════════════════
            PAYMENT SUMMARY PANEL
        ════════════════════════════════════════════════════════ */}
        <div className="xl:col-span-3 select-none">
          <div className="bg-white border border-slate-100 rounded-[24px] p-6 shadow-sm">
            <div className="border-b border-slate-100 pb-4 mb-6">
              <h4 className="text-lg font-black text-slate-900">
                Payment Summary
              </h4>
              <p className="text-xs text-slate-400 font-medium mt-1">
                Membership payment details and balance information
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* LEFT — breakdown */}
              <div className="lg:col-span-2 bg-slate-50 border border-slate-100 rounded-2xl p-5">
                <h5 className="text-xs font-black uppercase tracking-wider text-slate-500 border-b border-slate-200 pb-3 mb-4">
                  Payment Details
                </h5>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 text-sm">
                      Selected Plan
                    </span>
                    <span className="bg-white border border-slate-200 px-3 py-1 rounded-lg font-bold text-slate-800 text-xs">
                      {selectedPlan ? selectedPlan.name : "—"}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 text-sm">Duration</span>
                    <span className="bg-white border border-slate-200 px-3 py-1 rounded-lg font-bold text-slate-800 text-xs">
                      {formData.duration}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 text-sm">
                      Membership Fee
                    </span>
                    <span className="font-black text-slate-900 font-mono">
                      ₹
                      {Number(formData.membershipFee || 0).toLocaleString(
                        "en-IN",
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 text-sm">
                      Admission Fee
                    </span>
                    <span className="font-black text-slate-900 font-mono">
                      ₹
                      {Number(formData.admissionFee || 0).toLocaleString(
                        "en-IN",
                      )}
                    </span>
                  </div>

                  {Number(formData.discount) > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-orange-500 text-sm">Discount</span>
                      <span className="font-black text-orange-600 font-mono">
                        - ₹
                        {Number(formData.discount || 0).toLocaleString("en-IN")}
                      </span>
                    </div>
                  )}
                </div>

                <div className="mt-5 pt-4 border-t border-dashed border-slate-300">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-bold text-slate-600">
                        Total Amount
                      </p>
                      <p className="text-[11px] text-slate-400">
                        Total membership cost
                      </p>
                    </div>
                    <span className="text-2xl font-black text-violet-600 font-mono">
                      ₹{finalAmount.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>
              </div>

              {/* RIGHT — status */}
              <div className="space-y-4">
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-[11px] uppercase font-black text-slate-400 tracking-wider">
                      Payment Method
                    </span>
                    <span className="bg-white border border-slate-200 px-3 py-1 rounded-lg text-xs font-black text-slate-800">
                      {formData.paymentMethod}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-[11px] uppercase font-black text-slate-400 tracking-wider">
                      Status
                    </span>
                    <span
                      className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase border ${
                        balanceAmount > 0
                          ? "bg-orange-50 text-orange-600 border-orange-200"
                          : "bg-emerald-50 text-emerald-600 border-emerald-200"
                      }`}
                    >
                      {formData.paymentStatus}
                    </span>
                  </div>

                  <div className="border-t border-slate-200 mt-4 pt-4 flex justify-between items-center">
                    <span className="text-slate-500 text-sm">Amount Paid</span>
                    <span className="text-lg font-black text-emerald-600 font-mono">
                      ₹
                      {Number(formData.amountPaid || 0).toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>

                <div
                  className={`rounded-2xl border p-5 ${
                    balanceAmount > 0
                      ? "bg-red-50 border-red-200"
                      : "bg-emerald-50 border-emerald-200"
                  }`}
                >
                  <p
                    className={`text-[11px] uppercase font-black tracking-wider ${
                      balanceAmount > 0 ? "text-red-500" : "text-emerald-500"
                    }`}
                  >
                    {balanceAmount > 0 ? "Balance Amount" : "Payment Completed"}
                  </p>

                  <h3
                    className={`text-3xl font-black font-mono mt-2 ${
                      balanceAmount > 0 ? "text-red-600" : "text-emerald-600"
                    }`}
                  >
                    ₹{Number(balanceAmount || 0).toLocaleString("en-IN")}
                  </h3>

                  {balanceAmount > 0 ? (
                    <div className="mt-4 pt-4 border-t border-red-200 flex justify-between items-center">
                      <span className="text-[11px] font-bold text-red-500 uppercase">
                        Due Date
                      </span>
                      <span className="font-black text-slate-800 font-mono">
                        {formData.dueDate
                          ? formData.dueDate.split("-").reverse().join("/")
                          : "Not Set"}
                      </span>
                    </div>
                  ) : (
                    <div className="mt-4 inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-3 py-2 rounded-lg text-xs font-black">
                      Payment Received
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="xl:col-span-3 mt-8 w-full bg-white border border-slate-100 rounded-[24px] p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            {/* இடது பக்கம்: வார்னிங் மெசேஜ் */}
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <div
                className={`w-12 h-12 rounded-xl border flex items-center justify-center shrink-0 transition-all ${
                  isFormValid
                    ? "bg-emerald-50 border-emerald-100 text-emerald-600"
                    : "bg-amber-50 border-amber-100 text-amber-600"
                }`}
              >
                {isFormValid ? (
                  <FiCheckCircle size={22} />
                ) : (
                  <FiAlertCircle size={22} />
                )}
              </div>
              <div className="min-w-0">
                <h4
                  className={`text-sm font-black uppercase tracking-wider leading-tight whitespace-nowrap ${
                    isFormValid ? "text-emerald-700" : "text-amber-800"
                  }`}
                >
                  {isFormValid
                    ? "All Parameters Verified"
                    : "Required Parameters Intercepted"}
                </h4>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 leading-relaxed whitespace-nowrap">
                  {isFormValid
                    ? "Ready to save this member."
                    : "Please populate all required field vectors."}
                </p>
              </div>
            </div>

            {/* வலது பக்கம்: பட்டன்கள் */}
            <div className="flex items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={handlePrintClick}
                className="flex items-center justify-center gap-2 px-6 h-12 border border-slate-300 bg-white text-slate-700 rounded-xl text-xs font-black uppercase tracking-widest whitespace-nowrap transition-all hover:bg-slate-50 hover:border-slate-400 cursor-pointer"
              >
                <FiPrinter size={14} /> Print
              </button>

              <button
                type="submit"
                className={`flex items-center justify-center gap-2 px-8 h-12 rounded-xl text-xs font-black uppercase tracking-widest whitespace-nowrap transition-all cursor-pointer ${
                  isFormValid
                    ? "bg-[#4d3df7] text-white shadow-md shadow-indigo-500/30 hover:bg-[#3f30e0]"
                    : "bg-slate-100 text-slate-400 hover:bg-slate-200"
                }`}
              >
                <FiSave size={14} /> Save Member
              </button>
            </div>
          </div>
        </div>
      </form>

      {/* ════════════════════════════════════════════════════════
          BOTTOM ACTION BAR
      ════════════════════════════════════════════════════════ */}
    </div>
  );
}

export default NewMemberForm;
