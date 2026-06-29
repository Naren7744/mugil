import React, { useState, useEffect ,useRef} from "react";
import { useOutletContext, useLocation } from "react-router-dom";
import PageHeader from "../../components/dashboard/PageHeader";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import TablePagination from "../../components/common/TablePagination";
import { 
  FiUsers, FiActivity, FiAlertCircle, FiClock, FiSearch, 
  FiUserPlus, FiEye, FiX, FiPhone, FiCalendar, FiCheckCircle, 
  FiFileText, FiChevronDown, FiFilter, FiEdit2, FiTrash2, FiMoreVertical ,FiDollarSign
} from "react-icons/fi";

function Members() {
  const navigate = useNavigate();
  
  const {
    currentBranch,
    searchQuery,
    setSearchQuery
  } = useOutletContext();
  const location = useLocation();


  const [statusFilter, setStatusFilter] = useState("All");
  const [memberView, setMemberView] = useState("ALL");
  const [allMembers, setAllMembers] = useState([]);


  useEffect(() => {
  fetchMembers();
}, []);

const fetchMembers = async () => {
  try {
       const res = await api.get("/members");

    setAllMembers(res.data.data);

  } catch (error) {
   console.error(error);

setAllMembers([]);
  }
};

function calculateDaysLeft(
  expiryDate
) {
  if (!expiryDate) return 0;

  const today = new Date();
  today.setHours(0,0,0,0);

  const expiry = new Date(
    expiryDate
  );
expiry.setHours(0,0,0,0);
  const diff =
    expiry.getTime() -
    today.getTime();

  return Math.ceil(
    diff /
      (1000 * 60 * 60 * 24)
  );
}
const formatDate=(date)=>{

if(!date)
return "-";

const d=new Date(date);

if(isNaN(d))
return "-";

return d.toLocaleDateString(
"en-IN",
{
day:"2-digit",
month:"short",
year:"numeric"
});
}
  const [currentPage, setCurrentPage] = useState(1);

const membersPerPage = 10;
  
  // Live Auto Time Tick
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
  setCurrentPage(1);
}, [
  searchQuery,
  statusFilter,
  memberView,
  currentBranch
]);
console.log("allMembers:", allMembers);
console.log("Is Array:", Array.isArray(allMembers));
console.log("currentBranch:", currentBranch);
const activeBranchMembers =
  currentBranch === "ALL_BRANCHES"
    ? allMembers
    : allMembers.filter(
        (m) =>
          m.branch?.trim() ===
          currentBranch?.trim()
      );

    console.log("activeBranchMembers:", activeBranchMembers);

  const searchText = (searchQuery || "").toLowerCase();

  const filteredMembers = activeBranchMembers.filter((m) => {
   const matchesSearch =
  m.fullName
    ?.toLowerCase()
    .includes(searchText) ||

  m.memberId
    ?.toLowerCase()
    .includes(searchText) ||

  m.mobile
    ?.includes(searchText);
   const matchesStatus =
  statusFilter === "All" ||

  (statusFilter === "Paid" &&
    m.paymentStatus === "Fully Paid") ||

  (statusFilter === "Pending" &&
    m.paymentStatus === "Balance Pending") ||

  (statusFilter === "Expired" &&
    calculateDaysLeft(m.expiryDate) < 0) ||

  (statusFilter === "1 Month" &&
    m.duration === "1 Month") ||

  (statusFilter === "3 Months" &&
    m.duration === "3 Months") ||

 (statusFilter === "6 Months" &&
  m.duration === "6 Months") ||

(statusFilter === "12 Months" &&
  (
    m.duration === "12 Months" ||
    m.duration === "1 Year"
  )) ||

  (statusFilter === "7 Days Expiring" &&
    calculateDaysLeft(m.expiryDate) >= 0 &&
    calculateDaysLeft(m.expiryDate) <= 7);
    return matchesSearch && matchesStatus;
});



  const displayedMembers = filteredMembers.filter((member) => {
    if (memberView === "ALL") return true;
   if (memberView === "ACTIVE") {
  const daysLeft =
    calculateDaysLeft(member.expiryDate);

  return (
    member.status === "Active" &&
    daysLeft >= 0
  );
}
    if (memberView === "PENDING")
  return (
    member.paymentStatus ===
    "Balance Pending"
  );


   if (memberView === "EXPIRING") {
  const daysLeft =
    calculateDaysLeft(member.expiryDate);

  return (
    daysLeft >= 0 &&
    daysLeft <= 7
  );
}
    return true;
  });

  const indexOfLastMember =
  currentPage * membersPerPage;

