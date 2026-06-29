import React from 'react';
import { FiArrowUpRight, FiClock, FiActivity, FiMapPin } from 'react-icons/fi';
import { FaCrown } from 'react-icons/fa';

const Hero = () => {
  return (
    <section className="relative h-screen w-full bg-[#030303] overflow-hidden flex flex-col justify-between select-none">
      
      {/* =========================================================================
          MASTER VISUAL LAYER: Ultra-Bright Full Color Performance Athlete Image
         ========================================================================= */}
      <div   data-aos="fade-left"
  data-aos-duration="1200" className="absolute top-[90px] lg:top-[100px] bottom-0 lg:bottom-[68px] right-0 w-full lg:w-[55%] h-[calc(100vh-90px)] lg:h-auto z-0 pointer-events-none select-none">
        
        {/* Maximum Contrast & Maximum Brightness filters */}
        <img 
          src="/hero-full-bg.png" 
          alt="Mugil Fitness Elite Gym Athlete Performance" 
          className="w-full h-full object-cover object-[85%_center] lg:object-[left_center] saturate-[1.35] contrast-[1.15] brightness-[1.25] opacity-100 transition-all duration-700 animate-fadeIn"
        />
        
        {/* Ultra-Light Dynamic Transparency Mask */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#030303] via-[#030303]/50 lg:via-[#030303]/35 to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#030303]/15 via-transparent to-[#030303] lg:hidden z-10" />
        
        {/* Fine Editorial Edge Softeners */}
        <div className="absolute inset-0 hidden lg:block bg-[radial-gradient(circle_at_bottom_left,rgba(3,3,3,0.75),transparent_65%)] z-10" />
        <div className="absolute inset-0 hidden lg:block bg-gradient-to-t from-[#030303] via-transparent to-transparent opacity-20 z-10" />
      </div>

      {/* Premium #ffc114 ambient design accent behind typography */}
      <div className="absolute left-[10%] top-1/3 w-[350px] h-[350px] bg-[#ffc114]/[0.02] rounded-full blur-[120px] pointer-events-none z-0" />

      {/* =========================================================================
          MAIN TEXT ENVIRONMENT: Bounded Typography Layout (Aligned with Navbar Layout)
         ========================================================================= */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 md:px-8 lg:px-12 relative z-20 flex items-center h-full pt-32 lg:pt-24 pb-4 overflow-hidden">
        <div className="w-full lg:w-[50%] xl:w-[48%] space-y-5 sm:space-y-6 md:space-y-7 xl:space-y-8 flex flex-col justify-center items-start">
          
          <div    data-aos="fade-right"
  data-aos-delay="100" className="flex items-center gap-2 mb-4">
            <FaCrown className="text-[#ffc114] text-[10px] animate-pulse" />
            <span className="text-[#ffc114] text-[9px] md:text-[10px] font-bold tracking-[0.4em] uppercase">
              THE SQUADRON INTENSITY
            </span>
          </div>

          <h1  data-aos="fade-up"
  data-aos-delay="200" className="mb-2 text-[44px] sm:text-[64px] md:text-[80px] xl:text-[95px] font-gym-brutal uppercase leading-[0.85] flex flex-col tracking-tighter drop-shadow-[0_4px_20px_rgba(0,0,0,0.98)] lg:drop-shadow-none">
            <span className="text-white hover:text-[#ffc114] transition-colors duration-500 tracking-[5px]">
              TRAIN HARD
            </span>
            <span className="text-[#ffc114] hover:text-white transition-colors duration-500 mt-1 tracking-[5px]">
              BE STRONG
            </span>
          </h1>

          <p    data-aos="fade-up"
  data-aos-delay="350" className="mb-2 text-zinc-100 lg:text-zinc-500 text-[10px] sm:text-[12px] font-light tracking-[0.2em] uppercase max-w-sm sm:max-w-md leading-relaxed drop-shadow-[0_2px_12px_rgba(0,0,0,0.98)] lg:drop-shadow-none">
            Premium Fitness. Premium You. Architecting human longevity and muscle mechanics from the ground up.
          </p>

          <div   data-aos="zoom-in"
  data-aos-delay="500" className="pt-2 lg:pt-4 flex justify-start items-center w-full">
            <button className="
              w-full sm:w-auto 
              bg-[#ffc114] text-black 
              hover:bg-white border border-[#ffc114] hover:border-white 
              font-black 
              text-[11px] sm:text-[12px] 
              tracking-[0.25em] 
              px-8 py-4
              rounded-none 
              transition-all duration-500 
              uppercase 
              cursor-pointer 
              flex items-center justify-center gap-3.5 
              shadow-2xl shadow-amber-500/5 
              group
            ">
              <span>START YOUR JOURNEY</span>
              <FiArrowUpRight className="text-sm transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 shrink-0" />
            </button>
          </div>

        </div>
      </div>

      {/* =========================================================================
          BOTTOM METRICS BAR: Bounded securely at the lower viewport edge
         ========================================================================= */}
      <div   data-aos="fade-up"
  data-aos-delay="700" className="w-full border-t border-white/[0.04] py-4 bg-black/70 backdrop-blur-md z-30 shrink-0 select-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-4 text-[9px] lg:text-[10px] font-medium tracking-[0.18em] text-zinc-500 uppercase">
          
          {/* ITEM 1: BIOMECHANICAL FLOOR */}
          <div   
   className="flex items-start gap-3 md:border-r border-white/[0.05] pb-4 md:pb-0 justify-start">
            <FiActivity className="text-[#ffc114] text-sm shrink-0 mt-0.5" />
            <div className="flex flex-col space-y-1">
              <span className="text-white font-black tracking-widest text-[9.5px] lg:text-[10.5px]">BIOMECHANICAL FLOOR</span>
              <span className="text-zinc-500 font-light text-[8.5px] lg:text-[9px]">PREMIUM IMPORTED GYM SYSTEMS</span>
            </div>
          </div>

          {/* ITEM 2: OPEN HOURS SCHEDULE */}
          <div  
  className="flex items-start gap-3 md:border-r border-white/[0.05] pb-4 md:pb-0 md:px-4 justify-start">
            <FiClock className="text-[#ffc114] text-sm shrink-0 mt-0.5" />
            <div className="flex flex-col space-y-1">
              <span className="text-white font-black tracking-widest text-[9.5px] lg:text-[10.5px]">OPEN HOURS SCHEDULE</span>
              <span className="text-zinc-500 font-light text-[8.5px] lg:text-[9px]">
                MON-SAT: 05-10 AM / 04-10 PM <span className="text-[#ffc114] font-bold ml-1.5">[SUN: MRNG ONLY]</span>
              </span>
            </div>
          </div>

          {/* ITEM 3: SALEM REGION HUBS */}
          <div   
  className="flex items-start gap-3 justify-start md:px-4">
            <FiMapPin className="text-[#ffc114] text-sm shrink-0 mt-0.5" />
            <div className="flex flex-col space-y-1">
              <span className="text-white font-black tracking-widest text-[9.5px] lg:text-[10.5px]">SALEM REGION HUBS</span>
              <span className="text-zinc-500 font-light text-[8.5px] lg:text-[9px] block tracking-wider leading-relaxed">
                MUGIL: THATTANCHADI (636012) <br className="hidden xl:block" />/ SP: ENGINEERING CLG (636011)
              </span>
            </div>
          </div>

        </div>
      </div>

    </section>
  );
};

export default Hero;