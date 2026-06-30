import React from "react";
import { FaInstagram, FaTwitter, FaCrown } from "react-icons/fa";
import { FiCheckCircle } from "react-icons/fi";

const TrainersPreview = () => {
  const trainerData = {
    name: "UDHAYA SURIYAN",
    role: "Founder & Head Bio-Mechanics",
    img: "/images/trainer-1.jpg",
    bio: "Architecting high-end human biomechanics and structural transformation. Specializing in elite conditioning, kinetic optimization, and neuromuscular performance protocols tailored for high-performance athletes.",
    credentials: [
      "Certified Master Biomechanics Specialist",
      "Elite Hypertrophy & Strength Coach",
      "Neuromuscular Conditioning Expert",
      "10+ Years of Professional Athlete Transformation",
    ],
  };

  return (
    <section className="py-24 w-full bg-[#030303] border-b border-white/[0.03] relative overflow-hidden select-none">
      <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-[#ffc114]/[0.02] rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-[#ffc114]/[0.01] rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 md:px-8 lg:px-12 relative z-10">
        <div
          data-aos="fade-right"
          data-aos-delay="100"
          className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/[0.04] pb-10 mb-16 lg:mb-20 gap-6 w-full text-start"
        >
          <div className="space-y-2 flex flex-col items-start justify-center">
            <div className="flex items-center gap-2">
              <FaCrown className="text-[#ffc114] text-[10px] animate-pulse" />
              <h5 className="text-[#ffc114] tracking-[0.3em] uppercase text-[9px] font-black">
                ELITE HUMAN ARCHITECT
              </h5>
            </div>
            <h2 className="text-[36px] sm:text-[48px] md:text-[56px] font-gym-brutal uppercase tracking-tight text-white leading-none">
              MEET OUR <span className="text-[#ffc114]">HEAD COACH</span>
            </h2>
          </div>
          <p className="text-zinc-500 text-xs font-light tracking-widest uppercase max-w-xs md:text-right leading-relaxed">
            Certified elite mechanic redefining strength limits and human
            physiology.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center w-full">
          <div
            data-aos="fade-right"
            data-aos-duration="1000"
            className="lg:col-span-5 w-full flex justify-center"
          >
            <div className="bg-[#070707] border border-white/[0.04] rounded-none overflow-hidden relative group w-full max-w-[420px] h-[480px] sm:h-[540px] transition-all duration-700 ease-out hover:border-[#ffc114]/30 shadow-2xl flex flex-col justify-end items-start">
              <div className="absolute inset-0 w-full h-full z-0 overflow-hidden bg-zinc-950">
                <img
                  src={trainerData.img}
                  alt={trainerData.name}
                  className="w-full h-full object-cover mix-blend-luminosity grayscale group-hover:grayscale-0 group-hover:mix-blend-normal group-hover:scale-103 transition-all duration-700 ease-out"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-[#030303] via-[#030303]/20 to-transparent opacity-90" />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500" />
              </div>

              <span className="absolute top-0 right-0 w-0 h-[1px] bg-[#ffc114]/50 transition-all duration-500 group-hover:w-20" />
              <span className="absolute top-0 right-0 w-[1px] h-0 bg-[#ffc114]/50 transition-all duration-500 group-hover:h-20" />

              <div className="absolute top-6 left-6 z-10 flex flex-col gap-3 opacity-60 group-hover:opacity-100 transition-opacity duration-500">
                <a
                  href="#"
                  className="w-8 h-8 bg-[#030303]/80 border border-white/10 text-white hover:text-black hover:bg-[#ffc114] hover:border-[#ffc114] flex items-center justify-center transition-all duration-300 backdrop-blur-md"
                >
                  <FaInstagram className="text-xs" />
                </a>
                <a
                  href="#"
                  className="w-8 h-8 bg-[#030303]/80 border border-white/10 text-white hover:text-black hover:bg-[#ffc114] hover:border-[#ffc114] flex items-center justify-center transition-all duration-300 backdrop-blur-md"
                >
                  <FaTwitter className="text-xs" />
                </a>
              </div>

              <div className="relative z-10 p-8 w-full bg-gradient-to-t from-[#030303] via-[#030303]/80 to-transparent pt-20 text-start">
                <span className="text-zinc-600 font-mono text-[10px] block mb-1">
                  // MAIN ANCHOR
                </span>
                <h4 className="text-[14px] font-bold tracking-[0.2em] text-[#ffc114] uppercase">
                  MUGIL FITNESS EXECUTIVE
                </h4>
              </div>
            </div>
          </div>

          <div
            data-aos="fade-left"
            data-aos-delay="200"
            className="lg:col-span-7 flex flex-col items-start space-y-8 text-start"
          >
            <div data-aos="fade-up" data-aos-delay="300" className="space-y-3">
              <span className="text-zinc-600 font-mono text-[11px] block tracking-widest">
                // BIO-MECHANICS DIRECTOR
              </span>
              <h3 className="text-[32px] sm:text-[42px] font-black text-white uppercase tracking-tight font-gym-brutal leading-none">
                {trainerData.name}
              </h3>
              <p className="text-[#ffc114] text-[11px] tracking-[0.2em] uppercase font-bold">
                {trainerData.role}
              </p>
            </div>

            <div className="w-16 h-[2px] bg-[#ffc114]" />

            <p
              data-aos="fade-up"
              data-aos-delay="400"
              className="text-zinc-400 text-[13px] font-light tracking-wide leading-relaxed uppercase max-w-xl"
            >
              {trainerData.bio}
            </p>

            <div
              data-aos="fade-up"
              data-aos-delay="500"
              className="w-full pt-4"
            >
              <span className="text-zinc-600 font-mono text-[9px] block tracking-[0.25em] mb-4 uppercase">
                // VERIFIED ARCHITECTURE CAPABILITIES
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                {trainerData.credentials.map((spec, i) => (
                  <div
                    key={i}
                    data-aos="zoom-in-up"
                    data-aos-delay={i * 120}
                    data-aos-duration="700"
                    className="flex items-center gap-3 bg-[#060606] border border-white/[0.02] p-4 group/item hover:border-[#ffc114]/20 transition-all duration-500"
                  >
                    <FiCheckCircle className="text-[#ffc114] text-sm shrink-0 transition-transform duration-500 group-hover/item:scale-110" />
                    <span className="text-zinc-400 group-hover/item:text-white transition-colors duration-500 text-[10.5px] font-medium tracking-wider uppercase">
                      {spec}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrainersPreview;
