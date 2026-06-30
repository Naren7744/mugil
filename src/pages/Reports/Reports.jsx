import React, { useState, useEffect, useCallback } from "react";
import { useOutletContext } from "react-router-dom";
import PageHeader from "../../components/dashboard/PageHeader";
import api from "../../services/api";
import ReportModal from "../../components/common/ReportModal";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import {
  FiTrendingUp,
  FiUsers,
  FiDollarSign,
  FiDownload,
  FiCreditCard,
  FiRefreshCw,
  FiAlertTriangle,
  FiCheckCircle,
  FiLoader,
} from "react-icons/fi";

// ─── Constants ────────────────────────────────────────────────────────────────

const COLUMN_LABELS = {
  memberId: "Member ID",
  fullName: "Member Name",
  branch: "Branch",
  mobile: "Mobile",
  amountPaid: "Paid Amount",
  balanceAmount: "Balance",
  expiryDate: "Expiry Date",
  paymentMethod: "Payment Method",
  paymentMode: "Payment Mode",
  paymentDate: "Payment Date",
  ownerName: "Owner",
  branchName: "Branch Name",
  branchCode: "Branch Code",
  totalRevenue: "Branch Revenue",
  totalMembers: "Total Members",
  activeMembers: "Active Members",
  pendingAmount: "Outstanding Amount",
  status: "Status",
  amount: "Amount",
};

const HIDDEN_FIELDS = [
  "_id",
  "__v",
  "createdAt",
  "updatedAt",
  "isDeleted",
  "paymentHistory",
  "photo",
  "password",
];

const DATE_RANGE_OPTIONS = [
  { value: "today", label: "Today" },
  { value: "thisMonth", label: "This Month" },
  { value: "last3Months", label: "Last 3 Months" },
  { value: "overall", label: "Overall" },
];

const REPORT_CARDS = [
  {
    id: "DOC_01",
    name: "Payment Ledger",
    desc: "View all payments, balances and collection history.",
    icon: <FiDollarSign />,
    api: "/api/v1/reports/pending-fees",
    type: "pending-fees",
  },
  {
    id: "DOC_02",
    name: "Branch Revenue",
    desc: "Total income and pending fees for each branch.",
    icon: <FiTrendingUp />,
    api: "/api/v1/reports/branch-revenue",
    type: "branch-revenue",
  },
  {
    id: "DOC_03",
    name: "Member List",
    desc: "Full list of all members with their current status.",
    icon: <FiUsers />,
    api: "/api/v1/reports/all-members",
    type: "all-members",
  },
  {
    id: "DOC_04",
    name: "Renewals Due",
    desc: "Members whose membership expires in the next 7 days.",
    icon: <FiRefreshCw />,
    api: "/api/v1/reports/expiring-members",
    type: "expiring-members",
  },
];

const METRIC_CARDS = [
  {
    key: "expiringMembers",
    label: "Expiring Soon",
    sub: "Next 7 days",
    icon: <FiAlertTriangle size={18} />,
    color: "amber",
    api: "/api/v1/reports/expiring-members",
    title: "Expiring Members",
    format: "number",
    type: "expiring-members",
  },
  {
    key: "pendingPayments",
    label: "Pending Fees",
    sub: "Balance due",
    icon: <FiCreditCard size={18} />,
    color: "red",
    api: "/api/v1/reports/pending-fees",
    title: "Pending Fees",
    format: "currency",
    type: "pending-fees",
  },
  {
    key: "branchesReporting",
    label: "Active Branches",
    sub: "Open now",
    icon: <FiCheckCircle size={18} />,
    color: "emerald",
    api: "/api/v1/reports/active-branches",
    title: "Active Branches",
    format: "number",
    type: "active-branches",
  },
  {
    key: "todayCollection",

    label: "Collection",

    sub: (period) => {
      switch (period) {
        case "today":
          return "Today";

        case "thisMonth":
          return "This Month";

        case "last3Months":
          return "Last 3 Months";

        default:
          return "Overall";
      }
    },
    icon: <FiDollarSign size={18} />,
    color: "cyan",
    api: "/api/v1/reports/today-collection",
    title: "Collection Report",
    format: "currency",
    type: "today-collection",
  },
];

