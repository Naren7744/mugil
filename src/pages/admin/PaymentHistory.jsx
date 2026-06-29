import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../services/api";
import PageHeader from "../../components/dashboard/PageHeader";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  FiDownload,
  FiFileText,
  FiCalendar,
  FiBarChart2,
  FiFilter,
    FiCreditCard,
  FiDollarSign,
  FiSmartphone
} from "react-icons/fi";
function PaymentHistory() {

  const { memberId } = useParams();
  const [member, setMember] = useState(null);
const [loading, setLoading] = useState(true);
const [showExportMenu, setShowExportMenu] =
useState(false);

useEffect(() => {
  fetchMember();
}, [memberId]);


const fetchMember = async () => {
  try {

   const res = await api.get(
  `/members/${memberId}`
)
    setMember(res.data.data);

  } catch (error) {
    console.error(error);
  } finally {
    setLoading(false);
  }
};

const generatePaymentPDF = (payments, reportTitle, fileName) => {
  const doc = new jsPDF();

  // ==========================================
  // 1. YOUR ORIGINAL LOGIC (UNCHANGED)
  // ==========================================
  const totalCollected = payments.reduce(
    (sum, p) => sum + Number(p.amount || 0),
    0
  );

const progress =
member.totalAmount > 0
? Math.round(
(member.amountPaid/member.totalAmount)*100
)
:0;

  const cashTotal = payments
    .filter((p) => p.paymentMethod === "Cash")
    .reduce((sum, p) => sum + Number(p.amount || 0), 0);

  const upiTotal = payments
    .filter((p) => p.paymentMethod === "UPI")
    .reduce((sum, p) => sum + Number(p.amount || 0), 0);

  const cardTotal = payments
    .filter((p) => p.paymentMethod === "Card")
    .reduce((sum, p) => sum + Number(p.amount || 0), 0);


  // ==========================================
  // 2. PREMIUM CLASSIC PDF DESIGN LAYOUT
  // ==========================================

  // ===== HEADER SECTION =====
  // Classic Dark Slate Header
  doc.setFillColor(15, 23, 42); 
  doc.rect(0, 0, 210, 42, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(24);
  doc.text("MUGIL FITNESS", 14, 20);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(148, 163, 184); // Soft Slate text
  doc.text("Official Payment Record", 14, 28);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(255, 255, 255);
  doc.text(reportTitle.toUpperCase(), 196, 20, { align: "right" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(148, 163, 184);
  doc.text(`Date: ${new Date().toLocaleDateString("en-IN")}`, 196, 28, { align: "right" });

  // ===== WATERMARK (Very subtle & placed behind) =====
  doc.setTextColor(248, 250, 252); // Ultra light gray to prevent text clash
  doc.setFont("helvetica", "bold");
  doc.setFontSize(70);
  doc.text("MUGIL FITNESS", 30, 200, { angle: 45 });


  // ===== MEMBER DETAILS SECTION =====
  let currentY = 55;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42); // Darker slate for premium contrast
  doc.text("MEMBER PROFILE", 14, currentY);

  doc.setDrawColor(226, 232, 240); // Clean divider line
  doc.line(14, currentY + 4, 196, currentY + 4);

  currentY += 12;
  doc.setFontSize(10);
  
  // Left Column Labels
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 116, 139); 
  doc.text("Name:", 14, currentY);
  doc.text("Mobile:", 14, currentY + 8);
  doc.text("Plan:", 14, currentY + 16);

  // Left Column Values (X-axis increased to prevent overlap)
  doc.setFont("helvetica", "bold");
  doc.setTextColor(30, 41, 59);
  doc.text(member.fullName || "-", 35, currentY);
  doc.text(member.mobile || "-", 35, currentY + 8);
  doc.text(member.planType || "-", 35, currentY + 16);

  // Right Column Labels (X-axis adjusted for spacing)
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 116, 139);
  doc.text("Member ID:", 115, currentY);
  doc.text("Branch:", 115, currentY + 8);
  doc.text("Status:", 115, currentY + 16);

  // Right Column Values
  doc.setFont("helvetica", "bold");
  doc.setTextColor(30, 41, 59);
  doc.text(member.memberId || "-", 145, currentY);
  doc.text(member.branch || "-", 145, currentY + 8);
  doc.text(member.paymentStatus || "-", 145, currentY + 16);


  // ===== FINANCIAL SUMMARY CARDS =====
  currentY = 94;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text("FINANCIAL OVERVIEW", 14, currentY);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(77, 61, 247); 
  doc.text(`Completion: ${progress}%`, 196, currentY, { align: "right" });

  doc.setDrawColor(226, 232, 240);
  doc.line(14, currentY + 4, 196, currentY + 4);

  currentY += 10;
  
  // Create 3 premium boxes
  doc.setFillColor(248, 250, 252); 
  doc.setDrawColor(226, 232, 240); 
  
  doc.roundedRect(14, currentY, 57, 24, 3, 3, "FD"); // Total Box
  doc.roundedRect(75, currentY, 57, 24, 3, 3, "FD"); // Paid Box
  doc.roundedRect(136, currentY, 60, 24, 3, 3, "FD"); // Balance Box

  // Total Box Content
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text("Total Fee", 42.5, currentY + 8, { align: "center" });
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(30, 41, 59);
  doc.text(`Rs. ${Number(member.totalAmount || 0).toLocaleString("en-IN")}`, 42.5, currentY + 16, { align: "center" });

  // Paid Box Content
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text(`Paid (${payments.length} Txns)`, 103.5, currentY + 8, { align: "center" });
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(16, 185, 129); // Premium Green
  doc.text(`Rs. ${Number(member.amountPaid || 0).toLocaleString("en-IN")}`, 103.5, currentY + 16, { align: "center" });

  // Balance Box Content
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text("Balance Due", 166, currentY + 8, { align: "center" });
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(244, 63, 94); // Premium Red
  doc.text(`Rs. ${Number(member.balanceAmount || 0).toLocaleString("en-IN")}`, 166, currentY + 16, { align: "center" });

  // ===== PAYMENT MODES BREAKDOWN STRIP =====
  currentY += 30;
  doc.setFillColor(241, 245, 249); // Clean Gray Strip
  doc.roundedRect(14, currentY, 182, 14, 2, 2, "F");

  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(100, 116, 139);
  doc.text("MODE BREAKDOWN:", 18, currentY + 9);

  // Properly spaced to avoid overlaps
  doc.setTextColor(30, 41, 59);
  doc.text(`Cash: Rs. ${cashTotal.toLocaleString("en-IN")}`, 58, currentY + 9);
  doc.text(`UPI: Rs. ${upiTotal.toLocaleString("en-IN")}`, 95, currentY + 9);
  doc.text(`Card: Rs. ${cardTotal.toLocaleString("en-IN")}`, 130, currentY + 9);


  // ===== DATA TABLE (Classic Look) =====
  autoTable(doc, {
    startY: currentY + 22,
    head: [["Txn ID", "Date", "Time", "Amount", "Method", "Collected By", "Note"]],
    headStyles: {
      fillColor: [15, 23, 42], // Match Header Dark Slate for Classic Look
      textColor: [255, 255, 255],
      fontStyle: "bold",
      halign: "center",
      fontSize: 9,
    },
    bodyStyles: {
      fontSize: 9,
      textColor: [51, 65, 85],
      halign: "center",
      cellPadding: 4,
      valign: "middle"
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252] 
    },
    columnStyles: {
      3: { fontStyle: "bold", halign: "right" }, // Amount Right Aligned
      6: { halign: "left" } // Notes Left Aligned
    },
    body: payments.map((payment, index) => [
      payment.receiptNo || "OLD-TXN",
      new Date(payment.paymentDate).toLocaleDateString("en-IN"),
      new Date(payment.paymentDate).toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit"
      }),
      `Rs. ${Number(payment.amount || 0).toLocaleString("en-IN")}`,
      payment.paymentMethod || "-",
      payment.collectedBy || "Admin",
      payment.note || "-"
    ]),
  });

  // ===== FOOTER =====
  const pageHeight = doc.internal.pageSize.height;
  
  doc.setDrawColor(226, 232, 240); // Classic clean line
  doc.line(14, pageHeight - 15, 196, pageHeight - 15);

  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(148, 163, 184); 
  doc.text(`Generated On: ${new Date().toLocaleString("en-IN")}`, 14, pageHeight - 8);
  doc.text("Mugil Fitness & SP Fitness ", 196, pageHeight - 8, { align: "right" });

  // Save the PDF
  doc.save(fileName);
};
const exportPDF = () => {

  generatePaymentPDF(
    member.paymentHistory || [],
    "Full Payment History Report",
    `${member.memberId}-Payment-History.pdf`
  );

};
const exportMonthPDF = () => {

  const currentMonth =
    new Date().getMonth();

  const currentYear =
    new Date().getFullYear();

  const monthPayments =
    member.paymentHistory?.filter(
      (payment) => {

        const date =
          new Date(payment.paymentDate);

        return (
          date.getMonth() === currentMonth &&
          date.getFullYear() === currentYear
        );

      }
    ) || [];

  generatePaymentPDF(
    monthPayments,
    "Monthly Payment Report",
    `${member.memberId}-Month-Report.pdf`
  );

};

