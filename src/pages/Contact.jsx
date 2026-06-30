import React, { useState } from 'react';
import { FaCrown } from 'react-icons/fa';
import api from "../services/api";
import {
  FiPhone, FiMail, FiMapPin, FiClock, FiCheck,
  FiChevronDown, FiNavigation, FiLock, FiAlertCircle, FiCheckCircle
} from 'react-icons/fi';

const Contact = () => {
  const [expandedPolicy, setExpandedPolicy] = useState(0);

  // ── Form State ─────────────────────────────────────────────────────────────
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    goal: 'Weight Loss',
    message: '',
  });
  const [errors, setErrors]     = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading]   = useState(false);

  // ── Validation ─────────────────────────────────────────────────────────────
  const validate = () => {
    const e = {};

    // Name
    if (!formData.name.trim()) {
      e.name = 'Name is required.';
    } else if (formData.name.trim().length < 2) {
      e.name = 'Name must be at least 2 characters.';
    } else if (!/^[a-zA-Z\s]+$/.test(formData.name.trim())) {
      e.name = 'Name can only contain letters and spaces.';
    }

    // Phone
    const rawPhone = formData.phone.replace(/\s+/g, '').replace('+91', '').replace('-', '');
    if (!formData.phone.trim()) {
      e.phone = 'Phone number is required.';
    } else if (!/^[6-9]\d{9}$/.test(rawPhone)) {
      e.phone = 'Enter a valid 10-digit Indian phone number.';
    }

    // Email (optional — validate only if filled)
    if (formData.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      e.email = 'Enter a valid email address.';
    }

    // Message (optional — max 500 chars)
    if (formData.message.length > 500) {
      e.message = 'Message must be under 500 characters.';
    }

    return e;
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field on change
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

 const handleSubmit = async (e) => {
  e.preventDefault();

  const validationErrors = validate();

  if (Object.keys(validationErrors).length > 0) {
    setErrors(validationErrors);
    return;
  }

  setLoading(true);

  try {
    const response = await api.post("/contact", formData);

    if (response.data.success) {
      setSubmitted(true);

      setFormData({
        name: "",
        phone: "",
        email: "",
        goal: "Weight Loss",
        message: "",
      });

      setErrors({});
    }
  } catch (error) {
    console.error("Contact Form Error:", error);

    alert(
      error.response?.data?.message ||
      "Failed to submit enquiry. Please try again."
    );
  } finally {
    setLoading(false);
  }
};

  // ── Static Data ────────────────────────────────────────────────────────────
  const contactDetails = [
    {
      icon: <FiMapPin />,
      title: 'Our Address',
      lines: ['Thattanchavadi Karuppur,', 'Salem - 636012'],
    },
    {
      icon: <FiPhone />,
      title: 'Phone Number',
      lines: ['+91 80987 12009'],
    },
    {
      icon: <FiMail />,
      title: 'Email',
      lines: ['info@mugilfitness.com', 'support@spfitness.com'],
    },
  ];

  const clubHours = [
    { days: 'MONDAY - SATURDAY', hours: '04:00 AM - 09:00 AM', status: 'Morning Session' },
    { days: 'MONDAY - SATURDAY', hours: '04:00 PM - 09:00 PM', status: 'Evening Session' },
    { days: 'SUNDAY',            hours: '04:00 AM - 09:00 AM', status: 'Morning Session Only' },
  ];

  const securityPolicies = [
    {
      title: 'Biometric & QR Entry',
      desc: 'To keep our gym private and comfortable, entry requires a personal member QR code or biometric thumb scan. No walk-ins allowed.',
    },
    {
      title: 'Book Before You Visit',
      desc: 'New visitors must book a slot using the form before coming in. This ensures a staff member is available to guide you when you arrive.',
    },
  ];

  // ── Error field component ──────────────────────────────────────────────────
  const ErrorMsg = ({ msg }) =>
    msg ? (
      <span className="flex items-center gap-1 text-red-400 text-[9px] font-bold tracking-wide mt-1.5">
        <FiAlertCircle size={10} /> {msg}
      </span>
    ) : null;

  return (
    <div className="bg-[#030303] text-zinc-300 font-sans tracking-normal antialiased selection:bg-[#ffc114]/20 selection:text-[#ffc114]">

      {/* ── SECTION 1: HEADER ─────────────────────────────────────────────── */}
      <section className="pt-30 pb-12 px-6 md:px-12 lg:px-16 text-center relative z-30 border-b border-zinc-900">
        <div className="absolute left-1/2 top-0 -translate-x-1/2 w-[600px] h-[200px] bg-[#ffc114]/5 rounded-full blur-[140px] pointer-events-none" />
        <div   data-aos="fade-down"
  data-aos-duration="1000" className="max-w-[1400px] mx-auto space-y-4">
          <div className="inline-flex items-center gap-2.5 bg-[#0a0a0a] border border-zinc-800 px-4 py-1.5 shadow-sm">
            <FaCrown className="text-[#ffc114] text-[10px] animate-pulse" />
            <span className="text-[#ffc114] text-[9px] font-bold tracking-widest uppercase">Contact Us</span>
          </div>
          <h1 className="text-white font-gym-brutal text-3xl sm:text-4xl md:text-6xl uppercase tracking-tight">
            GET IN <span className="text-[#ffc114]">TOUCH</span>
          </h1>
          <p className="text-zinc-500 text-xs sm:text-sm font-light max-w-xl mx-auto leading-relaxed">
            Fill out the form below or call us directly to book a visit or ask about our membership plans.
          </p>
        </div>
      </section>

      {/* ── SECTION 2: CONTACT INFO + FORM ───────────────────────────────── */}
      <section className="py-24 px-6 md:px-12 lg:px-16 relative z-30 border-b border-zinc-900">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">

          {/* Left: Contact Details */}
          <div  data-aos="fade-right" className="lg:col-span-5 space-y-6">
            <span className="text-[#ffc114] text-[10px] font-bold tracking-widest uppercase block mb-2">// Contact Info</span>
            <div className="space-y-4">
              {contactDetails.map((info, idx) => (
                <div
                  key={idx}
                    data-aos="fade-up"
  data-aos-delay={idx * 150}
                  className="flex gap-6 items-center p-6 border border-zinc-900 bg-[#0a0a0a] group hover:border-zinc-700 transition-all duration-300 shadow-xs"
                >
                  <div className="w-11 h-11 bg-zinc-900 border border-zinc-800 flex items-center justify-center text-[#ffc114] text-base shrink-0 group-hover:bg-[#ffc114] group-hover:text-black transition-colors duration-300">
                    {info.icon}
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-zinc-500 font-bold text-[9px] tracking-widest uppercase">
                      {info.title}
                    </h4>
                    <div className="flex flex-col">
                      {info.lines.map((line, lIdx) => (
                        <span key={lIdx} className="text-white font-normal text-sm sm:text-base tracking-wide">
                          {line}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Contact Form */}
          <div  data-aos="fade-left"
  data-aos-delay="200" className="lg:col-span-7 bg-[#0a0a0a] border border-zinc-800 p-6 sm:p-10 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-zinc-900 pb-4 mb-8 select-none">
              <h3 className="text-white font-semibold text-xs tracking-wider uppercase flex items-center gap-2">
                <FiLock className="text-[#ffc114]" /> Send Us a Message
              </h3>
              <span className="text-[9px] font-mono text-zinc-600">SECURE FORM</span>
            </div>

            {/* Success State */}
            {submitted ? (
              <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
                <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
                  <FiCheckCircle className="text-emerald-400 text-2xl" />
                </div>
                <h4 className="text-white font-bold text-sm tracking-wider uppercase">Message Sent!</h4>
                <p className="text-zinc-500 text-xs max-w-xs leading-relaxed">
                  Thanks for reaching out. We'll get back to you shortly.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-2 text-[#ffc114] text-[10px] font-bold tracking-widest uppercase border-b border-transparent hover:border-[#ffc114] transition-all"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form   data-aos="zoom-in"
  data-aos-delay="300" onSubmit={handleSubmit} noValidate className="space-y-6">

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Name */}
                  <div className="flex flex-col">
                    <label className="text-zinc-400 text-[10px] font-bold tracking-wider uppercase mb-2">
                      Full Name <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleChange('name', e.target.value)}
                      placeholder="e.g., Alexander John"
                      className={`bg-black border text-white text-xs px-4 py-4 outline-none tracking-wide transition-all placeholder:text-zinc-700 ${errors.name ? 'border-red-500/60' : 'border-zinc-800 focus:border-[#ffc114]'}`}
                    />
                    <ErrorMsg msg={errors.name} />
                  </div>

                  {/* Phone */}
                  <div className="flex flex-col">
                    <label className="text-zinc-400 text-[10px] font-bold tracking-wider uppercase mb-2">
                      Phone Number <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleChange('phone', e.target.value)}
                      placeholder="e.g., 98765 43210"
                      maxLength={13}
                      className={`bg-black border text-white text-xs px-4 py-4 outline-none tracking-wide transition-all placeholder:text-zinc-700 ${errors.phone ? 'border-red-500/60' : 'border-zinc-800 focus:border-[#ffc114]'}`}
                    />
                    <ErrorMsg msg={errors.phone} />
                  </div>
                </div>

                {/* Email */}
                <div className="flex flex-col">
                  <label className="text-zinc-400 text-[10px] font-bold tracking-wider uppercase mb-2">
                    Email Address <span className="text-zinc-600 text-[8px] normal-case tracking-normal ml-1">(optional)</span>
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    placeholder="e.g., name@example.com"
                    className={`bg-black border text-white text-xs px-4 py-4 outline-none tracking-wide transition-all placeholder:text-zinc-700 ${errors.email ? 'border-red-500/60' : 'border-zinc-800 focus:border-[#ffc114]'}`}
                  />
                  <ErrorMsg msg={errors.email} />
                </div>

                {/* Fitness Goal */}
                <div className="flex flex-col">
                  <label className="text-zinc-400 text-[10px] font-bold tracking-wider uppercase mb-2">
                    Your Fitness Goal
                  </label>
                  <select
                    value={formData.goal}
                    onChange={(e) => handleChange('goal', e.target.value)}
                    className="w-full bg-black border border-zinc-800 text-zinc-400 text-xs px-4 py-4 outline-none focus:border-[#ffc114] tracking-wide transition-all cursor-pointer appearance-none"
                  >
                    <option value="Weight Loss">Weight Loss</option>
                    <option value="Weight Gain">Weight Gain & Muscle Building</option>
                    <option value="General Fitness">General Fitness</option>
                  </select>
                </div>

                {/* Message */}
                <div className="flex flex-col">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-zinc-400 text-[10px] font-bold tracking-wider uppercase">
                      Your Message <span className="text-zinc-600 text-[8px] normal-case tracking-normal ml-1">(optional)</span>
                    </label>
                    <span className={`text-[9px] font-mono ${formData.message.length > 450 ? 'text-red-400' : 'text-zinc-600'}`}>
                      {formData.message.length}/500
                    </span>
                  </div>
                  <textarea
                    rows="4"
                    value={formData.message}
                    onChange={(e) => handleChange('message', e.target.value)}
                    placeholder="Type your message or questions here..."
                    className={`bg-black border text-white text-xs px-4 py-4 outline-none tracking-wide transition-all resize-none placeholder:text-zinc-700 ${errors.message ? 'border-red-500/60' : 'border-zinc-800 focus:border-[#ffc114]'}`}
                  />
                  <ErrorMsg msg={errors.message} />
                </div>

                {/* Submit */}
                <div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#ffc114] text-black hover:bg-white font-black text-[11px] tracking-[0.25em] py-4 transition-all duration-300 uppercase cursor-pointer shadow-lg shadow-amber-500/5 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Sending...' : 'Send Message'}
                  </button>
                </div>

              </form>
            )}
          </div>

        </div>
      </section>

      {/* ── SECTION 3: GYM HOURS ──────────────────────────────────────────── */}
      <section className="py-24 px-6 md:px-12 lg:px-16 bg-[#060606] border-b border-zinc-900 select-none">
        <div className="max-w-[1400px] mx-auto">
          <div  data-aos="fade-right" className="mb-16 border-l-2 border-[#ffc114] pl-4">
            <span className="text-[#ffc114] text-[10px] font-bold tracking-widest block uppercase">// Timings</span>
            <h2 className="text-white font-gym-brutal text-2xl sm:text-3xl uppercase tracking-wide mt-1">Gym Hours</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {clubHours.map((time, idx) => (
              <div key={idx}  data-aos="flip-up"
  data-aos-delay={idx * 150} className="bg-black border border-zinc-900 p-6 flex flex-col justify-between h-36 shadow-xs">
                <div className="flex items-center justify-between border-b border-zinc-900 pb-2">
                  <span className="text-zinc-400 font-bold text-[10px] tracking-wide uppercase">{time.days}</span>
                  <FiClock className="text-[#ffc114] text-xs" />
                </div>
                <div className="space-y-1">
                  <div className="text-white font-gym-brutal text-lg sm:text-xl tracking-wide uppercase">{time.hours}</div>
                  <div className="inline-flex items-center gap-1.5 text-[10px] font-bold text-zinc-600 uppercase">
                    <FiCheck className="text-emerald-500" /> {time.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 4: POLICIES ───────────────────────────────────────────── */}
      <section className="py-24 px-6 md:px-12 lg:px-16 bg-[#030303] border-b border-zinc-900">
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

          <div  data-aos="fade-right" className="lg:col-span-5 space-y-2 select-none">
            <span className="text-[#ffc114] text-[10px] font-bold tracking-widest block uppercase">// Gym Rules</span>
            <h2 className="text-white font-gym-brutal text-2xl sm:text-3xl uppercase tracking-wide leading-none">
              ENTRY & <br /><span className="text-[#ffc114]">POLICIES</span>
            </h2>
            <p className="text-zinc-600 font-sans text-xs leading-relaxed mt-2">
              Please read our entry rules and booking requirements before visiting.
            </p>
          </div>

          <div  data-aos="fade-left" className="lg:col-span-7 space-y-4">
            {securityPolicies.map((item, idx) => {
              const isOpen = expandedPolicy === idx;
              return (
                <div
                  key={idx}
                    data-aos="fade-up"
  data-aos-delay={idx * 120}
                  onClick={() => setExpandedPolicy(isOpen ? null : idx)}
                  className={`border transition-all duration-500 p-6 cursor-pointer ${isOpen ? 'bg-[#0a0a0a] border-[#ffc114]' : 'bg-transparent border-zinc-900'}`}
                >
                  <div className="flex items-center justify-between gap-4">
                    <h4 className="text-white font-bold text-xs tracking-wider uppercase">{item.title}</h4>
                    <FiChevronDown className={`text-zinc-500 transition-transform ${isOpen ? 'rotate-180 text-[#ffc114]' : ''}`} />
                  </div>
                  <div className={`transition-all duration-500 overflow-hidden ${isOpen ? 'max-h-40 opacity-100 mt-4 pt-4 border-t border-zinc-900' : 'max-h-0 opacity-0 pointer-events-none'}`}>
                    <p className="text-zinc-500 text-xs leading-relaxed font-sans">{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ── SECTION 5: MAP ────────────────────────────────────────────────── */}
      <section className="py-24 px-6 md:px-12 lg:px-16 bg-[#020202]">
        <div className="max-w-[1400px] mx-auto">
          <div  data-aos="zoom-in"
  data-aos-duration="1000" className="w-full h-[280px] bg-[#0a0a0a] border border-zinc-900 flex flex-col items-center justify-center p-6 text-center relative group">
            <div className="w-10 h-10 bg-black border border-zinc-800 shadow-sm flex items-center justify-center text-[#ffc114] rounded-full mb-3">
              <FiNavigation className="text-base animate-pulse" />
            </div>
            <h3 className="text-white font-gym-brutal text-lg tracking-wider uppercase">Find Us on Google Maps</h3>
            <p className="text-zinc-500 text-xs font-light max-w-sm mt-1 mb-5">
              Click the button below to open Google Maps and get directions to our gym.
            </p>
            <a
              href="https://maps.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-zinc-900 hover:bg-[#ffc114] text-white hover:text-black border border-zinc-800 hover:border-[#ffc114] text-[10px] font-bold tracking-widest px-6 py-3 uppercase transition-all shadow-xs"
            >
              Get Directions
            </a>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Contact;