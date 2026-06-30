import React from "react";
import { Link } from "react-router-dom";
import {
  FaInstagram,
  FaYoutube,
  FaFacebookF,
  FaWhatsapp,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaCrown,
} from "react-icons/fa";
import { FiArrowUp, FiSend } from "react-icons/fi";

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
  };

  return (
    <footer className="bg-[#020202] text-zinc-400 font-sans border-t border-white/[0.03] pt-6 pb-2 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 relative z-40 overflow-hidden select-none">
      {/* Ambient Luxury Glow Node System: Updated to premium #ffc114 */}
      <div className="absolute right-[-10%] bottom-[-10%] w-[500px] h-[500px] bg-[#ffc114]/[0.02] rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-[1400px] mx-auto relative z-10">
        {/* =========================================================================
            TOP LAYERING: EDITORIAL HUB HEADER & NEWSLETTER
            ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pb-8 border-b border-white/[0.04] mb-8">
          <div className="lg:col-span-7 space-y-2">
            <div className="flex items-center gap-2">
              <FaCrown className="text-[#ffc114] text-[10px] animate-pulse" />
              <span className="text-[#ffc114] text-[9px] font-black tracking-[0.3em] uppercase">
                PRIVILEGED DISPATCH
              </span>
            </div>
            <h3 className="text-white font-gym-brutal text-2xl sm:text-3xl uppercase tracking-tight leading-none">
              JOIN THE ELITE MEMBERS DISPATCH
            </h3>
          </div>

          <div className="lg:col-span-5 w-full">
            <form
              onSubmit={handleSubscribe}
              className="flex w-full bg-[#060606] border border-white/[0.04] p-1.5 focus-within:border-[#ffc114]/30 transition-all duration-500 shadow-2xl"
            >
              <input
                type="email"
                required
                placeholder="ENTER YOUR VIP EMAIL ADDRESS"
                className="w-full bg-transparent text-white text-[11px] tracking-[0.2em] px-4 py-3 outline-none uppercase placeholder:text-zinc-700"
              />
              <button
                type="submit"
                className="bg-[#ffc114] text-black hover:bg-white px-6 font-black text-[10px] tracking-[0.2em] uppercase transition-all duration-500 flex items-center gap-2 cursor-pointer shrink-0"
              >
                <span>JOIN</span>
                <FiSend className="text-xs" />
              </button>
            </form>
          </div>
        </div>

        {/* =========================================================================
            NEW LUXURY ROW GRID SYSTEM (Ultra-Different Minimalist Layout)
            ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8 mb-20 items-start">
          {/* LEFT BLOCK: Core Brand Statement (Updated Logo Navbar Style) */}
          <div className="lg:col-span-5 space-y-6">
            <Link
              to="/"
              className="flex items-center gap-3 group shrink-0 relative z-[1001]"
            >
              {/* COMPACT PREMIUM LOGO BADGE */}
              <div className="relative w-[40px] h-[40px] flex items-center justify-center">
                {/* Outer decorative ring */}
                <div
                  className="
                    absolute inset-[-2px]
                    rounded-[12px]
                    border border-[#ffc114]/20
                    group-hover:border-[#ffc114]/50
                    transition-all duration-500
                  "
                />

                {/* Corner accent dots */}
                <span className="absolute top-[2px] left-[2px] w-[3px] h-[3px] rounded-full bg-[#ffc114]/30 group-hover:bg-[#ffc114]/70 transition-all duration-500" />
                <span className="absolute top-[2px] right-[2px] w-[3px] h-[3px] rounded-full bg-[#ffc114]/30 group-hover:bg-[#ffc114]/70 transition-all duration-500" />

                {/* Ambient glow */}
                <div
                  className="
                    absolute inset-0
                    rounded-[12px]
                    bg-[#ffc114]/10
                    blur-xl
                    opacity-0
                    group-hover:opacity-100
                    transition-all duration-500
                  "
                />

                {/* Main Badge Box */}
                <div
                  className="
                    relative
                    w-full h-full
                    rounded-[10px]
                    bg-gradient-to-br from-[#1a1502]/95 to-[#080808]/95
                    border border-[#ffc114]/25
                    backdrop-blur-xl
                    overflow-hidden
                    flex items-center justify-center
                    transition-all duration-500
                    group-hover:border-[#ffc114]/70
                    group-hover:shadow-[0_0_25px_rgba(255,193,20,0.35),inset_0_0_12px_rgba(255,193,20,0.1)]
                  "
                >
                  {/* Inner light reflection */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] to-transparent" />

                  {/* NEW SHARP & COMPACT PREMIUM SVG LOGO */}
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="relative z-10"
                  >
                    {/* Premium Shield Profile */}
                    <path
                      d="M12 2L4 5V11C4 16.06 7.41 20.74 12 22C16.59 20.74 20 16.06 20 11V5L12 2Z"
                      stroke="url(#premiumGold)"
                      strokeWidth="1.5"
                      fill="#ffc114"
                      fillOpacity="0.08"
                    />
                    {/* Stylized Minimal Wing/Crown inside */}
                    <path
                      d="M8 9L12 11L16 9L12 15L8 9Z"
                      fill="url(#premiumGold)"
                    />
                    <path
                      d="M12 15V18"
                      stroke="url(#premiumGold)"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                    <defs>
                      <linearGradient
                        id="premiumGold"
                        x1="4"
                        y1="2"
                        x2="20"
                        y2="22"
                        gradientUnits="userSpaceOnUse"
                      >
                        <stop stopColor="#FFF5CC" />
                        <stop offset="0.5" stopColor="#ffc114" />
                        <stop offset="1" stopColor="#946f00" />
                      </linearGradient>
                    </defs>
                  </svg>

                  {/* Shine Sweep */}
                  <div
                    className="
                      absolute top-[-120%] left-[-40%]
                      w-[30%] h-[150%]
                      bg-white/20
                      rotate-[25deg]
                      blur-sm
                      transition-all duration-1000
                      group-hover:left-[140%]
                    "
                  />
                </div>
              </div>

              {/* BRAND TEXT — COMPACT & ALIGNED */}
              <div className="flex flex-col justify-center">
                <div className="flex items-center gap-1.5 leading-none">
                  <span className="text-[14px] font-black uppercase tracking-[0.08em] text-white">
                    MUGIL
                  </span>
                  <span className="text-[14px] font-black uppercase tracking-[0.08em] text-[#ffc114]">
                    FITNESS
                  </span>
                </div>
                <div className="flex items-center gap-1.5 mt-[4px] leading-none">
                  <div className="w-3 h-[1px] bg-[#ffc114]/60" />
                  <span className="text-[7px] uppercase tracking-[0.22em] text-zinc-400 font-bold">
                    & SP FITNESS
                  </span>
                  <div className="w-3 h-[1px] bg-[#ffc114]/60" />
                </div>
              </div>
            </Link>
            <p className="text-zinc-500 text-[12px] font-light tracking-wide leading-relaxed max-w-sm uppercase">
              We architect ultimate human performance configurations. A luxury
              sanctuary dedicated to biological mastery, precision diagnostics,
              and elite athletic infrastructure.
            </p>

            {/* 🌐 Updated Social Ecosystem (Clickable and Interactive) */}
            <div className="flex items-center gap-2.5 pt-2">
              <a
                href="https://wa.me/918098712009"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 bg-[#060606] border border-white/[0.04] flex items-center justify-center text-zinc-500 hover:text-black hover:bg-[#ffc114] hover:border-[#ffc114] transition-all duration-500 text-sm shadow-md"
              >
                <FaWhatsapp />
              </a>
              <a
                href="https://www.instagram.com/mugil_fitness?igsh=eWd6dmZzbjVxc2M3"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 bg-[#060606] border border-white/[0.04] flex items-center justify-center text-zinc-500 hover:text-black hover:bg-[#ffc114] hover:border-[#ffc114] transition-all duration-500 text-sm shadow-md"
              >
                <FaInstagram />
              </a>
              <a
                href="https://youtube.com/@mugilfitness?si=Xblf4UmfwxlxuH-c"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 bg-[#060606] border border-white/[0.04] flex items-center justify-center text-zinc-500 hover:text-black hover:bg-[#ffc114] hover:border-[#ffc114] transition-all duration-500 text-sm shadow-md"
              >
                <FaYoutube />
              </a>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 bg-[#060606] border border-white/[0.04] flex items-center justify-center text-zinc-500 hover:text-black hover:bg-[#ffc114] hover:border-[#ffc114] transition-all duration-500 text-sm shadow-md"
              >
                <FaFacebookF />
              </a>
            </div>
          </div>

          {/* RIGHT BLOCK: High-End Matrix Rows (7/12) */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-12 lg:gap-6">
            {/* ROW link block 1 */}
            <div className="space-y-5">
              <h4 className="text-white font-black text-[10px] tracking-[0.25em] uppercase border-l-2 border-[#ffc114] pl-3">
                EXPLORE
              </h4>
              <ul className="space-y-3.5 text-[10px] font-bold tracking-[0.15em]">
                {[
                  { name: "HOME", path: "/" },
                  { name: "ABOUT US", path: "/about" },
                  { name: "MEMBERSHIP", path: "/membership" },
                  { name: "TRAINERS", path: "/trainers" },
                  { name: "GALLERY", path: "/gallery" },
                  { name: "CONTACT", path: "/contact" },
                ].map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.path}
                      className="text-zinc-500 hover:text-[#ffc114] transition-colors duration-300 block transform hover:translate-x-1 transition-transform ease-out"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* ROW link block 2 */}
            <div className="space-y-5">
              <h4 className="text-white font-black text-[10px] tracking-[0.25em] uppercase border-l-2 border-[#ffc114] pl-3">
                PRIVILEGE
              </h4>
              <ul className="space-y-3.5 text-[10px] font-bold tracking-[0.15em]">
                {[
                  "FAQ SUITE",
                  "PRIVACY CODE",
                  "TERMS & RULES",
                  "REFUND POLICY",
                  "VIP ACCESS",
                ].map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-zinc-500 hover:text-[#ffc114] transition-colors duration-300 block transform hover:translate-x-1 transition-transform ease-out"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* ROW link block 3: Concierge Contacts */}
            <div className="space-y-5">
              <h4 className="text-white font-black text-[10px] tracking-[0.25em] uppercase border-l-2 border-[#ffc114] pl-3">
                CONTACT DESK
              </h4>
              <div className="space-y-4 text-[11px] font-semibold tracking-wider">
                <a
                  href="tel:8098712009"
                  className="flex items-center gap-3 group w-fit"
                >
                  <div className="w-7 h-7 bg-[#060606] border border-white/[0.04] flex items-center justify-center text-[#ffc114] group-hover:bg-[#ffc114] group-hover:text-black transition-all duration-500 shadow-md shrink-0">
                    <FaPhoneAlt className="text-[8px]" />
                  </div>
                  <span className="text-zinc-400 group-hover:text-white transition-colors tracking-wide">
                    +91 80987 12009
                  </span>
                </a>

                <div className="flex items-center gap-3 group w-fit">
                  <div className="w-7 h-7 bg-[#060606] border border-white/[0.04] flex items-center justify-center text-[#ffc114] group-hover:bg-[#ffc114] group-hover:text-black transition-all duration-500 shadow-md shrink-0">
                    <FaEnvelope className="text-[8px]" />
                  </div>
                  <span className="text-zinc-400 group-hover:text-white transition-colors lowercase font-sans text-[10.5px]">
                    concierge@mugilfitness.com
                  </span>
                </div>

                <div className="flex items-start gap-3 group leading-relaxed w-fit">
                  <div className="w-7 h-7 bg-[#060606] border border-white/[0.04] flex items-center justify-center text-[#ffc114] group-hover:bg-[#ffc114] group-hover:text-black transition-all duration-500 shadow-md shrink-0 mt-0.5">
                    <FaMapMarkerAlt className="text-[9px]" />
                  </div>
                  <span className="text-zinc-500 group-hover:text-zinc-300 transition-colors text-[9.5px] tracking-widest uppercase">
                    SALEM REGION, TN
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================================
            SUB-FOOTER: BRAND LOGISTICS METRICS & COPYRIGHT (Ultra Premium Redesign)
            ========================================================================= */}
        <div className="relative border-t border-white/[0.04] pt-5 mt-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-[9px] tracking-[0.3em] font-medium text-zinc-600 bg-gradient-to-r from-transparent via-white/[0.01] to-transparent py-4 px-4 rounded-lg backdrop-blur-sm group/sub">
          {/* Subtle bottom decorative accent lines */}
          <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-[#ffc114]/20 to-transparent transition-all duration-1000 group-hover/sub:via-[#ffc114]/40" />

          <p className="uppercase leading-relaxed text-center sm:text-left">
            &copy; {new Date().getFullYear()}{" "}
            <span className="text-zinc-300 font-black tracking-[0.25em] transition-colors duration-500 group-hover/sub:text-[#ffc114]">
              MUGIL FITNESS
            </span>{" "}
            &{" "}
            <span className="text-zinc-300 font-black tracking-[0.25em] transition-colors duration-500 group-hover/sub:text-[#ffc114]">
              SP FITNESS
            </span>
            . ALL RIGHTS RESERVED.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
