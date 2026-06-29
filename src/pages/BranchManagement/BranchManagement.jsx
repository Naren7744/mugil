import React, { useState, useMemo ,useEffect} from "react";
import api from "../../services/api";
import { useOutletContext } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  FiLayers, FiCheckCircle, FiUsers, FiTrendingUp,
  FiSearch, FiFilter, FiPlus, FiMapPin, FiDownload,
  FiRefreshCw, FiX, FiChevronUp, FiChevronDown,
} from "react-icons/fi";
import PageHeader from "../../components/dashboard/PageHeader";

/* ── Helpers ──────────────────────────────────────────────────────── */
const fmtRev = (n) => "₹" + Number(n).toLocaleString("en-IN");

const recalcPct = (list) => {
  const total = list.reduce((s, b) => s + b.totalRevenue, 0) || 1;
  return list.map((b) => ({
    ...b,
    pct: parseFloat(((b.totalRevenue / total) * 100).toFixed(1)),
  }));
};





/* ── Main Component ───────────────────────────────────────────────── */
function BranchManagement() {
 const {
  searchQuery: globalSearchQuery,
  currentBranch,
} = useOutletContext() || {};
  const [branches, setBranches] =useState([]);
  const [localSearch, setLocalSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [sortCol, setSortCol]     = useState(null);
  const [sortDir, setSortDir]     = useState("asc");
  const [stats, setStats] =
  useState(null);
  const [period, setPeriod] =
  useState("thisMonth");
  const [editingBranch, setEditingBranch] =
  useState(null);

const [modalForm, setModalForm] = useState({
  name: "",
  code: "",
  loc: "",
  manager: "",
  mobile: "",
  email: "",
  address: "",
  color: "#6366f1",
  branchType: "Branch",
  openingTime: "",
  closingTime: "",
});
  const handleField = (k) => (e) =>
    setModalForm((p) => ({ ...p, [k]: e.target.value }));

  const activeSearch = localSearch || globalSearchQuery || "";

  /* Sort */
  const handleSort = (col) => {
    if (sortCol === col) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortCol(col); setSortDir("asc"); }
  };

  const SortIcon = ({ col }) => {
    if (sortCol !== col)
      return <FiChevronUp size={11} className="text-slate-300" />;
    return sortDir === "asc"
      ? <FiChevronUp size={11} className="text-indigo-500" />
      : <FiChevronDown size={11} className="text-indigo-500" />;
  };

  const fetchStats = async () => {
  try {
const res = await api.get(
  `/branches/stats?branch=${currentBranch}`
);

    setStats(res.data.data);
  } catch (error) {
    console.error(error);
  }
};
const fetchBranches = async () => {
  try {
const res = await api.get(
  `/branches?period=${period}&branch=${currentBranch}`
);
    const branchesWithPct =
      recalcPct(res.data.data);

    setBranches(branchesWithPct);

  } catch (error) {
    console.error(error);
  }
};


useEffect(() => {
  fetchBranches();
  fetchStats();
}, [currentBranch, period]);


  /* Filter + sort */
  const filtered = useMemo(() => {
  let list = branches.filter(
  (b) =>
    b.branchName
      ?.toLowerCase()
      .includes(
        activeSearch.toLowerCase()
      ) ||
    b.branchCode
      ?.toLowerCase()
      .includes(
        activeSearch.toLowerCase()
      )
);
    if (sortCol) {
      list = [...list].sort((a, b) => {
        let av = a[sortCol], bv = b[sortCol];
        if (typeof av === "string") { av = av.toLowerCase(); bv = bv.toLowerCase(); }
        if (av < bv) return sortDir === "asc" ? -1 : 1;
        if (av > bv) return sortDir === "asc" ?  1 : -1;
        return 0;
      });
    }
    return list;
  }, [branches, activeSearch, sortCol, sortDir]);
  const branchFiltered =
  currentBranch === "ALL_BRANCHES"
    ? filtered
    : filtered.filter(
        (b) =>
          b.branchCode === currentBranch
      );

  /* Aggregates */
  const activeBranches =
  stats?.activeBranches || 0;
  const totalBranches =
  stats?.totalBranches || 0;

const maxRev = useMemo(() => {
 if (!branches.length) return 1;

 return Math.max(
   ...branches.map(
     (b) => b.totalRevenue || 0
   )
 );
}, [branches]);
const handleEdit = (branch) => {

  setEditingBranch(branch);

  setModalForm({
    name: branch.branchName || "",
    code: branch.branchCode || "",
    loc: branch.city || "",
    manager: branch.ownerName || "",
    mobile: branch.mobile || "",
    email: branch.email || "",
    address: branch.address || "",
    color: branch.color || "#6366f1",
    branchType: branch.branchType || "Branch",
    openingTime: branch.openingTime || "",
    closingTime: branch.closingTime || "",
  });

  setShowModal(true);
};

  /* Actions */
const handleAddBranch = async (e) => {
  e.preventDefault();

  try {

    if (editingBranch) {

 await api.put(
  `/branches/${editingBranch._id}`,
  {
          branchName: modalForm.name,
          branchCode: modalForm.code,
          ownerName: modalForm.manager,
          city: modalForm.loc,
        }
      );

    } else {

    await api.post(
  "/branches",
  {
          branchId: `BR${Date.now()}`,
          branchName: modalForm.name,
          branchCode: modalForm.code,
          ownerName: modalForm.manager,
          city: modalForm.loc,
        }
      );

    }

    fetchBranches();
await fetchStats();
    setShowModal(false);

    setEditingBranch(null);

setModalForm({
  name: "",
  code: "",
  loc: "",
  manager: "",
  mobile: "",
  email: "",
  address: "",
  color: "#6366f1",
  branchType: "Branch",
  openingTime: "",
  closingTime: "",
});
  } catch (error) {
    console.error(error);
  }
};
const handleDelete = async (id) => {

  const confirmDelete =
    window.confirm(
      "Are you sure you want to delete this branch?"
    );

  if (!confirmDelete) return;

  try {

  await api.delete(
  `/branches/${id}`
);

    fetchBranches();
    fetchStats();

  } catch (error) {
    console.error(error);
  }
};
const handleExport = () => {
  const doc = new jsPDF();

  const totalRevenue = branchFiltered.reduce((sum, b) => sum + Number(b.totalRevenue || 0), 0);
  const totalMembers = branchFiltered.reduce((sum, b) => sum + Number(b.totalMembers || 0), 0);

  doc.setTextColor(248, 250, 252); // Ultra light gray to prevent text clash
  doc.setFont("helvetica", "bold");
  doc.setFontSize(70);
  doc.text("MUGIL FITNESS", 30, 200, { angle: 45 });

  // ===== HEADER BANNER =====
  doc.setFillColor(15, 23, 42); 
  doc.rect(0, 0, 210, 42, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.text("MUGIL & SP FITNESS", 14, 20);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(148, 163, 184);
  doc.text("Official Branch Performance Report", 14, 28);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(255, 255, 255);
  doc.text("BRANCH REPORT", 196, 20, { align: "right" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(148, 163, 184);
  doc.text(`Date: ${new Date().toLocaleDateString("en-IN")}`, 196, 28, { align: "right" });

  // ===== BRANCH OVERVIEW INFO =====
  let currentY = 55;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text("BRANCH OVERVIEW", 14, currentY);
  doc.setDrawColor(226, 232, 240);
  doc.line(14, currentY + 4, 196, currentY + 4);

  currentY += 12;
  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139);
  
  const drawInfo = (label, value, y) => {
    doc.setFont("helvetica", "normal");
    doc.text(label, 14, y);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(30, 41, 59);
    doc.text(String(value), 48, y);
    doc.setTextColor(100, 116, 139);
  };

  drawInfo("Total Branches:", totalBranches, currentY);
  drawInfo("Active Branches:", activeBranches, currentY + 8);
  drawInfo("Period:", period, currentY + 16);

  
  currentY = 94;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text("PERFORMANCE SUMMARY", 14, currentY);
  doc.line(14, currentY + 4, 196, currentY + 4);

  currentY += 10;
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  
  // Three Boxes
  [42.5, 103.5, 166].forEach((x, i) => doc.roundedRect(i === 0 ? 14 : i === 1 ? 75 : 136, currentY, 57, 24, 3, 3, "FD"));

  const drawSummaryBox = (label, val, x) => {
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text(label, x, currentY + 8, { align: "center" });
    doc.setFontSize(12);
    doc.setTextColor(30, 41, 59);
    doc.text(val, x, currentY + 17, { align: "center" });
  };

  drawSummaryBox("TOTAL BRANCHES", String(totalBranches), 42.5);
  drawSummaryBox("TOTAL MEMBERS", totalMembers.toLocaleString("en-IN"), 103.5);
  drawSummaryBox("TOTAL REVENUE", `Rs. ${totalRevenue.toLocaleString("en-IN")}`, 166);

  // ===== PREMIUM TABLE =====
  autoTable(doc, {
    startY: currentY + 35,
    head: [["Branch", "Code", "Owner", "Members", "Revenue", "Status"]],
    headStyles: { fillColor: [15, 23, 42], textColor: [255, 255, 255], fontSize: 9, halign: "center" },
    bodyStyles: { fontSize: 9, halign: "center", cellPadding: 4 },
    alternateRowStyles: { fillColor: [248, 250, 252] },
    body: branchFiltered.map((b) => [b.branchName, b.branchCode, b.ownerName || "-", b.totalMembers, `Rs. ${b.totalRevenue.toLocaleString()}`, b.status]),
    didDrawPage: (data) => {
        // Footer (Same as before)
        const pageHeight = doc.internal.pageSize.height;
        doc.setFontSize(8);
        doc.setTextColor(148, 163, 184);
        doc.text(`Generated: ${new Date().toLocaleString()}`, 14, pageHeight - 8);
        doc.text(`Page ${data.pageNumber}`, 196, pageHeight - 8, { align: "right" });
    }
  });

  doc.save(`Branch_Report_${new Date().getTime()}.pdf`);
};

  const fetchNextCode = async () => {
  try {
   const res = await api.get(
  "/branches/next-code"
);
    setModalForm((prev) => ({
      ...prev,
      code: res.data?.nextCode || ""
    }));
  } catch (error) {
    console.error(error);
  }
};

  /* Th helper */
  const Th = ({ children, col, className = "" }) => (
    <th
      className={`px-6 py-3.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400 whitespace-nowrap select-none ${col ? "cursor-pointer hover:text-slate-600 transition-colors" : ""} ${className}`}
      onClick={() => col && handleSort(col)}
    >
      <span className="flex items-center gap-1">
        {children}
        {col && <SortIcon col={col} />}
      </span>
    </th>
  );

  /* ── Render ─────────────────────────────────────────────────────── */
  return (
    <div className=" font-sans w-full min-h-screen bg-slate-50/50 pb-18 text-slate-800 antialiased selection:bg-indigo-100 selection:text-indigo-900">

      {/* Page Header */}
 <PageHeader
  title="Branch Management"
  description="Manage all gym branches, revenue and performance"
  rightContent={
    <div className="flex items-center gap-3">

      {/* Export */}
      <button
        type="button"
        onClick={handleExport}
        className="
        cursor-pointer
        min-w-[145px]
        px-6
        py-2.5
        rounded-lg
        text-xs
        font-black
        uppercase
        tracking-wider
        border
        border-slate-200
        bg-white
        text-slate-600
        shadow-sm
        hover:bg-slate-50
        transition-all
        duration-200
        flex
        items-center
        justify-center
        gap-2
        "
      >
        <FiDownload size={14} />
        Export Data
      </button>

      {/* Add Branch
      <button
        type="button"
        onClick={() => {
  fetchNextCode();
  setShowModal(true);
}}
        className="
        cursor-pointer
        min-w-[170px]
        px-8
        py-2.5
        rounded-lg
        text-xs
        font-black
        uppercase
        tracking-wider
        bg-gradient-to-r
        from-[#4d3df7]
        to-[#8a3df7]
        text-white
        shadow-md
        hover:opacity-95
        active:scale-95
        transition-all
        duration-200
        flex
        items-center
        justify-center
        gap-2
        "
      >
        <FiPlus size={14} />
Add Branch
      </button> */}

    </div>
  }
/>

      <div className="w-full max-w-[1800px] mx-auto px-0 sm:px-2 lg:px-0 mt-6 sm:mt-8 space-y-6">

        {/* ── Stat Cards ─────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

          {/* Total Branches */}
          <div className="group bg-white border border-slate-100 rounded-2xl p-5 shadow-sm flex items-center justify-between h-[110px] hover:border-violet-300 hover:shadow-md hover:shadow-violet-500/5 transition-all duration-200">
            <div className="space-y-1.5">
              <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">
                Total Branches
              </p>
              <h3 className="text-2xl font-bold text-slate-900 font-mono tracking-tight">
                {stats?.totalBranches || 0}
              </h3>
              <p className="text-[11px] text-violet-500 font-medium">
                Registered
              </p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-violet-50 text-violet-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
              <FiLayers size={18} />
            </div>
          </div>

          {/* Active Branches */}
          <div className="group bg-white border border-slate-100 rounded-2xl p-5 shadow-sm flex items-center justify-between h-[110px] hover:border-emerald-300 hover:shadow-md hover:shadow-emerald-500/5 transition-all duration-200">
            <div className="space-y-1.5">
              <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">
                Active Branches
              </p>
              <h3 className="text-2xl font-bold text-slate-900 font-mono tracking-tight">
               {stats?.activeBranches || 0}
              </h3>
              <p className="text-[11px] text-emerald-500 font-medium">
                {((activeBranches / totalBranches) * 100 || 0).toFixed(0)}%
                <span className="text-slate-400"> of total</span>
              </p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
              <FiCheckCircle size={18} />
            </div>
          </div>

          {/* Total Members */}
          <div className="group bg-white border border-slate-100 rounded-2xl p-5 shadow-sm flex items-center justify-between h-[110px] hover:border-amber-300 hover:shadow-md hover:shadow-amber-500/5 transition-all duration-200">
            <div className="space-y-1.5">
              <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">
                Total Members
              </p>
              <h3 className="text-2xl font-bold text-slate-900 font-mono tracking-tight">
               {stats?.totalMembers || 0}
              </h3>
              <p className="text-[11px] text-amber-500 font-medium">
                Across all branches
              </p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
              <FiUsers size={18} />
            </div>
          </div>

          {/* Total Revenue */}
          <div className="group bg-white border border-slate-100 rounded-2xl p-5 shadow-sm flex items-center justify-between h-[110px] hover:border-cyan-300 hover:shadow-md hover:shadow-cyan-500/5 transition-all duration-200">
            <div className="space-y-1.5">
              <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">
                Total Revenue
              </p>
              <h3 className="text-2xl font-bold text-slate-900 font-mono tracking-tight">
                {fmtRev(stats?.totalRevenue || 0)}
              </h3>
              <p className="text-[11px] text-cyan-500 font-medium">
                Current collection
              </p>
            </div>
            <div className="w-11 h-11 rounded-xl bg-cyan-50 text-cyan-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
              <FiTrendingUp size={18} />
            </div>
          </div>

        </div>

 {/* ── Branch Directory Table ──────────────────────────────────────── */}
<div className="bg-white border border-slate-200/70 rounded-2xl shadow-sm overflow-hidden">

  {/* Table header bar */}
  <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
    <div>
      <h3 className="text-sm font-semibold text-slate-800 tracking-tight">
        Branch Directory
      </h3>
      <p className="text-xs text-slate-400 mt-0.5">
        Showing{" "}
        <span className="text-slate-600 font-medium">{branchFiltered.length}</span>{" "}
        of{" "}
        <span className="text-slate-600 font-medium">{totalBranches}</span>{" "}
        branches
      </p>
    </div>
    <button
      type="button"
      className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 hover:border-slate-300 text-xs font-medium text-slate-500 hover:text-slate-700 transition-all duration-150"
    >
      <FiFilter size={12} className="text-slate-400" />
      Filter
    </button>
  </div>

  {/* Table */}
  <div className="overflow-x-auto">
    <table className="w-full text-left border-collapse">
      <thead>
        <tr className="border-b border-slate-100 bg-slate-50/40">

          {/* ── Column widths fixed so heading & data stay aligned ── */}
          <th className="w-[260px] px-6 py-3 text-[11px] font-semibold uppercase tracking-wide text-slate-400 whitespace-nowrap cursor-pointer hover:text-slate-600 transition-colors select-none" onClick={() => handleSort("branchName")}>
            <span className="flex items-center gap-1">
  Branch <SortIcon col="branchName" />
</span>
          </th>
          <th className="w-[160px] px-6 py-3 text-[11px] font-semibold uppercase tracking-wide text-slate-400 whitespace-nowrap cursor-pointer hover:text-slate-600 transition-colors select-none" onClick={() => handleSort("branchCode")}>
            <span className="flex items-center gap-1">Code <SortIcon col="branchCode" /></span>
          </th>
          <th className="w-[180px] px-6 py-3 text-[11px] font-semibold uppercase tracking-wide text-slate-400 whitespace-nowrap cursor-pointer hover:text-slate-600 transition-colors select-none" onClick={() =>handleSort("ownerName")}>
            <span className="flex items-center gap-1">Manager <SortIcon col="ownerName" /></span>
          </th>
          <th className="w-[130px] px-6 py-3 text-[11px] font-semibold uppercase tracking-wide text-slate-400 whitespace-nowrap cursor-pointer hover:text-slate-600 transition-colors select-none" onClick={() => handleSort("totalMembers")}>
            <span className="flex items-center gap-1">Members <SortIcon col="totalMembers" /></span>
          </th>
          <th className="w-[160px] px-6 py-3 text-[11px] font-semibold uppercase tracking-wide text-slate-400 whitespace-nowrap cursor-pointer hover:text-slate-600 transition-colors select-none" onClick={() => handleSort("totalRevenue")}>
            <span className="flex items-center gap-1">Revenue <SortIcon col="totalRevenue" /></span>
          </th>
          <th className="w-[110px] px-6 py-3 text-[11px] font-semibold uppercase tracking-wide text-slate-400 whitespace-nowrap cursor-pointer hover:text-slate-600 transition-colors select-none" onClick={() => handleSort("status")}>
            <span className="flex items-center gap-1">Status <SortIcon col="status" /></span>
          </th>
          {/* <th className="px-6 py-3 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
  Actions
</th> */}

        </tr>
      </thead>

      <tbody className="divide-y divide-slate-100">
        {branchFiltered.map((row, idx) => (
          <tr
            key={row._id}
            className="hover:bg-slate-50/50 transition-colors duration-100 group"
          >

            {/* ── Branch (redesigned) ────────────────────────────── */}
            <td className="px-6 py-4 w-[260px]">
              <div className="flex items-center gap-3.5">

                {/* Color-tinted avatar */}
                <div
                  className="w-9 h-9 rounded-xl flex-shrink-0 flex items-center justify-center"
                  style={{ background: `${row.color || "#6366f1"}18` }}
                >
                  <span
                    className="text-sm font-bold leading-none"
                   style={{
  color: row.color || "#6366f1"
}}
                  >
                    {row.branchName?.charAt(0) || "B"}
                  </span>
                </div>

                <div className="min-w-0">
                  {/* Name + HQ badge */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-[13px] font-semibold text-slate-800 leading-tight truncate">
                      {row.branchName}
                    </p>
                    {row.branchType === "Head Branch" && (
                      <span
                        className="text-[9px] font-semibold px-1.5 py-0.5 rounded-md leading-none border flex-shrink-0"
                        style={{
                          color: row.color|| "#6366f1",
                    background: `${row.color || "#6366f1"}12`,
borderColor: `${row.color || "#6366f1"}35`,
                        }}
                      >
                        HQ
                      </span>
                    )}
                  </div>

                  {/* Location */}
                  <p className="flex items-center gap-1 text-[11px] text-slate-400 mt-0.5 leading-tight">
                    <FiMapPin size={9} className="flex-shrink-0" />
                    <span className="truncate">{[row.city, row.state].filter(Boolean).join(", ")}</span>
                  </p>
                </div>

              </div>
            </td>

            {/* ── Code ──────────────────────────────────────────── */}
            <td className="px-6 py-4 w-[160px]">
              <span className="font-mono text-[11px] text-slate-500 bg-slate-50 border border-slate-200/70 px-2 py-1 rounded-md tracking-widest">
                {row.branchCode}
              </span>
            </td>

            {/* ── Manager ───────────────────────────────────────── */}
            <td className="px-6 py-4 w-[180px]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-semibold text-slate-600 flex-shrink-0">
                  {row.ownerName?.charAt(0) || "O"}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-slate-700 group-hover:text-indigo-600 transition-colors duration-150 truncate">
                    {row.ownerName}
                  </p>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wide mt-0.5 truncate">
                 Owner
                  </p>
                </div>
              </div>
            </td>

            {/* ── Members ───────────────────────────────────────── */}
            <td className="px-6 py-4 w-[130px]">
              <p className="text-[13px] font-semibold text-slate-800 font-mono tabular-nums leading-tight">
                {row.totalMembers.toLocaleString("en-IN")}
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5">members</p>
            </td>

            {/* ── Revenue ───────────────────────────────────────── */}
            <td className="px-6 py-4 w-[160px]">
              <p className="text-[13px] font-semibold text-slate-800 font-mono tabular-nums leading-tight">
                {fmtRev(row.totalRevenue)}
              </p>
              <div className="flex items-center gap-1.5 mt-1.5">
                <div className="w-14 h-1 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700 ease-out"
                    style={{ width: `${row.pct}%`, background: row.color || "#6366f1" }}
                  />
                </div>
                <span
                  className="text-[10px] font-medium font-mono tabular-nums"
                  style={{ color: row.color }}
                >
                  {row.pct}%
                </span>
              </div>
            </td>

            {/* ── Status ────────────────────────────────────────── */}
            <td className="px-6 py-4 w-[110px]">
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wide border ${
                  row.status === "Active"
                    ? "bg-emerald-50 border-emerald-100 text-emerald-700"
                    : "bg-rose-50 border-rose-100 text-rose-600"
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                    row.status === "Active"
                      ? "bg-emerald-500 animate-pulse"
                      : "bg-rose-400"
                  }`}
                />
                {row.status}
              </span>
            </td>
            <td className="px-6 py-4">
  {/* <div className="flex items-center gap-2">

    <button
      onClick={() => handleEdit(row)}
      className="
      px-3 py-1.5
      rounded-lg
      bg-amber-50
      text-amber-600
      text-xs
      font-semibold
      hover:bg-amber-100
      transition
      "
    >
      Edit
    </button>

    <button
      onClick={() => handleDelete(row._id)}
      className="
      px-3 py-1.5
      rounded-lg
      bg-red-50
      text-red-600
      text-xs
      font-semibold
      hover:bg-red-100
      transition
      "
    >
      Delete
    </button>

  </div> */}
</td>

          </tr>
        ))}

        {/* Empty state */}
     {branchFiltered.length === 0 && (
          <tr>
            <td colSpan={7} className="px-6 py-16 text-center">
              <p className="text-sm font-semibold text-slate-600">No branches found</p>
              <p className="text-xs text-slate-400 mt-1">Try adjusting your filters.</p>
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>



</div>

        {/* ── Branch Performance ──────────────────────────────────── */}
    <div className="bg-white border border-slate-200/70 rounded-2xl shadow-sm overflow-hidden">

  <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
    <div>
      <h3 className="text-sm font-semibold text-slate-800 tracking-tight">
        Branch Performance
      </h3>
      <p className="text-xs text-slate-400 mt-0.5">
        Revenue share and members across all branches
      </p>
    </div>
 <select
  value={period}
  onChange={(e) =>
    setPeriod(e.target.value)
  }
  className="text-xs bg-white border border-slate-200 px-3 py-2 rounded-lg"
>
  <option value="thisMonth">
    This Month
  </option>

  <option value="lastMonth">
    Last Month
  </option>

  <option value="last3Months">
    Last 3 Months
  </option>
</select>
  </div>

  <div className="divide-y divide-slate-100">
   {branchFiltered.map((b, i) => (
      <div
       key={b._id}
        className="px-6 py-5 hover:bg-slate-50/60 transition-colors duration-150 group"
      >
        <div className="grid grid-cols-1 md:grid-cols-[1fr_160px_160px] gap-6 items-center">

          {/* Name + Revenue bar */}
          <div>
            <div className="flex items-center gap-2 mb-2.5">
              <span
                className="w-2.5 h-2.5 rounded-md flex-shrink-0"
                style={{ background: b.color }}
              />
              <span className="text-xs font-semibold text-slate-800 group-hover:text-indigo-600 transition-colors">
                {b.branchName}
              </span>
              {b.branchType === "Head Branch" && (
                <span
                  className="text-[9px] font-semibold px-1.5 py-0.5 rounded-md leading-none border flex-shrink-0"
                  style={{
                color:
  b.color || "#6366f1",

background:
  `${b.color || "#6366f1"}12`,

borderColor:
  `${b.color || "#6366f1"}35`,
                  }}
                >
                  HQ
                </span>
              )}
            </div>
            <div className="flex items-center gap-3">
              <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700 ease-out"
                  style={{
                    width:
`${maxRev ? (b.totalRevenue/maxRev)*100 : 0}%`,
                    background: b.color|| "#6366f1",
                  }}
                />
              </div>
              <span className="text-[10px] font-medium text-slate-400 font-mono w-9 text-right tabular-nums">
                {b.pct}%
              </span>
            </div>
          </div>

          {/* Revenue */}
          <div>
            <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider mb-1">
              Revenue
            </p>
            <p className="text-sm font-semibold text-slate-800 font-mono tabular-nums">
              {fmtRev(b.totalRevenue)}
            </p>
          </div>

          {/* Members */}
          <div>
            <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider mb-1">
              Members
            </p>
            <p className="text-sm font-semibold text-slate-800 font-mono tabular-nums">
              {b.totalMembers.toLocaleString("en-IN")}
            </p>
          </div>

        </div>
      </div>
    ))}
  </div>

</div>

      </div>

      {/* ── Add Branch Modal ────────────────────────────────────────── */}
{showModal && (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4 animate-fade-in"
    onClick={(e) => e.target === e.currentTarget && setShowModal(false)}
    role="dialog"
    aria-modal="true"
  >
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md border border-slate-100 overflow-hidden transform transition-all max-h-[calc(100vh-2rem)] flex flex-col">

      {/* Modal header */}
      <div className="flex items-start justify-between px-6 pt-5 pb-4 border-b border-slate-100 bg-gradient-to-r from-slate-50/50 to-white sticky top-0 z-10">
        <div>
          <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider">{
            editingBranch
              ? "Edit Branch"
              : "Add New Branch"
          }</h2>
          <p className="text-xs text-slate-400 mt-1 font-medium">
            Fill in the details to register a new branch.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setShowModal(false);
            setEditingBranch(null);
          }}
          className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-all duration-200"
        >
          <FiX size={16} />
        </button>
      </div>

      {/* Modal form */}
      <form onSubmit={handleAddBranch} className="px-6 py-5 space-y-4 overflow-y-auto flex-1 custom-scrollbar">

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Branch Name */}
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">
              Branch Name *
            </label>
            <input
              type="text"
              value={modalForm.name}
              onChange={handleField("name")}
              placeholder="Mugil Fitness Salem"
              className="w-full px-3.5 py-2.5 text-xs font-medium border border-slate-200 rounded-xl bg-slate-50/50 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200 outline-none"
              required
            />
          </div>

          {/* Branch Code */}
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">
              Branch Code 
            </label>
       <input
  type="text"
  value={modalForm.code}
  readOnly
  className="
    w-full px-3.5 py-2.5
    text-xs font-medium
    border border-slate-200
    rounded-xl
    bg-slate-100
    text-slate-600
  "
/>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Branch Type */}
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">
              Branch Type
            </label>
            <select
              value={modalForm.branchType}
              onChange={handleField("branchType")}
              className="w-full px-3.5 py-2.5 text-xs font-medium border border-slate-200 rounded-xl bg-slate-50/50 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200 outline-none appearance-none"
            >
              <option>Head Branch</option>
              <option>Branch</option>
            </select>
          </div>

          {/* Owner */}
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">
              Owner Name *
            </label>
            <input
              type="text"
              value={modalForm.manager}
              onChange={handleField("manager")}
              placeholder="Udhaya Suriyan"
              className="w-full px-3.5 py-2.5 text-xs font-medium border border-slate-200 rounded-xl bg-slate-50/50 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200 outline-none"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Mobile */}
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">
              Mobile
            </label>
            <input
              type="tel"
              value={modalForm.mobile}
              onChange={handleField("mobile")}
              placeholder="9876543210"
              className="w-full px-3.5 py-2.5 text-xs font-medium border border-slate-200 rounded-xl bg-slate-50/50 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200 outline-none"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">
              Email
            </label>
            <input
              type="email"
              value={modalForm.email}
              onChange={handleField("email")}
              placeholder="branch@gmail.com"
              className="w-full px-3.5 py-2.5 text-xs font-medium border border-slate-200 rounded-xl bg-slate-50/50 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200 outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">
            Address
          </label>
          <textarea
            rows="3"
            value={modalForm.address}
            onChange={handleField("address")}
            placeholder="Karuppur, Salem..."
            className="w-full px-3.5 py-2.5 text-xs font-medium border border-slate-200 rounded-xl bg-slate-50/50 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200 outline-none resize-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Opening Time */}
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">
              Opening Time
            </label>
            <input
              type="time"
              value={modalForm.openingTime}
              onChange={handleField("openingTime")}
              className="w-full px-3.5 py-2.5 text-xs font-medium border border-slate-200 rounded-xl bg-slate-50/50 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200 outline-none"
            />
          </div>

          {/* Closing Time */}
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">
              Closing Time
            </label>
            <input
              type="time"
              value={modalForm.closingTime}
              onChange={handleField("closingTime")}
              className="w-full px-3.5 py-2.5 text-xs font-medium border border-slate-200 rounded-xl bg-slate-50/50 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200 outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">
            Branch Theme Color
          </label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={modalForm.color}
              onChange={handleField("color")}
              className="w-14 h-9 border border-slate-200 rounded-xl cursor-pointer bg-white p-1 shadow-2xs"
            />
            <span className="text-[11px] font-mono font-bold text-slate-400 uppercase">{modalForm.color || "#000000"}</span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex gap-3 pt-3 border-t border-slate-100 bg-white sticky bottom-0 z-10">
          <button
            type="button"
            onClick={() => {
              setShowModal(false);
              setEditingBranch(null);
setModalForm({
  name: "",
  code: "",
  loc: "",
  manager: "",
  mobile: "",
  email: "",
  address: "",
  color: "#6366f1",
  branchType: "Branch",
  openingTime: "",
  closingTime: "",
});
            }}
            className="flex-1 py-2.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all duration-200 active:scale-[0.99]"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/20 active:scale-[0.98] transition-all duration-200"
          >
            {
              editingBranch
                ? "Update Branch"
                : "Add Branch"
            }
          </button>
        </div>

      </form>
    </div>
  </div>
)}

    </div>
  );
}

export default BranchManagement;