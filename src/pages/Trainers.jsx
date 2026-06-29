import React, { useState } from 'react';
import { FaInstagram, FaCrown, FaStar } from 'react-icons/fa';
import { FiArrowRight, FiLayers, FiCalendar, FiChevronDown, FiCheckCircle } from 'react-icons/fi';
import { useNavigate } from "react-router-dom";

const Trainers = () => {
  const [expandedSpec, setExpandedSpec] = useState(0);
const navigate = useNavigate();


  const trainer = {
    name: "UDHAYA SURIYAN",
    role: "FOUNDER & HEAD TRAINER",
    image: "/images/trainer-1.jpg",
    rating: "5.0",
    exp: "12+ YRS",
    specialty: "Strength Training & Muscle Building",
    certs: ["ISSA - Master Trainer", "ASCA - Strength & Conditioning Coach"],
    clientCap: "3 Members Max",
    recoveryProtocol: "Neuromuscular Recovery Training",
    instagram: "#",
  };

  const philosophies = [
    {
      title: "PROPER FORM & TECHNIQUE",
      desc: "Every member gets a full body movement assessment to find weaknesses and imbalances. We build your training plan around your body — not a generic template — so you lift safely and grow faster.",
      stat: "0% Floor Injury Rate"
    },
    {
      title: "NUTRITION PLANNING",
      desc: "No guesswork. Your daily food plan is built around your body weight, goal, and lifestyle. Whether you want to lose fat or gain muscle, we give you a clear and simple plan to follow.",
      stat: "100% Goal Achieved"
    },
    {
      title: "WEEKLY PROGRESS CHECK",
      desc: "Your body changes every week, so your training should too. We review your progress every 7 days and adjust your workout and diet plan to keep you moving forward without hitting a plateau.",
      stat: "7-Day Plan Update"
    }
  ];

  return (
    <div className="bg-[#020202] text-zinc-400 font-sans overflow-hidden antialiased selection:bg-[#ffc114] selection:text-black">

      {/* ================= SECTION 1: HERO TITLE ================= */}
      <section className="pt-30 pb-12 px-6 md:px-12 lg:px-16 relative z-30 select-none text-center border-b border-zinc-950">
        <div className="absolute left-1/2 top-0 -translate-x-1/2 w-[800px] h-[300px] bg-[#ffc114]/5 rounded-full blur-[160px] pointer-events-none" />
        <div   data-aos="fade-down"
  data-aos-duration="1000" className="max-w-[1400px] mx-auto space-y-4">
          <div className="inline-flex items-center gap-2.5 bg-[#0a0a0a] border border-zinc-900 px-4 py-1.5 rounded-none">
            <FaCrown className="text-[#ffc114] text-[10px] animate-pulse" />
            <span className="text-[#ffc114] text-[9px] font-black tracking-[0.45em] uppercase">MEET YOUR TRAINER</span>
          </div>
          <h1 className="text-white font-gym-brutal text-4xl sm:text-6xl md:text-7xl uppercase tracking-tighter leading-none mt-2">
            YOUR PERSONAL <span className="text-[#ffc114]">TRAINER</span>
          </h1>
          <p className="text-zinc-600 text-xs sm:text-sm font-light max-w-2xl mx-auto leading-relaxed">
            Train directly with our founder. No junior staff, no handoffs — just one dedicated expert focused entirely on your results.
          </p>
        </div>
      </section>

      {/* ================= SECTION 2: TRAINER PROFILE ================= */}
      <section className="relative z-30 bg-black border-b border-zinc-900">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-12 lg:px-16 py-16 sm:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

            {/* Left: Image */}
            <div   data-aos="fade-right"
  data-aos-duration="1000" className="relative w-full aspect-[3/4] max-w-sm mx-auto lg:mx-0 overflow-hidden">
              <img
                src={trainer.image}
                alt={trainer.name}
                className="w-full h-full object-cover object-top grayscale contrast-[1.1] brightness-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="flex items-center gap-3">
                  <div className="bg-zinc-950 border border-zinc-800 px-3 py-1.5 text-[9px] font-bold text-zinc-400 uppercase tracking-widest">
                    {trainer.exp}
                  </div>
                  <div className="bg-zinc-950 border border-zinc-800 px-3 py-1.5 text-[9px] font-bold text-[#ffc114] flex items-center gap-1 uppercase tracking-widest">
                    <FaStar className="text-[8px]" /> {trainer.rating}
                  </div>
                </div>
              </div>
              <span className="absolute top-0 left-0 w-8 h-[2px] bg-[#ffc114]" />
              <span className="absolute top-0 left-0 w-[2px] h-8 bg-[#ffc114]" />
              <span className="absolute bottom-0 right-0 w-8 h-[2px] bg-[#ffc114]" />
              <span className="absolute bottom-0 right-0 w-[2px] h-8 bg-[#ffc114]" />
            </div>

            {/* Right: Info */}
            <div   data-aos-delay="200"
  data-aos-duration="1000" className="space-y-8 select-none">
              <div>
                <span className="text-zinc-700 font-mono text-[11px] block mb-2">// FOUNDER & TRAINER</span>
                <h2 className="text-white font-gym-brutal text-4xl sm:text-5xl uppercase tracking-tight leading-none">
                  {trainer.name}
                </h2>
                <p className="text-[#ffc114]/80 text-[10px] tracking-[0.2em] uppercase font-semibold mt-2">
                  {trainer.role}
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-zinc-600 font-bold tracking-widest text-[8.5px] uppercase">Specializes In</span>
                <p className="text-zinc-300 text-sm font-light tracking-wide">{trainer.specialty}</p>
              </div>

              <div className="space-y-1">
                <span className="text-zinc-600 font-bold tracking-widest text-[8.5px] uppercase">Certifications</span>
                <div className="space-y-1 pt-1">
                  {trainer.certs.map((cert, i) => (
                    <div key={i}  data-aos="fade-up"
  data-aos-delay={i * 120} className="flex items-center gap-2">
                      <FiCheckCircle className="text-[#ffc114] text-xs shrink-0" />
                      <span className="text-zinc-400 text-[11px] font-light tracking-wide">{cert}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div   data-aos="zoom-in"
  data-aos-delay="250" className="grid grid-cols-2 gap-4 pt-2">
                <div className="bg-[#060606] border border-zinc-900 p-4">
                  <span className="text-zinc-600 font-bold tracking-widest text-[8px] uppercase block mb-1">Batch Size</span>
                  <span className="text-amber-500 font-semibold text-xs">{trainer.clientCap}</span>
                  <span className="text-zinc-600 text-[10px]"> strict limit</span>
                </div>
                <div className="bg-[#060606] border border-zinc-900 p-4">
                  <span className="text-zinc-600 font-bold tracking-widest text-[8px] uppercase block mb-1">Recovery Method</span>
                  <span className="text-zinc-400 font-mono text-[10px] uppercase tracking-wide">{trainer.recoveryProtocol}</span>
                </div>
              </div>

              <div   data-aos="fade-up"
  data-aos-delay="350" className="pt-2 border-t border-zinc-900 flex items-center gap-4">
                
                <a  href={trainer.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] font-black text-zinc-400 hover:text-white transition-all duration-300"
                >
                  <FaInstagram className="text-sm text-[#ffc114]" />
                  <span>Follow on Instagram</span>
                  <FiArrowRight className="text-sm text-[#ffc114]" />
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ================= SECTION 3: TRAINING APPROACH ACCORDION ================= */}
      <section className="py-16 sm:py-24 px-5 sm:px-12 lg:px-16 bg-[#020202] border-t border-zinc-950 relative z-30">
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">

          <div   data-aos="fade-right"
  data-aos-duration="900" className="lg:col-span-5 lg:sticky lg:top-28 space-y-4 select-none">
            <span className="text-[#ffc114] text-[10px] font-bold tracking-[0.4em] uppercase block">// HOW WE TRAIN</span>
            <h2 className="text-white font-gym-brutal text-2xl sm:text-4xl uppercase tracking-wide leading-none">
              OUR TRAINING <br />APPROACH <br /><span className="text-[#ffc114]">& METHOD</span>
            </h2>
            <p className="text-zinc-600 text-xs leading-relaxed pt-2">
              No guesswork, no generic plans. Everything is built around your body, your goal, and your pace.
            </p>
          </div>

          <div   data-aos="fade-left"
  data-aos-delay="200" className="lg:col-span-7 space-y-4 w-full">
            {philosophies.map((item, idx) => {
              const isOpen = expandedSpec === idx;
              return (
                <div
                  key={idx}
                    data-aos="fade-up"
  data-aos-delay={idx * 120}
                  onClick={() => setExpandedSpec(isOpen ? null : idx)}
                  className={`border transition-all duration-500 rounded-none cursor-pointer p-5 sm:p-8 select-none ${
                    isOpen ? 'bg-[#060606] border-[#ffc114] shadow-xl shadow-yellow-500/5' : 'bg-transparent border-zinc-900 hover:border-zinc-800'
                  }`}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <span className={`text-[10px] sm:text-[11px] font-mono font-bold ${isOpen ? 'text-[#ffc114]' : 'text-zinc-700'}`}>
                        0{idx + 1}.
                      </span>
                      <h4 className="text-white font-gym-brutal text-xs sm:text-sm tracking-wider uppercase">{item.title}</h4>
                    </div>
                    <div className={`w-5 h-5 flex items-center justify-center text-zinc-500 transition-transform duration-300 shrink-0 ${isOpen ? 'rotate-180 text-[#ffc114]' : ''}`}>
                      <FiChevronDown className="text-xs" />
                    </div>
                  </div>
                  <div className={`transition-all duration-500 overflow-hidden ${isOpen ? 'max-h-[220px] opacity-100 mt-5 pt-4 border-t border-zinc-900/80' : 'max-h-0 opacity-0 pointer-events-none'}`}>
                    <p className="text-zinc-500 text-xs leading-relaxed mb-4">{item.desc}</p>
                    <div className="inline-flex items-center gap-2 bg-zinc-950 border border-zinc-900/60 text-[9px] font-bold text-emerald-400 tracking-wider uppercase px-2.5 py-1 rounded-none">
                      <FiCheckCircle className="text-xs" /> {item.stat}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ================= SECTION 4: BOOK A SESSION ================= */}
      <section className="py-16 sm:py-24 px-4 sm:px-12 lg:px-16 relative z-30">
        <div   data-aos="zoom-in"
  data-aos-duration="1000" className="max-w-[1100px] mx-auto bg-[#060606] border border-zinc-900 p-6 sm:p-12 md:p-16 rounded-none relative overflow-hidden">
          <div className="absolute right-0 bottom-0 w-64 h-64 bg-[#ffc114]/5 rounded-full blur-[100px] pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center relative z-20">
            <div   data-aos="fade-right"
  data-aos-delay="150" className="lg:col-span-8 space-y-3">
              <div className="flex items-center gap-2 text-zinc-600">
                <FiLayers className="text-xs" />
                <span className="text-[9px] font-bold tracking-widest uppercase">Limited Slots Available</span>
              </div>
              <h3 className="text-white font-gym-brutal text-xl sm:text-3xl md:text-4xl uppercase tracking-wide leading-tight">
                BOOK YOUR FREE FIRST SESSION
              </h3>
              <p className="text-zinc-500 text-xs sm:text-sm leading-relaxed max-w-2xl">
                Get a free 60-minute session with Udhaya Suriyan. We'll assess your fitness level, understand your goals, and build a personal plan just for you — no commitments needed.
              </p>
            </div>

            <div   data-aos="fade-left"
  data-aos-delay="300" className="lg:col-span-4 w-full">
              <button 
              onClick={() => navigate("/contact")}
              className="w-full bg-[#ffc114] text-black hover:bg-white font-black text-[10px] sm:text-[11px] tracking-[0.2em] sm:tracking-[0.25em] px-5 py-4 transition-all duration-300 uppercase flex items-center justify-center gap-2 cursor-pointer shadow-xl shadow-yellow-500/5">
                <FiCalendar className="text-sm shrink-0" />
                <span>BOOK A FREE SESSION</span>
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Trainers;