import React, { useState, useEffect ,useRef} from "react";
import { useOutletContext } from "react-router-dom";
import api from "../../services/api";
import PageHeader from "../../components/dashboard/PageHeader";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import TablePagination from "../../components/common/TablePagination";
import { useSearchParams } from "react-router-dom";


import { 
  ResponsiveContainer, AreaChart, Area, LineChart, Line, XAxis, Tooltip, PieChart, Pie, Cell, BarChart, Bar 
} from "recharts";
import { 
  FiDollarSign, FiClock, FiCheckCircle, FiAlertCircle, FiSearch, 
  FiFilter, FiDownload, FiFileText, FiPlus, FiMoreVertical, 
  FiCreditCard, FiSmartphone, FiMapPin, FiSend, FiCalendar, FiChevronDown
} from "react-icons/fi";

function FeeManagement() {
  const navigate = useNavigate();

  const [showHistoryModal, setShowHistoryModal] =
  useState(false);

const [historyMember, setHistoryMember] =
  useState(null);
  const [branchFilter, setBranchFilter] =
  useState("ALL");

const [statusFilter, setStatusFilter] =
  useState("ALL");

const [modeFilter, setModeFilter] =
  useState("ALL");

const [dateFilter, setDateFilter] =
  useState("THIS_MONTH");
  const { currentBranch, searchQuery } = useOutletContext();
  const [transactions, setTransactions] = useState([]);
  useEffect(() => {
  fetchMembers();
}, []);

const [memberSearch, setMemberSearch] =
  useState("");

  const [showReportMenu, setShowReportMenu] =
useState(false);

const [searchParams] = useSearchParams();

const formatAmount = (val) => {
  const n = Number(val || 0);
  if (n >= 1_00_00_000) return `₹${(n / 1_00_00_000).toFixed(2)}Cr`;
  if (n >= 1_00_000)    return `₹${(n / 1_00_000).toFixed(2)}L`;
  return `₹${n.toLocaleString("en-IN")}`;  // ← 1L கீழ normal ₹ amount
}
  



const fetchMembers = async () => {
  try {
  const res = await api.get("/members");

    setTransactions(res.data.data);
  }catch(error){
 console.error(
   "Failed to fetch members:",
   error
 );
}
};


useEffect(() => {
  const view = searchParams.get("view");

  if (view === "PENDING") {
    setStatusFilter("Balance Pending");
  }

  if (view === "PAID") {
    setStatusFilter("Fully Paid");
  }
}, [searchParams]);
const [selectedMember, setSelectedMember] =
  useState(null);

const [showCollectModal, setShowCollectModal] =
  useState(false);

const [paymentForm, setPaymentForm] =
  useState({
    amount: "",
    paymentMethod: "Cash",
    note: "",
  });


const paymentData = transactions.map((member) => {

  const latestPayment =
    member.paymentHistory?.at(-1);

  const latestPaymentDate =
    latestPayment?.paymentDate;

return {
  ...member,

  branch: member.branch,

  name: member.fullName || "Unknown Member",

  id: member.memberId || "-",

  phone: member.mobile || "-",

  plan: member.planType || "-",

  duration: member.duration || "-",

  branchName:
    member.branch === "MUGIL_FITNESS"
      ? "Mugil Fitness"
      : "SP Fitness",

    mode:
      latestPayment?.paymentMethod ||
      member.paymentMethod ||
      "Unknown",

    date:
      latestPaymentDate
        ? new Date(
            latestPaymentDate
          ).toLocaleDateString(
            "en-IN"
          )
        : "-",

    time:
      latestPaymentDate
        ? new Date(
            latestPaymentDate
          ).toLocaleTimeString(
            "en-IN",
            {
              hour: "2-digit",
              minute: "2-digit",
            }
          )
        : "-",

    status:
      member.paymentStatus,

    latestPaymentAmount:
      latestPayment?.amount || 0,

    latestReceiptNo:
      latestPayment?.receiptNo || "-",
  };

});

const now = new Date();

const filteredTx = paymentData.filter((t) => {

  const matchesBranch =
    branchFilter === "ALL" ||
    t.branch === branchFilter;

    const matchesCurrentBranch =
  currentBranch === "ALL_BRANCHES"
    ? true
    : t.branch === currentBranch;

  const matchesStatus =
    statusFilter === "ALL" ||
    t.status === statusFilter;

  const matchesMode =
    modeFilter === "ALL" ||
    t.mode === modeFilter;

const search = (searchQuery || "").toLowerCase();

const matchesSearch =
  t.name?.toLowerCase().includes(search) ||
  t.id?.toLowerCase().includes(search) ||
  t.phone?.toLowerCase().includes(search);

  const originalMember = transactions.find(
    (m) => m._id === t._id
  );

const txDate =
new Date(
originalMember?.paymentHistory?.at(-1)?.paymentDate
||
originalMember?.createdAt
);

  const now = new Date();

  let matchesDate = true;

  if (dateFilter === "TODAY") {
    matchesDate =
      txDate.toDateString() ===
      now.toDateString();
  }

  if (dateFilter === "THIS_WEEK") {
    const weekAgo = new Date();
    weekAgo.setDate(now.getDate() - 7);

    matchesDate =
      txDate >= weekAgo;
  }

  if (dateFilter === "THIS_MONTH") {
    matchesDate =
      txDate.getMonth() === now.getMonth() &&
      txDate.getFullYear() === now.getFullYear();
  }

  if (dateFilter === "THIS_YEAR") {
    matchesDate =
      txDate.getFullYear() ===
      now.getFullYear();
  }

return (
  matchesBranch &&
  matchesCurrentBranch &&
  matchesStatus &&
  matchesMode &&
  matchesSearch &&
  matchesDate
);
});




const totalCollectionSpark =
transactions.slice(-7).map((member) => ({
  v:
    member.paymentHistory?.reduce(
      (sum, payment) =>
        sum + Number(payment.amount || 0),
      0
    ) || 0,
}));

const pendingCollectionSpark =
transactions.slice(-7).map((m, index) => ({
  v: Number(m.balanceAmount || 0),
}));

const todayCollectionSpark =
transactions.slice(-7).map((m) => ({
  v:
    m.paymentHistory?.reduce(
      (sum, p) => sum + Number(p.amount || 0),
      0
    ) || 0,
}));


const handleCollect = (member) => {
  setSelectedMember(member);

  setPaymentForm({
    amount: "",
    paymentMethod: "Cash",
    note: "",
  });

 navigate(
  `/admin/payments/collect/${member._id}`
);
};
const renderStatus = (status) => {
  switch (status) {
    case "Fully Paid":
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-emerald-50 text-emerald-600 text-xs font-bold">
          Fully Paid
        </span>
      );

    case "Balance Pending":
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-amber-50 text-amber-600 text-xs font-bold">
          Pending
        </span>
      );

    default:
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-slate-50 text-slate-600 text-xs font-bold">
          {status}
        </span>
      );
  }
};


