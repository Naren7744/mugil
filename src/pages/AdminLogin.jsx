import React, { useState } from 'react';
import api from "../services/api";
import { useNavigate } from 'react-router-dom';
import { 
  FiMail, FiLock, FiEye, FiEyeOff, FiActivity, 
  FiShield, FiCheckCircle, FiRefreshCw, FiArrowLeft, FiAlertTriangle
} from 'react-icons/fi';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // FORM MODES: 'login' | 'forgot' | 'sent'
  const [formMode, setFormMode] = useState('login');

  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [recoveryLoading, setRecoveryLoading] = useState(false);

  const [fieldErrors, setFieldErrors] = useState({});
  const [shakeTrigger, setShakeTrigger] = useState(false);

  const navigate = useNavigate();

  const getPasswordStrength = () => {
    if (!password) return 0;
    let strength = 0;
    if (password.length >= 6) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    return strength;
  };

  const triggerShake = () => {
    setShakeTrigger(true);
    setTimeout(() => setShakeTrigger(false), 500);
  };

  const validateLogin = () => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) errors.email = 'Email is required.';
    else if (!emailRegex.test(email)) errors.email = 'Enter a valid email address.';
    if (!password) errors.password = 'Password is required.';
    else if (password.length < 6) errors.password = 'Password must be at least 6 characters.';
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setFieldErrors({});
    if (!validateLogin()) { triggerShake(); return; }
    setLoading(true);
    try {
      const response = await api.post("/auth/login", {
        email: email.trim().toUpperCase(),
        password
      });
      if (response.data.token) {
        localStorage.setItem("adminToken", response.data.token);
        localStorage.setItem("admin", JSON.stringify(response.data.admin));
        localStorage.setItem("adminRole", response.data.admin.role);
        navigate('/admin/dashboard');
      }
    } catch (err) {
      triggerShake();
      setError(err.response?.data?.message || 'Incorrect email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const validateRecovery = () => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!recoveryEmail) errors.recoveryEmail = 'Please enter your registered email.';
    else if (!emailRegex.test(recoveryEmail)) errors.recoveryEmail = 'Enter a valid email address.';
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setError('');
    setFieldErrors({});
    if (!validateRecovery()) { triggerShake(); return; }
    setRecoveryLoading(true);
    try {
      // API call to send reset email
      await api.post("/auth/forgot-password", { email: recoveryEmail.trim() });
      setFormMode('sent');
    } catch (err) {
      triggerShake();
      setError(err.response?.data?.message || 'Could not send reset email. Please try again.');
    } finally {
      setRecoveryLoading(false);
    }
  };

  const resetToLogin = () => {
    setFormMode('login');
    setError('');
    setFieldErrors({});
    setRecoveryEmail('');
  };

  return (
    <div
      className={`w-full min-h-screen flex flex-col justify-start items-center font-sans antialiased bg-transparent px-4 overflow-y-auto pt-32 lg:pt-30 pb-8 relative ${shakeTrigger ? 'animate-shake' : ''}`}
    >
      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-[#ff4a4a]/[0.025] rounded-full blur-[180px] pointer-events-none z-0" />

      {/* Main card */}
      <div className="w-full max-w-4xl min-h-[460px] bg-[#0d0d11]/50 backdrop-blur-3xl border border-neutral-900 rounded-[1.5rem] shadow-[0_50px_100px_rgba(0,0,0,0.95)] flex flex-col md:flex-row overflow-hidden relative z-10 transition-all duration-500 hover:border-[#ff4a4a]/20">

        {/* Top accent line */}
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#ff4a4a]/30 to-transparent" />

        {/* LEFT — Brand panel */}
        <div className="w-full md:w-1/2 relative overflow-hidden p-10 flex flex-col justify-between items-center text-center border-b md:border-b-0 md:border-r border-neutral-900/60 bg-[#09090b]/30 min-h-[220px] md:min-h-full">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,74,74,0.04)_0%,transparent_70%)] z-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#060608]/90 via-transparent to-[#060608]/40 z-10" />
          <div
            className="absolute inset-0 opacity-15 scale-105 contrast-125 saturate-50"
            style={{
             backgroundImage: "url('/images/about-2.jpg')",
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
          <div className="my-auto relative z-20 flex flex-col items-center">
            <div className="w-12 h-12 bg-neutral-900/90 text-[#ff4a4a] rounded-2xl flex items-center justify-center mb-5 border border-neutral-800 shadow-[0_0_30px_rgba(255,74,74,0.1)]">
              <FiActivity size={22} className="animate-pulse" />
            </div>
            <h1 className="text-xl font-black tracking-[0.2em] text-white mb-2 uppercase">
              MUGIL <span className="text-[#ff4a4a]">SP</span> FITNESS
            </h1>
            <div className="w-10 h-[1px] bg-neutral-800/60 my-1.5" />
            <p className="text-neutral-500 text-[9px] uppercase tracking-[0.25em] mt-1">
              Admin Management Portal
            </p>
          </div>
          <div className="relative z-20 text-neutral-600 text-[8px] tracking-[0.3em] uppercase font-mono hidden md:block">
            SECURE CONNECTION // ACTIVE
          </div>
        </div>

        {/* RIGHT — Form panel */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-8 sm:p-10 relative bg-[#09090b]/10">
          <div className="absolute top-1/4 right-1/4 w-[250px] h-[250px] bg-[#ff4a4a]/[0.015] rounded-full blur-[100px] pointer-events-none" />

          <div className="w-full max-w-xs relative z-10">

            {/* ── MODE: LOGIN ── */}
            {formMode === 'login' && (
              <div>
                <div className="mb-6">
                  <h2 className="text-lg font-bold text-white tracking-tight mb-1 flex items-center gap-2">
                    Sign In <FiShield className="text-[#ff4a4a] text-sm" />
                  </h2>
                  <p className="text-neutral-500 text-xs tracking-wide">Enter your admin credentials to continue.</p>
                </div>

                {error && (
                  <div className="mb-4 p-3 bg-[#ff4a4a]/5 border border-[#ff4a4a]/10 text-[#ff4a4a] text-xs font-medium rounded-xl flex items-center gap-2">
                    <span className="w-1 h-1 bg-[#ff4a4a] rounded-full animate-ping shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <form onSubmit={handleLogin} className="space-y-4" noValidate>
                  {/* Email */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center px-1">
                      <label className="text-neutral-400 text-[9px] font-bold tracking-[0.15em] uppercase">Email</label>
                    </div>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-neutral-600">
                        <FiMail size={15} />
                      </span>
                      <input
                        type="email"
                        autoComplete="username"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="admin@mugilfitness.com"
                        className={`w-full pl-11 pr-4 py-3 bg-[#060608]/90 border rounded-xl text-white text-sm placeholder-neutral-700 focus:outline-none transition-all duration-300 shadow-inner ${fieldErrors.email ? 'border-red-500/50' : 'border-neutral-900 focus:border-neutral-700'}`}
                      />
                    </div>
                    {fieldErrors.email && <p className="text-red-400 text-[10px] pl-1 font-medium">{fieldErrors.email}</p>}
                  </div>

                  {/* Password */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center px-1">
                      <label className="text-neutral-400 text-[9px] font-bold tracking-[0.15em] uppercase">Password</label>
                      <button
                        type="button"
                        onClick={() => { setFormMode('forgot'); setError(''); setFieldErrors({}); }}
                        className="text-neutral-500 hover:text-[#ff4a4a] text-[9px] font-bold tracking-wider uppercase transition-colors duration-200 focus:outline-none"
                      >
                        Forgot password?
                      </button>
                    </div>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-neutral-600">
                        <FiLock size={15} />
                      </span>
                      <input
                        type={showPassword ? "text" : "password"}
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className={`w-full pl-11 pr-12 py-3 bg-[#060608]/90 border rounded-xl text-white text-sm placeholder-neutral-700 focus:outline-none transition-all duration-300 shadow-inner ${fieldErrors.password ? 'border-red-500/50' : 'border-neutral-900 focus:border-neutral-700'}`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-neutral-600 hover:text-white transition-colors duration-200 focus:outline-none"
                      >
                        {showPassword ? <FiEyeOff size={15} /> : <FiEye size={15} />}
                      </button>
                    </div>
                    {fieldErrors.password && <p className="text-red-400 text-[10px] pl-1 font-medium">{fieldErrors.password}</p>}

                    {password && !fieldErrors.password && (
                      <div className="pt-1 flex items-center gap-2 px-1">
                        <div className="flex gap-1 flex-1">
                          <div className={`h-[2px] flex-1 rounded-full transition-all duration-500 ${getPasswordStrength() >= 1 ? 'bg-[#ff4a4a]' : 'bg-neutral-900'}`} />
                          <div className={`h-[2px] flex-1 rounded-full transition-all duration-500 ${getPasswordStrength() >= 2 ? 'bg-[#ff4a4a]' : 'bg-neutral-900'}`} />
                          <div className={`h-[2px] flex-1 rounded-full transition-all duration-500 ${getPasswordStrength() >= 3 ? 'bg-emerald-500' : 'bg-neutral-900'}`} />
                        </div>
                        <span className="text-[8px] uppercase tracking-widest text-neutral-500 font-bold">
                          {getPasswordStrength() === 3 ? 'Strong' : 'Weak'}
                        </span>
                      </div>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full mt-2 relative overflow-hidden bg-neutral-950 text-neutral-400 border border-neutral-900 font-bold py-3 px-4 rounded-xl text-xs tracking-[0.2em] uppercase transition-all duration-300 hover:text-white hover:border-[#ff4a4a]/40 focus:outline-none disabled:opacity-40 shadow-xl group"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      {loading ? 'Signing in...' : 'Sign In'}
                    </span>
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,74,74,0.15)_0%,transparent_100%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </button>
                </form>
              </div>
            )}

            {/* ── MODE: FORGOT PASSWORD ── */}
            {formMode === 'forgot' && (
              <div>
                <div className="mb-5">
                  <h2 className="text-lg font-bold text-white tracking-tight mb-1 flex items-center gap-2">
                    Reset Password <FiRefreshCw className="text-amber-500 text-sm" />
                  </h2>
                  <p className="text-neutral-500 text-xs tracking-wide leading-relaxed">
                    Enter your registered email address. We'll send you a link to reset your password.
                  </p>
                </div>

                <div className="p-3 bg-amber-500/5 border border-amber-500/10 rounded-xl mb-4 flex items-start gap-2.5">
                  <FiAlertTriangle className="text-amber-500 mt-0.5 shrink-0" size={14} />
                  <p className="text-neutral-400 text-[10px] leading-relaxed">
                    Make sure to use the same email address you registered with.
                  </p>
                </div>

                {error && (
                  <div className="mb-4 p-3 bg-[#ff4a4a]/5 border border-[#ff4a4a]/10 text-[#ff4a4a] text-xs font-medium rounded-xl flex items-center gap-2">
                    <span className="w-1 h-1 bg-[#ff4a4a] rounded-full animate-ping shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <form onSubmit={handleForgotPassword} className="space-y-4" noValidate>
                  <div className="space-y-1.5">
                    <label className="text-neutral-400 text-[9px] font-bold tracking-[0.15em] uppercase block px-1">
                      Registered Email
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-neutral-600">
                        <FiMail size={15} />
                      </span>
                      <input
                        type="email"
                        autoComplete="username"
                        value={recoveryEmail}
                        onChange={(e) => setRecoveryEmail(e.target.value)}
                        placeholder="admin@mugilfitness.com"
                        className={`w-full pl-11 pr-4 py-3 bg-[#060608]/90 border rounded-xl text-white text-sm placeholder-neutral-700 focus:outline-none transition-all duration-300 shadow-inner ${fieldErrors.recoveryEmail ? 'border-red-500/50' : 'border-neutral-900 focus:border-neutral-700'}`}
                      />
                    </div>
                    {fieldErrors.recoveryEmail && (
                      <p className="text-red-400 text-[10px] pl-1 font-medium">{fieldErrors.recoveryEmail}</p>
                    )}
                  </div>

                  <div className="space-y-3 pt-1">
                    <button
                      type="submit"
                      disabled={recoveryLoading}
                      className="w-full relative overflow-hidden bg-neutral-950 text-amber-500 border border-neutral-900 font-bold py-3 px-4 rounded-xl text-xs tracking-[0.2em] uppercase transition-all duration-300 hover:text-white hover:border-amber-500/50 focus:outline-none disabled:opacity-40 group"
                    >
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        {recoveryLoading ? 'Sending...' : 'Send Reset Link'}
                      </span>
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.1)_0%,transparent_100%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </button>

                    <button
                      type="button"
                      onClick={resetToLogin}
                      className="w-full py-1 text-center text-neutral-500 hover:text-white text-[9px] font-bold tracking-[0.15em] uppercase transition-colors duration-200 flex items-center justify-center gap-1 focus:outline-none"
                    >
                      <FiArrowLeft size={11} /> Back to Sign In
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* ── MODE: EMAIL SENT CONFIRMATION ── */}
            {formMode === 'sent' && (
              <div className="flex flex-col items-center text-center gap-4 py-4">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                  <FiCheckCircle size={26} className="text-emerald-400" />
                </div>

                <div>
                  <h2 className="text-base font-bold text-white mb-2">Check your email</h2>
                  <p className="text-neutral-500 text-xs leading-relaxed">
                    We sent a password reset link to
                  </p>
                  <p className="text-white text-xs font-bold mt-1 break-all">{recoveryEmail}</p>
                  <p className="text-neutral-500 text-xs leading-relaxed mt-2">
                    Click the link in the email to set a new password. The link expires in 15 minutes.
                  </p>
                </div>

                <div className="w-full p-3 bg-amber-500/5 border border-amber-500/10 rounded-xl">
                  <p className="text-neutral-400 text-[10px] leading-relaxed">
                    Didn't receive the email? Check your spam folder or{' '}
                    <button
                      onClick={() => setFormMode('forgot')}
                      className="text-amber-500 hover:text-amber-400 font-bold underline focus:outline-none"
                    >
                      try again
                    </button>
                    .
                  </p>
                </div>

                <button
                  onClick={resetToLogin}
                  className="mt-2 text-[9px] font-bold text-neutral-500 hover:text-white uppercase tracking-widest flex items-center gap-1 focus:outline-none transition-colors duration-200"
                >
                  <FiArrowLeft size={11} /> Back to Sign In
                </button>
              </div>
            )}

            {/* Footer */}
            <div className="mt-8 pt-4 border-t border-neutral-900 flex justify-between text-[8px] text-neutral-600 tracking-[0.15em] uppercase font-mono">
              <div>SECURE // ACTIVE</div>
              <div>MUGIL FITNESS © 2026</div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;