import React, { useState } from "react";
import { NavLink ,useNavigate } from "react-router-dom";
import { createPortal } from 'react-dom';
import {
  FiGrid, FiUsers, FiCreditCard, FiCheckCircle, FiTrendingUp, 
  FiClipboard, FiActivity, FiDollarSign, FiFileText, FiHome, 
  FiSettings, FiLogOut, FiAward, FiChevronRight, FiLock
} from "react-icons/fi";

function Sidebar({
  isSidebarOpen,
  setIsSidebarOpen
}) {
  const navigate = useNavigate();
    const [showLogoutModal, setShowLogoutModal] =
    useState(false);

  
  
  const menuItems = [
    { title: "Dashboard", icon: <FiGrid />, path: "/admin/dashboard" },
    { title: "Members", icon: <FiUsers />, path: "/admin/members" },
    { title: "Memberships", icon: <FiCreditCard />, path: "/admin/membership-plans" },
    // { title: "Workouts", icon: <FiTrendingUp />, path: "/admin/workout-plans" },
    // { title: "Diet Plans", icon: <FiClipboard />, path: "/admin/diet-plans" },
    // { title: "Trainers", icon: <FiActivity />, path: "/admin/trainers" },
    { title: "Payments", icon: <FiDollarSign />, path: "/admin/fees" },
    { title: "Branch", icon: <FiHome />, path: "/admin/branches" },
    { title: "Reports", icon: <FiFileText />, path: "/admin/reports" },
    { title: "Settings", icon: <FiSettings />, path: "/admin/settings" },
  ];

  const handleLogout = () => {

  localStorage.removeItem("adminToken");
  localStorage.removeItem("admin");
  localStorage.removeItem("adminRole");

  navigate("/adminLogin", { replace: true });

};

  return (
    <>
       {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() =>
            setIsSidebarOpen(false)
          }
        />
      )}
   
   <aside
  className={`
  fixed left-0 top-0 h-screen w-[270px]
  bg-[#070913]
  flex flex-col
  z-50
  justify-between
  border-r border-slate-900/60

  transition-transform duration-300

  ${isSidebarOpen
    ? "translate-x-0"
    : "-translate-x-full"}

  lg:translate-x-0
  lg:flex
  `}
>
      
      {/* ================= BRANDING LOGO AREA ================= */}
      <div>
     <div className="h-[70px] px-6 flex items-center gap-3 bg-[#0a0c16]/30 backdrop-blur-md relative overflow-hidden border-b border-slate-900/20 select-none">
  {/* Soft Ambient Decorative Radial Glow Accent */}
  <div className="absolute top-0 left-0 w-16 h-16 bg-violet-500/10 rounded-full blur-xl pointer-events-none" />
  
  {/* Futuristic Micro-Icon Container Shield with Soft Pulse */}
  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#4d3df7] via-[#6355f9] to-[#8a3df7] flex items-center justify-center text-white shadow-[0_4px_12px_rgba(77,61,247,0.25)] ring-1 ring-white/10 shrink-0">
    <FiActivity size={15} className="animate-pulse" />
  </div>
  
  {/* Compact Luxury Premium Typography Panel */}
  <div className="relative z-10 flex flex-col justify-center">
    <h1 className="text-white text-sm font-black tracking-[1.5px] uppercase font-sans leading-none">
      MUGIL <span className="bg-gradient-to-r from-violet-400 via-indigo-400 to-blue-400 bg-clip-text text-transparent">FITNESS</span>
    </h1>
    <p className="text-slate-500 text-[8px] font-black tracking-[1.8px] uppercase mt-1.5 font-mono">
    FITNESS CONTROL HUB
    </p>
  </div>
</div>

        {/* =================  INTERACTIVE NAVIGATION ITEMS ================= */}
<div className="px-3 py-4 space-y-1 overflow-y-auto flex-1 min-h-0 custom-sidebar-scroll">
  <p className="text-slate-600 text-[10px] uppercase font-bold tracking-[2.5px] px-4 mb-4">
    Management Suite
  </p>

{menuItems.map((item) => (
  <NavLink
    key={item.path}
    to={item.path}
    onClick={() => setIsSidebarOpen(false)}
    className={({ isActive }) =>
      `flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 transform group relative border ${
        isActive
          ? "bg-gradient-to-r from-[#1e1b4b] to-[#311042]/40 border-violet-500/30 text-white font-bold shadow-[inset_0_1px_20px_rgba(138,61,247,0.15)]"
          : "text-slate-400 border-transparent hover:bg-slate-900/40 hover:text-slate-200 hover:translate-x-1.5"
      }`
    }
  >
      {({ isActive }) => (
        <>
          <div className="flex items-center gap-3.5 relative z-10">
            <div
              className={`text-base transition-all duration-300 ${
                isActive
                  ? "text-[#6355f9] drop-shadow-[0_0_8px_rgba(99,85,249,0.6)]"
                  : "text-slate-400 group-hover:text-violet-400"
              }`}
            >
              {item.icon}
            </div>

            <span className="text-xs tracking-wide font-medium font-sans">
              {item.title}
            </span>
          </div>

          {isActive ? (
            <div className="w-1.5 h-5 bg-gradient-to-b from-[#4d3df7] to-[#8a3df7] rounded-full absolute left-0 shadow-[0_0_12px_#4d3df7]" />
          ) : (
            <FiChevronRight
              size={12}
              className="text-slate-600 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-[-4px] group-hover:translate-x-0"
            />
          )}
        </>
      )}
    </NavLink>
  ))}