const totalCollection =
transactions.reduce(
  (sum, member) =>
    sum +
    (
      member.paymentHistory?.reduce(
        (pSum, payment) =>
          pSum + Number(payment.amount || 0),
        0
      ) || 0
    ),
  0
);

const pendingCollection =
transactions.reduce(
  (sum, member) =>
    sum +
    Number(member.balanceAmount || 0),
  0
);

const overdueMembers = transactions.filter((member) => {
  if (!member.expiryDate) return false;
  const daysLeft = Math.ceil(
    (new Date(member.expiryDate) - new Date()) / (1000 * 60 * 60 * 24)
  );
  return daysLeft < 0 && daysLeft >= -180; 
}).length;

const todayCollection =
transactions.reduce((sum, member) => {

  const todayPayments =
    member.paymentHistory
      ?.filter(payment =>
        new Date(payment.paymentDate)
          .toDateString() ===
        new Date().toDateString()
      )
      ?.reduce(
        (pSum, payment) =>
          pSum + Number(payment.amount || 0),
        0
      ) || 0;

  return sum + todayPayments;

}, 0);

  const currentMonth = new Date().getMonth();
const currentYear = new Date().getFullYear();

const thisMonthCollection =
transactions.reduce(
(sum, member) => {

 const monthPayments =
(
 member.paymentHistory
 ?.filter(payment => {

   const date =
   new Date(payment.paymentDate);

   return (
     date.getMonth() === currentMonth &&
     date.getFullYear() === currentYear
   );

 })
 ?.reduce(
   (pSum, payment) =>
     pSum + Number(payment.amount || 0),
   0
 ) || 0
)

 return sum + monthPayments;

}, 0);

const previousMonth = new Date();
const currentPending =
transactions
.filter(
 member =>
 member.paymentStatus ===
 "Balance Pending"
)
.reduce(
 (sum, member) =>
 sum +
 Number(member.balanceAmount || 0),
 0
);
previousMonth.setMonth(
  previousMonth.getMonth() - 1
);

