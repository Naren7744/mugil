import React, { useState } from 'react';
import { FaCrown, FaTimes } from 'react-icons/fa';
import { useNavigate } from "react-router-dom";
import { FiArrowUpRight, FiMapPin, FiMaximize2, FiCpu, FiCompass, FiShield, FiCalendar, FiLayers } from 'react-icons/fi';

const Gallery = () => {

  const [activeFilter, setActiveFilter] = useState('ALL');
  const [selectedImage, setSelectedImage] = useState(null);
  const [hoveredIndex, setHoveredIndex] = useState(0);

  const filters = ['ALL', 'STRENGTH FLOOR', 'CARDIO', 'RECOVERY'];
const navigate = useNavigate();


  const galleryData = [
    {
      id: 1,
      title: "STRENGTH TRAINING AREA",
      category: "STRENGTH FLOOR",
      image: "/images/gym-1.jpg",
      desc: "Heavy weights, barbells, and machines built for serious strength training.",
      sqft: "4,500 SQ.FT",
      loadCapacity: "Heavy Duty Equipment",
      acoustics: "Sound Proof Flooring"
    },
    {
      id: 2,
      title: "FREE WEIGHTS SECTION",
      category: "STRENGTH FLOOR",
       image: "/images/gym-2.jpg",
      desc: "Full range of dumbbells and free weight stations for every fitness level.",
      sqft: "2,200 SQ.FT",
      loadCapacity: "Rubber Safety Flooring",
      acoustics: "Open Training Area"
    },
    {
      id: 3,
      title: "FUNCTIONAL TRAINING ZONE",
      category: "CARDIO",
       image: "/images/gym-3.jpg",
      desc: "Treadmills, bikes, and cardio machines with live heart rate tracking.",
      sqft: "3,100 SQ.FT",
      loadCapacity: "Shock Absorbing Floor",
      acoustics: "Music Sound System"
    },
    {
      id: 4,
      title: "GYM FLOOR OVERVIEW",
      category: "RECOVERY",
       image: "/images/gym-4.jpg",
      desc: "A full view of our well-equipped gym floor designed for all types of training.",
      sqft: "1,800 SQ.FT",
      loadCapacity: "Safe & Clean Setup",
      acoustics: "Relaxing Ambient Music"
    },
    {
      id: 5,
      title: "TRAINER COACHING AREA",
      category: "STRENGTH FLOOR",
       image: "/images/gym-5.jpg",
      desc: "Dedicated space where our trainer works one-on-one with members.",
      sqft: "1,500 SQ.FT",
      loadCapacity: "Premium Equipment",
      acoustics: "Focused Training Zone"
    },
  ];

  const filteredImages = activeFilter === 'ALL'
    ? galleryData
    : galleryData.filter(item => item.category === activeFilter);

  return (
    <div className="bg-[#030303] text-zinc-400 font-sans overflow-hidden antialiased selection:bg-[#ffc114] selection:text-black">

      <section className="pt-30 pb-12 px-6 md:px-12 lg:px-16 relative z-30 select-none text-center border-b border-zinc-900/60">
        <div className="absolute left-1/2 top-0 -translate-x-1/2 w-[800px] h-[300px] bg-[#ffc114]/5 rounded-full blur-[160px] pointer-events-none" />
        <div   data-aos="fade-down"
  data-aos-delay="100"
 className="max-w-[1400px] mx-auto space-y-4">
          <div className="inline-flex items-center gap-2.5 bg-[#0a0a0a] border border-zinc-800 px-4 py-1.5 rounded-none">
            <FaCrown className="text-[#ffc114] text-[10px] animate-pulse" />
            <span className="text-[#ffc114] text-[9px] font-bold tracking-[0.4em] uppercase">OUR GYM FACILITY</span>
          </div>
          <h1 className="text-white font-gym-brutal text-4xl sm:text-5xl md:text-7xl uppercase tracking-tighter leading-none mt-2">
            INSIDE <span className="text-[#ffc114]">OUR GYM</span>
          </h1>
          <p className="text-zinc-600 text-xs sm:text-sm font-light max-w-2xl mx-auto leading-relaxed">
            Take a look inside our gym. Explore our training areas, equipment setups, and recovery spaces built for serious results.
          </p>

          <div className="pt-10 flex flex-wrap items-center justify-center gap-2">
            {filters.map((filter) => {
              const count = filter === 'ALL' ? galleryData.length : galleryData.filter(i => i.category === filter).length;
              return (
                <button
                  key={filter}
                    data-aos="zoom-in"
  data-aos-delay={50}
                  onClick={() => {
                    setActiveFilter(filter);
                    setHoveredIndex(0);
                  }}
                  className={`px-5 py-3 text-[10px] font-black tracking-[0.25em] uppercase transition-all duration-300 rounded-none cursor-pointer relative ${
                    activeFilter === filter
                      ? 'text-white border-b-2 border-[#ffc114]'
                      : 'text-zinc-600 hover:text-zinc-400 border-b border-transparent'
                  }`}
                >
                  <span>{filter}</span>
                  <span className="text-[8px] ml-1.5 opacity-50 font-mono">({count})</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section className="relative z-30 bg-black border-b border-zinc-900">
        <div className="flex flex-col lg:flex-row w-full min-h-[500px] lg:h-[65vh] items-stretch">
          {filteredImages.map((item, idx) => {
            const isHovered = hoveredIndex === idx;
            return (
              <div
                key={item.id}
                  data-aos="zoom-in-up"
  data-aos-delay={idx * 120}
  data-aos-duration="800"
                onMouseEnter={() => setHoveredIndex(idx)}
                onClick={() => setSelectedImage(item)}
                className="relative cursor-pointer transition-all duration-700 ease-in-out border-b lg:border-b-0 lg:border-r border-zinc-900 overflow-hidden flex flex-col justify-end p-6 sm:p-10 group select-none"
                style={{ flex: isHovered ? '2.8 1 0%' : '1 1 0%' }}
              >
                <div className="absolute inset-0 w-full h-full pointer-events-none">
                  <img
                    src={item.image}
                    alt={item.title}
                    className={`w-full h-full object-cover object-center transition-all duration-1000 ease-out filter brightness-[0.65] ${
                      isHovered ? 'scale-100 grayscale-0 contrast-[1.05]' : 'scale-105 grayscale opacity-25 contrast-95'
                    }`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-95" />
                </div>

                <div className="relative z-20 space-y-2 pointer-events-none">
                  <div className="flex items-center gap-2">
                    <span className="text-[#ffc114] font-mono text-[9px] font-bold tracking-widest">[0{item.id}]</span>
                    <span className={`text-[8px] font-bold tracking-widest uppercase px-2 py-0.5 border ${
                      isHovered ? 'text-[#ffc114] border-[#ffc114]/30 bg-black/50' : 'text-zinc-600 border-zinc-900'
                    }`}>
                      {item.category}
                    </span>
                  </div>

                  <h3 className="text-white font-gym-brutal text-lg sm:text-xl uppercase tracking-wide group-hover:text-[#ffc114] transition-colors duration-300">
                    {item.title}
                  </h3>

                  <div className={`transition-all duration-700 overflow-hidden ${isHovered ? 'max-h-[120px] opacity-100 mt-2' : 'max-h-0 opacity-0'}`}>
                    <p className="text-zinc-500 font-sans text-xs max-w-sm leading-relaxed">
                      {item.desc}
                    </p>
                    <div className="pt-3 flex items-center gap-1.5 text-[9px] font-black tracking-widest text-white/80 uppercase">
                      <span>VIEW FULL IMAGE</span> <FiArrowUpRight className="text-xs text-[#ffc114]" />
                    </div>
                  </div>
                </div>

                <div className="absolute top-6 right-6 w-10 h-10 border border-zinc-800 rounded-full flex items-center justify-center text-zinc-600 bg-black/50 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                  <FiMaximize2 className="text-sm group-hover:text-[#ffc114]" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="py-24 px-6 md:px-12 lg:px-16 bg-[#030303] relative z-30 select-none">
        <div className="max-w-[1400px] mx-auto">
          <div   data-aos="fade-right"
  data-aos-delay="100" className="mb-14 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-zinc-600 text-[10px] font-bold tracking-[0.35em] uppercase block">// GYM STANDARDS</span>
              <h2 className="text-white font-gym-brutal text-2xl sm:text-3xl uppercase tracking-wider mt-1">WHAT MAKES US DIFFERENT</h2>
            </div>
            <p className="text-zinc-500 text-xs sm:text-sm font-light max-w-sm md:text-right leading-relaxed">
              Every part of our gym is built and maintained to give you the best training experience.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div   data-aos="fade-up"
  data-aos-delay="100" className="p-6 bg-[#0a0a0a] border border-zinc-900 space-y-4 hover:border-zinc-700 hover:-translate-y-1 transition-all duration-300 shadow-sm">
              <div className="w-10 h-10 bg-black border border-zinc-800 flex items-center justify-center text-[#ffc114] text-base"><FiCompass /></div>
              <h4 className="text-white font-gym-brutal text-sm tracking-widest uppercase">NATURAL LIGHTING</h4>
              <p className="text-zinc-500 font-sans text-xs leading-relaxed">Large windows and open layout to keep the gym bright and fresh throughout the day.</p>
            </div>
            <div    data-aos="fade-up"
  data-aos-delay="250" className="p-6 bg-[#0a0a0a] border border-zinc-900 space-y-4 hover:border-zinc-700 hover:-translate-y-1 transition-all duration-300 shadow-xl">
              <div className="w-10 h-10 bg-black border border-zinc-800 flex items-center justify-center text-[#ffc114] text-base"><FiCpu /></div>
              <h4 className="text-white font-gym-brutal text-sm tracking-widest uppercase">DIGITAL TRACKING</h4>
              <p className="text-zinc-500 font-sans text-xs leading-relaxed">Track your workouts and body progress easily with our in-gym digital tools.</p>
            </div>
            <div   data-aos="fade-up"
  data-aos-delay="400" className="p-6 bg-[#0a0a0a] border border-zinc-900 space-y-4 hover:border-zinc-700 hover:-translate-y-1 transition-all duration-300 shadow-sm">
              <div className="w-10 h-10 bg-black border border-zinc-800 flex items-center justify-center text-[#ffc114] text-base"><FiMapPin /></div>
              <h4 className="text-white font-gym-brutal text-sm tracking-widest uppercase">CLEAN AIR SYSTEM</h4>
              <p className="text-zinc-500 font-sans text-xs leading-relaxed">Air filters installed across the gym to keep the air fresh and clean while you train.</p>
            </div>
            <div   data-aos="fade-up"
  data-aos-delay="550" className="p-6 bg-[#0a0a0a] border border-zinc-900 space-y-4 hover:border-zinc-700 hover:-translate-y-1 transition-all duration-300 shadow-sm">
              <div className="w-10 h-10 bg-black border border-zinc-800 flex items-center justify-center text-[#ffc114] text-base"><FiShield /></div>
              <h4 className="text-white font-gym-brutal text-sm tracking-widest uppercase">HYGIENE FIRST</h4>
              <p className="text-zinc-500 font-sans text-xs leading-relaxed">All equipment is cleaned and sanitized daily to keep your training environment safe.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-6 md:px-12 lg:px-16 bg-[#060606] border-t border-b border-zinc-900/60 relative z-30 select-none">
        <div className="max-w-[1400px] mx-auto">
          <div   data-aos="fade-up"
  data-aos-delay="100" className="overflow-x-auto w-full border border-zinc-900 bg-black">
            <table className="w-full text-left border-collapse min-w-[750px]">
              <thead>
                <tr className="bg-zinc-950 border-b border-zinc-900 text-[9px] font-bold tracking-[0.25em] text-zinc-500 uppercase">
                  <th className="p-6">AREA NAME</th>
                  <th className="p-6">SIZE</th>
                  <th className="p-6">FLOOR TYPE</th>
                  <th className="p-6">SOUND SETUP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-900/60 text-xs text-zinc-400">
                {galleryData.map((item) => (
                  <tr key={item.id} className="hover:bg-zinc-950/40 transition-colors">
                    <td className="p-6 font-gym-brutal text-sm tracking-wider text-white uppercase">{item.title}</td>
                    <td className="p-6 text-[#ffc114] font-bold font-mono text-[11px]">{item.sqft}</td>
                    <td className="p-6 text-zinc-500 font-medium">{item.loadCapacity}</td>
                    <td className="p-6 text-zinc-500 font-mono text-[11px] uppercase tracking-wide">{item.acoustics}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="py-24 px-6 md:px-12 lg:px-16 relative z-30">
        <div   data-aos="zoom-in"
  data-aos-delay="100" className="max-w-[1100px] mx-auto bg-[#0a0a0a] border border-zinc-900 p-8 sm:p-12 md:p-16 rounded-none relative overflow-hidden">
          <div className="absolute right-0 bottom-0 w-64 h-64 bg-[#ffc114]/5 rounded-full blur-[100px] pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-20">
            <div className="lg:col-span-8 space-y-3">
              <span className="text-[#ffc114] text-[9px] font-bold tracking-[0.35em] uppercase block">// VISIT US IN PERSON</span>
              <h3 className="text-white font-gym-brutal text-2xl sm:text-4xl uppercase tracking-wide leading-tight">
                COME AND SEE THE GYM YOURSELF
              </h3>
              <p className="text-zinc-500 font-sans text-xs sm:text-sm leading-relaxed max-w-2xl">
                Photos can only show so much. Visit us in person and take a full tour of our gym, check the equipment, and meet our trainer — no pressure, no commitment.
              </p>
            </div>

            <div className="lg:col-span-4 w-full">
              <button  
              onClick={() => navigate("/contact")}
               data-aos="zoom-in"
  data-aos-delay="250" 
  className="w-full bg-[#ffc114] text-black hover:bg-white font-black text-[11px] tracking-[0.25em] px-6 py-4 transition-all duration-300 uppercase flex items-center justify-center gap-2.5 cursor-pointer shadow-2xl shadow-amber-500/5">
                <FiCalendar className="text-sm" />
                <span>BOOK A FREE VISIT</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {selectedImage && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-md z-[9999] flex flex-col items-center justify-center p-4">
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-6 right-6 text-zinc-500 hover:text-white text-xl transition-colors cursor-pointer p-2.5 bg-zinc-900/50 rounded-full border border-zinc-800 z-50"
          >
            <FaTimes />
          </button>

          <div className="max-w-[1000px] w-full bg-[#0a0a0a] border border-zinc-800/80 rounded-none overflow-hidden shadow-2xl relative">
            <div className="w-full max-h-[65vh] overflow-hidden bg-black flex items-center justify-center">
              <img
                src={selectedImage.image}
                alt={selectedImage.title}
                className="w-full h-full object-contain mx-auto"
              />
            </div>

            <div className="p-6 sm:p-8 bg-[#0a0a0a] border-t border-zinc-900 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div className="space-y-1">
                <span className="text-[#ffc114] font-mono text-[9px] font-bold tracking-[0.3em] uppercase block">
                  // AREA SIZE: {selectedImage.sqft}
                </span>
                <h3 className="text-white font-gym-brutal text-lg sm:text-xl tracking-wide uppercase">
                  {selectedImage.title}
                </h3>
                <p className="text-zinc-400 font-sans text-xs sm:text-sm font-light">
                  {selectedImage.desc}
                </p>
              </div>
              <button
                onClick={() => setSelectedImage(null)}
                className="bg-zinc-900 hover:bg-[#ffc114] text-white hover:text-black border border-zinc-800 hover:border-[#ffc114] font-black text-[10px] tracking-[0.25em] px-6 py-4 transition-all duration-300 uppercase shrink-0 rounded-none cursor-pointer"
              >
                CLOSE
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Gallery;