import React from "react";
import { GiWeightLiftingUp, GiDiploma } from "react-icons/gi";
import { FaUserShield, FaHeartbeat } from "react-icons/fa";

const Features = () => {
  const data = [
    {
      num: "01",
      icon: <GiWeightLiftingUp />,
      title: "MODERN EQUIPMENT",
      desc: "State of the art fitness machines & bio-mechanical technology.",
    },
    {
      num: "02",
      icon: <FaUserShield />,
      title: "EXPERT TRAINERS",
      desc: "Certified international coaches & elite level athletic trainers.",
    },
    {
      num: "03",
      icon: <GiDiploma />,
      title: "PERSONALIZED PLAN",
      desc: "Tailored workout regimes & science-backed dynamic diet protocols.",
    },
    {
      num: "04",
      icon: <FaHeartbeat />,
      title: "HEALTHY LIFESTYLE",
      desc: "Unlock your true peak performance, longevity, and mental grit.",
    },
  ];

  return (
    <section className="bg-[#050505] py-24 w-full relative z-30">
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 md:px-8 lg:px-12">
        <div
          data-aos="fade-right"
          data-aos-delay="100"
          className="flex flex-col mb-16 border-l-2 border-[#ffc114] pl-4 justify-start items-start"
        >
          <span className="text-[#ffc114] text-[10px] font-black tracking-[0.3em] uppercase mb-1">
            WHY CHOOSE US
          </span>
          <h2 className="text-white font-gym-brutal text-2xl sm:text-3xl tracking-wide uppercase">
            THE PREMIUM STANDARD
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {data.map((item, idx) => (
            <div
              key={idx}
              data-aos="zoom-in-up"
              data-aos-delay={idx * 150}
              className="group relative bg-[#0a0a0a] border border-zinc-900/80 p-8 flex flex-col justify-between min-h-[250px] transition-all duration-500 hover:border-[#ffc114]/30 hover:-translate-y-1.5 overflow-hidden select-none"
            >
              <div className="absolute right-4 bottom-2 text-[100px] font-black text-zinc-900/10 font-gym-brutal leading-none group-hover:text-[#ffc114]/5 transition-colors duration-500 pointer-events-none">
                {item.num}
              </div>

              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-zinc-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative z-10 flex flex-col items-start">
                <div
                  data-aos="flip-left"
                  data-aos-delay={idx * 150 + 150}
                  className="w-14 h-14 rounded-xl bg-zinc-900/50 border border-zinc-800/40 flex items-center justify-center text-[#ffc114] text-2xl mb-6 group-hover:bg-[#ffc114] group-hover:text-black group-hover:border-[#ffc114] transition-all duration-500 shadow-lg shadow-black/50"
                >
                  {item.icon}
                </div>

                <h4
                  data-aos="fade-up"
                  data-aos-delay={idx * 150 + 250}
                  className="text-white font-bold text-[13px] tracking-[0.15em] uppercase mb-3 group-hover:text-[#ffc114] transition-colors duration-300"
                >
                  {item.title}
                </h4>
              </div>

              <div className="relative z-10 mt-2 text-start">
                <p
                  data-aos="fade-up"
                  data-aos-delay={idx * 150 + 350}
                  className="text-zinc-500 text-[12px] font-medium tracking-wide leading-relaxed group-hover:text-zinc-400 transition-colors duration-300 max-w-[95%]"
                >
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
