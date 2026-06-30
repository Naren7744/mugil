import React, { useState, useEffect, useCallback } from "react";
import { useOutletContext } from "react-router-dom";
import PageHeader from "../../components/dashboard/PageHeader";
import {
  FiBriefcase,
  FiDollarSign,
  FiBell,
  FiSave,
  FiLock,
  FiShield,
  FiGlobe,
  FiCheckCircle,
  FiAlertCircle,
  FiLoader,
} from "react-icons/fi";
import api from "../../services/api";

// ─── Toast Component ───────────────────────────────────────────────────────────
function Toast({ toast }) {
  if (!toast.show) return null;
  return (
    <div
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl border text-sm font-bold transition-all duration-500 ${
        toast.type === "success"
          ? "bg-white border-emerald-200 text-emerald-700 shadow-emerald-100"
          : "bg-white border-red-200 text-red-600 shadow-red-100"
      }`}
    >
      {toast.type === "success" ? (
        <FiCheckCircle className="text-emerald-500 text-base shrink-0" />
      ) : (
        <FiAlertCircle className="text-red-500 text-base shrink-0" />
      )}
      {toast.message}
    </div>
  );
}

// ─── Skeleton Loader ───────────────────────────────────────────────────────────
function SkeletonField() {
  return <div className="h-[52px] bg-slate-100 rounded-xl animate-pulse" />;
}

function SkeletonTab() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div className="space-y-2">
        <div className="h-6 w-40 bg-slate-100 rounded-lg animate-pulse" />
        <div className="h-4 w-72 bg-slate-100 rounded-lg animate-pulse" />
      </div>
      <div className="h-[1px] w-full bg-slate-100" />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="space-y-1.5">
            <div className="h-3 w-24 bg-slate-100 rounded animate-pulse" />
            <SkeletonField />
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Toggle Switch ─────────────────────────────────────────────────────────────
function Toggle({ checked, onChange }) {
  return (
    <button
      type="button"
      onClick={onChange}
      className={`w-11 h-6 rounded-full transition-all duration-300 relative p-1 shrink-0 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
        checked ? "bg-indigo-600" : "bg-slate-200"
      }`}
    >
      <div
        className={`w-4 h-4 rounded-full bg-white transition-all transform shadow-md ${
          checked ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  );
}

// ─── Input Field ───────────────────────────────────────────────────────────────
function Field({ label, children }) {
  return (
    <div className="space-y-1.5">
      <label className="text-[11px] font-black text-slate-400 uppercase tracking-wider block">
        {label}
      </label>
      {children}
    </div>
  );
}

const inputCls =
  "w-full px-4 py-3.5 bg-slate-50/50 border border-slate-200/80 rounded-xl text-sm font-semibold text-slate-800 focus:bg-white focus:ring-4 focus:ring-indigo-600/5 focus:border-indigo-600 transition-all outline-none placeholder:text-slate-300";

const selectCls =
  "w-full px-4 py-3.5 bg-slate-50/50 border border-slate-200/80 rounded-xl text-sm font-semibold text-slate-700 outline-none focus:bg-white focus:ring-4 focus:ring-indigo-600/5 focus:border-indigo-600 transition-all appearance-none cursor-pointer";

