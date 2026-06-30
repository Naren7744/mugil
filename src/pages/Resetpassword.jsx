import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import {
  FiLock,
  FiEye,
  FiEyeOff,
  FiCheckCircle,
  FiActivity,
  FiAlertTriangle,
} from "react-icons/fi";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  const getStrength = () => {
    if (!newPassword) return 0;
    let s = 0;
    if (newPassword.length >= 6) s++;
    if (/[A-Z]/.test(newPassword)) s++;
    if (/[0-9]/.test(newPassword)) s++;
    return s;
  };

  const validate = () => {
    const errors = {};
    if (!newPassword) errors.newPassword = "Please enter a new password.";
    else if (newPassword.length < 6)
      errors.newPassword = "Password must be at least 6 characters.";
    if (!confirmPassword)
      errors.confirmPassword = "Please confirm your new password.";
    else if (newPassword !== confirmPassword)
      errors.confirmPassword = "Passwords do not match.";
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleReset = async (e) => {
    e.preventDefault();
    setError("");
    if (!validate()) return;
    setLoading(true);
    try {
      await api.post(`/auth/reset-password/${token}`, { newPassword });
      setSuccess(true);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "This reset link is invalid or has expired.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex flex-col justify-center items-center font-sans antialiased bg-[#060608] px-4 py-12 relative">
      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#ff4a4a]/[0.03] rounded-full blur-[180px] pointer-events-none" />

      <div className="w-full max-w-sm relative z-10">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-11 h-11 bg-neutral-900 text-[#ff4a4a] rounded-2xl flex items-center justify-center mb-3 border border-neutral-800 shadow-[0_0_30px_rgba(255,74,74,0.1)]">
            <FiActivity size={20} className="animate-pulse" />
          </div>
          <h1 className="text-sm font-black tracking-[0.2em] text-white uppercase">
            MUGIL <span className="text-[#ff4a4a]">SP</span> FITNESS
          </h1>
        </div>

        {/* Card */}
        <div className="bg-[#0d0d11]/80 backdrop-blur-xl border border-neutral-900 rounded-[2rem] p-8 shadow-[0_40px_80px_rgba(0,0,0,0.8)] relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#ff4a4a]/30 to-transparent" />

          {/* SUCCESS STATE */}
          {success ? (
            <div className="flex flex-col items-center text-center gap-4 py-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                <FiCheckCircle size={26} className="text-emerald-400" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white mb-2">
                  Password Updated
                </h2>
                <p className="text-neutral-500 text-xs leading-relaxed">
                  Your password has been changed successfully. You can now sign
                  in with your new password.
                </p>
              </div>
              <button
                onClick={() => navigate("/login")}
                className="mt-2 w-full bg-neutral-950 text-white border border-neutral-800 font-bold py-3 px-4 rounded-xl text-xs tracking-[0.2em] uppercase transition-all duration-300 hover:border-[#ff4a4a]/40 focus:outline-none"
              >
                Go to Sign In
              </button>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <h2 className="text-lg font-bold text-white tracking-tight mb-1">
                  Set New Password
                </h2>
                <p className="text-neutral-500 text-xs leading-relaxed">
                  Choose a strong password for your admin account.
                </p>
              </div>

              {/* Expired link error */}
              {error && (
                <div className="mb-4 p-3 bg-[#ff4a4a]/5 border border-[#ff4a4a]/10 rounded-xl flex items-start gap-2.5">
                  <FiAlertTriangle
                    className="text-[#ff4a4a] mt-0.5 shrink-0"
                    size={14}
                  />
                  <div>
                    <p className="text-[#ff4a4a] text-xs font-medium">
                      {error}
                    </p>
                    <button
                      onClick={() => navigate("/login")}
                      className="text-[10px] text-neutral-500 hover:text-white underline mt-1 focus:outline-none"
                    >
                      Request a new reset link →
                    </button>
                  </div>
                </div>
              )}

              <form onSubmit={handleReset} className="space-y-4" noValidate>
                {/* New Password */}
                <div className="space-y-1.5">
                  <label className="text-neutral-400 text-[9px] font-bold tracking-[0.15em] uppercase block px-1">
                    New Password
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-neutral-600">
                      <FiLock size={15} />
                    </span>
                    <input
                      type={showNew ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Min. 6 characters"
                      className={`w-full pl-11 pr-12 py-3 bg-[#060608]/90 border rounded-xl text-white text-sm placeholder-neutral-700 focus:outline-none transition-all duration-300 shadow-inner ${fieldErrors.newPassword ? "border-red-500/50" : "border-neutral-900 focus:border-neutral-700"}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNew(!showNew)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-neutral-600 hover:text-white transition-colors focus:outline-none"
                    >
                      {showNew ? <FiEyeOff size={15} /> : <FiEye size={15} />}
                    </button>
                  </div>
                  {fieldErrors.newPassword && (
                    <p className="text-red-400 text-[10px] pl-1 font-medium">
                      {fieldErrors.newPassword}
                    </p>
                  )}
                  {/* Strength bar */}
                  {newPassword && !fieldErrors.newPassword && (
                    <div className="pt-1 flex items-center gap-2 px-1">
                      <div className="flex gap-1 flex-1">
                        <div
                          className={`h-[2px] flex-1 rounded-full transition-all duration-500 ${getStrength() >= 1 ? "bg-[#ff4a4a]" : "bg-neutral-900"}`}
                        />
                        <div
                          className={`h-[2px] flex-1 rounded-full transition-all duration-500 ${getStrength() >= 2 ? "bg-[#ff4a4a]" : "bg-neutral-900"}`}
                        />
                        <div
                          className={`h-[2px] flex-1 rounded-full transition-all duration-500 ${getStrength() >= 3 ? "bg-emerald-500" : "bg-neutral-900"}`}
                        />
                      </div>
                      <span className="text-[8px] uppercase tracking-widest text-neutral-500 font-bold">
                        {getStrength() === 3 ? "Strong" : "Weak"}
                      </span>
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="space-y-1.5">
                  <label className="text-neutral-400 text-[9px] font-bold tracking-[0.15em] uppercase block px-1">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-neutral-600">
                      <FiLock size={15} />
                    </span>
                    <input
                      type={showConfirm ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter new password"
                      className={`w-full pl-11 pr-12 py-3 bg-[#060608]/90 border rounded-xl text-white text-sm placeholder-neutral-700 focus:outline-none transition-all duration-300 shadow-inner ${fieldErrors.confirmPassword ? "border-red-500/50" : "border-neutral-900 focus:border-neutral-700"}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-neutral-600 hover:text-white transition-colors focus:outline-none"
                    >
                      {showConfirm ? (
                        <FiEyeOff size={15} />
                      ) : (
                        <FiEye size={15} />
                      )}
                    </button>
                  </div>
                  {fieldErrors.confirmPassword && (
                    <p className="text-red-400 text-[10px] pl-1 font-medium">
                      {fieldErrors.confirmPassword}
                    </p>
                  )}
                  {/* Match indicator */}
                  {confirmPassword &&
                    newPassword &&
                    !fieldErrors.confirmPassword && (
                      <p
                        className={`text-[10px] pl-1 font-medium ${newPassword === confirmPassword ? "text-emerald-400" : "text-red-400"}`}
                      >
                        {newPassword === confirmPassword
                          ? "✓ Passwords match"
                          : "✗ Passwords do not match"}
                      </p>
                    )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-2 relative overflow-hidden bg-neutral-950 text-neutral-400 border border-neutral-900 font-bold py-3 px-4 rounded-xl text-xs tracking-[0.2em] uppercase transition-all duration-300 hover:text-white hover:border-[#ff4a4a]/40 focus:outline-none disabled:opacity-40 shadow-xl group"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {loading ? "Updating..." : "Update Password"}
                  </span>
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,74,74,0.15)_0%,transparent_100%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </button>
              </form>
            </>
          )}

          {/* Footer */}
          <div className="mt-6 pt-4 border-t border-neutral-900 flex justify-between text-[8px] text-neutral-600 tracking-[0.15em] uppercase font-mono">
            <div>SECURE // ACTIVE</div>
            <div>MUGIL FITNESS © 2026</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
