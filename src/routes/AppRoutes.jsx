import React from "react";
import { useEffect } from "react";
import AOS from "aos";
import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import ScrollToTop from "../components/common/ScrollToTop";
/* ================= LAYOUT ================= */
import MainLayout from "../layouts/MainLayout";
import DashboardLayout from "../layouts/DashboardLayout";


/* ================= PUBLIC PAGES ================= */
import Home from "../pages/Home";
import About from "../pages/About";
import Contact from "../pages/Contact";
import Membership from "../pages/Membership";
import Trainers from "../pages/Trainers";
import Gallery from "../pages/Gallery";

/* ================= AUTH ================= */
import AdminLogin from "../pages/AdminLogin";
import ProtectedRoute from "../components/ProtectedRoute";
import ResetPassword from "../pages/Resetpassword"; 

/* ================= ADMIN DASHBOARD ================= */
import Dashboard from "../pages/Dashboard/Dashboard";
import Members from "../pages/Members/Members";
import ViewMember from "../pages/Members/ViewMember";
import RenewMember from "../pages/Members/RenewMember";
import EditMember from "../pages/Members/EditMember";
import MembershipPlans from "../pages/Memberships/MembershipPlans";
import FeeManagement from "../pages/Payments/FeeManagement";
import BranchManagement from "../pages/BranchManagement/BranchManagement";
import Reports from "../pages/Reports/Reports";
import Settings from "../pages/Settings/Settings";
import NewMemberForm from "../pages/Members/NewMemberForm";
import PaymentHistory from "../pages/admin/PaymentHistory";
import CollectPaymentPage from "../pages/admin/CollectPaymentPage";

function AppRoutes() {

  useEffect(() => {
    AOS.init({
      duration: 1000,
      easing: "ease-in-out",
      once: true,
      offset: 80,
    });
  }, []);

  return (
    <>
      <ScrollToTop />

      <Routes>

        {/* ================= PUBLIC WEBSITE ================= */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="membership" element={<Membership />} />
          <Route path="trainers" element={<Trainers />} />
          <Route path="gallery" element={<Gallery />} />
          <Route path="contact" element={<Contact />} />
          <Route path="adminLogin" element={<AdminLogin />} />
        </Route>

        <Route path="/reset-password/:token" element={<ResetPassword />} />

        {/* ================= ADMIN PANEL ================= */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="members" element={<Members />} />
          <Route path="members/overview" element={<ViewMember />} />
          <Route path="members/view/:id" element={<ViewMember />} />
          <Route path="members/edit/:id" element={<EditMember />} />
          <Route path="members/renew/:id" element={<RenewMember />} />
          <Route path="members/new" element={<NewMemberForm />} />
          <Route path="membership-plans" element={<MembershipPlans />} />
          <Route path="fees" element={<FeeManagement />} />
          <Route path="branches" element={<BranchManagement />} />
          <Route path="reports" element={<Reports />} />
          <Route path="settings" element={<Settings />} />
          <Route path="payments/history/:memberId" element={<PaymentHistory />} />
          <Route path="payments/collect" element={<CollectPaymentPage />} />
          <Route path="payments/collect/:id" element={<CollectPaymentPage />} />
        </Route>

        {/* 404 FALLBACK */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </>
  );
}

export default AppRoutes;