const exportYearPDF = () => {

  const currentYear =
    new Date().getFullYear();

  const yearPayments =
    member.paymentHistory?.filter(
      (payment) => {

        const date =
          new Date(payment.paymentDate);

        return (
          date.getFullYear() === currentYear
        );

      }
    ) || [];

  generatePaymentPDF(
    yearPayments,
    "Yearly Payment Report",
    `${member.memberId}-Year-Report.pdf`
  );

};

if (loading) {
  return (
    <div className="p-6">
      Loading...
    </div>
  );
}
if (!member) {
  return (
    <div className="p-6">
      Member Not Found
    </div>
  );
}

const totalCollected =
member.paymentHistory?.reduce(
  (sum, p) => sum + Number(p.amount || 0),
  0
) || 0;

const progress =
member.totalAmount > 0
? Math.round(
(member.amountPaid/member.totalAmount)*100
)
:0;

const daysLeft =
member.expiryDate
? Math.max(
0,
Math.ceil(
(new Date(member.expiryDate)-new Date())/
(1000*60*60*24)
)
)
:0;

const reversedPayments =
  [...(member.paymentHistory || [])].reverse();




return (
    <>

<div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6 font-sans">

  <PageHeader
    title="Payment History"
    description="Track member payments, collected amounts and balance details."
  />

<div className="relative">

<button
  onClick={() =>
    setShowExportMenu(!showExportMenu)
  }
  className="
  cursor-pointer
  min-w-[145px]
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
  transition-all
  duration-200
  flex
  items-center
  justify-center
  gap-2
  "
>
  <FiDownload size={14}/>
  Export PDF
</button>

  {showExportMenu && (

    <div
      className="
      absolute
      right-0
      top-14
      w-72
      bg-white
      rounded-2xl
      shadow-2xl
      border
      border-slate-200
      z-50
      overflow-hidden
      "
    >

      <div className="px-4 py-3 border-b bg-slate-50">
        <p className="text-xs font-black text-slate-500 uppercase tracking-widest">
          Export Options
        </p>
      </div>

      <button
        onClick={() => {
          exportPDF();
          setShowExportMenu(false);
        }}
        className="
        w-full
        flex items-center gap-3
        px-4 py-3
        text-left
        hover:bg-violet-50
        transition-all
        "
      >
        <FiFileText
          size={16}
          className="text-violet-600"
        />

        <div>
          <p className="text-sm font-bold text-slate-800">
            Full History
          </p>

          <p className="text-[11px] text-slate-400">
            Export complete payment history
          </p>
        </div>
      </button>

      <button
        onClick={() => {
          exportMonthPDF();
          setShowExportMenu(false);
        }}
        className="
        w-full
        flex items-center gap-3
        px-4 py-3
        text-left
        hover:bg-violet-50
        transition-all
        "
      >
        <FiCalendar
          size={16}
          className="text-blue-600"
        />

        <div>
          <p className="text-sm font-bold text-slate-800">
            This Month
          </p>

          <p className="text-[11px] text-slate-400">
            Export current month report
          </p>
        </div>
      </button>

      <button
        onClick={() => {
          exportYearPDF();
          setShowExportMenu(false);
        }}
        className="
        w-full
        flex items-center gap-3
        px-4 py-3
        text-left
        hover:bg-violet-50
        transition-all
        "
      >
        <FiBarChart2
          size={16}
          className="text-emerald-600"
        />

        <div>
          <p className="text-sm font-bold text-slate-800">
            This Year
          </p>

          <p className="text-[11px] text-slate-400">
            Export yearly report
          </p>
        </div>
      </button>

      <button
        onClick={() => {
          alert(
            "Date Range Export Coming Soon"
          );
        }}
        className="
        w-full
        flex items-center gap-3
        px-4 py-3
        text-left
        hover:bg-violet-50
        transition-all
        border-t
        "
      >
        <FiFilter
          size={16}
          className="text-amber-600"
        />

        <div>
          <p className="text-sm font-bold text-slate-800">
            Date Range
          </p>

          <p className="text-[11px] text-slate-400">
            Export custom date report
          </p>
        </div>
      </button>

    </div>

  )}

</div>

</div>
    
<div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-[#1e1b4b] to-[#020617] rounded-[32px] p-8 sm:p-10 text-white shadow-[0_20px_60px_-15px_rgba(30,27,75,0.8)] border border-white/10 group">

  {/* Premium Ambient Glow Effects */}
  <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#4d3df7]/20 rounded-full blur-[100px] pointer-events-none -translate-y-1/2 translate-x-1/3 transition-all duration-700 group-hover:bg-[#4d3df7]/30" />
  <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none translate-y-1/3 -translate-x-1/4" />

  <div className="relative z-10">
    <div className="flex flex-col lg:flex-row justify-between gap-8 items-start lg:items-center">
      
      {/* Identity & Metadata Segment */}
      <div className="space-y-6">
        
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight mb-4">
            {member.fullName}
          </h1>

          {/* Clean Inline Metadata */}
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <p className="text-indigo-200/80 text-[11px] font-bold uppercase tracking-widest flex items-center gap-1.5">
              Mobile : <span className="text-white font-mono">{member.mobile}</span>
            </p>
            <div className="w-1 h-1 rounded-full bg-indigo-500/50 hidden sm:block"></div>
            <p className="text-indigo-200/80 text-[11px] font-bold uppercase tracking-widest flex items-center gap-1.5">
              Branch : <span className="text-white">{member.branch}</span>
            </p>
            <div className="w-1 h-1 rounded-full bg-indigo-500/50 hidden sm:block"></div>
            <p className="text-indigo-200/80 text-[11px] font-bold uppercase tracking-widest flex items-center gap-1.5">
              Joined : <span className="text-white">{member.joinDate
  ? new Date(member.joinDate).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
  : "-"
}</span>
            </p>
          </div>
        </div>

        {/* Glassmorphism Tags */}
        <div className="flex flex-wrap gap-3">
          <span className="px-3.5 py-1.5 bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 transition-colors rounded-[12px] text-xs font-black uppercase tracking-widest text-indigo-50 shadow-sm">
            ID : {member.memberId}
          </span>
          <span className="px-3.5 py-1.5 bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 transition-colors rounded-[12px] text-xs font-black uppercase tracking-widest text-indigo-50 shadow-sm">
            {member.planType}
          </span>
          <span className="px-3.5 py-1.5 bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 transition-colors rounded-[12px] text-xs font-black uppercase tracking-widest text-indigo-50 shadow-sm">
            {member.duration}
          </span>
        </div>

      </div>

      {/* Premium Status Node */}
      <div className="w-full lg:w-auto bg-white/5 backdrop-blur-xl border border-white/10 p-5 sm:p-6 rounded-[24px] shadow-lg shrink-0 flex flex-col justify-center">
        <p className="text-indigo-200/70 text-[10px] font-black uppercase tracking-widest mb-3 text-left lg:text-right">
          Status
        </p>
        <span
          className={`
            inline-flex items-center justify-center px-5 py-3 rounded-[14px] text-[11px] font-black uppercase tracking-widest border shadow-inner transition-all
            ${
              member.paymentStatus === "Fully Paid"
                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-emerald-500/5"
                : "bg-amber-500/10 text-amber-400 border-amber-500/20 shadow-amber-500/5"
            }
          `}
        >
          {/* Subtle Indicator Dot */}
          <span className={`w-1.5 h-1.5 rounded-full mr-2 shrink-0 ${member.paymentStatus === "Fully Paid" ? "bg-emerald-400" : "bg-amber-400 animate-pulse"}`}></span>
          {member.paymentStatus}
        </span>
      </div>

    </div>
  </div>

</div>

<div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mt-6">

  {/* Card 1: Total Fee */}
  <div className="bg-white border border-slate-200/60 rounded-[24px] p-5 sm:p-6 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-300 flex flex-col justify-between group">
    <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1.5">
      Total Fee
    </p>
    <h3 className="text-3xl font-black text-slate-900 font-mono tracking-tighter">
      ₹{member.totalAmount}
    </h3>
  </div>

  {/* Card 2: Paid Amount */}
  <div className="bg-white border border-emerald-100/80 rounded-[24px] p-5 sm:p-6 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all duration-300 flex flex-col justify-between relative overflow-hidden group">
    <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
    <div className="relative z-10">
      <p className="text-emerald-600/70 text-[10px] font-black uppercase tracking-widest mb-1.5">
        Paid Amount
      </p>
      <h3 className="text-3xl font-black text-emerald-600 font-mono tracking-tighter group-hover:scale-105 origin-left transition-transform duration-300">
        ₹{member.amountPaid}
      </h3>
    </div>
  </div>

  {/* Card 3: Balance */}
  <div className="bg-white border border-rose-100/80 rounded-[24px] p-5 sm:p-6 shadow-sm hover:shadow-md hover:border-rose-200 transition-all duration-300 flex flex-col justify-between relative overflow-hidden group">
    <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
    <div className="relative z-10">
      <p className="text-rose-400/80 text-[10px] font-black uppercase tracking-widest mb-1.5">
        Balance
      </p>
      <h3 className="text-3xl font-black text-rose-500 font-mono tracking-tighter group-hover:scale-105 origin-left transition-transform duration-300">
        ₹{member.balanceAmount}
      </h3>
    </div>
  </div>

  {/* Card 4: Payments */}
  <div className="bg-white border border-indigo-100/80 rounded-[24px] p-5 sm:p-6 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all duration-300 flex flex-col justify-between relative overflow-hidden group">
    <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
    <div className="relative z-10">
      <p className="text-indigo-400/80 text-[10px] font-black uppercase tracking-widest mb-1.5">
        Payments
      </p>
      <h3 className="text-3xl font-black text-[#4d3df7] font-mono tracking-tighter group-hover:scale-105 origin-left transition-transform duration-300">
        {member.paymentHistory?.length || 0}
      </h3>
    </div>
  </div>

</div>
<div className="bg-white border border-slate-200/60 rounded-[28px] p-6 sm:p-8 shadow-sm mt-6">

  <h2 className="text-lg font-black text-slate-900 tracking-tight mb-6">
    Member Details
  </h2>

  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

    {/* Mobile */}
    <div className="bg-slate-50/60 border border-slate-100 rounded-[20px] p-5 hover:bg-slate-50 hover:border-slate-200 transition-all duration-300">
      <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1.5">
        Mobile
      </p>
      <p className="text-base font-black text-slate-800 font-mono">
        {member.mobile}
      </p>
    </div>

    {/* Branch */}
    <div className="bg-slate-50/60 border border-slate-100 rounded-[20px] p-5 hover:bg-slate-50 hover:border-slate-200 transition-all duration-300">
      <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1.5">
        Branch
      </p>
      <p className="text-base font-black text-slate-800">
        {member.branch}
      </p>
    </div>

    {/* Join Date */}
    <div className="bg-slate-50/60 border border-slate-100 rounded-[20px] p-5 hover:bg-slate-50 hover:border-slate-200 transition-all duration-300">
      <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1.5">
        Join Date
      </p>
      <p className="text-base font-black text-slate-800">
        {member.joinDate
  ? new Date(member.joinDate).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
  : "-"
}
      </p>
    </div>

    {/* Expiry Date */}
    <div className="bg-slate-50/60 border border-slate-100 rounded-[20px] p-5 hover:bg-slate-50 hover:border-slate-200 transition-all duration-300">
      <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1.5">
        Expiry Date
      </p>
      <p className="text-base font-black text-slate-800">
        {member.expiryDate
  ? new Date(member.expiryDate).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
  : "-"
}
      </p>
    </div>

  </div>

</div>
<div className="bg-white border border-slate-200/60 rounded-[28px] p-6 sm:p-8 shadow-sm mt-6">
  
  <div className="flex justify-between items-end mb-4">
    <h2 className="text-lg font-black text-slate-900 tracking-tight">
      Payment Progress
    </h2>
    <span className="text-3xl font-black text-[#4d3df7] font-mono tracking-tighter leading-none">
      {progress}%
    </span>
  </div>

  <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden mb-4">
    <div
      className="h-full bg-gradient-to-r from-[#4d3df7] to-indigo-400 rounded-full relative transition-all duration-1000 ease-out"
      style={{
        width: `${progress}%`,
      }}
    >
      {/* Subtle Shimmer Effect inside progress bar */}
      <div className="absolute inset-0 bg-white/20 w-full h-full animate-[shimmer_2s_infinite]" />
    </div>
  </div>

  <div className="flex justify-between items-center">
    <div className="flex flex-col">
      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">
        Paid
      </span>
      <span className="text-sm font-black text-emerald-500 font-mono">
        ₹{member.amountPaid}
      </span>
    </div>
    
    <div className="flex flex-col text-right">
      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">
        Total
      </span>
      <span className="text-sm font-black text-slate-900 font-mono">
        ₹{member.totalAmount}
      </span>
    </div>
  </div>

</div>
<div className="bg-white border border-slate-200/60 rounded-[28px] p-6 sm:p-8 shadow-sm mt-6">

  <h2 className="text-lg font-black text-slate-900 tracking-tight mb-6">
    Membership Summary
  </h2>

  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">

    {/* Plan */}
    <div className="bg-slate-50/60 border border-slate-100 rounded-[20px] p-5 hover:bg-slate-50 hover:border-slate-200 transition-all duration-300">
      <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1.5">
        Plan
      </p>
      <p className="text-base font-black text-slate-800">
        {member.planType}
      </p>
    </div>

    {/* Duration */}
    <div className="bg-slate-50/60 border border-slate-100 rounded-[20px] p-5 hover:bg-slate-50 hover:border-slate-200 transition-all duration-300">
      <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1.5">
        Duration
      </p>
      <p className="text-base font-black text-slate-800">
        {member.duration}
      </p>
    </div>

    {/* Trainer */}
    <div className="bg-slate-50/60 border border-slate-100 rounded-[20px] p-5 hover:bg-slate-50 hover:border-slate-200 transition-all duration-300">
      <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1.5">
        Trainer
      </p>
      <p className="text-base font-black text-slate-800">
        {member.trainerAssigned}
      </p>
    </div>

    {/* Goal */}
    <div className="bg-slate-50/60 border border-slate-100 rounded-[20px] p-5 hover:bg-slate-50 hover:border-slate-200 transition-all duration-300">
      <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1.5">
        Goal
      </p>
      <p className="text-base font-black text-slate-800">
        {member.fitnessGoal}
      </p>
    </div>

    {/* Days Left (Highlighted Specially) */}
    <div className="bg-indigo-50/50 border border-indigo-100/80 rounded-[20px] p-5 hover:bg-indigo-50 hover:border-indigo-200 transition-all duration-300">
      <p className="text-indigo-400/80 text-[10px] font-black uppercase tracking-widest mb-1.5">
        Days Left
      </p>
      <p className="text-base font-black text-[#4d3df7]">
        {daysLeft}
      </p>
    </div>

  </div>

</div>

<div className="bg-white rounded-3xl p-6 shadow-sm border mt-6">

  <h2 className="text-xl font-black mb-5">
    Payment Timeline
  </h2>

  <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-sidebar-scroll">

  {reversedPayments.length > 0 ? (

  reversedPayments.map((payment, index) => {


    return (

          <div
            key={index}
            className="
            relative
            bg-gradient-to-r
            from-white
            to-slate-50
            border
            border-slate-200
            rounded-3xl
            p-5
            shadow-sm
            hover:shadow-lg
            transition-all
            "
          >

            <div className="flex justify-between items-start">
<div
  className="
  w-14 h-14
  rounded-2xl
  bg-gradient-to-br
  from-violet-50
  to-indigo-100
  flex items-center
  justify-center
  shadow-sm
  border
  border-violet-100
  "
>
  {payment.paymentMethod === "UPI" ? (
    <FiSmartphone
      size={24}
      className="text-violet-600"
    />
  ) : payment.paymentMethod === "Card" ? (
    <FiCreditCard
      size={24}
      className="text-blue-600"
    />
  ) : (
    <FiDollarSign
      size={24}
      className="text-emerald-600"
    />
  )}
</div>

              <span
                className="
                bg-emerald-50
                text-emerald-600
                px-3 py-1
                rounded-xl
                text-xs
                font-bold
                "
              >
                Received
              </span>

            </div>

            <div className="grid md:grid-cols-3 gap-4 mt-5">

              <div>
                <p className="text-xs text-slate-400">
                  Date
                </p>

                <p className="font-bold">
                  {new Date(
                    payment.paymentDate
                  ).toLocaleDateString("en-IN")}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-400">
                  Time
                </p>

                <p className="font-bold">
                  {new Date(
                    payment.paymentDate
                  ).toLocaleTimeString("en-IN")}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-400">
                  Collected By
                </p>

                <p className="font-bold">
                  {payment.collectedBy || "Admin"}
                </p>
              </div>

            </div>

           <div className="grid md:grid-cols-3 gap-4 mt-4">

              <div>
                <p className="text-xs text-slate-400">
                  Transaction No
                </p>

<p className="font-mono font-black">
 {payment.receiptNo || "OLD-TXN"}
</p>
              </div>

          <div>
  <p className="text-xs text-slate-400">
    Payment Amount
  </p>

  <p className="font-black text-emerald-600">
    ₹{Number(payment.amount).toLocaleString("en-IN")}
  </p>
</div>

<div>
  <p className="text-xs text-slate-400">
    Balance After Payment
  </p>

  <p className="font-black text-red-500">
    ₹{Number(
payment.balanceAfterPayment || 0
).toLocaleString("en-IN")}
  </p>
</div>

            </div>

            {payment.note && (

              <div
                className="
                mt-4
                bg-slate-100
                rounded-2xl
                p-3
                "
              >
                <p className="text-xs text-slate-400 mb-1">
                  Note
                </p>

                <p className="text-sm">
                  {payment.note}
                </p>
              </div>

            )}

                  </div>

        );

      })

) : (

  <div className="text-center py-10 text-slate-500">
    No Payment History Found
  </div>

)}

  </div>

</div>

</>


  );
}

export default PaymentHistory;