// ─── Main Settings Page ────────────────────────────────────────────────────────
function Settings() {
  const { currentBranch } = useOutletContext();
  const [activeTab, setActiveTab] = useState("general");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState({
    show: false,
    type: "success",
    message: "",
  });

  // ── Form State (mirrors schema exactly) ────────────────────────────────────
  const [gymData, setGymData] = useState({
    gymName: "",
    phone: "",
    email: "",
    gst: "",
    currency: "INR (₹)",
    timezone: "IST (UTC+05:30)",
  });

  const [profileData, setProfileData] = useState({
    adminName: "",
    adminEmail: "",
    sessionTimeout: 30,
    twoFactorAuth: true,
  });

  const [financeData, setFinanceData] = useState({
    upiId: "",
    lateFee: 0,
    invoicePrefix: "MF-INV-",
    gstSlab: 18,
    convenienceFee: 0,
  });

  const [notifications, setNotifications] = useState({
    expiryReminderSMS: true,
    expiryReminderWA: true,
    paymentReminderSMS: true,
    paymentReminderEmail: true,
    welcomeMessageWA: true,
    birthdayWishesWA: true,
  });

  // ── Show toast helper ───────────────────────────────────────────────────────
  const showToast = useCallback((type, message) => {
    setToast({ show: true, type, message });
    setTimeout(() => setToast((t) => ({ ...t, show: false })), 3500);
  }, []);

  // ── Fetch settings on mount ─────────────────────────────────────────────────
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const { data } = await api.get("/settings");
        if (data.success && data.data) {
          const s = data.data;
          setGymData({
            gymName: s.gymName || "",
            phone: s.phone || "",
            email: s.email || "",
            gst: s.gst || "",
            currency: s.currency || "INR (₹)",
            timezone: s.timezone || "IST (UTC+05:30)",
          });
          setProfileData({
            adminName: s.adminName || "",
            adminEmail: s.adminEmail || "",
            sessionTimeout: s.sessionTimeout || 30,
            twoFactorAuth: s.twoFactorAuth ?? true,
          });
          setFinanceData({
            upiId: s.upiId || "",
            lateFee: s.lateFee ?? 0,
            invoicePrefix: s.invoicePrefix || "MF-INV-",
            gstSlab: s.gstSlab ?? 18,
            convenienceFee: s.convenienceFee ?? 0,
          });
          if (s.notifications) {
            setNotifications({
              expiryReminderSMS: s.notifications.expiryReminderSMS ?? true,
              expiryReminderWA: s.notifications.expiryReminderWA ?? true,
              paymentReminderSMS: s.notifications.paymentReminderSMS ?? true,
              paymentReminderEmail:
                s.notifications.paymentReminderEmail ?? true,
              welcomeMessageWA: s.notifications.welcomeMessageWA ?? true,
              birthdayWishesWA: s.notifications.birthdayWishesWA ?? true,
            });
          }
        }
      } catch (err) {
        console.error("Failed to load settings:", err);
        showToast("error", "Couldn't load settings. Please refresh.");
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, [showToast]);

  // ── Save all settings ───────────────────────────────────────────────────────
  const handleSave = async () => {
    if (saving) return;
    try {
      setSaving(true);
      const payload = {
        ...gymData,
        ...profileData,
        ...financeData,
        notifications,
      };
      const { data } = await api.put("/settings", payload);
      if (data.success) {
        showToast("success", "Settings saved successfully.");
      } else {
        showToast("error", data.message || "Something went wrong.");
      }
    } catch (err) {
      console.error("Failed to save settings:", err);
      showToast("error", "Couldn't save settings. Try again.");
    } finally {
      setSaving(false);
    }
  };

  const toggleNotification = (key) =>
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));

  // ── Tabs config ─────────────────────────────────────────────────────────────
  const tabs = [
    { id: "general", label: "Gym Details", icon: <FiBriefcase /> },
    { id: "identity", label: "Security", icon: <FiLock /> },
    { id: "finance", label: "Payments & Tax", icon: <FiDollarSign /> },
    { id: "notifications", label: "Notifications", icon: <FiBell /> },
  ];

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="w-full font-sans text-slate-800 bg-[#f8fafc] min-h-screen pb-20 antialiased selection:bg-indigo-600 selection:text-white">
      <Toast toast={toast} />

      {/* ── Page Header ─────────────────────────────────────────────────────── */}
      <div className="mb-8 bg-white border border-slate-200/50 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <PageHeader
          title={
            <span className="text-2xl font-black text-slate-900 tracking-tight">
              Settings
            </span>
          }
          description="Manage your gym details, security, payments, and notification preferences."
        />
        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200/60 px-4 py-2 rounded-2xl">
          <span
            className={`w-2 h-2 rounded-full ${loading ? "bg-amber-400" : "bg-emerald-500 animate-pulse"}`}
          />
          <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
            {loading ? "Loading..." : "All Systems Online"}
          </span>
        </div>
      </div>

      {/* ── Settings Panel ──────────────────────────────────────────────────── */}
      <div className="bg-white border border-slate-200/60 rounded-3xl shadow-sm overflow-hidden grid grid-cols-1 md:grid-cols-4 min-h-[650px]">
        {/* Sidebar */}
        <div className="md:col-span-1 p-6 flex flex-col justify-between border-r border-slate-100 bg-slate-50/50">
          <div className="space-y-1.5">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-3 mb-5">
              Settings
            </p>
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3.5 px-4 py-3.5 text-xs font-bold rounded-xl transition-all duration-200 tracking-wide ${
                    isActive
                      ? "bg-white text-slate-900 shadow-sm border border-slate-200/80"
                      : "text-slate-400 border border-transparent hover:bg-white hover:text-slate-700 hover:shadow-sm hover:border-slate-200/60"
                  }`}
                >
                  <span
                    className={`text-base transition-colors duration-200 ${isActive ? "text-indigo-600" : "text-slate-400"}`}
                  >
                    {tab.icon}
                  </span>
                  {tab.label}
                  {isActive && (
                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-500" />
                  )}
                </button>
              );
            })}
          </div>

          <div className="pt-6 mt-6 border-t border-slate-200/60">
            <button
              onClick={handleSave}
              disabled={saving || loading}
              className="w-full bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 disabled:cursor-not-allowed text-white text-xs font-black py-4 rounded-xl transition-all duration-200 shadow-lg shadow-slate-900/10 hover:shadow-xl flex items-center justify-center gap-2 uppercase tracking-widest active:scale-[0.98]"
            >
              {saving ? (
                <>
                  <FiLoader className="text-sm animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <FiSave className="text-sm" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="md:col-span-3 p-8 lg:p-12 bg-white">
          {/* ── TAB 1: Gym Details ─────────────────────────────────────────── */}
          {activeTab === "general" && (
            <div className="space-y-8 max-w-4xl">
              <div>
                <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
                  Gym Details
                </h3>
                <p className="text-sm text-slate-400 mt-1">
                  Update your gym's basic information, currency, and timezone.
                </p>
              </div>
              <div className="h-[1px] w-full bg-slate-100" />

              {loading ? (
                <SkeletonTab />
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <Field label="Gym Name">
                      <input
                        type="text"
                        value={gymData.gymName}
                        onChange={(e) =>
                          setGymData({ ...gymData, gymName: e.target.value })
                        }
                        placeholder="e.g. Mugil & SP Fitness"
                        className={inputCls}
                      />
                    </Field>
                    <Field label="Phone Number">
                      <input
                        type="text"
                        value={gymData.phone}
                        onChange={(e) =>
                          setGymData({ ...gymData, phone: e.target.value })
                        }
                        placeholder="+91 98765 43210"
                        className={inputCls}
                      />
                    </Field>
                    <Field label="Email Address">
                      <input
                        type="email"
                        value={gymData.email}
                        onChange={(e) =>
                          setGymData({ ...gymData, email: e.target.value })
                        }
                        placeholder="info@mugilfitness.com"
                        className={inputCls}
                      />
                    </Field>

                    <Field label="Currency">
                      <select
                        value={gymData.currency}
                        onChange={(e) =>
                          setGymData({ ...gymData, currency: e.target.value })
                        }
                        className={selectCls}
                      >
                        <option>INR (₹)</option>
                        <option>USD ($)</option>
                        <option>EUR (€)</option>
                      </select>
                    </Field>
                    <Field label="Timezone">
                      <select
                        value={gymData.timezone}
                        onChange={(e) =>
                          setGymData({ ...gymData, timezone: e.target.value })
                        }
                        className={selectCls}
                      >
                        <option>IST (UTC+05:30)</option>
                        <option>EST (UTC-05:00)</option>
                        <option>GMT (UTC+00:00)</option>
                      </select>
                    </Field>
                  </div>

                  {/* Branch Locations */}
                  <div className="pt-8 border-t border-slate-100 space-y-4">
                    <div className="flex justify-between items-center">
                      <h4 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                        <FiGlobe className="text-indigo-500" /> Branch Locations
                      </h4>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {[
                        { name: "Mugil Fitness — Main", sub: "Primary branch" },
                        { name: "SP Fitness — Branch", sub: "Sub branch" },
                      ].map((b) => (
                        <div
                          key={b.name}
                          className="p-5 border border-slate-200/60 rounded-2xl bg-slate-50/40 flex justify-between items-center hover:shadow-md hover:border-slate-300 transition-all duration-300"
                        >
                          <div>
                            <p className="text-sm font-bold text-slate-800">
                              {b.name}
                            </p>
                            <p className="text-[11px] font-medium text-slate-400 mt-1">
                              {b.sub}
                            </p>
                          </div>
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-md shadow-emerald-500/40" />
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* ── TAB 2: Security ───────────────────────────────────────────── */}
          {activeTab === "identity" && (
            <div className="space-y-8 max-w-4xl">
              <div>
                <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
                  Security
                </h3>
                <p className="text-sm text-slate-400 mt-1">
                  Manage your admin login, session settings, and account
                  security.
                </p>
              </div>
              <div className="h-[1px] w-full bg-slate-100" />

              {loading ? (
                <SkeletonTab />
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <Field label="Admin Name">
                      <input
                        type="text"
                        value={profileData.adminName}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            adminName: e.target.value,
                          })
                        }
                        placeholder="Enter Your Name"
                        className={inputCls}
                      />
                    </Field>
                    <Field label="Admin Email">
                      <input
                        type="email"
                        value={profileData.adminEmail}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            adminEmail: e.target.value,
                          })
                        }
                        placeholder="Enter Your E-Mail"
                        className={inputCls}
                      />
                    </Field>
                    <Field label="Auto Logout After">
                      <select
                        value={profileData.sessionTimeout}
                        onChange={(e) =>
                          setProfileData({
                            ...profileData,
                            sessionTimeout: Number(e.target.value),
                          })
                        }
                        className={selectCls}
                      >
                        <option value={15}>15 minutes of inactivity</option>
                        <option value={30}>30 minutes of inactivity</option>
                        <option value={60}>60 minutes of inactivity</option>
                      </select>
                    </Field>
                  </div>

                  {/* 2FA */}
                  <div className="pt-6 border-t border-slate-100 space-y-4">
                    <h4 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                      <FiShield className="text-indigo-500" /> Security Options
                    </h4>
                    <div className="p-5 bg-slate-50/60 border border-slate-200/60 rounded-2xl flex justify-between items-center gap-4">
                      <div className="space-y-0.5">
                        <span className="text-sm font-bold text-slate-800 block">
                          Two-Factor Authentication (2FA)
                        </span>
                        <span className="text-xs text-slate-400 block">
                          Require an OTP on every login for extra security.
                        </span>
                      </div>
                      <Toggle
                        checked={profileData.twoFactorAuth}
                        onChange={() =>
                          setProfileData({
                            ...profileData,
                            twoFactorAuth: !profileData.twoFactorAuth,
                          })
                        }
                      />
                    </div>
                  </div>

                  {/* Change Password */}
                  <div className="p-5 bg-slate-950 border border-slate-900 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-xl">
                    <div>
                      <span className="text-sm font-bold text-white block">
                        Change Password
                      </span>
                      <span className="text-xs font-mono text-slate-500 tracking-widest block mt-1">
                        Last updated: 3 months ago
                      </span>
                    </div>
                    <button
                      type="button"
                      className="text-xs font-black uppercase bg-white/10 hover:bg-white/20 text-white border border-white/10 px-5 py-3 rounded-xl transition-all duration-300 active:scale-95"
                    >
                      Update Password
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

          {/* ── TAB 3: Payments & Tax ─────────────────────────────────────── */}
          {activeTab === "finance" && (
            <div className="space-y-8 max-w-4xl">
              <div>
                <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
                  Payments & Tax
                </h3>
                <p className="text-sm text-slate-400 mt-1">
                  Set up your UPI, late fees, invoice format, and GST details.
                </p>
              </div>
              <div className="h-[1px] w-full bg-slate-100" />

              {loading ? (
                <SkeletonTab />
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <Field label="UPI ID">
                    <input
                      type="text"
                      value={financeData.upiId}
                      onChange={(e) =>
                        setFinanceData({
                          ...financeData,
                          upiId: e.target.value,
                        })
                      }
                      placeholder="mugilspfitness@upi"
                      className={`${inputCls} font-mono`}
                    />
                  </Field>
                  <Field label="Late Fee Amount (₹)">
                    <input
                      type="number"
                      min={0}
                      value={financeData.lateFee}
                      onChange={(e) =>
                        setFinanceData({
                          ...financeData,
                          lateFee: Number(e.target.value),
                        })
                      }
                      className={inputCls}
                    />
                  </Field>
                  <Field label="Invoice Prefix">
                    <input
                      type="text"
                      value={financeData.invoicePrefix}
                      onChange={(e) =>
                        setFinanceData({
                          ...financeData,
                          invoicePrefix: e.target.value,
                        })
                      }
                      placeholder="MF-INV-"
                      className={`${inputCls} font-mono`}
                    />
                  </Field>
                  <Field label="GST Rate">
                    <select
                      value={financeData.gstSlab}
                      onChange={(e) =>
                        setFinanceData({
                          ...financeData,
                          gstSlab: Number(e.target.value),
                        })
                      }
                      className={selectCls}
                    >
                      <option value={0}>0% — Exempt</option>
                      <option value={5}>5%</option>
                      <option value={12}>12%</option>
                      <option value={18}>18% — Standard</option>
                    </select>
                  </Field>
                  <Field label="Online Payment Convenience Fee (%)">
                    <input
                      type="number"
                      min={0}
                      step={0.1}
                      value={financeData.convenienceFee}
                      onChange={(e) =>
                        setFinanceData({
                          ...financeData,
                          convenienceFee: Number(e.target.value),
                        })
                      }
                      className={inputCls}
                    />
                  </Field>
                </div>
              )}
            </div>
          )}

          {/* ── TAB 4: Notifications ──────────────────────────────────────── */}
          {activeTab === "notifications" && (
            <div className="space-y-8 max-w-4xl">
              <div>
                <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
                  Notifications
                </h3>
                <p className="text-sm text-slate-400 mt-1">
                  Choose how and when members get notified via SMS, WhatsApp, or
                  Email.
                </p>
              </div>
              <div className="h-[1px] w-full bg-slate-100" />

              {loading ? (
                <div className="space-y-4">
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className="h-20 bg-slate-100 rounded-2xl animate-pulse"
                    />
                  ))}
                </div>
              ) : (
                <div className="divide-y divide-slate-100 bg-slate-50/30 border border-slate-200/60 rounded-2xl px-6">
                  {/* Expiry Reminder */}
                  <div className="py-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="space-y-0.5">
                      <span className="text-sm font-bold text-slate-800 block">
                        Membership Expiry Reminder
                      </span>
                      <span className="text-xs text-slate-400 block">
                        Send a reminder 7 days before a member's plan expires.
                      </span>
                    </div>
                    <div className="flex items-center gap-5 bg-white px-4 py-2.5 border border-slate-200 rounded-xl shrink-0">
                      <label className="flex items-center gap-2 text-xs font-semibold text-slate-600 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={notifications.expiryReminderSMS}
                          onChange={() =>
                            toggleNotification("expiryReminderSMS")
                          }
                          className="rounded w-4 h-4 accent-indigo-600"
                        />
                        SMS
                      </label>
                      <label className="flex items-center gap-2 text-xs font-semibold text-slate-600 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={notifications.expiryReminderWA}
                          onChange={() =>
                            toggleNotification("expiryReminderWA")
                          }
                          className="rounded w-4 h-4 accent-indigo-600"
                        />
                        WhatsApp
                      </label>
                    </div>
                  </div>

                  {/* Payment Confirmation */}
                  <div className="py-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="space-y-0.5">
                      <span className="text-sm font-bold text-slate-800 block">
                        Payment Confirmation
                      </span>
                      <span className="text-xs text-slate-400 block">
                        Notify members instantly when a payment is received.
                      </span>
                    </div>
                    <div className="flex items-center gap-5 bg-white px-4 py-2.5 border border-slate-200 rounded-xl shrink-0">
                      <label className="flex items-center gap-2 text-xs font-semibold text-slate-600 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={notifications.paymentReminderSMS}
                          onChange={() =>
                            toggleNotification("paymentReminderSMS")
                          }
                          className="rounded w-4 h-4 accent-indigo-600"
                        />
                        SMS
                      </label>
                      <label className="flex items-center gap-2 text-xs font-semibold text-slate-600 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={notifications.paymentReminderEmail}
                          onChange={() =>
                            toggleNotification("paymentReminderEmail")
                          }
                          className="rounded w-4 h-4 accent-indigo-600"
                        />
                        Email
                      </label>
                    </div>
                  </div>

                  {/* Welcome Message */}
                  <div className="py-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="space-y-0.5">
                      <span className="text-sm font-bold text-slate-800 block">
                        Welcome Message for New Members
                      </span>
                      <span className="text-xs text-slate-400 block">
                        Send a welcome message with membership details when
                        someone joins.
                      </span>
                    </div>
                    <Toggle
                      checked={notifications.welcomeMessageWA}
                      onChange={() => toggleNotification("welcomeMessageWA")}
                    />
                  </div>

                  {/* Birthday Wishes */}
                  <div className="py-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="space-y-0.5">
                      <span className="text-sm font-bold text-slate-800 block">
                        Birthday Wishes
                      </span>
                      <span className="text-xs text-slate-400 block">
                        Automatically send a birthday message to members on
                        their special day.
                      </span>
                    </div>
                    <Toggle
                      checked={notifications.birthdayWishesWA}
                      onChange={() => toggleNotification("birthdayWishesWA")}
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Settings;