const COLOR_MAP = {
  amber: {
    border: "hover:border-amber-300",
    shadow: "hover:shadow-amber-500/5",
    icon: "bg-amber-50 text-amber-500",
    text: "text-amber-500",
  },
  red: {
    border: "hover:border-red-300",
    shadow: "hover:shadow-red-500/5",
    icon: "bg-red-50 text-red-500",
    text: "text-red-500",
  },
  emerald: {
    border: "hover:border-emerald-300",
    shadow: "hover:shadow-emerald-500/5",
    icon: "bg-emerald-50 text-emerald-500",
    text: "text-emerald-500",
  },
  cyan: {
    border: "hover:border-cyan-300",
    shadow: "hover:shadow-cyan-500/5",
    icon: "bg-cyan-50 text-sky-500",
    text: "text-cyan-500",
  },
  violet: {
    border: "hover:border-violet-300",
    shadow: "hover:shadow-violet-500/5",
    icon: "bg-violet-50 text-violet-500",
    text: "text-violet-500",
  },
  sky: {
    border: "hover:border-sky-300",
    shadow: "hover:shadow-sky-500/5",
    icon: "bg-sky-50 text-sky-500",
    text: "text-sky-500",
  },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatAmount = (amount) => {
  const num = Number(amount || 0);
  if (num >= 10_000_000)
    return `${(num / 10_000_000).toFixed(1).replace(".0", "")}Cr`;
  if (num >= 100_000) return `${(num / 100_000).toFixed(1).replace(".0", "")}L`;
  return num.toLocaleString("en-IN");
};

const formatMetricValue = (format, value) => {
  if (format === "currency") return `₹${formatAmount(value)}`;
  return value || 0;
};

// ─── Custom Chart Tooltip ─────────────────────────────────────────────────────

const ChartTooltip = ({ active, payload, label, prefix = "" }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-slate-200 rounded-2xl px-4 py-3 shadow-xl text-xs">
      <p className="font-bold text-slate-500 mb-1">{label}</p>
      {payload.map((p) => (
        <p key={p.dataKey} className="font-black" style={{ color: p.color }}>
          {prefix}
          {typeof p.value === "number"
            ? p.value.toLocaleString("en-IN")
            : p.value}
        </p>
      ))}
    </div>
  );
};

