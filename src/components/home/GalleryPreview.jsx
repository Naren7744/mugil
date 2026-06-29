import React from 'react';
import { FiArrowRight } from 'react-icons/fi';
import { FaCrown } from 'react-icons/fa';

const GalleryPreview = () => {
  const images = [
    { url: "/images/gallery-1.jpg", span: "md:col-span-2 md:row-span-2 h-[320px] md:h-[420px]" }, // பெரிய முதன்மை பிரேம்
    { url: "/images/gallery-2.jpg", span: "md:col-span-2 md:row-span-1 h-[150px] md:h-[200px]" },
    { url: "/images/gallery-3.jpg", span: "md:col-span-1 md:row-span-1 h-[150px] md:h-[200px]" },
    { url: "/images/gallery-4.jpg", span: "md:col-span-1 md:row-span-1 h-[150px] md:h-[200px]" }
  ];

  return (
    <section className="py-24 w-full bg-[#030303] border-b border-white/[0.03] relative overflow-hidden select-none">
      
      <div className="absolute left-1/2 bottom-0 -translate-x-1/2 w-[600px] h-[600px] bg-[#ffc114]/[0.01] rounded-full blur-[120px] pointer-events-none" />

   
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 md:px-8 lg:px-12 relative z-10">
    

        <div   data-aos="fade-right"
  data-aos-delay="100" className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/[0.04] pb-10 mb-16 gap-6 w-full text-start">
          <div className="space-y-2 flex flex-col items-start justify-center">
            <div className="flex items-center gap-2">
              <FaCrown className="text-[#ffc114] text-[10px] animate-pulse" />
              <h5 className="text-[#ffc114] tracking-[0.3em] uppercase text-[9px] font-black">
                VISUAL EVIDENCE
              </h5>
            </div>
            <h2 className="text-[36px] sm:text-[48px] md:text-[56px] font-gym-brutal uppercase tracking-tight text-white leading-none">
              MOMENTS THAT <span className="text-[#ffc114]">INSPIRE</span>
            </h2>
          </div>
          <p className="text-zinc-500 text-xs font-light tracking-widest uppercase max-w-xs md:text-right leading-relaxed">
            A glimpse into our high-performance arena, premium mechanics, and raw energy.
          </p>
        </div>


        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 lg:gap-6 w-full">
          {images.map((img, i) => (
            <div 
              key={i} 
                data-aos="zoom-in-up"
  data-aos-delay={i * 150}
  data-aos-duration="800"
              className={`
                ${img.span}
                rounded-none 
                overflow-hidden 
                border border-white/[0.03] 
                hover:border-[#ffc114]/30 
                transition-all duration-700 ease-out
                bg-[#070707]
                relative
                group
              `}
            >
              
              <img 
                src={img.url} 
                alt="Mugil SP Gym Activity" 
                className="w-full h-full object-cover opacity-40 hover:opacity-100 mix-blend-luminosity hover:mix-blend-normal grayscale group-hover:grayscale-0 scale-100 group-hover:scale-105 transition-all duration-[750ms] ease-out" 
              />
              
              <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#ffc114]/30 transition-all duration-500 group-hover:w-16" />
            </div>
          ))}
        </div>

  
        <div  data-aos="fade-up"
  data-aos-delay="500" className="mt-12 flex justify-center md:justify-end w-full">
          <a 
            href="/gallery" 
            className="inline-flex items-center gap-3 text-[10px] uppercase tracking-[0.25em] font-black text-zinc-400 hover:text-white transition-all duration-300 group/link"
          >
            <span>VIEW FULL ARENA GALLERY</span>
            <div className="w-8 h-8 rounded-none border border-white/[0.06] group-hover/link:border-[#ffc114]/40 flex items-center justify-center transition-all duration-500 bg-zinc-900/[0.1] group-hover/link:hover:bg-[#ffc114]">
              <FiArrowRight className="text-sm text-zinc-400 group-hover/link:text-black transition-transform duration-300 group-hover/link:translate-x-0.5" />
            </div>
          </a>
        </div>

      </div>
    </section>
  );
};

export default GalleryPreview;