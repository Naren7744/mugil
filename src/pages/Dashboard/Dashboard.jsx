import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import {
  FiUsers,
  FiDollarSign,
  FiActivity,
  FiAlertCircle,
  FiUserPlus,
  FiPlusCircle,
  FiFileText,
  FiClock,
  FiXCircle,
} from "react-icons/fi";

/* ─────────────── Custom Tooltip ─────────────── */
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl px-4 py-3 shadow-lg">
        <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">
          {label}
        </p>
        <p className="text-sm font-black text-violet-600 font-mono">
          ₹{Number(payload[0].value).toLocaleString()}
        </p>
      </div>
    );
  }
  return null;
};

function Dashboard() {
  const navigate = useNavigate();
  const activeView = "overview";
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentBranch, searchQuery } = useOutletContext();

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
        const res = await api.get("/members");
      setMembers(res.data.data || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  /* ── Branch Filter ── */
  const activeBranchMembers =
    currentBranch === "ALL_BRANCHES"
      ? members
      : members.filter((m) => m.branch === currentBranch);

  const filteredMembers = activeBranchMembers.filter((member) =>
    member.fullName
      ?.toLowerCase()
      .includes((searchQuery || "").toLowerCase())
  );

  /* ── Helpers ── */
  const getDaysLeft = (expiryDate) => {
    if (!expiryDate) return 999;
    const today = new Date();
    const expiry = new Date(expiryDate);
    return Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
  };

  const branchLabel =
    currentBranch === "ALL_BRANCHES"
      ? "All Branches"
      : currentBranch === "MUGIL_FITNESS"
      ? "Mugil Fitness"
      : "SP Fitness";

  /* ── KPI Counts ── */
  const totalMembers = activeBranchMembers.length;

  const activeMembers = activeBranchMembers.filter(
    (m) => m.status === "Active"
  ).length;

  const expiringMembers = activeBranchMembers.filter((m) => {
    const d = getDaysLeft(m.expiryDate);
    return d <= 7 && d >= 0;
  }).length;

  /* Expired: 1–180 days past expiry */
  const expiredMembers = activeBranchMembers.filter((m) => {
    const d = getDaysLeft(m.expiryDate);
    return d < 0 && d >= -180;
  }).length;

  const monthlyIncome = activeBranchMembers.reduce(
    (total, m) => total + Number(m.amountPaid || 0),
    0
  );

  const todayExpiring = activeBranchMembers.filter(
    (m) => getDaysLeft(m.expiryDate) === 0
  ).length;

  const weekExpiring = activeBranchMembers.filter((m) => {
    const d = getDaysLeft(m.expiryDate);
    return d >= 0 && d <= 7;
  }).length;

  /* Fixed: month = 30 days, was incorrectly set to 7 */
  const monthExpiring = activeBranchMembers.filter((m) => {
    const d = getDaysLeft(m.expiryDate);
    return d >= 0 && d <= 30;
  }).length;

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const monthlyNewMembers = activeBranchMembers.filter((m) => {
    const created = new Date(m.createdAt);
    return (
      created.getMonth() === currentMonth &&
      created.getFullYear() === currentYear
    );
  }).length;

  /* ── Revenue Chart ── */
  const [selectedPeriod, setSelectedPeriod] = useState("month");

  const monthlyRevenueData = [
    "Jan","Feb","Mar","Apr","May","Jun",
    "Jul","Aug","Sep","Oct","Nov","Dec",
  ].map((month, index) => ({
    month,
    revenue: activeBranchMembers
      .filter((m) => {
        const created = new Date(m.createdAt);
        return (
          created.getFullYear() === currentYear &&
          created.getMonth() === index
        );
      })
      .reduce((total, m) => total + Number(m.amountPaid || 0), 0),
  }));

  const revenueDataMap = {
    week: [
      { month: "Mon", revenue: 1200 },
      { month: "Tue", revenue: 1800 },
      { month: "Wed", revenue: 2400 },
      { month: "Thu", revenue: 2000 },
      { month: "Fri", revenue: 2800 },
      { month: "Sat", revenue: 3200 },
      { month: "Sun", revenue: 3500 },
    ],
    month: monthlyRevenueData,
    year: [
      { month: "2022", revenue: 120000 },
      { month: "2023", revenue: 220000 },
      { month: "2024", revenue: 340000 },
      { month: "2025", revenue: 480000 },
      {
        month: new Date().getFullYear().toString(),
        revenue: activeBranchMembers.reduce(
          (total, m) => total + Number(m.amountPaid || 0),
          0
        ),
      },
    ],
  };

  const revenueData = revenueDataMap[selectedPeriod];
 const peakRevenue =
  revenueData.length > 0
    ? Math.max(...revenueData.map((d) => d.revenue))
    : 0;

  const expense = Math.round(monthlyIncome * 0.35);
  const netProfit = monthlyIncome - expense;
  const growth = currentBranch === "MUGIL_FITNESS" ? 18.3 : 12.8;

  /* ── Pending Payments ── */
const pendingMembers = filteredMembers
  .filter(
    (m) =>
      Number(m.balanceAmount || 0) > 0 ||
      m.paymentStatus === "Balance Pending"
  )
  .sort(
    (a, b) =>
      Number(b.balanceAmount || 0) -
      Number(a.balanceAmount || 0)
  )
  .slice(0, 3);

  const totalPendingAmount = pendingMembers.reduce(
    (total, m) => total + Number(m.balanceAmount || 0),
    0
  );
  const pendingCount = pendingMembers.length;

  /* ── Loading ── */
  if (loading) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <div className="text-slate-500 font-bold">Loading Dashboard...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-slate-800 animate-fade-in select-none">

      {/* ═══════════════ SUB-HEADER ═══════════════ */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-2 select-none">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-slate-900">
            Welcome to{" "}
            <span className="bg-gradient-to-r from-violet-600 to-blue-500 bg-clip-text text-transparent">
              {branchLabel}
            </span>
          </h2>
          <p className="text-slate-400 text-xs font-medium mt-1">
            Real-time fitness operations, member analytics and business insights.
          </p>
        </div>

        <div className="flex items-center p-1 bg-slate-100/80 border border-slate-200/40 rounded-xl shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)]">
          <button
            type="button"
            onClick={() => navigate("/admin/members/new")}
            className="cursor-pointer min-w-[145px] px-8 py-2.5 rounded-lg text-xs font-black uppercase tracking-wider bg-gradient-to-r from-[#4d3df7] to-[#8a3df7] text-white shadow-md hover:opacity-95 transition-all duration-200"
          >
            + Add New Member
          </button>
        </div>
      </div>

      {/* ═══════════════ OVERVIEW ═══════════════ */}
      {activeView === "overview" && (
        <div className="space-y-6">

          {/* ── TOP 4 KPI CARDS ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6 select-none">

            {/* Card 1 – Total Members */}
            <div
              onClick={() => navigate("/admin/members?view=ALL")}
              className="group cursor-pointer bg-white border border-slate-100 rounded-2xl p-5 shadow-sm flex flex-col justify-between h-[135px] transition-all duration-300 hover:border-violet-400 hover:shadow-md hover:shadow-violet-500/5 active:scale-[0.98]"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center shadow-inner transition-transform duration-300 group-hover:scale-110 shrink-0">
                  <FiUsers size={18} />
                </div>
                <div>
                  <p className="text-slate-400 text-[11px] font-bold uppercase tracking-wider">
                    Total Members
                  </p>
                  <h3 className="text-2xl font-bold text-slate-900 font-mono mt-0.5">
                    {totalMembers}
                  </h3>
                </div>
              </div>
              <div className="pt-2 border-t border-slate-50 text-[11px] font-medium text-slate-400">
                <span className="text-emerald-500 font-bold">
                  +{monthlyNewMembers} this month
                </span>
              </div>
            </div>

            {/* Card 2 – Active Members */}
            <div
              onClick={() => navigate("/admin/members?view=ACTIVE")}
              className="group cursor-pointer bg-white border border-slate-100 rounded-2xl p-5 shadow-sm flex flex-col justify-between h-[135px] transition-all duration-300 hover:border-emerald-400 hover:shadow-md hover:shadow-emerald-500/5 active:scale-[0.98]"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-inner transition-transform duration-300 group-hover:scale-110 shrink-0">
                  <FiActivity size={18} />
                </div>
                <div>
                  <p className="text-slate-400 text-[11px] font-bold uppercase tracking-wider">
                    Active Members
                  </p>
                  <h3 className="text-2xl font-bold text-slate-900 font-mono mt-0.5">
                    {activeMembers}
                  </h3>
                </div>
              </div>
              <div className="pt-2 border-t border-slate-50 text-[11px] font-medium text-slate-400">
                <span className="text-emerald-500 font-bold">
                  +{monthlyNewMembers} this month
                </span>
              </div>
            </div>

            {/* Card 3 – Pending Fees */}
            <div
              onClick={() => navigate("/admin/fees?view=PENDING")}
              className="group cursor-pointer bg-white border border-slate-100 rounded-2xl p-5 shadow-sm flex flex-col justify-between h-[135px] transition-all duration-300 hover:border-amber-400 hover:shadow-md hover:shadow-amber-500/5 active:scale-[0.98]"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shadow-inner transition-transform duration-300 group-hover:scale-110 shrink-0">
                  <FiDollarSign size={18} />
                </div>
                <div>
                  <p className="text-slate-400 text-[11px] font-bold uppercase tracking-wider">
                    Pending Fees
                  </p>
                  <h3 className="text-2xl font-bold text-slate-900 font-mono mt-0.5">
                     ₹{totalPendingAmount.toLocaleString("en-IN")}
                  </h3>
                </div>
              </div>
              <div className="pt-2 border-t border-slate-50 text-[11px] font-medium text-slate-400">
                <span className="text-emerald-500 font-bold">
                  {pendingCount} Members
                </span>{" "}
                Pending
              </div>
            </div>

            {/* Card 4 – Expiring Members */}
            <div
              onClick={() => navigate("/admin/members/overview?view=EXPIRING")}
              className="group cursor-pointer bg-white border border-slate-100 rounded-2xl p-5 shadow-sm flex flex-col justify-between h-[135px] transition-all duration-300 hover:border-red-400 hover:shadow-md hover:shadow-red-500/5 active:scale-[0.98]"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-50 text-red-500 flex items-center justify-center shadow-inner transition-transform duration-300 group-hover:scale-110 shrink-0">
                  <FiAlertCircle size={18} />
                </div>
                <div>
                  <p className="text-slate-400 text-[11px] font-bold uppercase tracking-wider">
                    Expire Members
                  </p>
                  <h3 className="text-2xl font-bold text-slate-900 font-mono mt-0.5">
                    {expiringMembers}
                  </h3>
                </div>
              </div>
              <div className="pt-2 border-t border-slate-50 text-[11px] font-medium flex justify-between">
                <span className="text-red-500 font-bold">
                  {expiringMembers} Expiring
                </span>
                <span className="text-slate-400">Next 7 Days</span>
              </div>
            </div>
          </div>

          {/* ── 3-COLUMN SECTION ── */}
      {/* ── 3-COLUMN SECTION (NEW LAYOUT) ── */}
          {/* TOP ROW: Revenue Chart (wider left) + Expiry Alerts (narrower right) */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">

            {/* ── COL SPAN 3: REVENUE CHART ── */}
            <div className="lg:col-span-3 bg-white border border-slate-100 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
              <div>
                {/* Header */}
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                      Revenue Overview
                    </h4>
                    <p className="text-[10px] text-slate-400 font-medium mt-0.5">
                      {branchLabel} • {currentYear}
                    </p>
                  </div>
                  <select
                    value={selectedPeriod}
                    onChange={(e) => setSelectedPeriod(e.target.value)}
                    className="text-xs bg-violet-50 border border-violet-100 px-3 py-1.5 rounded-lg text-violet-600 font-bold outline-none cursor-pointer hover:border-violet-300 transition-colors"
                  >
                    <option value="week">This Week</option>
                    <option value="month">This Month</option>
                    <option value="year">This Year</option>
                  </select>
                </div>

                {/* Peak Badge */}
                <div className="flex items-center gap-2 mb-3 px-3 py-1.5 bg-violet-50/60 border border-violet-100 rounded-lg w-fit">
                  <span className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                    Peak
                  </span>
                  <span className="text-[11px] font-black text-violet-600 font-mono">
                    ₹{peakRevenue.toLocaleString()}
                  </span>
                </div>

                {/* Chart */}
                <div style={{ width: "100%", height: "185px" }}>
                  <ResponsiveContainer width="100%" height={185}>
                    <AreaChart
                      data={revenueData}
                      margin={{ top: 5, right: 5, left: -15, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#7c3aed" stopOpacity={0.22} />
                          <stop offset="100%" stopColor="#7c3aed" stopOpacity={0} />
                        </linearGradient>
                      </defs>

                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="#f1f5f9"
                        vertical={false}
                      />

                      <XAxis
                        dataKey="month"
                        tick={{ fontSize: 9, fill: "#94a3b8", fontWeight: 700 }}
                        axisLine={false}
                        tickLine={false}
                      />

                      <YAxis
                        tick={{ fontSize: 9, fill: "#94a3b8" }}
                        axisLine={false}
                        tickLine={false}
                        tickFormatter={(v) =>
                          v >= 1000 ? `₹${(v / 1000).toFixed(0)}k` : `₹${v}`
                        }
                      />

                      <Tooltip content={<CustomTooltip />} />

                      <Area
                        type="monotone"
                        dataKey="revenue"
                        stroke="#7c3aed"
                        strokeWidth={2.5}
                        fill="url(#incomeGradient)"
                        dot={{ r: 3, fill: "#7c3aed", strokeWidth: 0 }}
                        activeDot={{
                          r: 5,
                          fill: "#7c3aed",
                          stroke: "#ede9fe",
                          strokeWidth: 3,
                        }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* ── COL SPAN 2: EXPIRY ALERTS ── */}
            <div className="lg:col-span-2 bg-white border border-slate-200/60 rounded-[24px] p-5 shadow-[0_8px_30px_rgb(0,0,0,0.015)] flex flex-col justify-between select-none">
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                    Membership Expiry Alerts
                  </h4>
                  <button
                    type="button"
                    onClick={() => navigate("/admin/members/overview?view=EXPIRING")}
                    className="cursor-pointer text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors duration-200 active:scale-95"
                  >
                    View All
                  </button>
                </div>

                <div className="space-y-2.5">
            {filteredMembers
  .filter((m) => {
    const d = getDaysLeft(m.expiryDate);
    return d >= 0 && d <= 7;
  })
  .sort(
    (a, b) =>
      new Date(a.expiryDate) -
      new Date(b.expiryDate)
  )
  .slice(0, 3)
  .map((alert, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-3 bg-slate-50/50 border border-slate-100 rounded-xl hover:bg-slate-50 hover:border-slate-200 transition-all duration-200 group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200/40 text-xs flex items-center justify-center font-bold text-slate-600 group-hover:scale-105 transition-transform duration-200">
                            {(alert.fullName || "M").charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 text-xs leading-none">
                              {alert.fullName}
                            </p>
                            <p className="text-[10px] font-mono text-slate-400 mt-1">
                              {alert.memberId} // {alert.planType}
                            </p>
                          </div>
                        </div>
                        <span className="text-[10px] font-bold px-2.5 py-1.5 bg-red-50 text-red-500 border border-red-100 rounded-lg font-mono shadow-xs">
                          {getDaysLeft(alert.expiryDate)} Days
                        </span>
                      </div>
                    ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-between items-center text-xs font-bold text-slate-400">
                <span>Total {filteredMembers.length} accounts log</span>
                <button
                  type="button"
                  onClick={() => navigate("/admin/members/overview?view=EXPIRING")}
                  className="cursor-pointer text-blue-600 hover:text-blue-700 hover:underline transition-colors duration-200"
                >
                  View All
                </button>
              </div>
            </div>
          </div>

          {/* BOTTOM ROW: Expired + Expiry Status + Pending — 3 equal compact cards */}
<div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mt-5">

          {/* ── EXPIRED MEMBERS ── */}
            <div
              onClick={() =>  navigate("/admin/members/overview?view=EXPIRED")}
              className="group cursor-pointer bg-white border border-slate-100 border-l-4 border-l-rose-500 rounded-2xl p-5 shadow-sm flex flex-col gap-4 transition-all duration-300 hover:shadow-md hover:shadow-rose-500/5 active:scale-[0.98]"
            >
              {/* Header */}
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-rose-50 flex items-center justify-center shrink-0">
                    <FiXCircle className="text-rose-500" size={13} />
                  </div>
                  <span className="text-[11px] font-black text-slate-700 uppercase tracking-wider">
                    Expired Members
                  </span>
                </div>
                <span className="text-[8px] font-black tracking-wider uppercase bg-rose-50 text-rose-500 px-2 py-0.5 rounded-md border border-rose-100">
                  Live
                </span>
              </div>

              {/* Value row — same bg-slate-50 pill style as Expiring Status rows */}
              <div className="flex flex-col gap-2 flex-1 justify-center">
                <div className="flex justify-between items-center bg-slate-50 px-3 py-4 rounded-xl border border-slate-100">
                  <span className="text-xs font-semibold text-slate-500">Total Expired</span>
                  <span className="font-mono font-black text-3xl text-rose-600 leading-none">
                    {String(expiredMembers).padStart(2, "0")}
                  </span>
                </div>
                <p className="text-[10px] font-semibold text-slate-400 px-1">
                  Lapsed memberships ≤ 180 days
                </p>
              </div>

              {/* Footer */}
              <div className="pt-3 border-t border-slate-100 text-[10px] font-bold text-rose-500 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                Click to view expired members →
              </div>
            </div>

            {/* ── MEMBERSHIP EXPIRING STATUS ── */}
            <div className="bg-white border border-slate-100 border-l-4 border-l-amber-500 rounded-2xl p-5 shadow-sm flex flex-col gap-4">
              {/* Header */}
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-amber-50 flex items-center justify-center shrink-0">
                    <FiClock className="text-amber-500" size={13} />
                  </div>
                  <span className="text-[11px] font-black text-slate-700 uppercase tracking-wider">
                    Expiring Status
                  </span>
                </div>
                <span className="text-[8px] font-black tracking-wider uppercase bg-amber-50 text-amber-500 px-2 py-0.5 rounded-md border border-amber-100">
                  Live
                </span>
              </div>

              {/* Rows */}
              <div className="flex flex-col gap-2 flex-1 justify-center">
                <div className="flex justify-between items-center bg-slate-50 px-3 py-2.5 rounded-xl border border-slate-100 text-xs">
                  <span className="font-semibold text-slate-500">Today Expiring</span>
                  <span className="font-mono font-black bg-red-50 text-red-600 px-2.5 py-0.5 rounded-lg border border-red-100 min-w-[36px] text-center">
                    {String(todayExpiring).padStart(2, "0")}
                  </span>
                </div>
                <div className="flex justify-between items-center bg-slate-50 px-3 py-2.5 rounded-xl border border-slate-100 text-xs">
                  <span className="font-semibold text-slate-500">This Week</span>
                  <span className="font-mono font-black bg-amber-50 text-amber-600 px-2.5 py-0.5 rounded-lg border border-amber-100 min-w-[36px] text-center">
                    {String(weekExpiring).padStart(2, "0")}
                  </span>
                </div>
                <div className="flex justify-between items-center bg-slate-50 px-3 py-2.5 rounded-xl border border-slate-100 text-xs">
                  <span className="font-semibold text-slate-500">This Month</span>
                  <span className="font-mono font-black bg-violet-50 text-violet-600 px-2.5 py-0.5 rounded-lg border border-violet-100 min-w-[36px] text-center">
                    {String(monthExpiring).padStart(2, "0")}
                  </span>
                </div>
              </div>

              {/* Footer spacer to match height */}
              <div className="pt-3 border-t border-slate-100 text-[10px] font-bold text-amber-500 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                Membership watch · real-time
              </div>
            </div>

            {/* ── PENDING PAYMENTS ── */}
            <div className="bg-white border border-slate-100 border-l-4 border-l-slate-400 rounded-2xl p-5 shadow-sm flex flex-col gap-4">
              {/* Header */}
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                    <FiDollarSign className="text-slate-500" size={13} />
                  </div>
                  <span className="text-[11px] font-black text-slate-700 uppercase tracking-wider">
                    Pending Payments
                  </span>
                </div>
                <span className="text-[8px] font-black tracking-wider uppercase bg-slate-50 text-slate-500 px-2 py-0.5 rounded-md border border-slate-200">
                  Live
                </span>
              </div>

              {/* Member list */}
              <div className="flex flex-col gap-1.5 flex-1">
                {pendingMembers.length > 0 ? (
                  pendingMembers.slice(0, 4).map((item, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between items-center bg-slate-50 px-3 py-2 rounded-xl border border-slate-100 text-xs"
                    >
                      <div>
                        <p className="font-bold text-slate-800 leading-none">{item.fullName}</p>
                        <p className="text-[9px] font-mono text-red-400 mt-0.5">
                          Balance: ₹{item.balanceAmount}
                        </p>
                      </div>
                      <span className="font-mono font-black text-slate-700">
                        ₹{Number(item.balanceAmount).toLocaleString()}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="flex-1 flex items-center justify-center">
                    <p className="text-xs text-emerald-600 font-bold">✓ No Pending Payments</p>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="pt-3 border-t border-slate-100 flex justify-between items-center">
                <div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Total Pending</span>
                  <p className="text-[10px] text-slate-400 mt-0.5">{pendingCount} Members</p>
                </div>
                <span className="text-red-500 font-mono font-black text-sm">
                  ₹{totalPendingAmount.toLocaleString()}
                </span>
              </div>
            </div>

          </div>

          {/* ── SHORTCUT ACTIONS FOOTER ── */}
<div className="bg-white rounded-[10px] p-8 border border-slate-200/50 shadow-sm shadow-slate-100/50 select-none">
  {/* Header Section */}
  <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
    <div>
      <h4 className="text-xs font-black uppercase tracking-[2px] text-slate-900">
        Operational Control Hub
      </h4>
      <p className="text-xs text-slate-400 font-medium mt-1">
        Quick access shortcuts to core system parameters
      </p>
    </div>
    <div className="self-start sm:self-center flex items-center gap-2 bg-indigo-50/60 px-3 py-1.5 rounded-xl border border-indigo-100/80">
      <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse" />
      <span className="text-[10px] font-black uppercase tracking-wider text-indigo-600">
        Live Actions
      </span>
    </div>
  </div>

{/* Cards Grid Architecture */}
<div className="grid grid-cols-2 md:grid-cols-4 gap-5">
  {[
    {
      name: "Add Member",
      icon: <FiUserPlus size={18} />,
      accent: "hover:text-indigo-600 hover:bg-indigo-50/20 hover:border-indigo-200/60 hover:shadow-xl hover:shadow-indigo-500/[0.03]",
      iconBg: "bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white",
      action: () => navigate("/admin/members/new"),
    },
    {
      name: "Add Payment",
      icon: <FiDollarSign size={18} />,
      accent: "hover:text-amber-600 hover:bg-amber-50/20 hover:border-amber-200/60 hover:shadow-xl hover:shadow-amber-500/[0.03]",
      iconBg: "bg-amber-50 text-amber-600 group-hover:bg-amber-600 group-hover:text-white",
      action: () => navigate("/admin/payments/collect"),
    },
    {
      name: "Create Plan",
      icon: <FiPlusCircle size={18} />,
      accent: "hover:text-emerald-600 hover:bg-emerald-50/20 hover:border-emerald-200/60 hover:shadow-xl hover:shadow-emerald-500/[0.03]",
      iconBg: "bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white",
      action: () => navigate("/admin/membership-plans"),
    },
    {
      name: "Generate Report",
      icon: <FiFileText size={18} />,
      accent: "hover:text-rose-600 hover:bg-rose-50/20 hover:border-rose-200/60 hover:shadow-xl hover:shadow-rose-500/[0.03]",
      iconBg: "bg-rose-50 text-rose-600 group-hover:bg-rose-600 group-hover:text-white",
      action: () => navigate("/admin/reports"),
    },
  ].map((act, index) => (
    <button
      key={index}
      type="button"
      onClick={act.action}
      className={`flex flex-col items-center justify-center p-6 bg-white border border-slate-150 rounded-[24px] text-center transition-all duration-300 ease-out group active:scale-[0.96] hover:-translate-y-1 shadow-sm ${act.accent}`}
    >
      <div
        className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-xs border border-transparent ${act.iconBg}`}
      >
        {act.icon}
      </div>
      <span className="text-[11px] font-black text-slate-500 group-hover:text-slate-900 transition-colors duration-300 mt-4 tracking-wider uppercase">
        {act.name}
      </span>
    </button>
  ))}
</div>
</div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;