const previousMonthCollection =
transactions.reduce(
(sum, member) => {

const monthPayments =
(
member.paymentHistory
?.filter(payment => {

const date =
new Date(payment.paymentDate);

return (
date.getMonth() ===
previousMonth.getMonth()

&&

date.getFullYear() ===
previousMonth.getFullYear()
);

})
?.reduce(
(pSum, payment) =>
pSum + Number(payment.amount || 0),
0
) || 0
);

return sum + monthPayments;

}, 0);

const collectionGrowth =
previousMonthCollection > 0

? (
(
thisMonthCollection -
previousMonthCollection
)

/

previousMonthCollection

* 100
).toFixed(1)

: thisMonthCollection > 0
? 100
: 0;
const previousMonthPending =
transactions
.filter(member => {

 if (
   member.paymentStatus !==
   "Balance Pending"
 ) return false;

if (!member.expiryDate)
  return false;

const expiryDate =
 new Date(member.expiryDate);

return (
 expiryDate.getMonth() ===
 previousMonth.getMonth()
 &&
 expiryDate.getFullYear() ===
 previousMonth.getFullYear()
);

})
.reduce(
(sum, member) =>
sum +
Number(member.balanceAmount || 0),
0
);

const pendingGrowth =
previousMonthPending > 0
? (
(
currentPending -
previousMonthPending
)
/
previousMonthPending
* 100
).toFixed(1)
: currentPending > 0
? 100
: 0;

const yesterdayCollection =
transactions.reduce((sum, member) => {

const yesterday = new Date();
yesterday.setDate(
yesterday.getDate() - 1
);

const amount =
member.paymentHistory
?.filter(payment => {

const date =
new Date(payment.paymentDate);

return (
date.toDateString() ===
yesterday.toDateString()
);

})
?.reduce(
(pSum, payment) =>
pSum + Number(payment.amount || 0),
0
) || 0;

return sum + amount;

}, 0);

const todayGrowth =
yesterdayCollection > 0

? (
(
todayCollection -
yesterdayCollection
)
/
yesterdayCollection
*
100
).toFixed(1)

: todayCollection > 0
? 100
: 0;

const lastWeekOverdue =
transactions.filter(member => {

if (!member.expiryDate)
return false;

const weekAgo = new Date();
weekAgo.setDate(
weekAgo.getDate() - 7
);

return (
new Date(member.expiryDate) <
weekAgo
);

}).length;
const overdueDifference =
overdueMembers -
lastWeekOverdue;




  const fullyPaidMembers = transactions.filter(
  (member) =>
    member.paymentStatus === "Fully Paid"
).length;

const pendingMembers = transactions.filter(
  (member) =>
    member.paymentStatus === "Balance Pending"
).length;