const buildSummaryBoxes = (rows, reportType, period = "today") => {
  const today = new Date();

  // ── PENDING FEES / PAYMENT LEDGER ──────────────────────────────────────────

  if (reportType === "pending-fees") {
    const totalMembers = rows.length;
    const totalPaid = rows.reduce((s, m) => s + Number(m.amountPaid || 0), 0);
    const totalPending = rows.reduce(
      (s, m) => s + Number(m.balanceAmount || 0),
      0,
    );
    // rows are already sorted by balanceAmount desc (backend: .sort({ balanceAmount: -1 }))
    const highestBalance =
      rows.length > 0 ? Number(rows[0].balanceAmount || 0) : 0;

    return [
      {
        label: "Members with Due",
        value: `${totalMembers}`,
        bgColor: [230, 241, 251],
        border: [133, 183, 235],
        label_c: [24, 95, 165],
        value_c: [12, 68, 124],
      },
      {
        label: "Collected Amount",
        value: `Rs. ${totalPaid.toLocaleString("en-IN")}`,
        bgColor: [234, 243, 222],
        border: [151, 196, 89],
        label_c: [59, 109, 17],
        value_c: [39, 80, 10],
      },
      {
        label: "Outstanding Amount",
        value: `Rs. ${totalPending.toLocaleString("en-IN")}`,
        bgColor: [252, 235, 235],
        border: [240, 149, 149],
        label_c: [163, 45, 45],
        value_c: [121, 31, 31],
      },
      {
        label: "Highest Due",
        value: `Rs. ${highestBalance.toLocaleString("en-IN")}`,
        bgColor: [250, 238, 218],
        border: [239, 159, 39],
        label_c: [133, 79, 11],
        value_c: [99, 56, 6],
      },
    ];
  }

  // ── ALL MEMBERS ────────────────────────────────────────────────────────────
  if (reportType === "all-members") {
    const totalMembers = rows.length;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const activeMembers = rows.filter((member) => {
      if (!member.expiryDate) return false;

      return new Date(member.expiryDate) >= today;
    }).length;
    const totalPaid = rows.reduce((s, m) => s + Number(m.amountPaid || 0), 0);
    const totalPending = rows.reduce(
      (s, m) => s + Number(m.balanceAmount || 0),
      0,
    );

    return [
      {
        label: "Total Members",
        value: `${totalMembers}`,
        bgColor: [230, 241, 251],
        border: [133, 183, 235],
        label_c: [24, 95, 165],
        value_c: [12, 68, 124],
      },
      {
        label: "Active Members",
        value: `${activeMembers}`,
        bgColor: [234, 243, 222],
        border: [151, 196, 89],
        label_c: [59, 109, 17],
        value_c: [39, 80, 10],
      },
      {
        label: "Collected Amount",
        value: `Rs. ${totalPaid.toLocaleString("en-IN")}`,
        bgColor: [232, 248, 244],
        border: [100, 196, 170],
        label_c: [20, 115, 90],
        value_c: [10, 80, 60],
      },
      {
        label: "Outstanding Amount",
        value: `Rs. ${totalPending.toLocaleString("en-IN")}`,
        bgColor: [252, 235, 235],
        border: [240, 149, 149],
        label_c: [163, 45, 45],
        value_c: [121, 31, 31],
      },
    ];
  }

  if (reportType === "branch-revenue" || reportType === "active-branches") {
    const totalBranches = rows.length;
    const totalMembers = rows.reduce(
      (s, b) => s + Number(b.totalMembers || 0),
      0,
    );
    const totalRevenue = rows.reduce(
      (s, b) => s + Number(b.totalRevenue || 0),
      0,
    );
    const totalPending = rows.reduce(
      (s, b) => s + Number(b.pendingAmount || 0),
      0,
    );
    const totalActive = rows.reduce(
      (s, b) => s + Number(b.activeMembers || 0),
      0,
    );

    if (reportType === "active-branches") {
      return [
        {
          label: "Total Branches",
          value: `${totalBranches}`,
          bgColor: [230, 241, 251],
          border: [133, 183, 235],
          label_c: [24, 95, 165],
          value_c: [12, 68, 124],
        },
        {
          label: "Total Members",
          value: `${totalMembers}`,
          bgColor: [234, 243, 222],
          border: [151, 196, 89],
          label_c: [59, 109, 17],
          value_c: [39, 80, 10],
        },
        {
          label: "Branch Revenue",
          value: `Rs. ${totalRevenue.toLocaleString("en-IN")}`,
          bgColor: [232, 248, 244],
          border: [100, 196, 170],
          label_c: [20, 115, 90],
          value_c: [10, 80, 60],
        },
        {
          label: "Outstanding Amount",
          value: `Rs. ${totalPending.toLocaleString("en-IN")}`,
          bgColor: [252, 235, 235],
          border: [240, 149, 149],
          label_c: [163, 45, 45],
          value_c: [121, 31, 31],
        },
      ];
    }

    // branch-revenue: has activeMembers field
    return [
      {
        label: "Total Branches",
        value: `${totalBranches}`,
        bgColor: [230, 241, 251],
        border: [133, 183, 235],
        label_c: [24, 95, 165],
        value_c: [12, 68, 124],
      },
      {
        label: "Active Members",
        value: `${totalActive}`,
        bgColor: [234, 243, 222],
        border: [151, 196, 89],
        label_c: [59, 109, 17],
        value_c: [39, 80, 10],
      },
      {
        label: "Branch Revenue",
        value: `Rs. ${totalRevenue.toLocaleString("en-IN")}`,
        bgColor: [232, 248, 244],
        border: [100, 196, 170],
        label_c: [20, 115, 90],
        value_c: [10, 80, 60],
      },
      {
        label: "Outstanding Amount",
        value: `Rs. ${totalPending.toLocaleString("en-IN")}`,
        bgColor: [252, 235, 235],
        border: [240, 149, 149],
        label_c: [163, 45, 45],
        value_c: [121, 31, 31],
      },
    ];
  }

  // ── EXPIRING MEMBERS ───────────────────────────────────────────────────────
  if (reportType === "expiring-members") {
    const totalExpiring = rows.length;

    // expiring today
    const expiringToday = rows.filter((m) => {
      if (!m.expiryDate) return false;
      const diff = Math.ceil((new Date(m.expiryDate) - today) / 86_400_000);
      return diff === 0;
    }).length;

    // expiring in 1-3 days
    const expiring3Days = rows.filter((m) => {
      if (!m.expiryDate) return false;
      const diff = Math.ceil((new Date(m.expiryDate) - today) / 86_400_000);
      return diff >= 1 && diff <= 3;
    }).length;

    // expiring in 4-7 days
    const expiring7Days = rows.filter((m) => {
      if (!m.expiryDate) return false;
      const diff = Math.ceil((new Date(m.expiryDate) - today) / 86_400_000);
      return diff >= 4 && diff <= 7;
    }).length;

    return [
      {
        label: "Expiring This Week",
        value: `${totalExpiring}`,
        bgColor: [230, 241, 251],
        border: [133, 183, 235],
        label_c: [24, 95, 165],
        value_c: [12, 68, 124],
      },
      {
        label: "Expiring Today",
        value: `${expiringToday}`,
        bgColor: [252, 235, 235],
        border: [240, 149, 149],
        label_c: [163, 45, 45],
        value_c: [121, 31, 31],
      },
      {
        label: "Next 1–3 Days",
        value: `${expiring3Days}`,
        bgColor: [250, 238, 218],
        border: [239, 159, 39],
        label_c: [133, 79, 11],
        value_c: [99, 56, 6],
      },
      {
        label: "Next 4–7 Days",
        value: `${expiring7Days}`,
        bgColor: [234, 243, 222],
        border: [151, 196, 89],
        label_c: [59, 109, 17],
        value_c: [39, 80, 10],
      },
    ];
  }

  // ── TODAY'S COLLECTION ─────────────────────────────────────────────────────
  if (reportType === "today-collection") {
    const totalTxns = rows.length;

    const totalAmount = rows.reduce(
      (sum, row) => sum + Number(row.amount || 0),
      0,
    );

    const cashTotal = rows
      .filter((row) =>
        (row.paymentMode || row.paymentMethod || "")
          .toLowerCase()
          .includes("cash"),
      )
      .reduce((sum, row) => sum + Number(row.amount || 0), 0);

    const onlineTotal = rows
      .filter(
        (row) =>
          !(row.paymentMode || row.paymentMethod || "")
            .toLowerCase()
            .includes("cash"),
      )
      .reduce((sum, row) => sum + Number(row.amount || 0), 0);

    let collectionLabel;

    switch (period) {
      case "today":
        collectionLabel = "Today's Collection";
        break;

      case "thisMonth":
        collectionLabel = "This Month Collection";
        break;

      case "last3Months":
        collectionLabel = "Last 3 Months Collection";
        break;

      default:
        collectionLabel = "Overall Collection";
    }

    return [
      {
        label: "Total Transactions",
        value: `${totalTxns}`,
        bgColor: [230, 241, 251],
        border: [133, 183, 235],
        label_c: [24, 95, 165],
        value_c: [12, 68, 124],
      },
      {
        label: collectionLabel,
        value: `Rs. ${totalAmount.toLocaleString("en-IN")}`,
        bgColor: [234, 243, 222],
        border: [151, 196, 89],
        label_c: [59, 109, 17],
        value_c: [39, 80, 10],
      },
      {
        label: "Cash",
        value: `Rs. ${cashTotal.toLocaleString("en-IN")}`,
        bgColor: [232, 248, 244],
        border: [100, 196, 170],
        label_c: [20, 115, 90],
        value_c: [10, 80, 60],
      },
      {
        label: "Online / UPI",
        value: `Rs. ${onlineTotal.toLocaleString("en-IN")}`,
        bgColor: [250, 238, 218],
        border: [239, 159, 39],
        label_c: [133, 79, 11],
        value_c: [99, 56, 6],
      },
    ];
  }
  // ── FALLBACK (generic) ─────────────────────────────────────────────────────
  const totalMembers = rows.length;
  const totalCollected = rows.reduce(
    (s, m) => s + Number(m.amountPaid || m.amount || m.totalRevenue || 0),
    0,
  );
  const totalBalance = rows.reduce(
    (s, m) => s + Number(m.balanceAmount || m.pendingAmount || 0),
    0,
  );
  const expiredCount = rows.filter(
    (m) => m.expiryDate && new Date(m.expiryDate) < today,
  ).length;

  return [
    {
      label: "Total Records",
      value: `${totalMembers}`,
      bgColor: [230, 241, 251],
      border: [133, 183, 235],
      label_c: [24, 95, 165],
      value_c: [12, 68, 124],
    },
    {
      label: "Collected Amount",
      value: `Rs. ${totalCollected.toLocaleString("en-IN")}`,
      bgColor: [234, 243, 222],
      border: [151, 196, 89],
      label_c: [59, 109, 17],
      value_c: [39, 80, 10],
    },
    {
      label: "Outstanding Amount",
      value: `Rs. ${totalBalance.toLocaleString("en-IN")}`,
      bgColor: [252, 235, 235],
      border: [240, 149, 149],
      label_c: [163, 45, 45],
      value_c: [121, 31, 31],
    },
    {
      label: "Expired",
      value: `${expiredCount}`,
      bgColor: [250, 238, 218],
      border: [239, 159, 39],
      label_c: [133, 79, 11],
      value_c: [99, 56, 6],
    },
  ];
};

