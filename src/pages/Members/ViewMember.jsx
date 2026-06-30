import React, { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate, useOutletContext, useLocation } from "react-router-dom";
import PageHeader from "../../components/dashboard/PageHeader";
import TablePagination from "../../components/common/TablePagination";
import api from "../../services/api";
import {
  FiUsers,
  FiActivity,
  FiAlertCircle,
  FiDollarSign,
  FiClock,
  FiSearch,
  FiEye,
  FiEdit2,
  FiCheckCircle,
  FiXCircle,
  FiRefreshCw,
  FiUserPlus,
} from "react-icons/fi";

function ViewMember() {
  const calculateDaysLeft = (expiryDate) => {
    if (!expiryDate) return null;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const expiry = new Date(expiryDate);
    expiry.setHours(0, 0, 0, 0);

    const diff = expiry.getTime() - today.getTime();

    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };
  const formatDate = (date) => {
    if (!date) return "-";

    const d = new Date(date);

    if (isNaN(d)) return "-";

    return d.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };
  const navigate = useNavigate();
  // Getting branch and search context from Master Topbar
  const { currentBranch, searchQuery: globalSearch } = useOutletContext();

  const [allMembers, setAllMembers] = useState([]);
  const [searchQuery, setSearchQuery] = useState(globalSearch || "");
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);

    const view = params.get("view");

    if (view) {
      setActiveFilter(view);
    }
  }, [location.search]);

  // Local States

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

  // Sync global search with local if changed from master topbar
  useEffect(() => {
    if (globalSearch !== undefined) setSearchQuery(globalSearch);
  }, [globalSearch]);

  const branchMembers = useMemo(() => {
    if (currentBranch === "ALL_BRANCHES") {
      return allMembers;
    }

    const result = allMembers.filter((m) => m.branch === currentBranch);

    return result;
  }, [currentBranch, allMembers]);

  // 3. Dynamic KPI Calculations (Based on the selected branch)
  const totalCount = branchMembers.length;

  const activeCount = branchMembers.filter((m) => {
    if (!m.expiryDate) return false;

    const daysLeft = calculateDaysLeft(m.expiryDate);

    return daysLeft >= 0;
  }).length;

  const pendingCount = branchMembers.filter(
    (m) => m.paymentStatus === "Balance Pending",
  ).length;

  const expiringCount = branchMembers.filter((m) => {
    const daysLeft = calculateDaysLeft(m.expiryDate);
    return daysLeft >= 0 && daysLeft <= 7;
  }).length;

  const expiredCount = branchMembers.filter((m) => {
    const daysLeft = calculateDaysLeft(m.expiryDate);

    return daysLeft < 0 && daysLeft >= -180;
  }).length;

  const inactiveCount = branchMembers.filter((m) => {
    if (!m.expiryDate) return false;

    const daysLeft = calculateDaysLeft(m.expiryDate);

    return daysLeft < -180;
  }).length;

  const expiringPercentage =
    totalCount > 0 ? ((expiringCount / totalCount) * 100).toFixed(2) : "0.00";

  const expiredPercentage =
    totalCount > 0 ? ((expiredCount / totalCount) * 100).toFixed(2) : "0.00";

  const filteredMembers = useMemo(() => {
    let result = branchMembers;

    // A. Apply Search Filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (m) =>
          (m.fullName || "").toLowerCase().includes(q) ||
          (m.memberId || "").toLowerCase().includes(q) ||
          (m.mobile || "").includes(q),
      );
    }

    // B. Apply Dashboard KPI Filter
    switch (activeFilter) {
      case "ACTIVE":
        result = result.filter((m) => {
          if (!m.expiryDate) return false;

          const daysLeft = calculateDaysLeft(m.expiryDate);

          return daysLeft >= 0;
        });
        break;
      case "PENDING":
        result = result.filter((m) => m.paymentStatus === "Balance Pending");
        break;
      case "EXPIRING":
        result = result.filter((m) => {
          const daysLeft = calculateDaysLeft(m.expiryDate);

          return daysLeft >= 0 && daysLeft <= 7;
        });
        break;
      case "EXPIRED":
        result = result.filter((m) => {
          const daysLeft = calculateDaysLeft(m.expiryDate);

          return daysLeft < 0 && daysLeft >= -180;
        });
        break;

      case "INACTIVE":
        result = result.filter((m) => {
          const daysLeft = calculateDaysLeft(m.expiryDate);

          return daysLeft < -180;
        });
        break;
      default:
        break;
    }

    return result;
  }, [branchMembers, searchQuery, activeFilter]);

  const membersPerPage = 10;

  const totalPages = Math.max(
    1,
    Math.ceil(filteredMembers.length / membersPerPage),
  );

  const indexOfLastMember = currentPage * membersPerPage;

  const indexOfFirstMember = indexOfLastMember - membersPerPage;

  const paginatedMembers = filteredMembers.slice(
    indexOfFirstMember,
    indexOfLastMember,
  );

  // 4. Advanced Multi-level Filtration Engine (Search + Tabs)

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, activeFilter, currentBranch]);

  // 5. Intelligent Status Badge Generator
  const renderStatusBadge = (status, daysLeft) => {
    const days = parseInt(daysLeft);

    if (days < -180) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200 text-slate-600 text-[10px] font-black uppercase tracking-widest shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span>
          Inactive
        </span>
      );
    }

    if (days < 0) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-rose-50 border border-rose-100 text-rose-600 text-[10px] font-black uppercase tracking-widest shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
          Expired
        </span>
      );
    }

    // if (status === "Pending") {
    //   return (
    //     <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-50 border border-amber-100 text-amber-600 text-[10px] font-black uppercase tracking-widest shadow-sm">
    //       <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
    //       Pending
    //     </span>
    //   );
    // }

    if (days <= 7) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-orange-50 border border-orange-100 text-orange-600 text-[10px] font-black uppercase tracking-widest shadow-sm">
          <FiAlertCircle size={10} />
          Expiring Soon
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 border border-emerald-100 text-emerald-600 text-[10px] font-black uppercase tracking-widest shadow-sm">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
        Active
      </span>
    );
  };
  const membersTableRef = useRef(null);

  const handleMembersTableDrag = (e) => {
    const slider = membersTableRef.current;

    if (!slider) return;

    const startX = e.pageX - slider.offsetLeft;
    const scrollLeft = slider.scrollLeft;

    const handleMouseMove = (e) => {
      const x = e.pageX - slider.offsetLeft;
      const walk = (x - startX) * 1.5;
      slider.scrollLeft = scrollLeft - walk;
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);

      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);

    document.addEventListener("mouseup", handleMouseUp);
  };

  return (
    <div className=" font-sans space-y-6 text-slate-800 animate-fade-in select-none relative min-h-screen pb-24 lg:pb-12 bg-slate-50/50 w-full max-w-full">
      <PageHeader
        title="Member Directory"
        description="Comprehensive member analytics and database management."
        rightContent={
          <div className="flex flex-col sm:flex-row items-end sm:items-center gap-3"></div>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 mb-6 select-none">
        {/* Pending Payments */}
        <div
          onClick={() => setActiveFilter("PENDING")}
          className={`group cursor-pointer bg-white border rounded-2xl p-5 shadow-sm flex items-center justify-between h-[110px] transition-all duration-300 active:scale-[0.98]
  ${
    activeFilter === "PENDING"
      ? "border-amber-500 ring-4 ring-amber-500/10 shadow-md"
      : "border-slate-100 hover:border-amber-400 hover:shadow-md hover:shadow-amber-500/5"
  }`}
        >
          <div className="space-y-1">
            <p
              className={`text-[10px] font-black uppercase tracking-widest ${
                activeFilter === "PENDING" ? "text-amber-600" : "text-slate-400"
              }`}
            >
              Pending Payment
            </p>

            <h3
              className={`text-2xl font-black font-mono tracking-tight ${
                activeFilter === "PENDING" ? "text-amber-600" : "text-slate-900"
              }`}
            >
              {pendingCount}
            </h3>

            <p className="text-[10px] text-amber-500 font-bold">
              {totalCount > 0
                ? ((pendingCount / totalCount) * 100).toFixed(2)
                : "0.00"}
              %
              <span className="text-slate-400 font-normal">
                {" "}
                Payment pending
              </span>
            </p>
          </div>

          <div
            className={`w-11 h-11 rounded-xl flex items-center justify-center shadow-inner transition-transform duration-300 group-hover:scale-110 shrink-0 ${
              activeFilter === "PENDING"
                ? "bg-amber-500 text-white"
                : "bg-amber-50 text-amber-600"
            }`}
          >
            <FiDollarSign size={18} />
          </div>
        </div>
        {/* Expiring Soon */}
        <div
          onClick={() => setActiveFilter("EXPIRING")}
          className={`group cursor-pointer bg-white border rounded-2xl p-5 shadow-sm flex items-center justify-between h-[110px] transition-all duration-300 active:scale-[0.98]
  ${
    activeFilter === "EXPIRING"
      ? "border-orange-500 ring-4 ring-orange-500/10 shadow-md"
      : "border-slate-100 hover:border-orange-400 hover:shadow-md hover:shadow-orange-500/5"
  }`}
        >
          <div className="space-y-1">
            <p
              className={`text-[10px] font-black uppercase tracking-widest ${
                activeFilter === "EXPIRING"
                  ? "text-orange-600"
                  : "text-slate-400"
              }`}
            >
              Expiring Soon
            </p>

            <h3
              className={`text-2xl font-black font-mono tracking-tight ${
                activeFilter === "EXPIRING"
                  ? "text-orange-600"
                  : "text-slate-900"
              }`}
            >
              {expiringCount}
            </h3>

            <p className="text-[10px] text-orange-500 font-bold">
              {expiringPercentage}%
              <span className="text-slate-400 font-normal">
                {currentBranch === "ALL_BRANCHES"
                  ? "All Branches"
                  : currentBranch === "MUGIL_FITNESS"
                    ? "Mugil Fitness"
                    : "SP Fitness"}
              </span>
            </p>
          </div>

          <div
            className={`w-11 h-11 rounded-xl flex items-center justify-center shadow-inner transition-transform duration-300 group-hover:scale-110 shrink-0 ${
              activeFilter === "EXPIRING"
                ? "bg-orange-500 text-white"
                : "bg-orange-50 text-orange-600"
            }`}
          >
            <FiClock size={18} />
          </div>
        </div>

        {/* Expired / Lapsed */}
        <div
          onClick={() => setActiveFilter("EXPIRED")}
          className={`group cursor-pointer bg-white border rounded-2xl p-5 shadow-sm flex items-center justify-between h-[110px] transition-all duration-300 active:scale-[0.98]
  ${
    activeFilter === "EXPIRED"
      ? "border-rose-500 ring-4 ring-rose-500/10 shadow-md"
      : "border-slate-100 hover:border-rose-400 hover:shadow-md hover:shadow-rose-500/5"
  }`}
        >
          <div className="space-y-1">
            <p
              className={`text-[10px] font-black uppercase tracking-widest ${
                activeFilter === "EXPIRED" ? "text-rose-600" : "text-slate-400"
              }`}
            >
              Lapsed / Expired
            </p>

            <h3
              className={`text-2xl font-black font-mono tracking-tight ${
                activeFilter === "EXPIRED" ? "text-rose-600" : "text-slate-900"
              }`}
            >
              {expiredCount}
            </h3>

            <p className="text-[10px] text-rose-500 font-bold">
              {expiredPercentage}%
              <span className="text-slate-400 font-normal">
                {" "}
                Membership expired
              </span>
            </p>
          </div>

          <div
            className={`w-11 h-11 rounded-xl flex items-center justify-center shadow-inner transition-transform duration-300 group-hover:scale-110 shrink-0 ${
              activeFilter === "EXPIRED"
                ? "bg-rose-500 text-white"
                : "bg-rose-50 text-rose-600"
            }`}
          >
            <FiXCircle size={18} />
          </div>
        </div>

        <div
          onClick={() => setActiveFilter("INACTIVE")}
          className={`group cursor-pointer bg-white border rounded-2xl p-5 shadow-sm flex items-center justify-between h-[110px] transition-all duration-300 active:scale-[0.98]
  ${
    activeFilter === "INACTIVE"
      ? "border-slate-500 ring-4 ring-slate-500/10 shadow-md"
      : "border-slate-100 hover:border-slate-400 hover:shadow-md hover:shadow-slate-500/5"
  }`}
        >
          <div className="space-y-1">
            <p
              className={`text-[10px] font-black uppercase tracking-widest ${
                activeFilter === "INACTIVE"
                  ? "text-slate-600"
                  : "text-slate-400"
              }`}
            >
              Inactive Members
            </p>

            <h3
              className={`text-2xl font-black font-mono tracking-tight ${
                activeFilter === "INACTIVE"
                  ? "text-slate-600"
                  : "text-slate-900"
              }`}
            >
              {inactiveCount}
            </h3>

            <p className="text-[10px] text-slate-500 font-bold">
              No Renewal (180+ Days)
            </p>
          </div>

          <div
            className={`w-11 h-11 rounded-xl flex items-center justify-center shadow-inner transition-transform duration-300 group-hover:scale-110 shrink-0 ${
              activeFilter === "INACTIVE"
                ? "bg-slate-500 text-white"
                : "bg-slate-50 text-slate-600"
            }`}
          >
            <FiUsers size={18} />
          </div>
        </div>
      </div>

      {/* ================= 🗂️ STAGE 2: UNIFIED DATA TABLE ================= */}
      <div className="bg-white rounded-[14px] shadow-sm border border-slate-200/60 overflow-hidden w-full">
        <div
          ref={membersTableRef}
          onMouseDown={handleMembersTableDrag}
          className="
    w-full
    overflow-x-auto
    custom-sidebar-scroll
    select-none
  "
        >
          <table className="w-full min-w-[1100px] text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  ID
                </th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  Member Details
                </th>
                <th className="px-6 py-4 text-center text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  Status
                </th>
                <th className="px-6 py-4 text-center text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  Plan
                </th>
                <th className="px-6 py-4 text-center text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  Payment
                </th>
                <th className="px-6 py-4 text-center text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  Expiry
                </th>
                <th className="px-6 py-4 text-center text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {paginatedMembers.map((member) => {
                const daysLeft = calculateDaysLeft(member.expiryDate);
                return (
                  <tr
                    key={member._id}
                    className="bg-white hover:bg-slate-50/80 transition-all duration-200"
                  >
                    <td className="px-6 py-4 font-mono text-[11px] text-slate-500">
                      {member.memberId}
                    </td>
                    <td className="px-6 py-4">
                      <div
                        onClick={() =>
                          navigate(`/admin/members/edit/${member._id}`, {
                            state: { member },
                          })
                        }
                        className="flex items-center gap-3 cursor-pointer"
                      >
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-50 to-violet-50 text-indigo-600 flex items-center justify-center font-bold text-xs border border-indigo-100">
                          {(member.fullName || "M")
                            .trim()
                            .charAt(0)
                            .toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-900">
                            {member.fullName}
                          </p>
                          <p className="text-[10px] font-medium text-slate-400">
                            {member.mobile}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {renderStatusBadge(member.status, daysLeft)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="px-3 py-1 rounded-md bg-slate-100 text-slate-600 text-[11px] font-medium">
                        {member.duration}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <p className="text-[12px] font-bold text-slate-900 font-mono">
                        ₹{member.amountPaid}{" "}
                        <span className="text-slate-400 font-normal">
                          / ₹{member.totalAmount}
                        </span>
                      </p>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <p className="text-[11px] font-semibold text-slate-700">
                        {formatDate(member.expiryDate)}
                      </p>
                      <p
                        className={`text-[9px] font-bold ${daysLeft < -180 ? "text-slate-400" : daysLeft < 0 ? "text-rose-500" : daysLeft <= 7 ? "text-amber-500" : "text-emerald-500"}`}
                      >
                        {daysLeft < -180
                          ? `Inactive ${Math.abs(daysLeft)}d`
                          : daysLeft < 0
                            ? `${Math.abs(daysLeft)}d Ago`
                            : `${daysLeft} Days Left`}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        {/* Edit Button */}
                        <button
                          onClick={() =>
                            navigate(`/admin/members/edit/${member._id}`, {
                              state: { member },
                            })
                          }
                          className="
        group
        w-10 h-10
        rounded-xl
        bg-gradient-to-br
        from-indigo-50
        to-violet-50
        border
        border-indigo-100
        text-indigo-600
        flex
        items-center
        justify-center
        shadow-sm
        hover:shadow-md
        hover:border-indigo-300
        hover:scale-105
        transition-all
        duration-300
      "
                          title="Edit Member"
                        >
                          <FiEdit2
                            size={14}
                            className="group-hover:rotate-12 transition-transform duration-300"
                          />
                        </button>

                        {/* Renew Button */}
                        {daysLeft !== null && daysLeft < 0 && (
                          <button
                            onClick={() =>
                              navigate(`/admin/members/renew/${member._id}`)
                            }
                            className="
          group
          relative
          overflow-hidden
          px-4
          py-2.5
          rounded-xl
          bg-gradient-to-r
          from-orange-500
          to-amber-500
          text-white
          text-[10px]
          font-black
          uppercase
          tracking-wider
          shadow-md
          hover:shadow-lg
          hover:shadow-orange-500/20
          hover:scale-105
          active:scale-95
          transition-all
          duration-300
        "
                          >
                            <span className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />

                            <span className="relative flex items-center gap-1.5">
                              <FiRefreshCw size={11} />
                              Renew
                            </span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="p-5 border-t border-slate-100 bg-slate-50/50">
          <TablePagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredMembers.length}
            startItem={filteredMembers.length > 0 ? indexOfFirstMember + 1 : 0}
            endItem={Math.min(indexOfLastMember, filteredMembers.length)}
            setCurrentPage={setCurrentPage}
          />
        </div>
      </div>
    </div>
  );
}

export default ViewMember;