const generateReportPDF = (members, reportTitle, fileName) => {
  const doc = new jsPDF();

  const totalMembers = members.length;

const totalCollected = members.reduce(
  (sum, member) =>
    sum +
    (
      member.paymentHistory?.reduce(
        (pSum, payment) =>
          pSum + Number(payment.amount || 0),
        0
      ) || 0
    ),
  0
);

  const totalBalance = members.reduce(
    (sum, m) => sum + Number(m.balanceAmount || 0),
    0
  );

  const fullyPaid = members.filter(
    (m) => m.paymentStatus === "Fully Paid"
  ).length;

  const expiredMembers = members.filter((m) => {
    if (!m.expiryDate) return false;
    return new Date(m.expiryDate) < new Date();
  }).length;

  doc.setFillColor(15, 23, 42); 
  doc.rect(0, 0, 210, 42, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(24);
  doc.text("MUGIL & SP FITNESS", 14, 20);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(148, 163, 184); // Soft Slate text
  doc.text("Official Master Ledger", 14, 28);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(255, 255, 255);
  doc.text(reportTitle.toUpperCase(), 196, 20, { align: "right" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(148, 163, 184);
  doc.text(`Date: ${new Date().toLocaleDateString("en-IN")}`, 196, 28, { align: "right" });

  doc.setTextColor(241, 245, 249); 
  doc.setFont("helvetica", "bold");
  doc.setFontSize(50); 
  // X: 45, Y: 220 ensures it starts bottom-left and perfectly spans to top-right
  doc.text("MUGIL & SP FITNESS", 50, 230, { angle: 45 });


  let currentY = 55;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text("LEDGER OVERVIEW", 14, currentY);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(16, 185, 129); 
  doc.text(`Fully Paid Members: ${fullyPaid}`, 196, currentY, { align: "right" });

  doc.setDrawColor(226, 232, 240); 
  doc.line(14, currentY + 4, 196, currentY + 4);

  currentY += 10;
  
  doc.setFillColor(248, 250, 252); 
  doc.setDrawColor(226, 232, 240); 
  
  doc.roundedRect(14, currentY, 42.5, 24, 3, 3, "FD");    // Members Box
  doc.roundedRect(60.5, currentY, 42.5, 24, 3, 3, "FD");  // Collected Box
  doc.roundedRect(107, currentY, 42.5, 24, 3, 3, "FD");   // Balance Box
  doc.roundedRect(153.5, currentY, 42.5, 24, 3, 3, "FD"); // Expired Box

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text("Total Members", 35.25, currentY + 8, { align: "center" });
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(30, 41, 59);
  doc.text(`${totalMembers}`, 35.25, currentY + 16, { align: "center" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text(" Total Collected", 81.75, currentY + 8, { align: "center" });
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(16, 185, 129); // Premium Green
  doc.text(`Rs. ${totalCollected.toLocaleString("en-IN")}`, 81.75, currentY + 16, { align: "center" });

  // 3. Balance Box Content
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text("Total Pending", 128.25, currentY + 8, { align: "center" });
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(244, 63, 94); // Premium Rose
  doc.text(`Rs. ${totalBalance.toLocaleString("en-IN")}`, 128.25, currentY + 16, { align: "center" });

  // 4. Expired Box Content
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text("Total Expired", 174.75, currentY + 8, { align: "center" });
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(245, 158, 11); // Premium Amber/Orange
  doc.text(`${expiredMembers}`, 174.75, currentY + 16, { align: "center" });

  currentY += 35;

  // ===== DATA TABLE =====
  autoTable(doc, {
    startY: currentY,
    head: [["Member ID", "Name", "Branch", "Paid Amount", "Balance", "Status"]],
    headStyles: {
      fillColor: [15, 23, 42],
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
      1: { halign: "left", fontStyle: "bold" },
      3: { fontStyle: "bold", textColor: [16, 185, 129], halign: "right" },
      4: { fontStyle: "bold", textColor: [244, 63, 94], halign: "right" }
    },
    body: members.map((member) => [
      member.memberId || "-",
      member.fullName || "-",
      member.branch || "-",
      `Rs. ${
(
member.paymentHistory?.reduce(
(sum,p)=>sum+Number(p.amount||0),
0
) || 0
).toLocaleString("en-IN")
}`,
      `Rs. ${Number(member.balanceAmount || 0).toLocaleString("en-IN")}`,
      member.paymentStatus || "-"
    ]),
  });

  // ===== FOOTER =====
  const pageHeight = doc.internal.pageSize.height;
  
  doc.setDrawColor(226, 232, 240);
  doc.line(14, pageHeight - 15, 196, pageHeight - 15);

  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(148, 163, 184); 
  doc.text(`Generated On: ${new Date().toLocaleString("en-IN")}`, 14, pageHeight - 8);
  doc.text("Mugil Fitness CRM Console", 196, pageHeight - 8, { align: "right" });

  // Save the PDF
  doc.save(fileName);
};


// ==========================================
// EXPORT TRIGGERS
// ==========================================
const exportFullPDF = () => {
  generateReportPDF(
    transactions,
    "Full Report",
    "Full-Report.pdf"
  );
};

const export30DaysPDF = () => {

  const cutoffDate = new Date();

  cutoffDate.setDate(
    cutoffDate.getDate() - 30
  );

  const filtered =
    transactions.filter(member => {

      return member.paymentHistory?.some(
        payment =>
          new Date(payment.paymentDate)
          >= cutoffDate
      );

    });

generateReportPDF(
  filtered,
  "Last 30 Days Report",
  "30-Days-Report.pdf",
  
);
};

const export60DaysPDF = () => {

  const cutoffDate = new Date();

  cutoffDate.setDate(
    cutoffDate.getDate() - 60
  );

  const filtered =
    transactions.filter(member => {

      return member.paymentHistory?.some(
        payment =>
          new Date(payment.paymentDate)
          >= cutoffDate
      );

    });

generateReportPDF(
  filtered,
  "Last 60 Days Report",
  "60-Days-Report.pdf",
  
);
};

const savePayment = async () => {

  if (!selectedMember) {
    alert("Select Member First");
    return;
  }

  if (!paymentForm.amount || Number(paymentForm.amount) <= 0) {
    alert("Enter valid amount");
    return;
  }
  try {
  await api.put(
`/members/collect-payment/${selectedMember._id}`,
{
        amount:
          Number(paymentForm.amount),

        paymentMethod:
          paymentForm.paymentMethod,

        note:
          paymentForm.note,

        collectedBy: "Admin",
      }
    );

   await fetchMembers();

    setShowCollectModal(false);
    alert("Payment Collected Successfully");

    setPaymentForm({
      amount: "",
      paymentMethod: "Cash",
      note: "",
    });

  } catch (error) {
    console.error(error);
  }
};
const tableScrollRef = useRef(null);

const handleTableDragScroll = (e) => {
  const slider = tableScrollRef.current;

  if (!slider) return;

  const startX = e.pageX - slider.offsetLeft;
  const scrollLeft = slider.scrollLeft;

  const handleMouseMove = (e) => {
    const x = e.pageX - slider.offsetLeft;
    const walk = (x - startX) * 2;
    slider.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => {
    document.removeEventListener(
      "mousemove",
      handleMouseMove
    );
    document.removeEventListener(
      "mouseup",
      handleMouseUp
    );
  };

  document.addEventListener(
    "mousemove",
    handleMouseMove
  );

  document.addEventListener(
    "mouseup",
    handleMouseUp
  );
};

const [currentPage, setCurrentPage] =
  useState(1);

const itemsPerPage = 10;

const indexOfLastItem =
  currentPage * itemsPerPage;

const indexOfFirstItem =
  indexOfLastItem - itemsPerPage;

const paginatedTx =
  filteredTx.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

const totalPages = Math.ceil(
  filteredTx.length / itemsPerPage
);

  return (
    <>
    <div className="w-full text-slate-800 animate-fade-in select-none font-sans min-h-screen pb-12 bg-slate-50/50 max-w-full overflow-hidden">
      
      <PageHeader
        title="Fee Management"
        description="Track all payments, collections, and financial transactions globally."
        rightContent={
<div className="flex flex-wrap items-center gap-3 mt-4 sm:mt-0">

 
<div className="relative">

<button
onClick={() =>
setShowReportMenu(!showReportMenu)
}
className="
hidden sm:flex
cursor-pointer
min-w-[120px]
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
items-center
justify-center
gap-2
"
>
<FiFileText size={14}/>
Report
</button>
{showReportMenu && (

<div className="
absolute
top-14
right-0
w-72
bg-white
rounded-2xl
shadow-2xl
border
border-slate-200
z-50
overflow-hidden
">

<button
onClick={()=>{
export30DaysPDF();
setShowReportMenu(false);
}}
className="
w-full
text-left
px-4 py-3
hover:bg-violet-50
"
>
Last 30 Days Report
</button>

<button
onClick={()=>{
export60DaysPDF();
setShowReportMenu(false);
}}
className="
w-full
text-left
px-4 py-3
hover:bg-violet-50
"
>
Last 60 Days Report
</button>

<button
onClick={()=>{
exportFullPDF();
setShowReportMenu(false);
}}
className="
w-full
text-left
px-4 py-3
hover:bg-violet-50
"
>
Full Report
</button>

</div>

)}
</div>

  <button
    type="button"
    onClick={() => navigate("/admin/payments/collect")}
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
    Add Payment
  </button>

</div>
        }
      />   

      {/* ================= 📊 STAGE 1: FINANCIAL HUB HIGHLIGHT METRICS ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6 mt-2">
        {/* Metric 1 */}
        <div  className=" bg-white border border-slate-200/60 rounded-[15px] p-5 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all duration-300 flex flex-col justify-between h-[130px] group relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
          <div className="flex justify-between items-start relative z-10">
            <div className="flex gap-3">
              <div className="w-12 h-12 rounded-[16px] bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-300 shrink-0">
                <FiDollarSign size={20} strokeWidth={2.5}/>
              </div>
              <div>
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-0.5">Total Collection</p>
                <h3 className="text-2xl font-black text-slate-900 font-mono tracking-tight group-hover:text-indigo-600 transition-colors">{formatAmount(totalCollection)}</h3>
              </div>
            </div>
          
          </div>
          <div className="text-[10px] font-black text-emerald-500 tracking-wide mt-auto">{
Number(collectionGrowth) > 0
? `↑ ${collectionGrowth}%`
: Number(collectionGrowth) < 0
? `↓ ${Math.abs(collectionGrowth)}%`
: `0%`
}<span className="text-slate-400 font-semibold tracking-normal">from last month</span></div>
        </div>

        {/* Metric 2 */}
        <div   onClick={() => {
    setStatusFilter("Balance Pending");
    setCurrentPage(1);
  }} className="  cursor-pointer bg-white border border-slate-200/60 rounded-[15px] p-5 shadow-sm hover:shadow-md hover:border-amber-200 transition-all duration-300 flex flex-col justify-between h-[130px] group relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
          <div className="flex justify-between items-start relative z-10">
            <div className="flex gap-3">
              <div className="w-12 h-12 rounded-[16px] bg-amber-50 text-amber-600 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-300 shrink-0">
                <FiClock size={20} strokeWidth={2.5}/>
              </div>
              <div>
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-0.5">Pending Collection</p>
                <h3 className="text-2xl font-black text-slate-900 font-mono tracking-tight group-hover:text-amber-600 transition-colors">₹{pendingCollection.toLocaleString()}</h3>
              </div>
            </div>
          
          </div>
          <div className={`text-[10px] font-black tracking-wide mt-auto ${
  Number(pendingGrowth) > 0
    ? "text-red-500"
    : "text-emerald-500"
}`}>{
Number(pendingGrowth) > 0
? `↑ ${pendingGrowth}%`
: Number(pendingGrowth) < 0
? `↓ ${Math.abs(pendingGrowth)}%`
: `0%`
}<span className="text-slate-400 font-semibold tracking-normal">from last month</span></div>
        </div>

        {/* Metric 3 */}
        <div   onClick={() => {
    setDateFilter("TODAY");
    setCurrentPage(1);
  }} className="  cursor-pointer bg-white border border-slate-200/60 rounded-[15px] p-5 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all duration-300 flex flex-col justify-between h-[130px] group relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
          <div className="flex justify-between items-start relative z-10">
            <div className="flex gap-3">
              <div className="w-12 h-12 rounded-[16px] bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-300 shrink-0">
                <FiCheckCircle size={20} strokeWidth={2.5}/>
              </div>
              <div>
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-0.5">Today's Collection</p>
                <h3 className="text-2xl font-black text-slate-900 font-mono tracking-tight group-hover:text-emerald-600 transition-colors">₹{todayCollection.toLocaleString()}</h3>
              </div>
            </div>
          
          </div>
          <div className="text-[10px] font-black text-emerald-500 tracking-wide mt-auto">{
Number(todayGrowth) > 0
? `↑ ${todayGrowth}%`
: Number(todayGrowth) < 0
? `↓ ${Math.abs(todayGrowth)}%`
: `0%`
}<span className="text-slate-400 font-semibold tracking-normal">from yesterday</span></div>
        </div>

        {/* Metric 4 */}
        <div onClick={() =>
  navigate("/admin/members/overview?view=EXPIRED")
}className="  cursor-pointer bg-white border border-slate-200/60 rounded-[15px] p-5 shadow-sm hover:shadow-md hover:border-rose-200 transition-all duration-300 flex flex-col justify-between h-[130px] group relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
          <div className="flex justify-between items-start relative z-10">
            <div className="flex gap-3">
              <div className="w-12 h-12 rounded-[16px] bg-rose-50 text-rose-600 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-300 shrink-0">
                <FiAlertCircle size={20} strokeWidth={2.5}/>
              </div>
              <div>
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-0.5">Overdue Members</p>
                <h3 className="text-2xl font-black text-slate-900 font-mono tracking-tight group-hover:text-rose-600 transition-colors">{overdueMembers}</h3>
              </div>
            </div>
          </div>
          <div className="text-[10px] font-black text-rose-500 tracking-wide mt-auto">{
overdueDifference >= 0
? `↑ ${overdueDifference}`
: `↓ ${Math.abs(overdueDifference)}`
} <span className="text-slate-400 font-semibold tracking-normal">from last week</span></div>
        </div>
      </div>

      {/* ================= 📋 STAGE 2: ENTERPRISE DATA GRID ================= */}
      <div className="bg-white border border-slate-200/60 rounded-[15px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden flex flex-col w-full max-w-full">
        
        {/* Smart CRM Toolbar */}
        <div className="p-5 sm:p-6 border-b border-slate-100 flex flex-col xl:flex-row items-start xl:items-center gap-4 justify-between bg-slate-50/30">
          


  {/* <div className="bg-violet-50 border border-violet-100 rounded-2xl px-4 py-3">
    <p className="text-[10px] text-violet-500 font-bold uppercase">
      Members
    </p>

    <h3 className="text-lg font-black text-violet-700">
      {filteredTx.length}
    </h3>
  </div> */}
<div className="w-full flex flex-wrap items-center justify-between gap-4">

  <div>
    <h3 className="text-xl font-black text-slate-900">
    Payment Records
    </h3>

    <p className="text-sm text-slate-500">
   {filteredTx
  .reduce(
    (sum, tx) =>
      sum +
      (
        tx.paymentHistory?.reduce(
          (paymentSum, payment) =>
            paymentSum + Number(payment.amount || 0),
          0
        ) || 0
      ),
    0
  )
  .toLocaleString("en-IN")} Collected
    </p>
  </div>

  <div className="flex gap-2">

    <div className="px-4 py-2 rounded-xl bg-violet-50 border border-violet-100">
      <span className="text-violet-700 font-black">
        {filteredTx.length}
      </span>

      <span className="text-xs ml-2">
        Members
      </span>
    </div>

    <div className="px-4 py-2 rounded-xl bg-emerald-50 border border-emerald-100">
      <span className="text-emerald-700 font-black">
        ₹
       {filteredTx
  .reduce(
    (sum, tx) =>
      sum +
      (
        tx.paymentHistory?.reduce(
          (paymentSum, payment) =>
            paymentSum + Number(payment.amount || 0),
          0
        ) || 0
      ),
    0
  )
  .toLocaleString("en-IN")}
      </span>
    </div>

  </div>

</div>
 

          

        </div>
                 <div className="flex flex-wrap items-center gap-3 bg-white border border-slate-200 rounded-2xl p-3 shadow-sm w-full xl:w-auto">
            <div className="relative">
          <select
  value={branchFilter}
  onChange={(e) => setBranchFilter(e.target.value)}
  className="appearance-none bg-white border border-slate-200/80 rounded-[14px] pl-4 pr-9 py-2.5 text-xs font-bold text-slate-600"
>
<option value="ALL">
  All Branches
</option>

<option value="MUGIL_FITNESS">
  Mugil Fitness
</option>

<option value="SP_FITNESS">
  SP Fitness
</option>
</select>
              <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={14}/>
            </div>
            
   <div className="relative">
  <select
    value={statusFilter}
    onChange={(e) => setStatusFilter(e.target.value)}
    className="appearance-none bg-white border border-slate-200/80 rounded-[14px] pl-4 pr-9 py-2.5 text-xs font-bold text-slate-600 focus:outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10 cursor-pointer shadow-sm"
  >
    <option value="ALL">All Status</option>
    <option value="Fully Paid">Fully Paid</option>
    <option value="Balance Pending">Balance Pending</option>
  </select>

  <FiChevronDown
    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
    size={14}
  />
</div>

<div className="relative hidden sm:block">
  <select
    value={modeFilter}
    onChange={(e) => setModeFilter(e.target.value)}
    className="appearance-none bg-white border border-slate-200/80 rounded-[14px] pl-4 pr-9 py-2.5 text-xs font-bold text-slate-600 focus:outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10 cursor-pointer shadow-sm"
  >
    <option value="ALL">All Modes</option>
    <option value="Cash">Cash</option>
    <option value="UPI">UPI</option>
    <option value="Card">Card</option>
  </select>

  <FiChevronDown
    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
    size={14}
  />
</div>

         <div className="relative hidden md:block">
  <select
    value={dateFilter}
    onChange={(e) => setDateFilter(e.target.value)}
    className="appearance-none bg-white border border-slate-200/80 rounded-[14px] pl-4 pr-9 py-2.5 text-xs font-bold text-slate-600 focus:outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10 cursor-pointer shadow-sm"
  >
    <option value="TODAY">Today</option>
    <option value="THIS_WEEK">This Week</option>
    <option value="THIS_MONTH">This Month</option>
    <option value="THIS_YEAR">This Year</option>
  </select>

  <FiChevronDown
    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
    size={14}
  />
</div>
<button
onClick={()=>{
setBranchFilter("ALL");
setStatusFilter("ALL");
setModeFilter("ALL");
setDateFilter("THIS_MONTH");
setCurrentPage(1);
}}
className="px-4 py-2.5 rounded-xl bg-red-50 text-red-600 font-bold text-xs"
>
Reset
</button>

     <div className="ml-auto bg-slate-900 text-white px-5 py-3 rounded-2xl">

  <span className="text-xs font-black uppercase">
    {filteredTx.length} Results
  </span>

</div>

          </div>

        {/* The Enterprise Table View */}
        <div className="w-full max-w-full overflow-hidden">
        <div
  ref={tableScrollRef}
  onMouseDown={handleTableDragScroll}
  className="
    w-full
    overflow-x-auto
    pb-2
    custom-sidebar-scroll

    select-none
  "
>
            <table className="w-full min-w-[1100px] xl:min-w-[1200px] border-collapse whitespace-nowrap text-left">
              <thead>
                <tr className="bg-gradient-to-r from-slate-50 to-white border-b border-slate-200">
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Member Name</th>
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Branch</th>
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Plan</th>
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Amount</th>
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Payment Method</th>
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Date</th>
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Status</th>
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {paginatedTx.map((tx, idx) => (
                  <tr key={tx._id} className="bg-white hover:bg-slate-50/60 transition-colors group">
                    
                    {/* MEMBER IDENTITY */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3.5">
                        <div className="w-10 h-10 rounded-[14px] bg-slate-100 text-slate-600 flex items-center justify-center font-black text-sm group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-colors shadow-sm border border-slate-200/50 shrink-0">
                          {
  tx.name
    ? tx.name.charAt(0).toUpperCase()
    : "M"
}
                        </div>
                        <div>
                          <p className="text-sm font-black text-slate-900 group-hover:text-[#4d3df7] transition-colors">{tx.name}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[10px] font-bold text-slate-400 font-mono tracking-wider">{tx.id}</span>
                            <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                            <span className="text-[10px] font-bold text-slate-400 font-mono">{tx.phone}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* BRANCH */}
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 bg-slate-50 border border-slate-200/60 px-2.5 py-1 rounded-[8px]">
                        <span className={`w-1.5 h-1.5 rounded-full ${tx.branch === "MUGIL_FITNESS" ? "bg-violet-500" : "bg-cyan-500"}`}/>
                        {tx.branchName}
                      </span>
                    </td>

                    {/* SUBSCRIPTION */}
                    <td className="px-6 py-4">
                      <p className="text-xs font-black text-slate-800">{tx.plan}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{tx.duration}</p>
                    </td>

                    {/* AMOUNT */}
                    <td className="px-6 py-4">
                      <div className="text-sm font-black text-slate-900 font-mono bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
  <p className="font-black">
    ₹{Number(tx.totalAmount || 0).toLocaleString("en-IN")}
  </p>

  <p className="text-green-600 text-[10px]">
    Paid: ₹{Number(tx.amountPaid|| 0).toLocaleString("en-IN")}
  </p>

  <p className="text-red-500 text-[10px]">
    Balance: ₹{Number(tx.balanceAmount || 0).toLocaleString("en-IN")}
  </p>
</div>
                      
                    </td>

                    {/* METHOD */}
                    <td className="px-6 py-4">
                      <span className="flex items-center gap-2 text-slate-600 text-xs font-bold">
                        <div className={`p-1.5 rounded-[8px] ${tx.mode === "UPI" ? "bg-violet-100 text-violet-600" : tx.mode === "Card" ? "bg-blue-100 text-blue-600" : "bg-emerald-100 text-emerald-600"}`}>
                          {tx.mode === "UPI" ? <FiSmartphone size={12}/> : tx.mode === "Card" ? <FiCreditCard size={12}/> : <FiDollarSign size={12}/>}
                        </div>
                        {tx.mode}
                      </span>
                    </td>

                    {/* TIMESTAMP */}
                    <td className="px-6 py-4">
                      <div className="leading-tight font-mono text-[11px] font-bold text-slate-600">
                        <p>{tx.date}</p>
                        <p className="text-slate-400 mt-0.5">{tx.time}</p>
                      </div>
                    </td>

                    {/* STATUS */}
                    <td className="px-6 py-4 text-center">
                      {renderStatus(tx.status)}
                    </td>

                    {/* MANAGE ACTIONS */}
{/* MANAGE ACTIONS */}
<td className="px-6 py-4 text-center">
  <div className="flex gap-2 justify-center">
    
    {/* ✅ FIXED: Added ID to the Collect button route */}
    <button
      onClick={() => navigate(`/admin/payments/collect/${tx._id}`)}
      className="px-3 py-1 bg-violet-600 text-white rounded-lg text-[10px] font-bold hover:bg-violet-700 shadow-sm"
    >
      Collect
    </button>

    <button
      onClick={() => navigate(`/admin/payments/history/${tx._id}`)}
      className="px-3 py-1 bg-slate-700 text-white rounded-lg text-[10px] font-bold hover:bg-slate-800 shadow-sm"
    >
      History
    </button>
    
  </div>
</td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Pagination Console Footer */}
   <TablePagination
  currentPage={currentPage}
  totalPages={totalPages}
  totalItems={filteredTx.length}
  startItem={
    filteredTx.length > 0
      ? indexOfFirstItem + 1
      : 0
  }
  endItem={Math.min(
    indexOfLastItem,
    filteredTx.length
  )}
  setCurrentPage={setCurrentPage}
/>

      </div>

    
    
    </div>


</>

    
    
  );
  
}

export default FeeManagement;