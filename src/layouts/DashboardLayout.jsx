import React, { useState } from "react";
import { Outlet } from "react-router-dom";

import Sidebar from "../components/dashboard/Sidebar";
import Topbar from "../components/dashboard/Topbar";

function DashboardLayout() {
  /* ================= GLOBAL DASHBOARD STATE ================= */
  const [isSidebarOpen, setIsSidebarOpen] =
  useState(false);

 const [currentBranch, setCurrentBranch] =
useState("ALL_BRANCHES");

  const [searchQuery, setSearchQuery] =
    useState("");

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900">

      {/* ================= BACKGROUND EFFECTS ================= */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">

        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-violet-500/5 blur-[180px]" />

        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-cyan-500/5 blur-[150px]" />

      </div>

      <div className="relative flex">

        {/* ================= SIDEBAR ================= */}
       <Sidebar
  isSidebarOpen={isSidebarOpen}
  setIsSidebarOpen={setIsSidebarOpen}
/>

        {/* ================= MAIN CONTENT ================= */}
       <div className="flex-1 min-h-screen lg:ml-[280px] overflow-x-auto">

          {/* ================= TOPBAR ================= */}
        <Topbar
  currentBranch={currentBranch}
  onBranchChange={setCurrentBranch}
  searchQuery={searchQuery}
  onSearchChange={setSearchQuery}
  setIsSidebarOpen={setIsSidebarOpen}
/>

          {/* ================= PAGE CONTENT ================= */}
          <main className="p-4 sm:p-6 lg:p-8 overflow-x-auto">

           <div className="mx-auto">

              <Outlet
                context={{
                  currentBranch,
                  searchQuery,
                  setCurrentBranch,
                  setSearchQuery,
                }}
              />

            </div>

          </main>

        </div>

      </div>

    </div>
  );
}

export default DashboardLayout;