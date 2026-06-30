import React, { useState, useEffect } from "react";
import {
  FiBell,
  FiSearch,
  FiChevronDown,
  FiMenu,
  FiMapPin,
  FiCheckCircle,
  FiCalendar,
  FiClock,
} from "react-icons/fi";

function Topbar({
  currentBranch,
  onBranchChange,
  searchQuery,
  onSearchChange,
  setIsSidebarOpen,
}) {
  const [isBranchDropdownOpen, setIsBranchDropdownOpen] = useState(false);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  // Real-time ticking system clock engine matching reference timeline metrics
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Format strings strictly matching reference display layouts
  const formattedDate = currentDateTime.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const formattedTime = currentDateTime.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  const handleBranchSwitch = (branchKey) => {
    if (onBranchChange) {
      onBranchChange(branchKey);
    }
    setIsBranchDropdownOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-100 select-none transition-all duration-300">
      <div className="h-[64px] sm:h-[74px] px-3 sm:px-6 lg:px-8 flex items-center justify-between gap-2 sm:gap-4">
        {/* ================= 🧩 LEFT SECTION: TEXTUAL INPUT FIELD ================= */}
        <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0 max-w-xl">
          {/* Mobile responsive drawer controller anchor */}
          <button
            type="button"
            onClick={() => setIsSidebarOpen(true)}
            className="lg:hidden w-9 h-9 rounded-xl bg-slate-50 border border-slate-200/70 flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <FiMenu size={16} />
          </button>

          {/* Image Aligned Search Container Capsule */}
          <div className="flex items-center gap-2 bg-slate-50/50 border border-slate-200/60 rounded-xl px-3 sm:px-3.5 h-[38px] sm:h-[42px] min-w-0 w-full focus-within:bg-white focus-within:border-violet-500 focus-within:ring-4 focus-within:ring-violet-500/5 group transition-all duration-300">
            <FiSearch className="text-slate-400 text-base group-focus-within:text-violet-500 transition-colors" />
            <input
              type="text"
              value={searchQuery || ""}
              onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
              placeholder={
                window.innerWidth < 640
                  ? "Search..."
                  : "Search members by name, ID or phone..."
              }
              className="w-full bg-transparent outline-none text-slate-800 placeholder:text-slate-400/90 text-xs font-medium tracking-wide"
            />
          </div>
        </div>

        {/* ================= 🔐 RIGHT SECTION: ANALYTICS & HUB CONTROLLERS ================= */}
        <div className="flex items-center gap-2 sm:gap-4 lg:gap-6 shrink-0">
          {/* Notification Alert Node */}
          <button className="relative w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-colors focus:outline-none">
            <FiBell className="text-xl" />
            <span className="absolute top-1 right-1.5 w-4 h-4 rounded-full bg-red-500 text-white font-mono text-[9px] font-black flex items-center justify-center shadow-sm">
              5
            </span>
          </button>

          {/* Real-Time Live Clock Widget Layer Blocks */}
          <div className="hidden md:flex items-center gap-2.5 border-l border-slate-100 pl-4 h-8 text-right font-medium">
            <div className="p-2 bg-slate-50 text-slate-400 rounded-xl">
              <FiCalendar size={15} />
            </div>
            <div className="flex flex-col text-left leading-none justify-center">
              <span className="text-slate-700 text-xs font-bold tracking-wide">
                {formattedDate}
              </span>
              <span className="text-slate-400 font-mono text-[10px] font-bold mt-1.5 uppercase">
                {formattedTime}
              </span>
            </div>
          </div>

          {/* ================= 👑 NEW ELITE BRANCH DROPSELECTOR COMPONENT ================= */}
          <div className="relative border-l border-slate-100 pl-2 sm:pl-4">
            <button
              type="button"
              onClick={() => setIsBranchDropdownOpen(!isBranchDropdownOpen)}
              className=" cursor-pointer flex items-center gap-1.5 sm:gap-2.5 bg-slate-50 border border-slate-200/80 px-2 sm:px-3.5 h-[38px] sm:h-[42px] rounded-xl shadow-sm hover:border-slate-300 hover:bg-white active:scale-98 transition-all duration-200 focus:outline-none"
            >
              <div
                className={`w-2 h-2 rounded-full ring-4 ${
                  currentBranch === "ALL_BRANCHES"
                    ? "bg-emerald-500 ring-emerald-100"
                    : currentBranch === "MUGIL_FITNESS"
                      ? "bg-violet-500 ring-violet-100"
                      : "bg-cyan-500 ring-cyan-100"
                }`}
              />
              <span className="hidden sm:block text-slate-700 font-black text-[11px] uppercase tracking-wider">
                {currentBranch === "ALL_BRANCHES"
                  ? "All Branches"
                  : currentBranch === "MUGIL_FITNESS"
                    ? "Mugil Fitness"
                    : "SP Fitness"}
              </span>
              <FiChevronDown
                className={`text-slate-400 text-xs transition-transform duration-200 ${isBranchDropdownOpen ? "rotate-180" : ""}`}
              />
            </button>

            {/* Dropdown Menu Node Panels */}
            {isBranchDropdownOpen && (
              <div className="absolute right-0 mt-2 w-60 bg-white/95 backdrop-blur-xl border border-slate-100 rounded-xl shadow-[0_12px_30px_rgba(0,0,0,0.08)] py-1.5 z-50 ring-1 ring-black/5 animate-fade-in">
                <div className="px-3.5 py-1.5 text-[9px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 mb-1">
                  Switch Active Terminal
                </div>
                <button
                  type="button"
                  onClick={() => handleBranchSwitch("ALL_BRANCHES")}
                  className={`w-full text-left px-3.5 py-2 text-xs font-bold uppercase tracking-wider flex items-center justify-between transition-colors ${
                    currentBranch === "ALL_BRANCHES"
                      ? "bg-emerald-50 text-emerald-600"
                      : "text-slate-600 hover:bg-slate-50/80"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <FiMapPin
                      size={13}
                      className={
                        currentBranch === "ALL_BRANCHES"
                          ? "text-emerald-500"
                          : "text-slate-400"
                      }
                    />
                    All Branches
                  </span>

                  {currentBranch === "ALL_BRANCHES" && (
                    <FiCheckCircle className="text-emerald-500" size={13} />
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => handleBranchSwitch("MUGIL_FITNESS")}
                  className={`w-full text-left px-3.5 py-2 text-xs font-bold uppercase tracking-wider flex items-center justify-between transition-colors ${currentBranch === "MUGIL_FITNESS" ? "bg-violet-50/60 text-violet-600" : "text-slate-600 hover:bg-slate-50/80"}`}
                >
                  <span className="flex items-center gap-2">
                    <FiMapPin
                      size={13}
                      className={
                        currentBranch === "MUGIL_FITNESS"
                          ? "text-violet-500"
                          : "text-slate-400"
                      }
                    />{" "}
                    Mugil Fitness
                  </span>
                  {currentBranch === "MUGIL_FITNESS" && (
                    <FiCheckCircle className="text-violet-500" size={13} />
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => handleBranchSwitch("SP_FITNESS")}
                  className={`w-full text-left px-3.5 py-2 text-xs font-bold uppercase tracking-wider flex items-center justify-between transition-colors ${currentBranch === "SP_FITNESS" ? "bg-cyan-50/60 text-cyan-600" : "text-slate-600 hover:bg-slate-50/80"}`}
                >
                  <span className="flex items-center gap-2">
                    <FiMapPin
                      size={13}
                      className={
                        currentBranch === "SP_FITNESS"
                          ? "text-cyan-500"
                          : "text-slate-400"
                      }
                    />{" "}
                    SP Fitness
                  </span>
                  {currentBranch === "SP_FITNESS" && (
                    <FiCheckCircle className="text-cyan-500" size={13} />
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Topbar;
