import React from 'react';
import { FaCrown, FaUsers } from 'react-icons/fa';
import { FiZap, FiCheckCircle } from 'react-icons/fi';

const About = () => {
  const stats = [
    { value: "10K+", label: "ACTIVE MEMBERS" },
    { value: "15+", label: "ELITE COACHES" },
    { value: "50+", label: "MODERN MACHINES" },
    { value: "99%", label: "SATISFACTION" }
  ];

  const pillars = [
    {
      icon: <FiZap className="text-[#ffc114] text-xl" />,
      title: "BIO-MECHANICAL SCIENCE",
      desc: "Every platform and machine angle is perfectly set up to get the maximum muscle growth while keeping your joints safe from injuries."
    },
    {
      icon: <FaCrown className="text-[#ffc114] text-xl" />,
      title: "UNCOMPROMISED LUXURY",
      desc: "From premium air-conditioned training floors to luxury locker rooms and recovery lounges, your environment matches your high standards."
    },
    {
      icon: <FaUsers className="text-[#ffc114] text-xl" />,
      title: "ALPHA COMMUNITY",
      desc: "Train alongside driven individuals, business heads, and top athletes who motivate you to push your limits every single day."
    }
  ];

  const milestones = [
    { year: "2023", title: "THE FOUNDATION", desc: "Started our mega fitness facility with top-tier premium imported strength machines and expert trainers." },
    { year: "2024", title: "BIO-MECHANICS FLOOR", desc: "Introduced advanced posture screening, body composition testing, and custom workout programming." },
    { year: "2025", title: "PREMIUM RECOVERY SPA", desc: "Launched dedicated premium steam rooms, infrared therapy, and advanced sports massage setups." },
    { year: "2026", title: "DIGITAL ECOSYSTEM", desc: "Integrating mobile app tracking and expert diet chart delivery systems for all premium club members." }
  ];

  const amenities = [
    "Biomechanical Strength Suite", "Infrared Recovery Sauna", 
    "Cryotherapy Chambers", "Private VIP Locker Suites", 
    "Oxygen Hyperbaric Pods", "Juice & Macro Nutrition Bar"
  ];

  return (
    <div className=" bg-[#050505] text-zinc-400 font-sans overflow-hidden">
      
      {/* ================= SECTION 1: HERO INTRO ================= */}
      <section className="py-30 px-6 md:px-12 lg:px-16 relative z-30 border-b border-zinc-950">
        <div className="absolute right-0 top-1/4 w-[300px] h-[300px] bg-[#ffc114]/5 rounded-full blur-[120px] pointer-events-none select-none" />
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* Left Side: Asymmetric Images */}
            <div   data-aos="fade-right"
  data-aos-duration="1000" className="lg:col-span-6 relative w-full h-[450px] sm:h-[550px] md:h-[600px] select-none">
              <div className="absolute top-0 left-0 w-[75%] h-[85%] border border-zinc-900 overflow-hidden rounded-sm group shadow-2xl shadow-black">
                <img src="/hero-full-bg.png" alt="Premium Gym" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              </div>
              <div className="absolute bottom-0 right-0 w-[55%] h-[55%] border-4 border-[#050505] bg-zinc-900 overflow-hidden rounded-sm group shadow-2xl shadow-black/80 z-10">
                <img src="/hero-full-bg.png" alt="Elite Workout" className="w-full h-full object-cover object-right transition-transform duration-700 group-hover:scale-105 filter brightness-90 grayscale-[30%]" />
              </div>
              <div className="absolute -bottom-3 left-8 w-24 h-24 border-b-2 border-l-2 border-[#ffc114]/40 pointer-events-none z-0" />
            </div>

            {/* Right Side: Typography */}
            <div   data-aos="fade-left"
  data-aos-delay="200" className="lg:col-span-6 flex flex-col justify-center">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-8 h-[1px] bg-[#ffc114]" />
                <span className="text-[#ffc114] text-[10px] font-black tracking-[0.35em] uppercase">ABOUT MUGIL FITNESS</span>
              </div>
              <h2 className="text-white font-gym-brutal text-3xl sm:text-4xl md:text-5xl uppercase leading-[1.05] tracking-wide mb-6">
                WE FORGE THE <br />
                <span className="text-[#ffc114]">ULTIMATE VERSION</span> OF YOU
              </h2>
              <div className="space-y-5 text-zinc-400 text-[13px] sm:text-sm font-medium tracking-wide leading-relaxed mb-10 max-w-xl">
                <p>At Mugil Fitness & SP Fitness, we do not believe in ordinary workouts. We believe in elite bio-mechanical transformations. Founded with a vision to redefine fitness standards, we provide an ultra-premium sanctuary engineered for true high-performance athletes.</p>
                <p className="border-l border-zinc-800 pl-4 text-zinc-500 italic">"It is never just about lifting standard weights; it is about fixing your body movements, boosting energy levels, and living a completely healthy life."</p>
              </div>

              {/* Stats Counters */}
              <div  data-aos="fade-up"
  data-aos-delay="350" className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-6 border-t border-zinc-900/80">
                {stats.map((stat, index) => (
                  <div key={index} className="flex flex-col select-none">
                    <span className="text-white font-gym-brutal text-2xl sm:text-3xl font-black tracking-wide mb-1 transition-colors hover:text-[#ffc114] duration-300">{stat.value}</span>
                    <span className="text-zinc-600 text-[9px] font-black tracking-widest uppercase">{stat.label}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ================= SECTION 2: THE FOUNDERS' VISION ================= */}
      <section className="py-24 px-6 md:px-12 lg:px-16 bg-[#0a0a0a] border-b border-zinc-900/40 relative">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div    data-aos="fade-right" className="lg:col-span-6 order-2 lg:order-1">
            <div className="flex items-center gap-3 mb-4">
              <FaCrown className="text-[#ffc114] text-xs animate-pulse" />
              <span className="text-[#ffc114] text-[10px] font-black tracking-[0.35em] uppercase">THE FOUNDERS' STATEMENT</span>
            </div>
            <h2 className="text-white font-gym-brutal text-3xl sm:text-4xl uppercase tracking-wide mb-6">
              LEGACY DRIVEN, <span className="text-[#ffc114]">SCIENCE BACKED</span>
            </h2>
            <p className="text-zinc-400 text-sm leading-relaxed mb-6">
              Mugil Fitness was built out of pure frustration with commercial gyms—spaces that packed crowds but lacked true physiological depth. We wanted an uncompromised zone where business leaders, athletes, and premium minds could build absolute physical power.
            </p>
            <div className="flex items-center gap-4 border-t border-zinc-900 pt-6">
              <div>
                <h4 className="text-white font-gym-brutal text-base tracking-wider">ALEXANDER MUGIL & SP</h4>
                <p className="text-zinc-600 text-[10px] font-black tracking-widest uppercase mt-0.5">CHIEF ARCHITECTS & FOUNDERS</p>
              </div>
            </div>
          </div>
          
          <div   data-aos="fade-left"
  data-aos-delay="150" className="lg:col-span-6 order-1 lg:order-2 h-[350px] border border-zinc-900 bg-zinc-950 overflow-hidden rounded-sm relative">
            <img src="/images/about-1.jpg" alt="Founders Space" className="w-full h-full object-cover grayscale opacity-40 filter contrast-125 hover:scale-105 transition-transform duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] to-transparent" />
          </div>
        </div>
      </section>

      {/* ================= SECTION 3: THE THREE PILLARS OF EXCELLENCE ================= */}
      <section className="py-24 px-6 md:px-12 lg:px-16 relative">
        <div className="absolute left-[-5%] top-1/3 w-[300px] h-[300px] bg-[#ffc114]/5 rounded-full blur-[120px] pointer-events-none select-none" />
        <div className="max-w-[1400px] mx-auto">
          <div   data-aos="fade-down" className="text-center mb-16">
            <span className="text-[#ffc114] text-[10px] font-black tracking-[0.4em] uppercase">HOW WE OPERATE</span>
            <h2 className="text-white font-gym-brutal text-3xl sm:text-4xl uppercase tracking-wide mt-2">OUR THREE <span className="text-[#ffc114]">PILLARS</span></h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pillars.map((pillar, idx) => (
              <div key={idx}  data-aos="zoom-in-up"
  data-aos-delay={idx * 150}
  data-aos-duration="800" className="bg-[#0a0a0a] border border-zinc-900 p-8 rounded-sm hover:border-[#ffc114]/30 transition-all duration-300 shadow-xl">
                <div className="w-12 h-12 bg-zinc-950 border border-zinc-800 rounded-sm flex items-center justify-center mb-6 shadow-md">
                  {pillar.icon}
                </div>
                <h3 className="text-white font-bold text-xs tracking-widest uppercase mb-3">{pillar.title}</h3>
                <p className="text-zinc-500 text-xs sm:text-[13px] font-sans leading-relaxed">{pillar.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= SECTION 4: THE EXECUTIVE TIMELINE ================= */}
      <section className="py-24 px-6 md:px-12 lg:px-16 bg-[#0a0a0a] border-t border-b border-zinc-900/60 select-none">
        <div className="max-w-[1400px] mx-auto">
          <div  data-aos="fade-right" className="mb-16 border-l-2 border-[#ffc114] pl-4">
            <span className="text-[#ffc114] text-[10px] font-black tracking-[0.35em] uppercase">CHRONOLOGICAL GROWTH</span>
            <h2 className="text-white font-gym-brutal text-3xl sm:text-4xl uppercase tracking-wide mt-1">THE METRIC <span className="text-[#ffc114]">TIMELINE</span></h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            {milestones.map((stone, idx) => (
              <div key={idx}   data-aos="fade-up"
  data-aos-delay={idx * 150} className="relative group">
                <div className="text-[#ffc114] font-gym-brutal text-4xl sm:text-5xl font-black mb-3 tracking-wide opacity-40 group-hover:opacity-100 transition-opacity">
                  {stone.year}
                </div>
                <div className="border-t border-zinc-800 pt-4 max-w-[85%]">
                  <h4 className="text-white font-black text-[11px] tracking-wider uppercase mb-1.5">{stone.title}</h4>
                  <p className="text-zinc-500 font-sans text-xs leading-relaxed">{stone.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= SECTION 5: BESPOKE CLUB AMENITIES ================= */}
      <section className="py-24 px-6 md:px-12 lg:px-16 relative">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div  data-aos="fade-right" className="lg:col-span-5">
            <span className="text-[#ffc114] text-[10px] font-black tracking-[0.35em] uppercase">PREMIUM INFRASTRUCTURE</span>
            <h2 className="text-white font-gym-brutal text-3xl sm:text-4xl uppercase tracking-wide mt-2 mb-6">
              UNLIMITED <span className="text-[#ffc114]">PRIVILEGES</span>
            </h2>
            <p className="text-zinc-500 text-xs sm:text-[13px] font-medium leading-relaxed mb-8">
              Our architectural square footage is optimized entirely for luxury physical development. Every corner breathes premium engineering.
            </p>
            
            {/* List Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {amenities.map((item, idx) => (
                <div key={idx}    data-aos="fade-up"
  data-aos-delay={idx * 80} className="flex items-center gap-2 text-xs font-bold text-zinc-300 tracking-wide">
                  <FiCheckCircle className="text-[#ffc114] shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Floating Display Box */}
          <div  data-aos="fade-left"
  data-aos-delay="200" className="lg:col-span-7 bg-[#0a0a0a] border border-zinc-900/80 p-8 rounded-sm relative flex flex-col md:flex-row items-center gap-6 shadow-2xl shadow-black">
            <div className="w-full md:w-1/2 h-[220px] bg-zinc-950 border border-zinc-900 overflow-hidden rounded-sm">
              <img src= "/images/about-2.jpg" alt="Amenity Spot" className="w-full h-full object-cover brightness-70" />
            </div>
            <div className="flex-1 text-left">
              <span className="text-[#ffc114] font-mono text-[9px] font-black tracking-[0.25em] uppercase block mb-1">// SECURE HOUSING</span>
              <h3 className="text-white font-gym-brutal text-lg uppercase tracking-wide mb-2">RESTRICTED ROYALTY ENTRY</h3>
              <p className="text-zinc-500 font-sans text-xs leading-relaxed">
                Only authenticated active members with encrypted biometric codes can request portal entries. Absolute security, zero clutter.
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default About;