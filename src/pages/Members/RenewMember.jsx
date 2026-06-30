import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";
import PageHeader from "../../components/dashboard/PageHeader";
import Swal from "sweetalert2";

import {
  successAlert,
  errorAlert,
  warningAlert,
  loadingAlert,
  confirmAlert,
} from "../../utils/alerts";
import {
  FiArrowLeft,
  FiRefreshCw,
  FiPhone,
  FiCalendar,
  FiAward,
  FiClock,
  FiTrendingUp,
  FiHash,
  FiCheck,
  FiLock,
  FiDollarSign,
  FiSmartphone,
  FiCreditCard,
  FiHome,
  FiZap,
  FiCheckCircle,
} from "react-icons/fi";

const THEME_VARS = {
  "--ink": "#0B1220",
  "--ink-soft": "#141C2E",
  "--ink-line": "#243049",
  "--canvas": "#F4F6FA",
  "--paper": "#FFFFFF",
  "--line": "#E7EAF1",
  "--text": "#0F1626",
  "--text-soft": "#5B6478",
  "--text-faint": "#8A93A6",
  "--violet": "#7C5CFC",
  "--cyan": "#22D3EE",
  "--mint": "#34D399",
  "--mint-soft": "#E8FAF3",
  "--amber": "#F59E0B",
  "--amber-soft": "#FEF6E6",
  "--rose": "#FB7185",
  "--rose-soft": "#FEEEF0",
  fontFamily: "'Inter', sans-serif",
};

