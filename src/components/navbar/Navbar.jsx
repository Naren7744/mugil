import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { HiMenu, HiX } from 'react-icons/hi'; 
import { FiChevronRight, FiLock } from 'react-icons/fi';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const navLinks = [
    { name: 'HOME', path: '/' },
    { name: 'ABOUT', path: '/about' },
    { name: 'MEMBERSHIP', path: '/membership' },
    { name: 'TRAINERS', path: '/trainers' },
    { name: 'GALLERY', path: '/gallery' },
    { name: 'CONTACT', path: '/contact' },
  ];

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-[999] bg-gradient-to-b from-black/95 via-black/60 to-transparent backdrop-blur-[4px]">
        
        {/* =========================================================
            CONTAINER — Perfectly Aligned Center Wrapper With Max-Width
        ========================================================== */}
        <div className="max-w-7xl w-full mx-auto h-24 px-4 sm:px-6 md:px-8 lg:px-12 flex items-center justify-between gap-4">

          {/* =========================================================
              LEFT SIDE — COMPACT PREMIUM LOGO & BRAND (Left Aligned)
          ========================================================== */}
          <div className="flex items-center justify-start shrink-0">
            <Link
              to="/"
              className="flex items-center gap-3 group relative z-[1001] min-w-fit"
            >
              {/* COMPACT PREMIUM LOGO BADGE */}
              <div className="relative w-[43px] h-[43px] flex items-center justify-center">
                {/* Outer decorative ring */}
                <div className="absolute inset-[-2px] rounded-[12px] border border-[#ffc114]/20 group-hover:border-[#ffc114]/50 transition-all duration-500" />

                {/* Corner accent dots */}
                <span className="absolute top-[2px] left-[2px] w-[3px] h-[3px] rounded-full bg-[#ffc114]/30 group-hover:bg-[#ffc114]/70 transition-all duration-500" />
                <span className="absolute top-[2px] right-[2px] w-[3px] h-[3px] rounded-full bg-[#ffc114]/30 group-hover:bg-[#ffc114]/70 transition-all duration-500" />

                {/* Ambient glow */}
                <div className="absolute inset-0 rounded-[12px] bg-[#ffc114]/10 blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500" />

                {/* Main Badge Box */}
                <div className="relative w-full h-full rounded-[10px] bg-gradient-to-br from-[#1a1502]/95 to-[#080808]/95 border border-[#ffc114]/25 backdrop-blur-xl overflow-hidden flex items-center justify-center transition-all duration-500 group-hover:border-[#ffc114]/70 group-hover:shadow-[0_0_25px_rgba(255,193,20,0.35),inset_0_0_12px_rgba(255,193,20,0.1)]">
                  {/* Inner light reflection */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] to-transparent" />

                  {/* PREMIUM SVG LOGO */}
                  <svg
                    width="21"
                    height="21"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="relative z-10"
                  >
                    <path
                      d="M12 2L4 5V11C4 16.06 7.41 20.74 12 22C16.59 20.74 20 16.06 20 11V5L12 2Z"
                      stroke="url(#premiumGold)"
                      strokeWidth="1.5"
                      fill="#ffc114"
                      fillOpacity="0.08"
                    />
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
                      <linearGradient id="premiumGold" x1="4" y1="2" x2="20" y2="22" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#FFF5CC" />
                        <stop offset="0.5" stopColor="#ffc114" />
                        <stop offset="1" stopColor="#946f00" />
                      </linearGradient>
                    </defs>
                  </svg>

                  {/* Shine Sweep */}
                  <div className="absolute top-[-120%] left-[-40%] w-[30%] h-[160%] bg-white/20 rotate-[25deg] blur-sm transition-all duration-1000 group-hover:left-[140%]" />
                </div>
              </div>

              {/* BRAND TEXT */}
              <div className="flex flex-col justify-center">
                <div className="flex items-center gap-1.5 leading-none">
                  <span className="text-[15px] font-black uppercase tracking-[0.08em] text-white">
                    MUGIL
                  </span>
                  <span className="text-[15px] font-black uppercase tracking-[0.08em] text-[#ffc114]">
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
          </div>

          {/* =========================================================
              CENTER MENU (DESKTOP — Perfectly Centered or Balanced Spacing)
          ========================================================== */}
          <div className="hidden lg:flex items-center justify-center flex-1 gap-6 xl:gap-8 px-4">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) =>
                  `text-[11px] font-bold tracking-[0.13em] uppercase transition-all duration-300 relative py-2 select-none ${
                    isActive
                      ? 'text-[#ffc114]'
                      : 'text-white/90 hover:text-zinc-400'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span>{link.name}</span>
                    <span
                      className={`
                        absolute bottom-[-1px] left-0 w-full h-[2px]
                        bg-[#ffc114]
                        transition-all duration-300
                        transform origin-left
                        ${isActive ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'}
                      `}
                    />
                  </>
                )}
              </NavLink>
            ))}
          </div>

          {/* =========================================================
              RIGHT — DESKTOP PREMIUM LOGIN BUTTON (Right Aligned)
          ========================================================== */}
          <div className="hidden lg:flex items-center justify-end shrink-0">
            <Link to="/adminLogin">
              <button
                className="
                  relative overflow-hidden group
                  bg-[#ffc114] hover:bg-[#e0a800]
                  text-black
                  text-[11px] font-black tracking-[0.20em]
                  px-[26px] py-[10px]
                  rounded-[6px]
                  border border-white/20
                  transition-all duration-300
                  shadow-[0_2px_10px_rgba(0,0,0,0.30)]
                  hover:shadow-[0_0_0_3px_rgba(255,193,20,0.25),0_0_25px_rgba(255,193,20,0.5),0_4px_12px_rgba(0,0,0,0.4)]
                  hover:scale-[1.03]
                  uppercase cursor-pointer
                "
              >
                {/* Shimmer effect */}
                <span
                  className="
                    absolute top-0 left-[-100%]
                    w-[55%] h-full
                    bg-gradient-to-r from-transparent via-white/40 to-transparent
                    skew-x-[-20deg]
                    transition-all duration-700
                    group-hover:left-[160%]
                  "
                />
                <span className="relative z-10 flex items-center gap-[6px]">
                  <FiLock className="text-[11px]" />
                  LOGIN
                </span>
              </button>
            </Link>
          </div>

          {/* =========================================================
              MOBILE HAMBURGER BUTTON (Right Aligned on Mobile)
          ========================================================== */}
          <div className="flex lg:hidden items-center justify-end">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="flex items-center justify-center w-10 h-10 relative z-[1001] text-white text-2xl focus:outline-none cursor-pointer"
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? <HiX className="text-[#ffc114]" /> : <HiMenu />}
            </button>
          </div>

        </div>
      </nav>

      {/* =========================================================
          MOBILE OVERLAY
      ========================================================== */}
      <div 
        className={`fixed inset-0 z-[997] bg-black/70 backdrop-blur-sm lg:hidden transition-opacity duration-300 ${
          isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsMobileMenuOpen(false)}
      />

      {/* =========================================================
          MOBILE SIDE DRAWER
      ========================================================== */}
      <div
  className={`fixed top-0 right-0 z-[1000] w-[280px] sm:w-[320px] h-dvh overflow-y-auto bg-[#0a0a0a] border-l border-white/[0.05] lg:hidden flex flex-col pt-24 pb-6 px-5 transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* NAV LINKS */}
        <div className="flex-1 flex flex-col space-y-1">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <NavLink
                key={link.name}
                to={link.path}
                className={`flex items-center justify-between px-4 py-3.5 rounded-lg text-[12px] font-bold tracking-[0.1em] uppercase transition-all duration-200 ${
                  isActive 
                    ? 'bg-[#ffc114]/10 text-[#ffc114]' 
                    : 'text-zinc-300 hover:bg-white/[0.02] hover:text-white'
                }`}
              >
                <span>{link.name}</span>
                <FiChevronRight className={`text-sm transition-transform duration-200 ${isActive ? 'text-[#ffc114] translate-x-0' : 'text-zinc-600 opacity-0'}`} />
              </NavLink>
            );
          })}
        </div>

        {/* DRAWER FOOTER — MOBILE LOGIN */}
      <div className="mt-8 border-t border-white/[0.05] pt-6">
          <Link to="/adminLogin" className="block w-full">
            <button
              className="
                relative overflow-hidden group
                w-full
                bg-[#ffc114] hover:bg-[#e0a800]
                text-black
                text-[11px] font-black tracking-[0.15em]
                py-3.5 rounded-[6px]
                border border-white/10
                transition-all duration-300
                shadow-[0_2px_8px_rgba(0,0,0,0.30)]
                hover:shadow-[0_0_0_3px_rgba(255,193,20,0.20),0_0_20px_rgba(255,193,20,0.45)]
                uppercase flex items-center justify-center gap-2 cursor-pointer
              "
            >
              <span
                className="
                  absolute top-0 left-[-100%]
                  w-[55%] h-full
                  bg-gradient-to-r from-transparent via-white/30 to-transparent
                  skew-x-[-20deg]
                  transition-all duration-700
                  group-hover:left-[160%]
                "
              />
              <FiLock className="text-sm relative z-10" />
              <span className="relative z-10">Admin LOGIN</span>
            </button>
          </Link>
        </div>
      </div>
    </>
  );
};

export default Navbar;