const indexOfFirstMember =
  indexOfLastMember - membersPerPage;

const paginatedMembers =
  displayedMembers.slice(
    indexOfFirstMember,
    indexOfLastMember
  );

const totalPages = Math.ceil(
  displayedMembers.length /
  membersPerPage
);

  const totalCount = activeBranchMembers.length;
const activeCount =
  activeBranchMembers.filter((m) => {
    const daysLeft =
      calculateDaysLeft(m.expiryDate);

    return (
      m.status === "Active" &&
      daysLeft >= 0
    );
  }).length;
const pendingCount =
  activeBranchMembers.filter(
    (m) =>
      m.paymentStatus ===
      "Balance Pending"
  ).length;
  const criticalCount =
  activeBranchMembers.filter(
    (m) => {
      const daysLeft =
        calculateDaysLeft(
          m.expiryDate
        );

      return (
        daysLeft >= 0 &&
        daysLeft <= 7
      );
    }
  ).length;

  const attendanceTableRef = useRef(null);

const handleAttendanceTableDrag = (e) => {
  e.preventDefault();

  const slider = attendanceTableRef.current;

  if (!slider) return;
  const startX = e.pageX - slider.offsetLeft;
  const scrollLeft = slider.scrollLeft;

  const handleMouseMove = (e) => {
    const x = e.pageX - slider.offsetLeft;
    const walk = (x - startX) * 1.5;

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


  return (
    <div className=" w-full text-slate-800 animate-fade-in select-none font-sans min-h-screen pb-12">
      
      {/* ================= SUB-HEADER DIRECTORY ROW ================= */}
      <PageHeader
        title="Members Directory"
        description="Manage and monitor all gym members in your branch"
        rightContent={
   <div className="flex items-center gap-2 select-none">

  {/* Member Overview */}
  <button
    type="button"
    onClick={() => navigate("/admin/members/overview")}
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
    <FiUsers size={14} />
    Member Overview
  </button>



  {/* Add New Member */}
  <button
    type="button"
    onClick={() => navigate("/admin/members/new")}
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
    <FiUserPlus size={14} />
    Add New Member
  </button>

</div>
        }
      />

      {/* =================  KPI CARDS ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6 select-none">
        {/* Card 1: Total Members */}
        <div
          onClick={() => setMemberView("ALL")}
          className="group cursor-pointer bg-white border border-slate-100 rounded-2xl p-5 shadow-sm flex items-center justify-between h-[110px] transition-all duration-300 hover:border-violet-400 hover:shadow-md hover:shadow-violet-500/5 active:scale-[0.98]"
        >
 <div className="space-y-1">
  <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">
    Total Members
  </p>

  <h3 className="text-2xl font-black text-slate-900 font-mono tracking-tight">
    {totalCount}
  </h3>

  <p className="text-[10px] text-violet-500 font-bold">
    {
      currentBranch === "ALL_BRANCHES"
        ? "All Branches"
        : currentBranch === "MUGIL_FITNESS"
        ? "Mugil Fitness"
        : "SP Fitness"
    }
  </p>
</div>
          <div className="w-11 h-11 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center shadow-inner transition-transform duration-300 group-hover:scale-110 shrink-0">
            <FiUsers size={18} />
          </div>
        </div>

        {/* Card 2: Active Members */}
        <div
          onClick={() => setMemberView("ACTIVE")}
          className="group cursor-pointer bg-white border border-slate-100 rounded-2xl p-5 shadow-sm flex items-center justify-between h-[110px] transition-all duration-300 hover:border-emerald-400 hover:shadow-md hover:shadow-emerald-500/5 active:scale-[0.98]"
        >
          <div className="space-y-1">
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Active Members</p>
            <h3 className="text-2xl font-black text-slate-900 font-mono tracking-tight">{activeCount}</h3>
            <p className="text-[10px] text-emerald-500 font-bold">
              {totalCount > 0 ? ((activeCount / totalCount) * 100).toFixed(2) : "0.00"}%
              <span className="text-slate-400 font-normal"> Currently active</span>
            </p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-inner transition-transform duration-300 group-hover:scale-110 shrink-0">
            <FiActivity size={18} />
          </div>
        </div>

        {/* Card 3: Pending Fees */}
        <div
          onClick={() => setMemberView("PENDING")}
          className="group cursor-pointer bg-white border border-slate-100 rounded-2xl p-5 shadow-sm flex items-center justify-between h-[110px] transition-all duration-300 hover:border-amber-400 hover:shadow-md hover:shadow-amber-500/5 active:scale-[0.98]"
        >
          <div className="space-y-1">
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Pending Fees</p>
            <h3 className="text-2xl font-black text-slate-900 font-mono tracking-tight">{pendingCount}</h3>
            <p className="text-[10px] text-amber-500 font-bold">
              {totalCount > 0 ? ((pendingCount / totalCount) * 100).toFixed(2) : "0.00"}%
              <span className="text-slate-400 font-normal"> Payment pending</span>
            </p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shadow-inner transition-transform duration-300 group-hover:scale-110 shrink-0">
            <FiDollarSign size={18} />
          </div>
        </div>

        {/* Card 4: Expiring Soon */}
        <div
          onClick={() => setMemberView("EXPIRING")}
          className="group cursor-pointer bg-white border border-slate-100 rounded-2xl p-5 shadow-sm flex items-center justify-between h-[110px] transition-all duration-300 hover:border-red-400 hover:shadow-md hover:shadow-red-500/5 active:scale-[0.98]"
        >
          <div className="space-y-1">
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Expiring Soon</p>
            <h3 className="text-2xl font-black text-slate-900 font-mono tracking-tight">{criticalCount}</h3>
            <p className="text-[10px] text-red-500 font-bold">
              {totalCount > 0 ? ((criticalCount / totalCount) * 100).toFixed(2) : "0.00"}%
              <span className="text-slate-400 font-normal"> Expiring within 7 days</span>
            </p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-red-50 text-red-500 flex items-center justify-center shadow-inner transition-transform duration-300 group-hover:scale-110 shrink-0">
            <FiAlertCircle size={18} />
          </div>
        </div>
      </div>

      {/* ================= MEMBERS TABLE ================= */}
      <div className="grid grid-cols-1 gap-6">
        <div className="w-full bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-5">
          
          {/* Search and Filter Pills */}
          <div className="flex flex-col gap-3 md:flex-row md:items-center justify-between pt-1">
            <div className="relative flex-1 max-w-xs">
              <FiSearch className="absolute left-3 top-3 text-slate-400 text-sm pointer-events-none" />
              <input
                type="text"
                value={searchQuery || ""}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search member..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs font-semibold focus:outline-none focus:border-violet-500 transition-colors"
              />
            </div>
            <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-bold text-slate-500">
              {["All", "Paid", "Pending", "Expired", "1 Month", "3 Months", "6 Months", "12 Months"].map(pill => (
                <button key={pill} onClick={() => setStatusFilter(pill)} className={`px-3 py-1.5 rounded-xl transition-all ${statusFilter === pill ? "bg-violet-600 text-white shadow-sm" : "bg-slate-50 hover:bg-slate-100 text-slate-500"}`}>{pill}</button>
              ))}
              <div className="h-4 w-px bg-slate-200 mx-1 hidden sm:block" />
            </div>
          </div>

          {/* Table */}
        <div
  ref={attendanceTableRef}
  onMouseDown={handleAttendanceTableDrag}
  className="overflow-x-auto rounded-2xl border border-slate-100 bg-white custom-sidebar-scroll "
>
            <table className="w-full min-w-[1300px] text-left border-separate border-spacing-y-3">
              <thead>
                <tr className="border-b border-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-400">
                  <th className="w-[90px] pb-3.5 pl-3">ID</th>
                  <th className="w-[220px] pb-3.5">Member Name</th>
                  <th className="w-[160px] pb-3.5">Mobile</th>
                  <th className="w-[120px] pb-3.5">DOB</th>
                  <th className="w-[180px] pb-3.5">Membership</th>
                  <th className="w-[120px] pb-3.5">Status</th>
                  <th className="w-[150px] pb-3.5">Join Date</th>
                  <th className="w-[150px] pb-3.5">Expiry Date</th>
                  <th className="w-[120px] pb-3.5">Days Left</th>
                  <th className="w-[140px] pb-3.5 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm font-medium text-slate-600">
                {paginatedMembers.map((m) => (
                  <tr key={m._id} className="bg-white hover:bg-slate-50 transition-all duration-200 rounded-xl">
                    {/* ID */}
                    <td className="py-4 pl-3 font-mono text-slate-400 text-xs">{m.memberId}</td>

                    {/* Member Name – removed onClick (no longer opens modal) */}
          <td className="py-4">
  <div
    onClick={() =>
     navigate(
  `/admin/members/edit/${m._id}`
)
    }
    className="flex items-center gap-3 cursor-pointer"
  >
    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 text-white flex items-center justify-center font-bold shadow-sm">
      {m.fullName?.trim()?.charAt(0) || "M"}
    </div>

    <div>
      <p className="font-bold text-slate-900 hover:text-violet-600 transition-colors">
        {m.fullName}
      </p>

      <p className="text-[10px] text-slate-400">
        Member Profile
      </p>
    </div>
  </div>
</td>

                    {/* Mobile */}
                    <td className="py-4 font-mono text-slate-500">{m.mobile}</td>

                    {/* DOB */}
                    <td className="py-4 text-slate-500">{formatDate(m.dob)}</td>

                    {/* Membership */}
                    <td className="py-4">
                      <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-violet-50 text-violet-600 border border-violet-100">{m.duration}</span>
                    </td>

                    {/* Status */}
                    <td className="py-4">
<span
  className={`px-3 py-1 rounded-full text-[11px] font-black uppercase ${
    m.status === "Active"
      ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
      : m.status === "Expired"
      ? "bg-red-50 text-red-600 border border-red-100"
      : m.status === "Inactive"
      ? "bg-slate-100 text-slate-600 border border-slate-200"
      : "bg-amber-50 text-amber-600 border border-amber-100"
  }`}
>
  {m.status}
</span>
                    </td>

                    {/* Join Date */}
                    <td className="py-4 font-mono text-slate-500">{formatDate(m.joinDate)}</td>

                    {/* Expiry Date */}
                    <td className="py-4 font-mono text-slate-500"> {formatDate(m.expiryDate)}</td>

                    {/* Days Left */}
                    <td className="py-4">
                    {(() => {
  const daysLeft =
    calculateDaysLeft(m.expiryDate);


  return (
    <span
      className={`font-bold ${
        daysLeft < 0
          ? "text-red-500"
          : daysLeft <= 7
          ? "text-amber-500"
          : "text-emerald-500"
      }`}
    >
      {daysLeft} Days
    </span>
  );
})()}
                    </td>

                    {/* Actions – both buttons navigate to ViewMember page */}
                    <td className="py-4 text-center pr-3">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() =>navigate(
  `/admin/members/view/${m._id}`
)}
                          className="p-2 rounded-lg text-slate-400 hover:text-violet-600 hover:bg-violet-50 transition-all"
                        >
                          <FiEye size={14} />
                        </button>
                        {/* <button
                          onClick={() => navigate(`/admin/members/view/${m.id}`, { state: { member: m } })}
                          className="p-2 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all"
                        >
                          <FiEdit2 size={14} />
                        </button>
                        <button className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all">
                          <FiTrash2 size={14} />
                        </button>
                        <button className="p-2 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-all">
                          <FiMoreVertical size={14} />
                        </button> */}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
<TablePagination
  currentPage={currentPage}
  totalPages={totalPages}
  totalItems={displayedMembers.length}
  startItem={
    displayedMembers.length > 0
      ? indexOfFirstMember + 1
      : 0
  }
  endItem={Math.min(
    indexOfLastMember,
    displayedMembers.length
  )}
  setCurrentPage={setCurrentPage}
/>
        </div>
      </div>
    </div>
  );
}

export default Members;