</div>
      </div>

      {/* ================= 🚨 UPGRADE & ACCOUNT PROFILE FOOTER SECTION ================= */}
      <div className="px-4 pb-4 space-y-4">
<>
  {/* ================= 👤 CONSOLIDATED USER ACCOUNT SECTOR PROFILE ================= */}
  <div className="border-t border-slate-900/30 pt-4 pb-1 flex items-center justify-between px-2 select-none">
    <div className="flex items-center gap-3 group cursor-pointer">
      {/* Avatar Element built with High-End Geometric Matte Gradients */}
      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#4d3df7] to-[#8a3df7] text-white font-mono font-black text-xs flex items-center justify-center shadow-md shadow-blue-500/10 border border-white/10 group-hover:scale-105 transition-transform duration-200">
        S
      </div>
      
      <div className="text-left leading-none">
        <h4 className="font-bold text-xs text-white tracking-wide group-hover:text-violet-400 transition-colors duration-200">
          Udhaya Suriyan
        </h4>
        <p className="text-slate-500 text-[8px] font-black mt-1.5 uppercase tracking-widest font-mono">
          Super Admin
        </p>
      </div>
    </div>
    
    {/* Trigger State Modal on Click */}
    <button 
      type="button"
      onClick={() => setShowLogoutModal(true)}
      className="w-8 h-8 rounded-xl bg-slate-900/40 hover:bg-red-950/20 text-slate-500 hover:text-red-400 border border-slate-800/60 flex items-center justify-center transition-all duration-200 hover:border-red-500/20 shadow-inner focus:outline-none active:scale-90"
      title="Secure Terminate Session"
    >
      <FiLogOut size={13} />
    </button>
  </div>

  {/* =================  PREMIUM GLASSMORPHIC LOGOUT POP-UP MODAL ================= */}
{showLogoutModal && (
  <>
    {/* Overlay - full viewport cover */}
    <div
      className="fixed inset-0 z-[9998] bg-black/70 backdrop-blur-sm"
      onClick={() => setShowLogoutModal(false)}
    />

    {/* Modal - perfectly centered */}
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 pointer-events-none">
      <div className="pointer-events-auto w-full max-w-[340px] bg-[#0e1123] border border-white/[0.07] rounded-[24px] overflow-hidden shadow-[0_32px_80px_rgba(0,0,0,0.8),inset_0_0_0_1px_rgba(255,255,255,0.03)]">

        {/* Top red accent bar */}
        <div className="h-[3px] bg-gradient-to-r from-red-900 via-red-500 to-red-400" />

        <div className="px-6 pt-7 pb-6 text-center">

          {/* Icon */}
          <div className="w-[60px] h-[60px] rounded-[18px] bg-red-500/[0.08] border border-red-500/[0.18] flex items-center justify-center mx-auto mb-5">
            <FiLogOut size={24} className="text-red-400" />
          </div>

          {/* Title */}
          <h3 className="text-white/93 text-[16px] font-medium mb-2">
            Log out?
          </h3>

          {/* Description */}
          <p className="text-slate-400/60 text-[12px] leading-relaxed mb-5">
            Are you sure you want to log out from{' '}
            <span className="text-red-400/80 font-medium">MUGIL & SP FITNESS</span>{' '}
            
          </p>

          {/* Divider */}
          <div className="h-px bg-white/[0.05] mb-5" />

          {/* Buttons */}
          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => setShowLogoutModal(false)}
              className="py-3 bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.07] hover:border-white/[0.13] text-slate-400/70 hover:text-white/85 rounded-[13px] text-[11.5px] font-medium uppercase tracking-[0.05em] transition-all duration-150 active:scale-[0.97]"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => { setShowLogoutModal(false); handleLogout(); }}
              className="py-3 bg-gradient-to-br from-red-700 to-red-800 hover:from-red-600 hover:to-red-700 border border-red-500/25 hover:border-red-400/40 text-red-100/95 rounded-[13px] text-[11.5px] font-medium uppercase tracking-[0.05em] transition-all duration-150 active:scale-[0.97] flex items-center justify-center gap-1.5"
            >
              <FiLock size={12} />
              Log out
            </button>
          </div>

          {/* Hint */}
          <p className="text-slate-500/40 text-[10.5px] mt-3.5 tracking-wide">
            Your session will be securely terminated
          </p>

        </div>
      </div>
    </div>
  </>
)}
</>
      </div>

    </aside>
     </>
  );
}

export default Sidebar;