const FONT_IMPORTS = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@600;700;800&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@500;600&display=swap');
  .rh-display { font-family: 'Sora', sans-serif; }
  .rh-mono { font-family: 'JetBrains Mono', monospace; letter-spacing: 0.02em; }
  .rh-grid-fade {
    background-image:
      linear-gradient(rgba(255,255,255,0.045) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.045) 1px, transparent 1px);
    background-size: 28px 28px;
    -webkit-mask-image: radial-gradient(ellipse 80% 80% at 30% 20%, black 40%, transparent 85%);
            mask-image: radial-gradient(ellipse 80% 80% at 30% 20%, black 40%, transparent 85%);
  }
  .rh-card-glow {
    background:
      radial-gradient(420px 220px at 88% -10%, rgba(124,92,252,0.35), transparent 60%),
      radial-gradient(380px 200px at 100% 110%, rgba(34,211,238,0.18), transparent 60%);
  }
  @keyframes rh-dash {
    to { stroke-dashoffset: 0; }
  }
  .rh-ring-progress {
    stroke-dasharray: 226.19;
    animation: rh-dash 1.1s cubic-bezier(0.22, 1, 0.36, 1) forwards;
  }
  @keyframes rh-rise {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .rh-rise { animation: rh-rise 0.45s cubic-bezier(0.22, 1, 0.36, 1) both; }
  .rh-plan-card { transition: transform 0.22s cubic-bezier(0.22,1,0.36,1), box-shadow 0.22s, border-color 0.22s; }
  .rh-plan-card:hover { transform: translateY(-3px); }
  @media (prefers-reduced-motion: reduce) {
    .rh-ring-progress { animation: none; stroke-dashoffset: 0; }
    .rh-rise { animation: none; }
    .rh-plan-card:hover { transform: none; }
  }
`;

const STATUS_STYLES = {
  Active: {
    bg: "bg-[var(--mint-soft)]",
    text: "text-[var(--mint)]",
    dot: "bg-[var(--mint)]",
    icon: FiAward,
  },
  "Expiring Soon": {
    bg: "bg-[var(--amber-soft)]",
    text: "text-[var(--amber)]",
    dot: "bg-[var(--amber)]",
    icon: FiClock,
  },
  Expired: {
    bg: "bg-[var(--rose-soft)]",
    text: "text-[var(--rose)]",
    dot: "bg-[var(--rose)]",
    icon: FiCalendar,
  },
};
const STATUS_FALLBACK = {
  bg: "bg-white/10",
  text: "text-white",
  dot: "bg-white/60",
  icon: FiAward,
};

const PAYMENT_METHODS = [
  { id: "Cash", label: "Cash", icon: FiDollarSign },
  { id: "UPI", label: "UPI", icon: FiSmartphone },
  { id: "Card", label: "Card", icon: FiCreditCard },
];

const HeroStat = ({ label, value, icon: Icon }) => (
  <div>
    <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/45">
      {Icon && <Icon size={11} />}
      {label}
    </p>
    <p className="rh-mono text-sm font-semibold text-white mt-1.5">{value}</p>
  </div>
);

const SummaryField = ({ label, value, accent }) => (
  <div>
    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--text-faint)]">
      {label}
    </p>
    <p
      className={`rh-display text-base font-bold mt-1.5 ${accent || "text-[var(--text)]"}`}
    >
      {value}
    </p>
  </div>
);

const ExpiryRing = ({ daysLeft, totalDays }) => {
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const ratio =
    totalDays > 0 ? Math.max(0, Math.min(1, daysLeft / totalDays)) : 0;
  const offset = circumference * (1 - ratio);
  const ringColor =
    daysLeft <= 0
      ? "var(--rose)"
      : daysLeft <= 7
        ? "var(--amber)"
        : "var(--mint)";

  return (
    <div className="relative w-24 h-24 shrink-0">
      <svg viewBox="0 0 84 84" className="w-24 h-24 -rotate-90">
        <circle
          cx="42"
          cy="42"
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.10)"
          strokeWidth="6"
        />
        <circle
          cx="42"
          cy="42"
          r={radius}
          fill="none"
          stroke={ringColor}
          strokeWidth="6"
          strokeLinecap="round"
          className="rh-ring-progress"
          style={{
            strokeDasharray: circumference,
            strokeDashoffset: circumference,
            stroke: ringColor,
          }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="rh-display text-xl font-bold text-white leading-none">
          {daysLeft > 0 ? daysLeft : 0}
        </span>
        <span className="text-[8px] font-semibold uppercase tracking-[0.14em] text-white/45 mt-1">
          days left
        </span>
      </div>
    </div>
  );
};

const RenewMember = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [member, setMember] = useState(null);
  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [amountPaid, setAmountPaid] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [remarks, setRemarks] = useState("");
  const [loading, setLoading] = useState(false);
  const [planType, setPlanType] = useState("");

  const fetchMember = async () => {
    try {
      const res = await api.get(`/members/${id}`);
      setMember(res.data.data);
    } catch (error) {
      errorAlert("Load Failed", "Unable to load member details.");
    }
  };

  const fetchPlans = async () => {
    try {
      const res = await api.get("/plans");
      setPlans(res.data.data);
    } catch (error) {
      errorAlert("Load Failed", "Unable to load membership plans.");
    }
  };

  useEffect(() => {
    fetchMember();
    fetchPlans();
  }, [id]);

  const handleRenew = async () => {
    if (!member?._id) {
      await warningAlert("Member Not Found", "Please reload the page.");
      return;
    }

    if (!selectedPlan?._id) {
      await warningAlert("Plan Required", "Please select a membership plan.");
      return;
    }

    if (!paymentMethod) {
      await warningAlert(
        "Payment Method Required",
        "Please select a payment method.",
      );
      return;
    }

    if (!amountPaid || isNaN(amountPaid)) {
      await warningAlert("Amount Required", "Enter the payment amount.");
      return;
    }

    if (amountPaid <= 0) {
      await warningAlert(
        "Invalid Amount",
        "Amount should be greater than zero.",
      );
      return;
    }

    if (amountPaid > selectedPlan?.finalPrice) {
      await warningAlert(
        "Invalid Amount",
        `Amount cannot exceed ₹${selectedPlan.finalPrice}`,
      );
      return;
    }

    if (remarks.trim().length > 200) {
      await warningAlert("Remarks Too Long", "Maximum 200 characters allowed.");
      return;
    }
    try {
      const confirmRenew = await confirmAlert({
        title: "Renew Membership?",
        text: `
Member : ${member.fullName}

Plan : ${selectedPlan.name}

Amount : ₹${amountPaid}
  `,
        confirmButtonText: "Yes, Renew",
      });

      if (!confirmRenew) {
        return;
      }

      loadingAlert("Renewing Membership...", "Please wait.");
      setLoading(true);

      await api.put(`/members/renew/${member._id}`, {
        selectedPlanId: selectedPlan._id,
        amountPaid,
        paymentMethod,
        remarks,
      });

      Swal.close();

      await successAlert(
        "Membership Renewed",
        `${member.fullName}'s membership has been renewed successfully.`,
      );
      navigate("/admin/members/overview");
    } catch (error) {
      Swal.close();

      await errorAlert(
        "Renewal Failed",
        error.response?.data?.message || "Something went wrong.",
      );
    } finally {
      setLoading(false);
    }
  };

  const calculateExpiry = () => {
    if (!selectedPlan || !member) return "-";

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const expiry = member.expiryDate ? new Date(member.expiryDate) : new Date();

    expiry.setHours(0, 0, 0, 0);

    const baseDate = expiry > today ? new Date(expiry) : new Date(today);

    baseDate.setDate(baseDate.getDate() + Number(selectedPlan.durationDays));

    return baseDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const daysLeft = useMemo(() => {
    if (!member?.expiryDate) return 0;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const expiry = new Date(member.expiryDate);
    expiry.setHours(0, 0, 0, 0);

    const diff = expiry - today;

    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }, [member]);

  const planTypes = [
    ...new Set(plans.filter((p) => p.planType).map((p) => p.planType)),
  ].sort();

  const filteredPlans = plans.filter(
    (plan) => plan.planType === planType && plan.status !== "Inactive",
  );

  useEffect(() => {
    if (!planType && planTypes.length > 0) {
      setPlanType(planTypes[0]);
    }
  }, [planTypes, planType]);

  useEffect(() => {
    const exists = filteredPlans.some((plan) => plan._id === selectedPlan?._id);

    if (!exists) {
      if (filteredPlans.length > 0) {
        setSelectedPlan(filteredPlans[0]);

        setAmountPaid(filteredPlans[0].finalPrice || 0);
      } else {
        setSelectedPlan(null);
      }
    }
  }, [filteredPlans, selectedPlan]);

  /* ---------------------------- Loading ---------------------------- */

  if (!member) {
    return (
      <div
        className="rh-root flex items-center justify-center h-[500px]"
        style={THEME_VARS}
      >
        <style>{FONT_IMPORTS}</style>
        <div className="text-center">
          <div className="w-10 h-10 mx-auto rounded-full border-2 border-[var(--violet)] border-t-transparent animate-spin" />
          <p className="rh-display text-[var(--text)] mt-4 text-base font-semibold">
            Loading member…
          </p>
        </div>
      </div>
    );
  }

  const status = STATUS_STYLES[member.status] || STATUS_FALLBACK;
  const StatusIcon = status.icon;
  const quickAmounts = selectedPlan
    ? [
        Math.max(1, Math.floor(selectedPlan.finalPrice * 0.25)),
        Math.max(1, Math.floor(selectedPlan.finalPrice * 0.5)),
        selectedPlan.finalPrice,
      ]
    : [500, 1000, 2000];

  /* ----------------------------- Render ----------------------------- */

  return (
    <div className="rh-root space-y-7 pb-6" style={THEME_VARS}>
      <style>{FONT_IMPORTS}</style>

      <PageHeader
        title="Membership Renewal"
        description="Renew memberships, capture payment, and keep the ledger straight — all in one secure flow."
        rightContent={
          <div className="flex items-center gap-3 select-none">
            <button
              type="button"
              onClick={() => navigate("/admin/members/overview")}
              className="inline-flex items-center justify-center gap-2 min-w-[110px] px-5 py-2.5
                rounded-xl border border-[var(--line)] bg-white
                text-[var(--text)] text-[12px] font-semibold
                hover:border-[var(--text)]/30 hover:shadow-sm
                transition-all duration-200"
            >
              <FiArrowLeft size={14} />
              Back
            </button>

            <button
              type="button"
              onClick={handleRenew}
              disabled={
                !selectedPlan ||
                !paymentMethod ||
                amountPaid === "" ||
                Number(amountPaid) <= 0 ||
                Number(amountPaid) > selectedPlan?.finalPrice ||
                loading
              }
              className="inline-flex items-center justify-center gap-2 min-w-[200px] px-6 py-2.5
                rounded-xl text-white text-[12px] font-semibold
                bg-gradient-to-r from-[var(--violet)] to-[var(--cyan)]
                shadow-[0_8px_24px_-8px_rgba(124,92,252,0.55)]
                hover:shadow-[0_10px_28px_-6px_rgba(124,92,252,0.7)] hover:brightness-105
                disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none
                transition-all duration-200"
            >
              <FiRefreshCw
                size={14}
                className={loading ? "animate-spin" : ""}
              />
              {loading ? "Renewing…" : "Renew Membership"}
            </button>
          </div>
        }
      />

      <div className="relative rounded-2xl bg-[var(--ink)] overflow-hidden rh-rise">
        <div className="absolute inset-0 rh-grid-fade pointer-events-none" />
        <div className="absolute inset-0 rh-card-glow pointer-events-none" />

        <div className="relative p-7 md:p-8">
          <div className="flex items-start justify-between flex-wrap gap-6">
            <div className="flex items-start gap-5">
              <ExpiryRing
                daysLeft={daysLeft}
                totalDays={Number(member.totalDays) || 30}
              />

              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-white/40">
                  Membership Record
                </p>
                <h2 className="rh-display text-2xl md:text-3xl font-bold text-white mt-1.5 leading-tight">
                  {member.fullName}
                </h2>
                <p className="flex items-center gap-1.5 text-xs text-white/40 mt-2 rh-mono">
                  <FiHash size={11} />
                  {member.memberId}
                </p>
              </div>
            </div>

            <span
              className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[10px]
                font-semibold uppercase tracking-[0.16em] ${status.bg} ${status.text}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
              <StatusIcon size={12} />
              {member.status}
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-x-6 gap-y-6 mt-8 pt-6 border-t border-white/10">
            <HeroStat label="Current Plan" value={member.planType} />
            <HeroStat
              label="Expiry Date"
              value={
                member.expiryDate
                  ? new Date(member.expiryDate).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })
                  : "-"
              }
            />
            <HeroStat label="Mobile" value={member.mobile} icon={FiPhone} />
            <HeroStat
              label="Renewals"
              value={member.renewalCount || 0}
              icon={FiTrendingUp}
            />
            <HeroStat
              label="Last Renewal"
              value={
                member.lastRenewalDate
                  ? new Date(member.lastRenewalDate).toLocaleDateString(
                      "en-IN",
                      {
                        day: "2-digit",
                        month: "short",
                      },
                    )
                  : "—"
              }
            />
            <HeroStat
              label="Balance Due"
              value={`₹${member.balanceAmount ?? 0}`}
            />
          </div>
        </div>
      </div>

      <div className="rh-rise" style={{ animationDelay: "60ms" }}>
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-4">
          <div>
            <h3 className="rh-display text-base font-bold text-[var(--text)]">
              Select renewal plan
            </h3>
            <span className="text-xs text-[var(--text-faint)]">
              {filteredPlans.length} plans available
            </span>
          </div>

          <div>
            <label className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--text-faint)] mb-2">
              Plan Type
            </label>
            <select
              value={planType}
              onChange={(e) => setPlanType(e.target.value)}
              className="h-11 px-4 rounded-xl border border-[var(--line)] bg-white text-sm font-semibold text-[var(--text)] outline-none focus:border-[var(--violet)] transition-colors"
            >
              {planTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredPlans.map((plan) => {
            const isSelected = selectedPlan?._id === plan._id;
            const hasOffer =
              plan.discountAmount > 0 ||
              (plan.offerPrice > 0 && plan.offerPrice < plan.price);

            return (
              <button
                type="button"
                key={plan._id}
                onClick={() => {
                  setSelectedPlan(plan);
                  setAmountPaid(plan.finalPrice);
                }}
                className={`rh-plan-card relative text-left rounded-2xl border-2 bg-white p-5
                  ${
                    isSelected
                      ? "border-[var(--violet)] shadow-[0_12px_28px_-10px_rgba(124,92,252,0.45)] bg-gradient-to-b from-[var(--violet)]/[0.04] to-[var(--cyan)]/[0.04]"
                      : "border-[var(--line)] hover:border-[var(--violet)]/30 hover:shadow-[0_10px_24px_-12px_rgba(15,22,38,0.18)]"
                  }`}
              >
                {/* Offer badge */}
                {hasOffer && !isSelected && (
                  <span className="absolute top-4 right-4 inline-flex items-center gap-1 bg-gradient-to-r from-[var(--amber)] to-[#FB923C] text-white text-[8px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full">
                    <FiZap size={8} />
                    Offer
                  </span>
                )}

                {/* Selected indicator */}
                {isSelected && (
                  <span className="absolute top-4 right-4 w-5 h-5 rounded-full bg-gradient-to-r from-[var(--violet)] to-[var(--cyan)] flex items-center justify-center">
                    <FiCheck size={12} className="text-white" strokeWidth={3} />
                  </span>
                )}

                {/* Plan ID chip */}
                {plan.planId && (
                  <span className="inline-block rh-mono text-[9px] font-bold text-[var(--text-faint)] bg-[var(--canvas)] px-1.5 py-0.5 rounded-md">
                    {plan.planId}
                  </span>
                )}

                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--text-faint)] mt-2">
                  {plan.duration}
                </p>
                <h4
                  className={`rh-display text-lg font-bold mt-1 pr-6 ${isSelected ? "text-[var(--violet)]" : "text-[var(--text)]"}`}
                >
                  {plan.name}
                </h4>

                <div className="mt-4 pt-4 border-t border-[var(--line)]">
                  {hasOffer ? (
                    <div>
                      <p className="rh-mono text-[10px] line-through text-[var(--text-faint)] font-semibold">
                        ₹{plan.price}
                      </p>
                      <p
                        className={`rh-mono text-2xl font-semibold ${isSelected ? "text-[var(--violet)]" : "text-[var(--mint)]"}`}
                      >
                        ₹{plan.finalPrice}
                      </p>
                    </div>
                  ) : (
                    <p
                      className={`rh-mono text-2xl font-semibold ${isSelected ? "text-[var(--violet)]" : "text-[var(--text)]"}`}
                    >
                      ₹{plan.finalPrice}
                    </p>
                  )}
                  {plan?.admissionFee > 0 && (
                    <p className="text-[9px] font-semibold text-[var(--text-faint)] mt-1">
                      + ₹{plan.admissionFee} admission
                    </p>
                  )}
                </div>

                {plan.features?.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1">
                    {plan.features.slice(0, 2).map((f, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1 text-[8px] font-semibold text-[var(--text-soft)] bg-[var(--canvas)] px-1.5 py-0.5 rounded-md"
                      >
                        <FiCheckCircle
                          size={8}
                          className="text-[var(--text-faint)]"
                        />
                        {f}
                      </span>
                    ))}
                    {plan.features.length > 2 && (
                      <span className="text-[8px] font-bold text-[var(--violet)] bg-[var(--violet)]/10 px-1.5 py-0.5 rounded-md">
                        +{plan.features.length - 2}
                      </span>
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {filteredPlans.length === 0 && (
          <div className="rounded-2xl border border-dashed border-[var(--line)] p-8 text-center text-sm text-[var(--text-faint)] font-medium">
            No "{planType}" plans found. Create one in Subscription Plans, or
            pick another plan type above.
          </div>
        )}
      </div>

      {selectedPlan && (
        <div
          className="rounded-2xl bg-white border border-[var(--line)] p-7 rh-rise relative overflow-hidden"
          style={{ animationDelay: "100ms" }}
        >
          <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-[var(--violet)] to-[var(--cyan)]" />
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--text-faint)] mb-5 pl-2">
            Renewal Summary
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 pl-2">
            <SummaryField label="Selected Plan" value={selectedPlan?.name} />

            <SummaryField label="Duration" value={selectedPlan?.duration} />

            <SummaryField
              label="Amount"
              value={`₹${selectedPlan?.finalPrice || 0}`}
            />

            <SummaryField label="New Expiry" value={calculateExpiry()} />

            <SummaryField
              label="Admission Fee"
              value={`₹${selectedPlan?.admissionFee || 0}`}
            />

            <SummaryField label="Plan ID" value={selectedPlan?.planId || "-"} />
          </div>
        </div>
      )}
      {selectedPlan?.features?.length > 0 && (
        <div className="mt-6">
          <p
            className="
      text-[10px]
      font-semibold
      uppercase
      tracking-[0.18em]
      text-[var(--text-faint)]
      mb-3
    "
          >
            Included Features
          </p>

          <div className="flex flex-wrap gap-2">
            {selectedPlan.features.map((feature, index) => (
              <span
                key={index}
                className="
        px-3
        py-1
        rounded-full
        bg-[var(--canvas)]
        text-xs
        font-semibold
      "
              >
                {feature}
              </span>
            ))}
          </div>
        </div>
      )}

      <div
        className="rounded-2xl bg-white border border-[var(--line)] p-7 rh-rise"
        style={{ animationDelay: "140ms" }}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="rh-display text-base font-bold text-[var(--text)]">
            Payment details
          </h3>
          <span className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--text-faint)]">
            <FiLock size={11} />
            Secure checkout
          </span>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Amount */}
          <div>
            <label className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--text-faint)]">
              Amount to pay
            </label>

            <div className="flex items-center gap-2 mt-2.5 rounded-xl border-2 border-[var(--line)] focus-within:border-[var(--violet)] px-4 py-3 transition-colors bg-[var(--canvas)]">
              <span className="rh-mono text-lg text-[var(--text-faint)]">
                ₹
              </span>
              <input
                type="number"
                min="1"
                max={selectedPlan?.finalPrice || 999999}
                value={amountPaid ?? ""}
                onChange={(e) =>
                  setAmountPaid(
                    e.target.value === "" ? "" : Number(e.target.value),
                  )
                }
                className="
    w-full
    bg-transparent
    outline-none
    rh-mono
    text-xl
    font-semibold
    text-[var(--text)]
  "
              />
              {selectedPlan && (
                <button
                  type="button"
                  onClick={() => setAmountPaid(selectedPlan?.finalPrice)}
                  className="shrink-0 px-3 py-1.5 rounded-lg bg-[var(--ink)] text-white text-[10px] font-semibold uppercase tracking-wide hover:bg-[var(--ink-soft)] transition-colors"
                >
                  Pay full
                </button>
              )}
            </div>

            <div className="flex flex-wrap gap-2 mt-3">
              {quickAmounts.map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setAmountPaid(amt)}
                  className="px-3.5 py-1.5 rounded-full border border-[var(--line)] text-xs font-semibold text-[var(--text-soft)] hover:border-[var(--violet)] hover:text-[var(--violet)] transition-colors rh-mono"
                >
                  +₹{amt}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--text-faint)]">
              Pay with
            </label>
            <div className="grid grid-cols-4 gap-2.5 mt-2.5">
              {PAYMENT_METHODS.map(({ id: methodId, label, icon: Icon }) => {
                const isActive = paymentMethod === methodId;
                return (
                  <button
                    key={methodId}
                    type="button"
                    onClick={() => setPaymentMethod(methodId)}
                    className={`flex flex-col items-center justify-center gap-1.5 py-3.5 rounded-xl border-2 transition-all duration-200
                      ${
                        isActive
                          ? "border-[var(--violet)] bg-gradient-to-b from-[var(--violet)]/5 to-[var(--cyan)]/5"
                          : "border-[var(--line)] hover:border-[var(--text-faint)]"
                      }`}
                  >
                    <Icon
                      size={17}
                      className={
                        isActive
                          ? "text-[var(--violet)]"
                          : "text-[var(--text-faint)]"
                      }
                    />
                    <span
                      className={`text-[10px] font-semibold uppercase tracking-wide ${
                        isActive
                          ? "text-[var(--violet)]"
                          : "text-[var(--text-soft)]"
                      }`}
                    >
                      {label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-6">
          <label className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--text-faint)]">
            Remarks{" "}
            <span className="normal-case font-medium text-[var(--text-faint)]/70">
              (optional)
            </span>
          </label>
          <textarea
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            rows={2}
            placeholder="Reference ID or any notes…"
            className="w-full mt-2.5 rounded-xl border-2 border-[var(--line)] focus:border-[var(--violet)] outline-none px-4 py-3 text-sm text-[var(--text)] bg-[var(--canvas)] transition-colors resize-none placeholder:text-[var(--text-faint)]"
          />
        </div>

        <div className="mt-7 pt-6 border-t border-[var(--line)] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="w-9 h-9 rounded-full bg-[var(--mint-soft)] flex items-center justify-center shrink-0">
              <FiLock size={14} className="text-[var(--mint)]" />
            </span>
            <div>
              <p className="text-xs font-semibold text-[var(--text)]">
                {selectedPlan
                  ? `Renewing with ${selectedPlan?.name}`
                  : "Select a plan to continue"}
              </p>
              <p className="text-[11px] text-[var(--text-faint)] mt-0.5">
                {selectedPlan
                  ? `₹${amountPaid} via ${paymentMethod} · new expiry ${calculateExpiry()}`
                  : "Pick a plan above to enable renewal"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleRenew}
            disabled={
              !selectedPlan ||
              !paymentMethod ||
              amountPaid === "" ||
              Number(amountPaid) <= 0 ||
              Number(amountPaid) > selectedPlan?.finalPrice ||
              loading
            }
            className="group relative inline-flex items-center justify-center gap-2.5 w-full sm:w-auto min-w-[230px] px-7 py-3.5
              rounded-l text-white text-[13px] font-bold tracking-wide
              bg-gradient-to-r from-[var(--violet)] via-[#8B6CFF] to-[var(--cyan)]
              shadow-[0_10px_30px_-8px_rgba(124,92,252,0.55)]
              hover:shadow-[0_14px_36px_-6px_rgba(124,92,252,0.75)] hover:brightness-110 hover:-translate-y-0.5
              active:translate-y-0 active:brightness-95
              disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none disabled:translate-y-0 disabled:hover:brightness-100
              transition-all duration-200 overflow-hidden"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/25 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out" />
            <FiRefreshCw
              size={15}
              className={`relative ${loading ? "animate-spin" : ""}`}
            />
            <span className="relative">
              {loading ? "Renewing…" : "Confirm & Renew Membership"}
            </span>
          </button>
        </div>
      </div>

      <div
        className="rounded-2xl bg-white border border-[var(--line)] p-7 rh-rise"
        style={{ animationDelay: "180ms" }}
      >
        <h3 className="rh-display text-base font-bold text-[var(--text)] mb-5">
          Renewal history
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px]">
            <thead>
              <tr className="border-b border-[var(--line)]">
                <th className="text-left py-3 px-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--text-faint)]">
                  Receipt No
                </th>

                <th className="text-left py-3 px-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--text-faint)]">
                  Plan
                </th>

                <th className="text-right py-3 px-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--text-faint)]">
                  Amount
                </th>

                <th className="text-center py-3 px-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--text-faint)]">
                  Method
                </th>

                <th className="text-center py-3 px-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--text-faint)]">
                  Old Expiry
                </th>

                <th className="text-center py-3 px-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--text-faint)]">
                  New Expiry
                </th>

                <th className="text-center py-3 px-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--text-faint)]">
                  Renewed On
                </th>

                <th className="text-left py-3 px-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--text-faint)]">
                  Remarks
                </th>
              </tr>
            </thead>

            <tbody>
              {member.renewalHistory?.length > 0 ? (
                [...member.renewalHistory]
                  .sort((a, b) => new Date(b.renewedOn) - new Date(a.renewedOn))
                  .map((item, index) => (
                    <tr
                      key={item.receiptNo}
                      className="
                border-b
                border-[var(--line)]
                last:border-0
                hover:bg-[var(--canvas)]
                transition-all
              "
                    >
                      <td className="py-4 px-2 text-xs font-semibold rh-mono whitespace-nowrap text-[var(--text)]">
                        {item.receiptNo || "-"}
                      </td>

                      <td className="py-4 px-2 text-sm font-semibold text-[var(--text)] whitespace-nowrap">
                        {item.planName}
                      </td>

                      <td className="py-4 px-2 text-right rh-mono font-semibold text-[var(--mint)] text-sm whitespace-nowrap">
                        ₹{item.amount}
                      </td>

                      <td className="py-4 px-2 text-center text-[var(--text-soft)] text-sm whitespace-nowrap">
                        {item.paymentMethod || "-"}
                      </td>

                      <td className="py-4 px-2 text-center rh-mono text-[var(--text-soft)] text-sm whitespace-nowrap">
                        {item.oldExpiryDate
                          ? new Date(item.oldExpiryDate).toLocaleDateString(
                              "en-IN",
                              {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              },
                            )
                          : "-"}
                      </td>

                      <td className="py-4 px-2 text-center rh-mono text-[var(--text-soft)] text-sm whitespace-nowrap">
                        {item.newExpiryDate
                          ? new Date(item.newExpiryDate).toLocaleDateString(
                              "en-IN",
                              {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              },
                            )
                          : "-"}
                      </td>

                      <td className="py-4 px-2 text-center text-[var(--text-soft)] text-sm whitespace-nowrap">
                        {item.renewedOn
                          ? new Date(item.renewedOn).toLocaleDateString(
                              "en-IN",
                              {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              },
                            )
                          : "-"}
                      </td>

                      <td className="py-4 px-2 text-sm text-[var(--text-soft)]">
                        {item.remarks || "-"}
                      </td>
                    </tr>
                  ))
              ) : (
                <tr>
                  <td
                    colSpan="8"
                    className="
              py-12
              text-center
              text-[var(--text-faint)]
              text-sm
              font-medium
            "
                  >
                    No renewal history yet — this will be the first record.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RenewMember;
