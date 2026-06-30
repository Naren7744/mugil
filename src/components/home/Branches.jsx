import React from "react";
import { FiMapPin, FiClock, FiPhone, FiArrowRight } from "react-icons/fi";
import { FaCrown } from "react-icons/fa";

const Branches = () => {
  const branchData = [
    {
      id: 1,
      name: "Mugil Fitness",
      headline: "Main Premium Hub",
      location: "Thattanchadi, Karupur Post, Omalur Taluk, Salem Dt - 636012",
      timings: [
        "Mon - Sat: 05:00 AM - 10:00 AM",
        "Mon - Sat: 04:00 PM - 10:00 PM",
        "Sunday: Morning Session Only",
      ],
      phone: "+91 80987 12009",
      mapUrl: "https://maps.app.goo.gl/3pF5azccNj2gykoCA",
    },
    {
      id: 2,
      name: "SP Fitness",
      headline: "Elite Performance Zone",
      location:
        "Government Engineering College Opposite, Karupur, Omalur Tk, Salem Dt - 636011",
      timings: [
        "Mon - Sat: 05:00 AM - 10:00 AM",
        "Mon - Sat: 04:00 PM - 10:00 PM",
        "Sunday: Morning Session Only",
      ],
      phone: "+91 80987 12009",
      mapUrl: "https://maps.app.goo.gl/YGY69xAfmz3xRFHfA",
    },
  ];

  return (
    <section className="py-15 w-full bg-[#020202] border-b border-white/[0.02] relative overflow-hidden select-none">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#ffc114]/[0.01] rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 md:px-8 lg:px-12 relative z-10">
        <div
          data-aos="fade-right"
          data-aos-delay="100"
          className="flex flex-col items-start space-y-4 mb-20 border-l-2 border-[#ffc114] pl-4 justify-start"
        >
          <div className="flex items-center gap-2">
            <FaCrown className="text-[#ffc114] text-[10px] animate-pulse" />
            <h5 className="text-[#ffc114] tracking-[0.25em] uppercase text-[9px] font-black">
              OUR LOCATIONS
            </h5>
          </div>
          <h2 className="text-[34px] sm:text-[46px] md:text-[54px] font-gym-brutal uppercase tracking-tight text-white leading-none">
            PREMIUM GYMS <span className="text-[#ffc114]">NEAR YOU</span>
          </h2>
          <p className="text-zinc-500 text-xs font-light tracking-wide uppercase max-w-sm pt-1 leading-relaxed text-start">
            World-class training facilities across the Salem area.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
          {branchData.map((branch) => (
            <div
              key={branch.id}
              data-aos={branch.id % 2 === 0 ? "fade-left" : "fade-right"}
              data-aos-delay={branch.id * 200}
              className="relative bg-[#060606] border border-white/[0.03] p-8 sm:p-10 lg:p-12 rounded-none transition-all duration-700 group hover:border-[#ffc114]/30 flex flex-col justify-between h-full shadow-2xl items-start"
            >
              <span className="absolute top-0 right-0 w-0 h-[1px] bg-[#ffc114]/50 transition-all duration-500 group-hover:w-24" />
              <span className="absolute top-0 right-0 w-[1px] h-0 bg-[#ffc114]/50 transition-all duration-500 group-hover:h-24" />

              <div className="w-full text-start">
                <div
                  data-aos="fade-up"
                  data-aos-delay="150"
                  className="mb-10 flex flex-col items-start"
                >
                  <span className="text-zinc-700 font-mono text-[11px] block mb-2">
                    // BRANCH 0{branch.id}
                  </span>
                  <h3 className="text-[30px] sm:text-[36px] font-black text-white uppercase tracking-tight font-gym-brutal transition-colors duration-500 group-hover:text-[#ffc114]">
                    {branch.name}
                  </h3>
                  <p className="text-[#ffc114]/80 text-[10px] tracking-[0.15em] uppercase font-semibold mt-1">
                    {branch.headline}
                  </p>
                </div>

                <div className="space-y-6 text-zinc-400 text-[11px] font-medium tracking-wider uppercase flex flex-col items-start">
                  <div
                    data-aos="fade-up"
                    data-aos-delay="250"
                    className="flex items-start gap-4 text-start"
                  >
                    <FiMapPin className="text-[#ffc114] text-base shrink-0 mt-0.5 transition-colors duration-500" />
                    <div className="flex flex-col space-y-1 items-start">
                      <span className="text-zinc-600 font-bold tracking-widest text-[8.5px]">
                        ADDRESS
                      </span>
                      <span className="text-zinc-400 font-light tracking-wide normal-case sm:uppercase leading-relaxed group-hover:text-white transition-colors duration-500">
                        {branch.location}
                      </span>
                    </div>
                  </div>

                  <div
                    data-aos="fade-up"
                    data-aos-delay="350"
                    className="flex items-start gap-4 text-start"
                  >
                    <FiClock className="text-[#ffc114] text-base shrink-0 mt-0.5 transition-colors duration-500" />
                    <div className="flex flex-col space-y-1 items-start">
                      <span className="text-zinc-600 font-bold tracking-widest text-[8.5px]">
                        TIMINGS
                      </span>
                      <div className="flex flex-col space-y-0.5 font-light text-zinc-400 text-[10.5px] items-start">
                        <span>{branch.timings[0]}</span>
                        <span>{branch.timings[1]}</span>
                        <span className="text-[#ffc114] font-black text-[9px] pt-1 tracking-widest animate-pulse">
                          {branch.timings[2]}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div
                    data-aos="fade-up"
                    data-aos-delay="450"
                    className="flex items-start gap-4 text-start"
                  >
                    <FiPhone className="text-[#ffc114] text-base shrink-0 transition-colors duration-500" />
                    <div className="flex flex-col space-y-1 items-start">
                      <span className="text-zinc-600 font-bold tracking-widest text-[8.5px]">
                        CONTACT
                      </span>
                      <span className="text-white group-hover:text-[#ffc114] font-black tracking-[0.1em] text-xs transition-colors duration-500">
                        {branch.phone}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div
                data-aos="zoom-in"
                data-aos-delay="550"
                className="mt-12 pt-4 border-t border-white/[0.02] w-full text-start flex justify-start"
              >
                <a
                  href={branch.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 text-[10px] uppercase tracking-[0.25em] font-black text-zinc-400 group-hover:text-white transition-all duration-500"
                >
                  <span>GET DIRECTIONS</span>
                  <FiArrowRight className="text-sm transition-transform duration-500 transform group-hover:translate-x-2 text-[#ffc114]" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Branches;
