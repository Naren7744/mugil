import React, { useState, useEffect } from "react";
import PageHeader from "../../components/dashboard/PageHeader";
import { useOutletContext } from "react-router-dom";
import {
  successAlert,
  errorAlert,
  warningAlert,
  confirmAlert,
  loadingAlert,
} from "../../utils/alerts";
import api from "../../services/api";
import {
  FiCreditCard, FiPlus, FiEdit2, FiTrash2, FiCheckCircle,
  FiDollarSign, FiClock, FiLayers, FiX, FiSave, FiAlertCircle,
  FiEye, FiStar, FiXCircle, FiChevronDown, FiRefreshCw
} from "react-icons/fi";

function MembershipPlans() {
  const { currentBranch, searchQuery } = useOutletContext();

  const [statusFilter, setStatusFilter]           = useState("All Status");
  const [plans, setPlans]                         = useState([]);
  const [deletedPlans, setDeletedPlans]           = useState([]);
  const [isFormOpen, setIsFormOpen]               = useState(false);
  const [editingPlan, setEditingPlan]             = useState(null);
  const [selectedPlan, setSelectedPlan]           = useState(null);
  const [activeCategoryTab, setActiveCategoryTab] = useState("All Plans");
  const [activeDashboardFilter, setActiveDashboardFilter] = useState("ALL");
  const [loading, setLoading]                     = useState(false);
  const [fetchingPlans, setFetchingPlans]         = useState(false);
  const [restoringId, setRestoringId]             = useState(null);

  const [formData, setFormData] = useState({
    name: "", planType: "Weight Gain", duration: "1 Month",
    price: "", admissionFee: "", offerPrice: "", status: "Active",
    description: "", features: "", isFeatured: false,
    offerStartDate: "", offerEndDate: "",
  });

  // ── Fetch active plans ────────────────────────────────────────────────────
  const fetchPlans = async () => {
    setFetchingPlans(true);
    try {
     const res = await api.get("/plans");
      setPlans(res.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setFetchingPlans(false);
    }
  };

  // ── Fetch soft-deleted plans ──────────────────────────────────────────────
  const fetchDeletedPlans = async () => {
    try {
    const res = await api.get("/plans/deleted");
      setDeletedPlans(res.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchPlans();
    fetchDeletedPlans();
  }, []);

  // ── Restore plan ──────────────────────────────────────────────────────────
  const handleRestore = async (id) => {
    if (restoringId) return;
    try {
      setRestoringId(id);
      await api.put(`/plans/restore/${id}`);
      await fetchPlans();
      await fetchDeletedPlans();
    } catch (error) {
      errorAlert(
  "Restore Failed",
  error?.response?.data?.message || "Unable to restore plan."
);
    } finally {
      setRestoringId(null);
    }
  };

  // ── Form helpers ──────────────────────────────────────────────────────────
  const handleOpenCreate = () => {
    setEditingPlan(null);
    setFormData({
      name: "", planType: "Weight Gain", duration: "1 Month",
      price: "", admissionFee: "", offerPrice: "", status: "Active",
      description: "", features: "", isFeatured: false,
      offerStartDate: "", offerEndDate: "",
    });
    setIsFormOpen(true);
  };

  const handleOpenEdit = (plan) => {
    setEditingPlan(plan);
    setFormData({
      name:          plan.name          || "",
      planType:      plan.planType      || "Weight Gain",
      duration:      plan.duration      || "1 Month",
      price:         plan.price         || "",
      admissionFee:  plan.admissionFee  || "",
      offerPrice:    plan.offerPrice    || "",
      status:        plan.status        || "Active",
      description:   plan.description   || "",
      features:      plan.features ? plan.features.join(", ") : "",
      isFeatured:    plan.isFeatured    || false,
      offerStartDate: plan.offerStartDate?.slice(0, 10) || "",
      offerEndDate:   plan.offerEndDate?.slice(0, 10)   || "",
    });
    setIsFormOpen(true);
  };

  // ── Save plan ─────────────────────────────────────────────────────────────
  const handleSavePlan = async (e) => {
    e.preventDefault();
    if (loading) return;

    try {
      if (!formData.name.trim()) { warningAlert(
   "Validation",
   "Please enter Plan Name."
); return; }
      if (!formData.price)       { warningAlert(
   "Validation",
   "Please enter Plan Price."
); return; }

      if (Number(formData.offerPrice) > Number(formData.price)) {
       warningAlert(
   "Invalid Offer",
   "Offer price cannot be greater than Plan price."
); return;
      }

      if (
        Number(formData.offerPrice) > 0 &&
        (!formData.offerStartDate || !formData.offerEndDate)
      ) {
       warningAlert(
   "Offer Dates Missing",
   "Select Offer Start Date and End Date."
);; return;
      }

      if (
        formData.offerStartDate &&
        formData.offerEndDate &&
        formData.offerStartDate > formData.offerEndDate
      ) {
       warningAlert(
   "Invalid Date",
   "Offer End Date should be after Start Date."
);; return;
      }

      setLoading(true);

      const featureArray = formData.features
        .split(",").map((f) => f.trim()).filter((f) => f !== "");

      if (editingPlan) {
        await api.put(
`/plans/${editingPlan._id}`,
{
          name:         formData.name,
          planType:     formData.planType,
          duration:     formData.duration,
          price:        Number(formData.price),
          admissionFee: Number(formData.admissionFee || 0),
          offerPrice:   Number(formData.offerPrice   || 0),
          status:
            formData.status === "Inactive"
              ? "Inactive"
              : Number(formData.offerPrice) > 0
              ? "Offer"
              : "Active",
          description:    formData.description,
          features:       featureArray,
          isFeatured:     formData.isFeatured,
          offerStartDate: Number(formData.offerPrice) > 0 ? formData.offerStartDate : "",
          offerEndDate:   Number(formData.offerPrice) > 0 ? formData.offerEndDate   : "",
        });
        successAlert(
   "Plan Updated",
   "Membership Plan updated successfully."
);
      } else {
        const prefixMap = {
          "Weight Gain": "WG", "Weight Loss": "WL",
          "Personal Training": "PT", Crossfit: "CF", Others: "OT",
        };
        const prefix  = prefixMap[formData.planType] || "PL";
   const idRes = await api.get(
`/plans/next-id?prefix=${prefix}`
);
        const generatedId = idRes.data.nextId;

        await api.post(
"/plans",
{
          planId:       generatedId,
          name:         formData.name,
          planType:     formData.planType,
          duration:     formData.duration,
          price:        Number(formData.price),
          admissionFee: Number(formData.admissionFee || 0),
          offerPrice:   Number(formData.offerPrice   || 0),
          status:       Number(formData.offerPrice) > 0 ? "Offer" : formData.status || "Active",
          description:  formData.description,
          features:     featureArray,
          isFeatured:   formData.isFeatured,
          offerStartDate: formData.offerStartDate,
          offerEndDate:   formData.offerEndDate,
        });
        successAlert(
   "Plan Created",
   "Membership Plan created successfully."
);
      }

      await fetchPlans();
      await fetchDeletedPlans();
      setIsFormOpen(false);
      setEditingPlan(null);
      setFormData({
        name: "", planType: "Weight Gain", duration: "1 Month",
        price: "", admissionFee: "", offerPrice: "", status: "Active",
        description: "", features: "", isFeatured: false,
        offerStartDate: "", offerEndDate: "",
      });
    } catch (error) {
      console.error(error);
     errorAlert(
   "Operation Failed",
   error?.response?.data?.message || "Something went wrong."
);
    } finally {
      setLoading(false);
    }
  };

  // ── Delete plan ───────────────────────────────────────────────────────────
const handleDeletePlan = async (id) => {
  const ok = await confirmAlert({
    title: "Delete Membership Plan?",
    text: "This plan will be moved to Deleted Plans.",
    confirmButtonText: "Delete",
    cancelButtonText: "Cancel",
  });

  if (!ok) return;

  try {
    loadingAlert("Deleting Membership Plan...");

    await api.delete(`/plans/${id}`);

    await fetchPlans();
    await fetchDeletedPlans();

    successAlert(
      "Deleted Successfully",
      "Membership Plan has been moved to Deleted Plans."
    );

    if (selectedPlan?._id === id) {
      setSelectedPlan(null);
    }
  } catch (error) {
    errorAlert(
      "Delete Failed",
      error?.response?.data?.message ||
        "Unable to delete Membership Plan."
    );
  }
};

  // ── Filter logic ──────────────────────────────────────────────────────────
  let dashboardFilteredPlans = plans;
  if (activeDashboardFilter === "ACTIVE") {
    dashboardFilteredPlans = plans.filter((p) => p.status?.toLowerCase() === "active");
  } else if (activeDashboardFilter === "OFFER") {
    dashboardFilteredPlans = plans.filter((p) => Number(p.offerPrice) > 0);
  } else if (activeDashboardFilter === "INACTIVE") {
    dashboardFilteredPlans = plans.filter((p) => p.status?.toLowerCase() === "inactive");
  }

  // When DELETED filter is active — show deleted plans grid instead
  const showDeletedView = activeDashboardFilter === "DELETED";

  const filteredPlans = dashboardFilteredPlans.filter((plan) => {
    const matchesCategory =
      activeCategoryTab === "All Plans" ? true : plan.planType === activeCategoryTab;
    const matchesStatus =
      statusFilter === "All Status" ? true : plan.status === statusFilter;
    const matchesSearch = plan.name
      ?.toLowerCase()
      .includes((searchQuery || "").toLowerCase());
    return matchesCategory && matchesStatus && matchesSearch;
  });

  // ── Counts ─────────────────────────────────────────────────────────────────
  const totalCount    = plans.length;
  const activeCount   = plans.filter((p) => p.status?.toLowerCase() !== "inactive").length;
  const offerCount    = plans.filter((p) => Number(p.offerPrice) > 0).length;
  const inactiveCount = plans.filter((p) => p.status?.toLowerCase() === "inactive").length;
  const deletedCount  = deletedPlans.length;

  const finalAmount = selectedPlan
    ? (Number(selectedPlan.offerPrice) > 0
        ? Number(selectedPlan.offerPrice)
        : Number(selectedPlan.price)) + Number(selectedPlan.admissionFee || 0)
    : 0;

  // ── Style helpers ─────────────────────────────────────────────────────────
  const getStatusBadgeClass = (status) => {
    const s = status?.toLowerCase();
    if (s === "active")   return "bg-emerald-50 border-emerald-200 text-emerald-600";
    if (s === "offer")    return "bg-amber-50 border-amber-200 text-amber-600";
    return "bg-rose-50 border-rose-200 text-rose-600";
  };

  const getStatusDotClass = (status) => {
    const s = status?.toLowerCase();
    if (s === "active") return "bg-emerald-500";
    if (s === "offer")  return "bg-amber-500";
    return "bg-rose-500";
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className=" font-sans space-y-4 sm:space-y-6 text-slate-800 animate-fade-in select-none relative min-h-screen pb-24 sm:pb-12 overflow-x-hidden">

      <PageHeader
        title="Subscription Plans"
        description="Configure membership pricing, durations and plan features."
        rightContent={
          <button
            onClick={handleOpenCreate}
            className="cursor-pointer min-w-[145px] px-8 py-2.5 rounded-lg text-xs font-black uppercase tracking-wider bg-gradient-to-r from-[#4d3df7] to-[#8a3df7] text-white shadow-md hover:opacity-95 active:scale-95 transition-all duration-200 flex items-center justify-center gap-2"
          >
            <FiPlus size={14} />
            <span>Create New Plan</span>
          </button>
        }
      />

      {/* ── KPI CARDS ───────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-5 mb-6">

        {/* Total Plans */}
        <div
          onClick={() => setActiveDashboardFilter("ALL")}
          className={`group bg-white border rounded-[22px] p-4 md:p-5 shadow-sm flex flex-col justify-between h-auto md:h-[115px] transition-all duration-500 hover:-translate-y-1 hover:shadow-lg cursor-pointer relative overflow-hidden ${activeDashboardFilter === "ALL" ? "border-purple-300 shadow-purple-100" : "border-purple-100/70 hover:border-purple-200"}`}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-purple-50/0 to-purple-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="flex items-center gap-3 relative z-10">
            <div className="w-10 h-10 rounded-full bg-purple-50 text-[#4d3df7] flex items-center justify-center shadow-inner shrink-0 transition-transform duration-500 group-hover:scale-110 group-hover:bg-[#4d3df7] group-hover:text-white">
              <FiLayers size={16} />
            </div>
            <div className="leading-tight">
              <span className="text-[9px] font-black uppercase tracking-widest text-[#4d3df7] block">Total Plans</span>
              <h3 className="text-xl md:text-2xl font-black text-slate-900 font-mono tracking-tight mt-0.5">{totalCount}</h3>
            </div>
          </div>
          <div className="border-t border-slate-50/50 pt-2 mt-1 relative z-10">
            <span className="text-[10px] text-slate-400 font-semibold">All Plans</span>
          </div>
        </div>

        {/* Active Plans */}
        <div
          onClick={() => setActiveDashboardFilter("ACTIVE")}
          className={`group bg-white border rounded-[22px] p-4 md:p-5 shadow-sm flex flex-col justify-between h-auto md:h-[115px] transition-all duration-500 hover:-translate-y-1 hover:shadow-lg cursor-pointer relative overflow-hidden ${activeDashboardFilter === "ACTIVE" ? "border-emerald-300 shadow-emerald-100" : "border-emerald-100/70 hover:border-emerald-200"}`}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/0 to-emerald-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="flex items-center gap-3 relative z-10">
            <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-inner shrink-0 group-hover:scale-110 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-500">
              <FiCheckCircle size={16} />
            </div>
            <div className="leading-tight">
              <span className="text-[9px] font-black uppercase tracking-widest text-emerald-600 block">Active</span>
              <h3 className="text-xl md:text-2xl font-black text-slate-900 font-mono tracking-tight mt-0.5">{activeCount}</h3>
            </div>
          </div>
          <div className="border-t border-slate-50/50 pt-2 mt-1 relative z-10">
            <span className="text-[10px] text-slate-400 font-semibold">Currently Active</span>
          </div>
        </div>

        {/* Offer Plans */}
        <div
          onClick={() => setActiveDashboardFilter("OFFER")}
          className={`group bg-white border rounded-[22px] p-4 md:p-5 shadow-sm flex flex-col justify-between h-auto md:h-[115px] transition-all duration-500 hover:-translate-y-1 hover:shadow-lg cursor-pointer relative overflow-hidden ${activeDashboardFilter === "OFFER" ? "border-amber-300 shadow-amber-100" : "border-amber-100/70 hover:border-amber-200"}`}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-amber-50/0 to-amber-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="flex items-center gap-3 relative z-10">
            <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center shadow-inner shrink-0 group-hover:scale-110 group-hover:bg-amber-500 group-hover:text-white transition-all duration-500">
              <FiStar size={16} />
            </div>
            <div className="leading-tight">
              <span className="text-[9px] font-black uppercase tracking-widest text-amber-500 block">Offers</span>
              <h3 className="text-xl md:text-2xl font-black text-slate-900 font-mono tracking-tight mt-0.5">{offerCount}</h3>
            </div>
          </div>
          <div className="border-t border-slate-50/50 pt-2 mt-1 relative z-10">
            <span className="text-[10px] text-slate-400 font-semibold">Discounted</span>
          </div>
        </div>

        {/* Inactive Plans */}
        <div
          onClick={() => setActiveDashboardFilter("INACTIVE")}
          className={`group bg-white border rounded-[22px] p-4 md:p-5 shadow-sm flex flex-col justify-between h-auto md:h-[115px] transition-all duration-500 hover:-translate-y-1 hover:shadow-lg cursor-pointer relative overflow-hidden ${activeDashboardFilter === "INACTIVE" ? "border-rose-300 shadow-rose-100" : "border-rose-100/70 hover:border-rose-200"}`}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-rose-50/0 to-rose-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="flex items-center gap-3 relative z-10">
            <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center shadow-inner shrink-0 group-hover:scale-110 group-hover:bg-rose-500 group-hover:text-white transition-all duration-500">
              <FiXCircle size={16} />
            </div>
            <div className="leading-tight">
              <span className="text-[9px] font-black uppercase tracking-widest text-rose-500 block">Inactive</span>
              <h3 className="text-xl md:text-2xl font-black text-slate-900 font-mono tracking-tight mt-0.5">{inactiveCount}</h3>
            </div>
          </div>
          <div className="border-t border-slate-50/50 pt-2 mt-1 relative z-10">
            <span className="text-[10px] text-slate-400 font-semibold">Not Active</span>
          </div>
        </div>

        {/* ── 5th Card: Deleted Plans ─────────────────────────────────────── */}
        <div
          onClick={() => setActiveDashboardFilter("DELETED")}
          className={`group bg-white border rounded-[22px] p-4 md:p-5 shadow-sm flex flex-col justify-between h-auto md:h-[115px] transition-all duration-500 hover:-translate-y-1 hover:shadow-lg cursor-pointer relative overflow-hidden ${activeDashboardFilter === "DELETED" ? "border-slate-400 shadow-slate-200" : "border-slate-200/70 hover:border-slate-300"}`}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-slate-50/0 to-slate-100/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="flex items-center gap-3 relative z-10">
            <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center shadow-inner shrink-0 group-hover:scale-110 group-hover:bg-slate-700 group-hover:text-white transition-all duration-500">
              <FiTrash2 size={16} />
            </div>
            <div className="leading-tight">
              <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 block">Deleted</span>
              <h3 className="text-xl md:text-2xl font-black text-slate-900 font-mono tracking-tight mt-0.5">{deletedCount}</h3>
            </div>
          </div>
          <div className="border-t border-slate-50/50 pt-2 mt-1 relative z-10">
            <span className="text-[10px] text-slate-400 font-semibold">Soft Deleted</span>
          </div>
        </div>
      </div>

      {/* ── DELETED PLANS VIEW ───────────────────────────────────────────────── */}
      {showDeletedView && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-black text-slate-900">Deleted Plans</h3>
              <p className="text-sm text-slate-400 mt-0.5">
                {deletedCount} plan{deletedCount !== 1 ? "s" : ""} — click Restore to bring them back.
              </p>
            </div>
          </div>

          {deletedCount === 0 ? (
            <div className="text-center py-20 text-slate-400 font-bold text-sm bg-white rounded-[22px] border border-slate-100">
              No deleted plans found.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {deletedPlans.map((plan) => (
                <div
                  key={plan._id}
                  className="relative bg-white border border-slate-200/60 rounded-[24px] p-5 shadow-sm flex flex-col gap-4 opacity-75 hover:opacity-100 transition-all duration-300"
                >
                  {/* Deleted badge */}
                  <div className="absolute top-4 right-4">
                    <span className="text-[9px] font-black uppercase tracking-widest bg-slate-100 text-slate-500 px-2 py-1 rounded-full border border-slate-200">
                      Deleted
                    </span>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-11 h-11 rounded-[14px] bg-slate-100 text-slate-400 flex items-center justify-center shrink-0">
                      <FiCreditCard size={18} />
                    </div>
                    <div>
                      <span className="text-[9px] font-mono font-black text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
                        {plan.planId || "—"}
                      </span>
                      <h4 className="font-black text-slate-700 text-base mt-1 leading-tight">
                        {plan.name}
                      </h4>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">
                        {plan.planType} · {plan.duration}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between bg-slate-50 rounded-xl p-3 border border-slate-100">
                    <div>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Price</p>
                      <p className="font-black text-slate-700 font-mono">
                        ₹{Number(plan.price || 0).toLocaleString("en-IN")}
                      </p>
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Members</p>
                      <p className="font-black text-slate-700">{plan.memberCount || 0}</p>
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Revenue</p>
                      <p className="font-black text-emerald-600">
                        ₹{(plan.revenue || 0).toLocaleString("en-IN")}
                      </p>
                    </div>
                  </div>

                  <p className="text-[10px] text-slate-400 font-semibold">
                    Deleted on:{" "}
                    {plan.updatedAt
                      ? new Date(plan.updatedAt).toLocaleDateString("en-IN")
                      : "—"}
                  </p>

                  {/* Restore Button */}
                  <button
                    type="button"
                    onClick={() => handleRestore(plan._id)}
                    disabled={restoringId === plan._id}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-slate-900 hover:bg-slate-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white text-xs font-black uppercase tracking-widest rounded-[14px] transition-all duration-200 active:scale-95 shadow-sm"
                  >
                    <FiRefreshCw
                      size={14}
                      className={restoringId === plan._id ? "animate-spin" : ""}
                    />
                    {restoringId === plan._id ? "Restoring..." : "Restore Plan"}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── FILTER BAR (hidden in deleted view) ─────────────────────────────── */}
      {!showDeletedView && (
        <>
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-6 w-full bg-white p-2 rounded-[16px] border border-slate-100 shadow-sm">
            <div className="flex items-center bg-slate-50/60 border border-slate-200/60 rounded-[10px] h-[38px] p-0.5 overflow-x-auto hide-scrollbar shrink-0 w-full lg:w-auto">
              {["All Plans", "Weight Gain", "Weight Loss", "Personal Training", "Crossfit", "Others"].map((tab, idx) => {
                const isActive = activeCategoryTab === tab;
                return (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveCategoryTab(tab)}
                    className={`h-full px-3 sm:px-4 text-[10px] sm:text-[11px] font-bold tracking-wide transition-all flex items-center justify-center whitespace-nowrap ${
                      isActive
                        ? "bg-white text-[#4d3df7] border border-slate-200 shadow-sm rounded-[8px] font-black relative z-10"
                        : `text-slate-600 hover:text-slate-900 ${idx !== 5 ? "border-r border-slate-200/50" : ""}`
                    }`}
                  >
                    {tab}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-2.5 w-full lg:w-auto shrink-0">
              <div className="relative w-full sm:w-[130px] shrink-0">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full h-[38px] appearance-none bg-white border border-slate-200 rounded-[10px] pl-3 pr-8 text-[11px] font-bold text-slate-700 focus:outline-none focus:border-[#4d3df7] cursor-pointer transition-all"
                >
                  <option value="All Status">All Status</option>
                  <option value="Active">Active</option>
                  <option value="Offer">Offer</option>
                  <option value="Inactive">Inactive</option>
                </select>
                <div className="absolute inset-y-0 right-2.5 flex items-center pointer-events-none text-slate-400">
                  <FiChevronDown size={13} strokeWidth={2.5} />
                </div>
              </div>
            </div>
          </div>

          {/* ── PLAN CARDS GRID ──────────────────────────────────────────────── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 items-start w-full transition-all duration-700">
            {!fetchingPlans && filteredPlans.length === 0 && (
              <div className="col-span-2 text-center py-20 text-slate-400 font-bold text-sm">
                No plans found. Try adjusting your filters.
              </div>
            )}
            {fetchingPlans && (
              <div className="col-span-2 text-center py-20">
                <h3 className="font-bold text-slate-500">Loading Plans...</h3>
              </div>
            )}

            {filteredPlans.map((plan) => {
              const isOffer = Number(plan.offerPrice) > 0;
              const status  = plan.status || "Active";

              return (
                <div
                  key={plan.planId}
                  onClick={() => setSelectedPlan(plan)}
                  className="group relative rounded-[28px] transition-all duration-500 hover:-translate-y-2 cursor-pointer hover:shadow-xl hover:shadow-slate-300/50"
                >
                  <div className={`absolute inset-0 rounded-[28px] transition-all duration-500 ${
                    isOffer
                      ? "bg-gradient-to-br from-amber-400 via-orange-400 to-rose-400 opacity-0 group-hover:opacity-100 group-hover:scale-[1.01]"
                      : "bg-gradient-to-br from-indigo-400 via-purple-400 to-blue-400 opacity-0 group-hover:opacity-100 group-hover:scale-[1.01]"
                  }`} />
                  <div className={`absolute -inset-1 rounded-[30px] blur-xl transition-opacity duration-500 opacity-0 group-hover:opacity-40 ${
                    isOffer ? "bg-amber-500/30" : "bg-indigo-500/30"
                  }`} />

                  <div className="relative h-full bg-white rounded-[26px] p-4 sm:p-6 flex flex-col justify-between overflow-hidden transition-all duration-500 m-[2px] border border-slate-200/80 group-hover:border-transparent">
                    <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-slate-50 to-transparent pointer-events-none" />

                    <div className="relative z-10">
                      <div className="flex flex-wrap justify-between items-start gap-2 mb-4 sm:mb-6">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-[9px] sm:text-[10px] font-mono font-black text-slate-500 bg-slate-100/80 px-2 py-1 rounded-md">
                            {plan.planId || "NEW"}
                          </span>
                          {isOffer && (
                            <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-white bg-gradient-to-r from-amber-500 to-rose-500 px-2 py-1 rounded-md shadow-sm">
                              Offer
                            </span>
                          )}
                          {(plan.memberCount || 0) >= 20 && (
                            <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-amber-700 bg-amber-50 border border-amber-200 px-2 py-1 rounded-md">
                              🔥 Popular
                            </span>
                          )}
                        </div>
                        <span className={`flex items-center gap-1.5 text-[8px] sm:text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-full border ${getStatusBadgeClass(status)}`}>
                          <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${getStatusDotClass(status)}`} />
                          {status}
                        </span>
                      </div>

                      <div className="mb-4 sm:mb-5">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-[16px] bg-gradient-to-br from-slate-50 to-white border border-slate-100 shadow-sm text-slate-400 group-hover:text-[#4d3df7] flex items-center justify-center mb-3 sm:mb-4 transition-all duration-500 group-hover:scale-110">
                          <FiCreditCard size={18} />
                        </div>
                        <h4 className="font-black text-slate-900 text-lg sm:text-xl leading-tight tracking-tight group-hover:bg-clip-text group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-indigo-600 group-hover:to-purple-600 transition-all">
                          {plan.name}
                        </h4>
                        <div className="mb-2 mt-1">
                          <span className="px-2 py-0.5 sm:py-1 rounded-lg text-[8px] sm:text-[9px] font-black uppercase tracking-widest bg-violet-50 text-violet-600 border border-violet-100">
                            {plan.planType}
                          </span>
                        </div>
                        <p className="text-[9px] sm:text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-widest">
                          {plan.duration}
                        </p>
                      </div>

                      <div className="mb-3 sm:mb-4 pb-3 sm:pb-4 border-b border-slate-100/80">
                        <div className="flex items-baseline gap-1.5 flex-wrap">
                          <span className="text-2xl sm:text-3xl font-black text-slate-900 font-mono tracking-tighter">
                            ₹{Number(plan.price || 0).toLocaleString("en-IN")}
                          </span>
                          <span className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest">/ cycle</span>
                        </div>
                        {isOffer && plan.offerPrice > 0 && (
                          <div className="mt-2 flex items-center gap-2 flex-wrap">
                            <span className="line-through text-slate-400 font-bold text-xs sm:text-sm">
                              ₹{Number(plan.price || 0).toLocaleString("en-IN")}
                            </span>
                            <span className="text-emerald-600 font-black text-base sm:text-lg">
                              ₹{plan.offerPrice.toLocaleString("en-IN")}
                            </span>
                            <span className="bg-red-50 text-red-600 text-[8px] sm:text-[9px] px-2 py-1 rounded-md font-black border border-red-100">
                              SAVE ₹{(plan.price - plan.offerPrice).toLocaleString("en-IN")}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="mt-2 flex justify-between items-center text-xs mb-3 sm:mb-4">
                        <span className="text-slate-400 text-[10px] sm:text-xs">Admission Fee</span>
                        <span className="font-black text-slate-700 text-sm sm:text-base">₹{plan.admissionFee}</span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-4 sm:mb-5">
                        <div className="bg-slate-50 rounded-xl p-2 sm:p-3 border border-slate-100">
                          <p className="text-[8px] sm:text-[9px] uppercase font-black tracking-widest text-slate-400">Members</p>
                          <h4 className="text-base sm:text-lg font-black text-slate-900">{plan.memberCount || 0}</h4>
                        </div>
                        <div className="bg-slate-50 rounded-xl p-2 sm:p-3 border border-slate-100">
                          <p className="text-[8px] sm:text-[9px] uppercase font-black tracking-widest text-slate-400">Revenue</p>
                          <h4 className="text-base sm:text-lg font-black text-emerald-600">
                            ₹{(plan.revenue || 0).toLocaleString("en-IN")}
                          </h4>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-4 sm:mb-6">
                        {plan.features?.slice(0, 3).map((feat, index) => (
                          <span key={index} className="inline-flex items-center gap-1 bg-slate-50 border border-slate-100 text-slate-600 text-[9px] sm:text-[10px] font-bold px-2 py-0.5 sm:py-1 rounded-lg">
                            <FiCheckCircle className="text-emerald-500" size={10} />
                            {feat}
                          </span>
                        ))}
                        {plan.features?.length > 3 && (
                          <span className="inline-flex items-center text-[9px] sm:text-[10px] font-black text-[#4d3df7] bg-indigo-50 px-2 py-0.5 sm:py-1 rounded-lg">
                            +{plan.features.length - 3}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2 relative z-10">
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); setSelectedPlan(plan); }}
                        className="flex-1 flex items-center justify-center gap-2 text-[9px] sm:text-[10px] font-black uppercase tracking-widest py-3 rounded-[16px] transition-all duration-300 active:scale-95 bg-slate-50 text-slate-700 hover:bg-[#4d3df7] hover:text-white hover:shadow-lg hover:shadow-indigo-500/20 min-h-[44px]"
                      >
                        <FiEye size={14} /> View Plan
                      </button>
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); handleOpenEdit(plan); }}
                        className="w-10 sm:w-12 flex items-center justify-center bg-slate-50 rounded-[16px] text-slate-400 hover:text-[#4d3df7] hover:bg-indigo-50 transition-all active:scale-95 min-h-[44px]"
                      >
                        <FiEdit2 size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); handleDeletePlan(plan._id); }}
                        className="w-10 sm:w-12 flex items-center justify-center bg-slate-50 rounded-[16px] text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-all active:scale-95 min-h-[44px]"
                      >
                        <FiTrash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* ── PLAN DETAILS MODAL ──────────────────────────────────────────────── */}
      {selectedPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 animate-fade-in">
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-md transition-opacity"
            onClick={() => setSelectedPlan(null)}
          />
          <div className="relative bg-white w-full max-w-2xl rounded-[28px] sm:rounded-[32px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] ring-1 ring-slate-900/5 overflow-hidden transform transition-all duration-500 scale-100 flex flex-col max-h-[90vh]">

            <div className="relative p-5 sm:p-8 pb-6 sm:pb-8 overflow-hidden border-b border-slate-100 bg-gradient-to-b from-indigo-50/60 to-white">
              <div className={`absolute top-0 right-0 w-64 h-64 sm:w-72 sm:h-72 blur-3xl opacity-20 pointer-events-none rounded-full translate-x-1/3 -translate-y-1/3 ${Number(selectedPlan.offerPrice) > 0 ? "bg-amber-500" : "bg-indigo-500"}`} />
              <div className="flex justify-between items-start mb-4 sm:mb-6 relative z-10">
                <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-[18px] sm:rounded-[22px] text-white flex items-center justify-center shadow-xl ring-4 shrink-0 ${
                  Number(selectedPlan.offerPrice) > 0
                    ? "bg-gradient-to-br from-amber-400 to-orange-500 shadow-amber-500/30 ring-amber-50"
                    : "bg-gradient-to-br from-[#4d3df7] to-[#7b61ff] shadow-indigo-500/30 ring-indigo-50"
                }`}>
                  <FiCreditCard size={20} className="sm:w-[26px] sm:h-[26px]" strokeWidth={2} />
                </div>
                <button type="button" onClick={() => setSelectedPlan(null)} className="text-slate-400 hover:text-slate-900 bg-white border border-slate-200/80 p-2 rounded-full shadow-sm transition-all hover:scale-105 active:scale-95 min-h-[44px] min-w-[44px] flex items-center justify-center">
                  <FiX size={18} />
                </button>
              </div>
              <div className="relative z-10">
                <div className="flex flex-wrap items-center gap-2 mb-2 sm:mb-3">
                  <span className="text-[9px] sm:text-[10px] font-black font-mono tracking-widest text-indigo-600 bg-indigo-500/10 border border-indigo-500/20 px-2 sm:px-3 py-1 rounded-full uppercase">
                    {selectedPlan.planId || "NEW TIER"}
                  </span>
                  {Number(selectedPlan.offerPrice) > 0 && (
                    <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-amber-700 bg-amber-500/10 border border-amber-500/20 px-2 sm:px-3 py-1 rounded-full flex items-center gap-1">
                      <FiStar size={12} className="fill-amber-500 text-amber-500" /> Special Offer
                    </span>
                  )}
                </div>
                <h4 className="font-black text-2xl sm:text-4xl text-slate-900 leading-tight tracking-tight mt-1">{selectedPlan.name}</h4>
                <p className="text-[10px] sm:text-xs text-slate-500 font-bold mt-2 uppercase tracking-widest flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                  {selectedPlan.planType || "General"} Subscription Plan
                </p>
              </div>
            </div>

            <div className="p-5 sm:p-8 overflow-y-auto custom-sidebar-scroll flex-1 bg-slate-50/50">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8">
                <div className="bg-white border border-slate-200/60 shadow-sm rounded-[20px] sm:rounded-[24px] p-4 sm:p-5">
                  <p className="text-slate-400 text-[9px] sm:text-[10px] font-black uppercase tracking-widest mb-2 flex items-center gap-2"><FiClock size={14} className="text-indigo-400" /> Duration</p>
                  <p className="text-slate-900 font-black text-base sm:text-lg">{selectedPlan.duration}</p>
                </div>
                <div className="bg-white border border-slate-200/60 shadow-sm rounded-[20px] sm:rounded-[24px] p-4 sm:p-5">
                  <p className="text-slate-400 text-[9px] sm:text-[10px] font-black uppercase tracking-widest mb-2">Plan Type</p>
                  <p className="text-slate-900 font-black text-base sm:text-lg">{selectedPlan.planType}</p>
                </div>
                <div className="bg-white border border-slate-200/60 shadow-sm rounded-[20px] sm:rounded-[24px] p-4 sm:p-5">
                  <p className="text-slate-400 text-[9px] sm:text-[10px] font-black uppercase tracking-widest mb-2 flex items-center gap-2"><FiDollarSign size={14} className="text-emerald-400" /> Base Fee</p>
                  <p className="text-slate-900 font-black font-mono text-xl sm:text-2xl">₹{Number(selectedPlan.price || 0).toLocaleString("en-IN")}</p>
                </div>
                <div className="bg-white border border-slate-200/60 shadow-sm rounded-[20px] sm:rounded-[24px] p-4 sm:p-5">
                  <p className="text-slate-400 text-[9px] sm:text-[10px] font-black uppercase tracking-widest mb-2 flex items-center gap-2"><FiLayers size={14} className="text-blue-400" /> Admission</p>
                  <p className="text-slate-900 font-black font-mono text-xl sm:text-2xl">₹{selectedPlan.admissionFee || 0}</p>
                </div>
                <div className={`${Number(selectedPlan.offerPrice) > 0 ? "bg-gradient-to-br from-rose-50 to-orange-50 border-rose-200/60" : "bg-white border-slate-200/60"} border shadow-sm rounded-[20px] sm:rounded-[24px] p-4 sm:p-5`}>
                  <p className={`${Number(selectedPlan.offerPrice) > 0 ? "text-rose-500" : "text-slate-400"} text-[9px] sm:text-[10px] font-black uppercase tracking-widest mb-2 flex items-center gap-2`}><FiStar size={14} /> Offer Price</p>
                  <p className={`${Number(selectedPlan.offerPrice) > 0 ? "text-rose-600" : "text-slate-400"} font-black font-mono text-xl sm:text-2xl`}>
                    {Number(selectedPlan.offerPrice) > 0 ? `₹${Number(selectedPlan.offerPrice || 0).toLocaleString("en-IN")}` : "N/A"}
                  </p>
                </div>
                {Number(selectedPlan.offerPrice) > 0 && (
                  <div className="bg-orange-50 border border-orange-100 rounded-[20px] sm:rounded-[24px] p-4 sm:p-5">
                    <p className="text-orange-500 text-[9px] sm:text-[10px] font-black uppercase">Offer Validity</p>
                    <div className="font-bold text-orange-700 mt-2 text-xs sm:text-sm">
                      {selectedPlan.offerStartDate && selectedPlan.offerEndDate
                        ? `${new Date(selectedPlan.offerStartDate).toLocaleDateString("en-IN")} → ${new Date(selectedPlan.offerEndDate).toLocaleDateString("en-IN")}`
                        : "—"}
                    </div>
                  </div>
                )}
                <div className="bg-white border border-slate-200/60 shadow-sm rounded-[20px] sm:rounded-[24px] p-4 sm:p-5">
                  <p className="text-slate-400 text-[9px] sm:text-[10px] font-black uppercase tracking-widest mb-2">Status</p>
                  <span className={`px-2 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-black ${getStatusBadgeClass(selectedPlan.status)}`}>{selectedPlan.status}</span>
                </div>
                <div className="bg-indigo-50 border border-indigo-100 rounded-[20px] sm:rounded-[24px] p-4 sm:p-5">
                  <p className="text-indigo-500 text-[9px] sm:text-[10px] font-black uppercase tracking-widest mb-2">Total Cost</p>
                  <p className="text-xl sm:text-2xl font-black text-indigo-700 font-mono">₹{finalAmount.toLocaleString("en-IN")}</p>
                </div>
              </div>

              <div className="mb-6 sm:mb-8">
                <p className="text-[10px] sm:text-[11px] font-black uppercase tracking-widest text-slate-400 mb-3 ml-2">Context & Description</p>
                <div className="bg-white border border-slate-200/60 p-4 sm:p-6 rounded-[20px] sm:rounded-[24px] shadow-sm">
                  <p className="text-[13px] sm:text-[14px] font-medium text-slate-600 leading-relaxed">{selectedPlan.description || "No description provided."}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:gap-4 mt-2 mb-4 sm:mb-6">
                <div>
                  <p className="text-[9px] sm:text-[10px] text-slate-400 font-black uppercase">Created By</p>
                  <p className="font-bold text-slate-700 text-sm">{selectedPlan.createdBy || "Admin"}</p>
                </div>
                <div>
                  <p className="text-[9px] sm:text-[10px] text-slate-400 font-black uppercase">Created Date</p>
                  <p className="font-bold text-slate-700 text-sm">{selectedPlan.createdAt ? new Date(selectedPlan.createdAt).toLocaleDateString("en-IN") : "—"}</p>
                </div>
                <div>
                  <p className="text-[9px] sm:text-[10px] text-slate-400 font-black uppercase">Updated Date</p>
                  <p className="font-bold text-slate-700 text-sm">{selectedPlan.updatedAt ? new Date(selectedPlan.updatedAt).toLocaleDateString("en-IN") : "—"}</p>
                </div>
                {selectedPlan.isFeatured && (
                  <div className="flex items-center">
                    <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-violet-700 bg-violet-50 border border-violet-200 px-2 sm:px-3 py-1 rounded-full">⭐ Featured</span>
                  </div>
                )}
              </div>

              {Number(selectedPlan.offerPrice) > 0 && (
                <div className="bg-emerald-50 border border-emerald-100 rounded-[20px] sm:rounded-[24px] p-4 sm:p-5 mb-6">
                  <p className="text-emerald-500 text-[9px] sm:text-[10px] font-black uppercase tracking-widest">You Save</p>
                  <h3 className="text-2xl sm:text-3xl font-black text-emerald-600 mt-2">
                    ₹{Math.max(0, selectedPlan.price - selectedPlan.offerPrice).toLocaleString("en-IN")}
                  </h3>
                </div>
              )}

              <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-6">
                <div className="bg-white rounded-2xl border p-3 sm:p-4">
                  <h4 className="text-lg sm:text-2xl font-black text-indigo-600">{selectedPlan.features?.length || 0}</h4>
                  <p className="text-[10px] sm:text-xs font-bold text-slate-500">Features</p>
                </div>
                <div className="bg-white rounded-2xl border p-3 sm:p-4">
                  <h4 className="text-base sm:text-xl font-black text-emerald-600">{selectedPlan.duration}</h4>
                  <p className="text-[10px] sm:text-xs font-bold text-slate-500">Duration</p>
                </div>
                <div className="bg-white rounded-2xl border p-3 sm:p-4">
                  <h4 className="text-base sm:text-xl font-black text-orange-600">{selectedPlan.status}</h4>
                  <p className="text-[10px] sm:text-xs font-bold text-slate-500">Status</p>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-[10px] sm:text-[11px] font-black uppercase tracking-widest text-slate-400 mb-4 ml-2">Included Benefits</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                  {selectedPlan.features?.map((f, i) => (
                    <div key={i} className="flex items-center gap-2 sm:gap-3.5 bg-white border border-slate-200/60 p-3 sm:p-4 rounded-[16px] sm:rounded-[20px] shadow-sm hover:border-indigo-300 hover:shadow-md transition-all cursor-default">
                      <div className="bg-emerald-50 text-emerald-500 rounded-full p-1.5 sm:p-2 shrink-0 border border-emerald-100/50">
                        <FiCheckCircle size={14} className="sm:w-[16px] sm:h-[16px]" strokeWidth={2.5} />
                      </div>
                      <span className="text-xs sm:text-[13px] text-slate-700 font-bold">{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 sm:p-6 bg-white/80 backdrop-blur-2xl border-t border-slate-100 z-20">
              <button type="button" onClick={() => setSelectedPlan(null)} className="w-full py-3 sm:py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-[18px] sm:rounded-[20px] text-[11px] sm:text-[13px] font-black uppercase tracking-widest shadow-xl shadow-slate-900/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2 min-h-[48px]">
                <FiX size={18} /> Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── CREATE/EDIT FORM MODAL ───────────────────────────────────────────── */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 animate-fade-in">
          <div className="absolute inset-0 bg-slate-900/30 backdrop-blur-md transition-opacity" onClick={() => setIsFormOpen(false)} />
          <div className="relative bg-white w-full max-w-xl rounded-[28px] sm:rounded-[32px] shadow-2xl shadow-slate-900/20 overflow-hidden transform transition-all duration-500 scale-100 flex flex-col max-h-[90vh]">

            <div className="relative pt-6 sm:pt-8 px-5 sm:px-8 pb-5 sm:pb-6 bg-gradient-to-b from-indigo-50/50 to-white border-b border-slate-100">
              <button onClick={() => setIsFormOpen(false)} className="absolute top-4 sm:top-6 right-4 sm:right-6 w-8 h-8 sm:w-9 sm:h-9 rounded-2xl bg-white border border-slate-200/60 text-slate-400 hover:text-slate-900 hover:border-slate-300 hover:shadow-sm flex items-center justify-center transition-all duration-300 active:scale-90 z-10">
                <FiX size={16} />
              </button>
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-[18px] sm:rounded-[20px] bg-gradient-to-br from-[#4d3df7] to-[#7b61ff] text-white flex items-center justify-center shadow-lg shadow-indigo-500/20 ring-4 ring-indigo-50 shrink-0">
                  <FiLayers size={20} className="sm:w-[24px] sm:h-[24px]" />
                </div>
                <div className="pt-1">
                  <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-[#4d3df7] bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">
                    {editingPlan ? "Edit Plan" : "New Plan"}
                  </span>
                  <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight leading-tight mt-1.5">
                    {editingPlan ? "Modify Plan" : "Create New Plan"}
                  </h3>
                  <p className="text-[10px] sm:text-[11px] text-slate-500 font-semibold mt-1">
                    Fill in the details to {editingPlan ? "update" : "create"} a membership plan.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-5 sm:p-8 overflow-y-auto custom-sidebar-scroll flex-grow">
              <form onSubmit={handleSavePlan} id="plan-form" className="space-y-4 sm:space-y-5">
                <div className="space-y-1.5">
                  <label className="text-slate-500 text-[9px] sm:text-[10px] uppercase font-black tracking-widest block pl-1">Plan Name</label>
                  <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="e.g. Premium Strength Elite" className="w-full bg-slate-50/50 border border-slate-200/80 rounded-[14px] sm:rounded-[16px] px-4 py-3 text-sm font-bold text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#4d3df7] focus:ring-4 focus:ring-indigo-500/5 transition-all" />
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-500 text-[9px] sm:text-[10px] uppercase font-black tracking-widest block pl-1">Plan Type</label>
                  <select disabled={!!editingPlan} value={formData.planType} onChange={(e) => setFormData({ ...formData, planType: e.target.value })} className="w-full disabled:bg-slate-100 disabled:cursor-not-allowed bg-slate-50 border border-slate-200 rounded-[14px] sm:rounded-[16px] px-4 py-3 text-sm font-bold text-slate-800 focus:outline-none focus:bg-white focus:border-[#4d3df7] transition-all">
                    <option>Weight Gain</option>
                    <option>Weight Loss</option>
                    <option>Personal Training</option>
                    <option>Crossfit</option>
                    <option>Others</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                  <div className="space-y-1.5">
                    <label className="text-slate-500 text-[9px] sm:text-[10px] uppercase font-black tracking-widest block pl-1">Price (INR)</label>
                    <div className="relative flex items-center">
                      <div className="absolute left-0 top-0 bottom-0 w-10 sm:w-12 flex items-center justify-center bg-slate-100 border-r border-slate-200/80 rounded-l-[14px] sm:rounded-l-[16px] text-slate-500">
                        <FiDollarSign size={14} />
                      </div>
                      <input type="number" required min="0" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} placeholder="0" className="w-full bg-slate-50/50 border border-slate-200/80 rounded-[14px] sm:rounded-[16px] pl-10 sm:pl-14 pr-4 py-3 text-sm font-black text-slate-900 font-mono placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#4d3df7] transition-all" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-slate-500 text-[9px] sm:text-[10px] uppercase font-black tracking-widest block pl-1">Admission Fee</label>
                    <input type="number" min="0" value={formData.admissionFee} onChange={(e) => setFormData({ ...formData, admissionFee: e.target.value })} placeholder="0" className="w-full bg-slate-50 border border-slate-200 rounded-[14px] sm:rounded-[16px] px-4 py-3 text-sm font-bold text-slate-800 focus:outline-none focus:border-[#4d3df7] transition-all" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-slate-500 text-[9px] sm:text-[10px] uppercase font-black tracking-widest block pl-1">Duration</label>
                    <div className="relative flex items-center">
                      <div className="absolute left-0 top-0 bottom-0 w-10 sm:w-12 flex items-center justify-center bg-slate-100 border-r border-slate-200/80 rounded-l-[14px] sm:rounded-l-[16px] text-slate-500 pointer-events-none">
                        <FiClock size={14} />
                      </div>
                      <select value={formData.duration} onChange={(e) => setFormData({ ...formData, duration: e.target.value })} className="w-full appearance-none bg-slate-50/50 border border-slate-200/80 rounded-[14px] sm:rounded-[16px] pl-10 sm:pl-14 pr-10 py-3 text-sm font-bold text-slate-800 focus:outline-none focus:bg-white focus:border-[#4d3df7] transition-all cursor-pointer">
                        <option value="1 Month">1 Month</option>
                        <option value="3 Months">3 Months</option>
                        <option value="6 Months">6 Months</option>
                        <option value="12 Months">12 Months</option>
                      </select>
                      <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-400"><FiChevronDown size={14} /></div>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-slate-500 text-[9px] sm:text-[10px] uppercase font-black tracking-widest block pl-1">Offer Price</label>
                    <input type="number" min="0" value={formData.offerPrice} onChange={(e) => setFormData({ ...formData, offerPrice: e.target.value })} placeholder="0 = no offer" className="w-full bg-slate-50 border border-slate-200 rounded-[14px] sm:rounded-[16px] px-4 py-3 text-sm font-bold text-slate-800 focus:outline-none focus:border-[#4d3df7] transition-all" />
                  </div>
                </div>

                {Number(formData.offerPrice) > 0 && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-slate-500 text-[9px] sm:text-[10px] uppercase font-black tracking-widest block pl-1">Offer Start Date</label>
                      <input type="date" value={formData.offerStartDate} onChange={(e) => setFormData({ ...formData, offerStartDate: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-[14px] sm:rounded-[16px] px-4 py-3 text-sm font-bold text-slate-800 focus:outline-none focus:border-[#4d3df7] transition-all" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-slate-500 text-[9px] sm:text-[10px] uppercase font-black tracking-widest block pl-1">Offer End Date</label>
                      <input type="date" value={formData.offerEndDate} onChange={(e) => setFormData({ ...formData, offerEndDate: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-[14px] sm:rounded-[16px] px-4 py-3 text-sm font-bold text-slate-800 focus:outline-none focus:border-[#4d3df7] transition-all" />
                    </div>
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="text-slate-500 text-[9px] sm:text-[10px] uppercase font-black tracking-widest block pl-1">Status</label>
                  <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className="w-full bg-slate-50 border border-slate-200 rounded-[14px] sm:rounded-[16px] px-4 py-3 text-sm font-bold text-slate-800 focus:outline-none focus:border-[#4d3df7] transition-all">
                    <option>Active</option>
                    <option>Inactive</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-500 text-[9px] sm:text-[10px] uppercase font-black tracking-widest block pl-1">Description</label>
                  <textarea rows="3" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Plan description..." className="w-full bg-slate-50 border border-slate-200 rounded-[14px] sm:rounded-[16px] px-4 py-3 text-sm font-semibold text-slate-700 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#4d3df7] transition-all resize-none" />
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between pl-1">
                    <label className="text-slate-500 text-[9px] sm:text-[10px] uppercase font-black tracking-widest block">Features</label>
                    <span className="text-[8px] sm:text-[9px] font-bold text-indigo-400 bg-indigo-50 px-2 py-0.5 rounded">Comma separated</span>
                  </div>
                  <textarea rows="3" value={formData.features} onChange={(e) => setFormData({ ...formData, features: e.target.value })} placeholder="e.g. Diet Consultation, Custom Workout, Locker Access" className="w-full bg-slate-50/50 border border-slate-200/80 rounded-[14px] sm:rounded-[16px] px-4 py-3 text-sm font-semibold text-slate-700 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#4d3df7] transition-all resize-none" />
                </div>

                <div className="bg-amber-50/50 border border-amber-100 rounded-[14px] sm:rounded-[16px] p-3 sm:p-4 flex items-start gap-2 sm:gap-3 text-[10px] sm:text-[11px] font-semibold text-amber-700 leading-relaxed">
                  <div className="bg-amber-100/80 text-amber-600 rounded-lg p-1.5 shrink-0"><FiAlertCircle size={14} /></div>
                  <span className="pt-0.5">Changes will be reflected immediately across all plan listings.</span>
                </div>
              </form>
            </div>

            <div className="px-5 sm:px-8 pb-2">
              <label className="flex items-center justify-between bg-slate-50 border-2 border-transparent hover:border-indigo-100 hover:bg-indigo-50/30 rounded-[18px] sm:rounded-[20px] p-3 sm:p-4 transition-all cursor-pointer group">
                <div className="flex items-center gap-2 sm:gap-3.5">
                  <div className={`rounded-xl p-2 shrink-0 transition-colors ${formData.isFeatured ? "bg-amber-100 text-amber-500" : "bg-slate-200 text-slate-400"}`}>
                    <FiStar size={16} className={`sm:w-[18px] sm:h-[18px] ${formData.isFeatured ? "fill-amber-500" : ""}`} />
                  </div>
                  <div>
                    <span className="text-xs sm:text-sm font-black text-slate-900 block group-hover:text-[#4d3df7] transition-colors">Featured Plan</span>
                    <span className="text-[9px] sm:text-[10px] font-semibold text-slate-400 mt-0.5 block">Highlight this plan on the showcase.</span>
                  </div>
                </div>
                <div className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input type="checkbox" className="sr-only peer" checked={formData.isFeatured || false} onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })} />
                  <div className="w-10 sm:w-12 h-5 sm:h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-500/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 sm:after:h-5 after:w-4 sm:after:w-5 after:transition-all peer-checked:bg-[#4d3df7]" />
                </div>
              </label>
            </div>

            <div className="p-5 sm:p-8 pt-4 border-t border-slate-100 bg-slate-50/30">
              <div className="flex gap-3">
                <button type="button" onClick={() => setIsFormOpen(false)} className="flex-1 py-3 sm:py-4 bg-white border border-slate-200 text-slate-700 font-bold rounded-[14px] sm:rounded-[16px] text-[10px] sm:text-[11px] uppercase tracking-widest hover:bg-slate-50 transition-all active:scale-95 shadow-sm min-h-[44px]">
                  Cancel
                </button>
                <button type="submit" form="plan-form" disabled={loading} className="flex-[2] bg-[#4d3df7] hover:bg-[#3e2ff2] text-white font-black py-3 sm:py-4 rounded-[14px] sm:rounded-[16px] text-[10px] sm:text-[11px] uppercase tracking-widest shadow-lg shadow-indigo-500/25 transition-all active:scale-95 flex items-center justify-center gap-2 min-h-[44px] disabled:opacity-50 disabled:cursor-not-allowed">
                  <FiSave size={14} />
                  {loading ? "Saving..." : editingPlan ? "Save Changes" : "Create Plan"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default MembershipPlans;