// ─── PDF Generator ────────────────────────────────────────────────────────────

const buildPDF = (rows, title, branch, period, reportType = "") => {
  if (!rows.length) return;

  const doc = new jsPDF();
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();

  // ── WATERMARK ────────────────────────────────────────────────────────────────
  doc.setTextColor(241, 245, 249);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(50);
  doc.text("MUGIL & SP FITNESS", 50, 230, { angle: 45 });

  // ── HEADER ───────────────────────────────────────────────────────────────────
  doc.setFillColor(15, 23, 42);
  doc.rect(0, 0, pageW, 42, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(24);
  doc.text("MUGIL & SP FITNESS", 14, 20);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(148, 163, 184);
  doc.text("Gym Management — Member Report", 14, 30);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(255, 255, 255);
  doc.text(title.toUpperCase(), pageW - 14, 20, { align: "right" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(148, 163, 184);
  doc.text(`Date: ${new Date().toLocaleDateString("en-IN")}`, pageW - 14, 30, {
    align: "right",
  });

  // ── SECTION LABEL ─────────────────────────────────────────────────────────────
  let y = 55;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text("REPORT SUMMARY", 14, y);

  const branchLabel =
    branch === "ALL_BRANCHES" ? "All Branches" : branch || "All Branches";
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text(`Branch: ${branchLabel}   |   Period: ${period}`, 14, y + 7);

  doc.setDrawColor(226, 232, 240);
  doc.line(14, y + 11, pageW - 14, y + 11);

  // ── SUMMARY BOXES (smart per report type) ─────────────────────────────────
  y += 17;
  const boxes = buildSummaryBoxes(rows, reportType, period);

  const boxW = 42.5;
  const boxH = 24;

  boxes.forEach((box, i) => {
    const x = 14 + i * (boxW + 4);
    const cx = x + boxW / 2;

    doc.setFillColor(...box.bgColor);
    doc.setDrawColor(...box.border);
    doc.roundedRect(x, y, boxW, boxH, 3, 3, "FD");

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(...box.label_c);
    doc.text(box.label, cx, y + 9, { align: "center" });

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(...box.value_c);
    doc.text(box.value, cx, y + 18, { align: "center" });
  });

  // ── DATA TABLE ───────────────────────────────────────────────────────────────
  const hiddenFields = [...HIDDEN_FIELDS];
  const columns = Object.keys(rows[0]).filter((k) => !hiddenFields.includes(k));
  const headers = columns.map(
    (k) =>
      COLUMN_LABELS[k] ||
      k.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase()),
  );

  const body = rows.map((row) =>
    columns.map((key) => {
      const val = row[key];
      if (val === null || val === undefined) return "—";
      if (typeof val === "object") return "—";
      if (key.toLowerCase().includes("date")) {
        const d = new Date(val);
        return isNaN(d) ? String(val) : d.toLocaleDateString("en-IN");
      }
      if (
        key.toLowerCase().includes("amount") ||
        key.toLowerCase().includes("balance") ||
        key.toLowerCase().includes("revenue") ||
        key === "amount"
      ) {
        return `Rs. ${Number(val).toLocaleString("en-IN")}`;
      }
      if (typeof val === "boolean") return val ? "Yes" : "No";
      return String(val);
    }),
  );

  autoTable(doc, {
    startY: y + boxH + 8,
    head: [headers],
    body,
    headStyles: {
      fillColor: [15, 23, 42],
      textColor: [255, 255, 255],
      fontStyle: "bold",
      halign: "center",
      fontSize: 8,
    },
    bodyStyles: {
      fontSize: 8,
      textColor: [51, 65, 85],
      halign: "center",
      cellPadding: 3,
      valign: "middle",
    },
    alternateRowStyles: { fillColor: [248, 250, 252] },
    columnStyles: {
      1: { halign: "left", fontStyle: "bold" },
    },
    theme: "grid",
    margin: { left: 10, right: 10 },
    tableLineColor: [226, 232, 240],
    tableLineWidth: 0.1,
  });

  // ── FOOTER on every page ──────────────────────────────────────────────────────
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setDrawColor(226, 232, 240);
    doc.line(14, pageH - 15, pageW - 14, pageH - 15);
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(148, 163, 184);
    doc.text(`Generated: ${new Date().toLocaleString("en-IN")}`, 14, pageH - 8);
    doc.text(`Page ${i} of ${pageCount}`, pageW / 2, pageH - 8, {
      align: "center",
    });
    doc.text("Mugil SP Fitness CRM", pageW - 14, pageH - 8, { align: "right" });
  }

  doc.save(`${title.replace(/\s+/g, "_")}_${Date.now()}.pdf`);
};

// ─── Component ────────────────────────────────────────────────────────────────

function Reports() {
  const { currentBranch } = useOutletContext();

  const [dateRange, setDateRange] = useState("thisMonth");
  const [openReport, setOpenReport] = useState(false);
  const [loadingReport, setLoadingReport] = useState(false);
  const [reportTitle, setReportTitle] = useState("");
  const [reportType, setReportType] = useState("");
  const [reportData, setReportData] = useState([]);
  const [metricsLoading, setMetricsLoading] = useState(true);
  const [chartsLoading, setChartsLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState(null);

  const [metrics, setMetrics] = useState({
    totalRevenue: 0,
    pendingPayments: 0,
    activeMembers: 0,
    expiringMembers: 0,
    branchesReporting: 0,
    todayCollection: 0,
    newMembers: 0,
  });

  const [revenueOverviewData, setRevenueOverviewData] = useState([]);
  const [membershipGrowthData, setMembershipGrowthData] = useState([]);

  // ── Fetch metrics ─────────────────────────────────────────────

  const fetchDashboardMetrics = useCallback(async () => {
    setMetricsLoading(true);
    try {
      const res = await api.get("/reports/dashboard", {
        params: { branch: currentBranch, period: dateRange },
      });
      setMetrics(res.data.data);
    } catch (err) {
      console.error("Metrics error:", err);
    } finally {
      setMetricsLoading(false);
    }
  }, [currentBranch, dateRange]);

  const fetchChartData = useCallback(async () => {
    setChartsLoading(true);
    try {
      const res = await api.get("/reports/charts", {
        params: { branch: currentBranch, period: dateRange },
      });
      setRevenueOverviewData(res.data.revenueChart || []);
      setMembershipGrowthData(res.data.membershipChart || []);
    } catch (err) {
      console.error("Charts error:", err);
    } finally {
      setChartsLoading(false);
    }
  }, [currentBranch, dateRange]);

  useEffect(() => {
    fetchDashboardMetrics();
    fetchChartData();
  }, [fetchDashboardMetrics, fetchChartData]);

  // ── Open modal ────────────────────────────────────────────────────────────────
  const openReportModal = useCallback(
    async (title, endpoint, type = "") => {
      setLoadingReport(true);
      setReportTitle(title);
      setReportType(type);
      setReportData([]);
      setOpenReport(true);
      try {
        const res = await api.get(endpoint.replace("/api/v1", ""), {
          params: { branch: currentBranch, period: dateRange },
        });
        setReportData(res.data.data || []);
      } catch (err) {
        console.error("Report fetch error:", err);
        setReportData([]);
      } finally {
        setLoadingReport(false);
      }
    },
    [currentBranch, dateRange],
  );

  // ── PDF from modal ────────────────────────────────────────────────────────────
  const downloadReportPDF = useCallback(
    (rows = []) => {
      buildPDF(rows, reportTitle, currentBranch, dateRange, reportType);
    },
    [reportTitle, currentBranch, dateRange, reportType],
  );

  // ── Direct download from card ─────────────────────────────────────────────────
  const handleDownloadReport = useCallback(
    async (card) => {
      setDownloadingId(card.id);
      try {
        const res = await api.get(card.api.replace("/api/v1", ""), {
          params: { branch: currentBranch, period: dateRange },
        });
        const rows = res.data.data || [];
        if (!rows.length) {
          setReportTitle(card.name);
          setReportType(card.type || "");
          setReportData([]);
          setOpenReport(true);
          return;
        }
        buildPDF(rows, card.name, currentBranch, dateRange, card.type);
      } catch (err) {
        console.error("Download error:", err);
      } finally {
        setDownloadingId(null);
      }
    },
    [currentBranch, dateRange],
  );

  // ── Export all reports as one PDF ─────────────────────────────────────────────
  const handleMasterExport = useCallback(async () => {
    try {
      const results = await Promise.allSettled(
        REPORT_CARDS.map((c) =>
          api.get(c.api.replace("/api/v1", ""), {
            params: { branch: currentBranch, period: dateRange },
          }),
        ),
      );

      const doc = new jsPDF();
      const pageW = doc.internal.pageSize.getWidth();
      const pageH = doc.internal.pageSize.getHeight();
      let isFirst = true;

      REPORT_CARDS.forEach((card, i) => {
        if (results[i].status !== "fulfilled") return;
        const rows = results[i].value.data?.data || [];
        if (!rows.length) return;

        if (!isFirst) doc.addPage();
        isFirst = false;

        // Watermark
        doc.setTextColor(241, 245, 249);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(50);
        doc.text("MUGIL & SP FITNESS", 50, 230, { angle: 45 });

        // Header
        doc.setFillColor(15, 23, 42);
        doc.rect(0, 0, pageW, 22, "F");
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text(`MUGIL & SP FITNESS  —  ${card.name.toUpperCase()}`, 14, 14);
        doc.setFillColor(99, 102, 241);
        doc.rect(0, 22, pageW, 1.5, "F");

        const columns = Object.keys(rows[0]).filter(
          (k) => !HIDDEN_FIELDS.includes(k),
        );
        const headers = columns.map(
          (k) =>
            COLUMN_LABELS[k] ||
            k.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase()),
        );
        const body = rows.map((row) =>
          columns.map((key) => {
            const val = row[key];
            if (val === null || val === undefined) return "—";
            if (typeof val === "object") return "—";
            if (key.toLowerCase().includes("date"))
              return new Date(val).toLocaleDateString("en-IN");
            if (
              key.toLowerCase().includes("amount") ||
              key.toLowerCase().includes("revenue") ||
              key.toLowerCase().includes("balance") ||
              key === "amount"
            )
              return `Rs. ${Number(val).toLocaleString("en-IN")}`;
            if (typeof val === "boolean") return val ? "Yes" : "No";
            return String(val);
          }),
        );

        autoTable(doc, {
          startY: 30,
          head: [headers],
          body,
          headStyles: {
            fillColor: [15, 23, 42],
            textColor: 255,
            fontStyle: "bold",
            fontSize: 8,
          },
          bodyStyles: { fontSize: 8, cellPadding: 3, textColor: [51, 65, 85] },
          alternateRowStyles: { fillColor: [248, 250, 252] },
          theme: "grid",
          margin: { left: 10, right: 10 },
        });
      });

      if (isFirst) return;

      const pageCount = doc.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setDrawColor(226, 232, 240);
        doc.line(14, pageH - 15, pageW - 14, pageH - 15);
        doc.setFontSize(8);
        doc.setTextColor(148, 163, 184);
        doc.text(
          `Generated: ${new Date().toLocaleString("en-IN")}`,
          14,
          pageH - 8,
        );
        doc.text(`Page ${i} of ${pageCount}`, pageW - 14, pageH - 8, {
          align: "right",
        });
      }

      doc.save(`Full_Report_${dateRange}_${Date.now()}.pdf`);
    } catch (err) {
      console.error("Master export error:", err);
    }
  }, [currentBranch, dateRange]);

  return (
    <>
      <div className="w-full text-slate-800 font-sans min-h-screen pb-20 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-slate-100 via-slate-50 to-indigo-50/20 select-none">
        <PageHeader
          title="Reports"
          description="View member data, track payments and download PDF reports."
          rightContent={
            <div className="flex items-center gap-2">
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="cursor-pointer min-w-[150px] px-4 py-2.5 rounded-lg text-xs font-black uppercase tracking-wider border border-slate-200 bg-white text-slate-600 shadow-sm hover:bg-slate-50 transition-all outline-none"
              >
                {DATE_RANGE_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>

              <button
                onClick={handleMasterExport}
                type="button"
                className="cursor-pointer min-w-[160px] px-6 py-2.5 rounded-lg text-xs font-black uppercase tracking-wider bg-gradient-to-r from-[#4d3df7] to-[#8a3df7] text-white shadow-md hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <FiDownload size={14} />
                Download All
              </button>
            </div>
          }
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {METRIC_CARDS.map((card) => {
            const c = COLOR_MAP[card.color];
            const displayValue = formatMetricValue(
              card.format,
              metrics?.[card.key],
            );
            const subText =
              typeof card.sub === "function"
                ? card.key === "totalRevenue"
                  ? card.sub(metrics)
                  : card.sub(dateRange)
                : card.sub;

            return (
              <div
                key={card.key}
                onClick={() => openReportModal(card.title, card.api, card.type)}
                className={`group bg-white border border-slate-100 rounded-2xl p-5 shadow-sm flex items-center justify-between h-[110px] ${c.border} hover:shadow-md ${c.shadow} transition-all duration-200 cursor-pointer`}
              >
                <div className="space-y-1.5">
                  <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider whitespace-nowrap">
                    {typeof card.label === "function"
                      ? card.label(dateRange)
                      : card.label}
                  </p>
                  <h3 className="text-2xl font-bold text-slate-900 font-mono tracking-tight">
                    {metricsLoading ? (
                      <span className="inline-block w-16 h-7 bg-slate-100 rounded animate-pulse" />
                    ) : (
                      displayValue
                    )}
                  </h3>
                  <p className={`text-[11px] font-medium ${c.text}`}>
                    {subText}
                  </p>
                </div>
                <div
                  className={`w-11 h-11 rounded-xl ${c.icon} flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}
                >
                  {card.icon}
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-10 mb-10">
          {/* Revenue chart */}
          <div className="bg-gradient-to-b from-white to-slate-50/50 border border-slate-200/70 rounded-[1.5rem] p-7 shadow-sm hover:shadow-lg transition-all duration-500 space-y-5  min-w-0">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-widest bg-slate-100/80 px-2.5 py-1 rounded-md inline-block">
                  {dateRange === "today"
                    ? "Today's Revenue"
                    : dateRange === "thisMonth"
                      ? "This Month Revenue"
                      : dateRange === "last3Months"
                        ? "Last 3 Months Revenue"
                        : "Overall Revenue"}
                </h4>
                <div className="flex items-center gap-4 text-[11px] font-semibold text-slate-400 mt-3">
                  <span className="flex items-center gap-2 text-slate-600">
                    <span className="w-3 h-1 bg-[#6366f1] rounded-full" />
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="w-3 h-0.5 bg-slate-300 rounded-full" />
                  </span>
                </div>
              </div>
              <span className="text-[9px] uppercase font-black text-indigo-600 tracking-wider bg-indigo-50/80 border border-indigo-100 rounded-xl px-3 py-1.5">
                Live
              </span>
            </div>

            <div className="h-56 w-full" style={{ minWidth: 0 }}>
              {chartsLoading ? (
                <div className="h-full flex items-center justify-center">
                  <div className="w-8 h-8 rounded-full border-4 border-slate-200 border-t-indigo-500 animate-spin" />
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={224}>
                  <LineChart
                    data={revenueOverviewData}
                    margin={{ top: 8, right: 5, left: -20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis
                      dataKey="day"
                      tick={{ fontSize: 10, fill: "#94a3b8", fontWeight: 700 }}
                      axisLine={false}
                      tickLine={false}
                      dy={10}
                    />
                    <YAxis
                      tick={{ fontSize: 10, fill: "#94a3b8", fontWeight: 700 }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}K`}
                    />
                    <Tooltip content={<ChartTooltip prefix="₹" />} />
                    <Line
                      type="monotone"
                      dataKey="thisWeek"
                      stroke="#6366f1"
                      strokeWidth={3}
                      dot={{
                        r: 4,
                        fill: "#6366f1",
                        stroke: "#fff",
                        strokeWidth: 2,
                      }}
                      activeDot={{ r: 6, strokeWidth: 0, fill: "#4f46e5" }}
                    />
                    <Line
                      type="monotone"
                      dataKey="lastWeek"
                      stroke="#cbd5e1"
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          <div className="bg-gradient-to-b from-white to-slate-50/50 border border-slate-200/70 rounded-[1.5rem] p-7 shadow-sm hover:shadow-lg transition-all duration-500 space-y-5">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-widest bg-slate-100/80 px-2.5 py-1 rounded-md inline-block">
                  {dateRange === "today"
                    ? "Today's Membership"
                    : dateRange === "thisMonth"
                      ? "This Month Membership"
                      : dateRange === "last3Months"
                        ? "Last 3 Months Membership"
                        : "Overall Membership"}
                </h4>
                <div className="flex items-center gap-4 text-[11px] font-semibold text-slate-400 mt-3">
                  <span className="flex items-center gap-2 text-slate-600">
                    <span className="w-3 h-2.5 bg-[#6366f1] rounded-sm" />{" "}
                    Active
                  </span>
                  <span className="flex items-center gap-2 text-slate-600">
                    <span className="w-3 h-1 bg-emerald-500 rounded-full" /> New
                  </span>
                </div>
              </div>
              <span className="text-[9px] uppercase font-black text-emerald-600 tracking-wider bg-emerald-50/80 border border-emerald-100 rounded-xl px-3 py-1.5">
                Live
              </span>
            </div>

            <div className="w-full h-56 min-w-0 min-h-[224px]">
              {chartsLoading ? (
                <div className="h-full flex items-center justify-center">
                  <div className="w-8 h-8 rounded-full border-4 border-slate-200 border-t-emerald-500 animate-spin" />
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={224}>
                  <BarChart
                    data={membershipGrowthData}
                    margin={{ top: 8, right: 5, left: -20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis
                      dataKey="day"
                      tick={{ fontSize: 10, fill: "#94a3b8", fontWeight: 700 }}
                      axisLine={false}
                      tickLine={false}
                      dy={10}
                    />
                    <YAxis
                      tick={{ fontSize: 10, fill: "#94a3b8", fontWeight: 700 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip content={<ChartTooltip />} />
                    <Bar
                      dataKey="totalMembers"
                      fill="#6366f1"
                      radius={[6, 6, 0, 0]}
                      barSize={10}
                    />
                    <Line
                      type="monotone"
                      dataKey="newMembers"
                      stroke="#10b981"
                      strokeWidth={2.5}
                      dot={{
                        r: 3,
                        fill: "#10b981",
                        stroke: "#fff",
                        strokeWidth: 1,
                      }}
                    />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-slate-50/60 border border-slate-200/50 rounded-[1rem] p-5">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-3 bg-sky-500 rounded-full" />
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.15em]">
                  Download Reports
                </h3>
              </div>
              <p className="text-[11px] text-slate-400 font-semibold tracking-wide">
                Click Preview to view data first, or Download PDF to save
                directly.
              </p>
            </div>
            <div className="flex items-center gap-3 bg-white border border-slate-200/60 rounded-xl px-3.5 py-1.5">
              <span className="text-[9px] uppercase font-black text-slate-400 tracking-wider font-mono">
                Period
              </span>
              <span className="h-3 w-[1px] bg-slate-200" />
              <span className="text-[10px] font-mono font-black text-sky-600">
                {dateRange}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {REPORT_CARDS.map((card) => {
              const isDownloading = downloadingId === card.id;
              return (
                <div
                  key={card.id}
                  className="group bg-white border border-slate-200/70 hover:border-sky-400/60 rounded-[1.5rem] p-6 shadow-sm hover:shadow-xl hover:shadow-sky-500/5 flex flex-col justify-between min-h-[190px] transition-all duration-500"
                >
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200/60 text-slate-600 flex items-center justify-center text-base transition-all group-hover:bg-sky-500 group-hover:text-white group-hover:border-sky-500">
                        {card.icon}
                      </div>
                      <span className="text-[9px] font-mono font-black tracking-widest text-slate-400 bg-slate-50 border border-slate-200/40 px-2 py-0.5 rounded-md">
                        {card.id}
                      </span>
                    </div>
                    <div className="space-y-1.5">
                      <h4 className="text-xs font-black text-slate-900 uppercase tracking-wide group-hover:text-sky-600 transition-colors">
                        {card.name}
                      </h4>
                      <p className="text-[11px] text-slate-400 font-semibold leading-relaxed">
                        {card.desc}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between gap-4">
                    <button
                      onClick={() =>
                        openReportModal(card.name, card.api, card.type)
                      }
                      type="button"
                      className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-sky-600 transition-colors cursor-pointer"
                    >
                      Preview →
                    </button>
                    <button
                      onClick={() => handleDownloadReport(card)}
                      disabled={isDownloading}
                      type="button"
                      className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 active:scale-[0.96] flex items-center gap-2 ${
                        isDownloading
                          ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                          : "bg-slate-900 hover:bg-sky-500 text-white shadow-sm hover:shadow-md hover:shadow-sky-500/20 cursor-pointer"
                      }`}
                    >
                      {isDownloading ? (
                        <>
                          <FiLoader size={12} className="animate-spin" />{" "}
                          Generating...
                        </>
                      ) : (
                        <>
                          <FiDownload size={12} /> Download PDF
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <ReportModal
        open={openReport}
        onClose={() => setOpenReport(false)}
        title={reportTitle}
        data={reportData}
        loading={loadingReport}
        onDownload={downloadReportPDF}
      />
    </>
  );
}

export default Reports;
