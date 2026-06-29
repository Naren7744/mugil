import React, { useState, useEffect } from 'react';
import { FiArrowUpRight, FiCheck } from 'react-icons/fi';
import { FaCrown } from 'react-icons/fa';

const API_BASE = '/api/v1';

const MembershipPlans = () => {
  const [plans, setPlans]   = useState([]);
  const [loading, setLoading] = useState(true);

  // ── Fetch 1-Month active plans from backend ──────────────────────────────
  useEffect(() => {
    fetch(`${API_BASE}/plans/public`)
      .then((res) => res.json())
      .then((data) => {
        const monthly = (data.data || [])
          .filter((p) => p.duration === '1 Month' && p.status !== 'Inactive')
          .sort((a, b) => Number(a.price) - Number(b.price));
        setPlans(monthly);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load plans:', err);
        setLoading(false);
      });
  }, []);

  // Show offer price if available, else regular price
  const displayPrice = (plan) =>
    Number(plan.offerPrice) > 0 ? Number(plan.offerPrice) : Number(plan.price);

  // 01, 02, 03 index format
  const formatIdx = (i) => String(i + 1).padStart(2, '0');

  return (
    <section className="py-24 w-full bg-[#030303] border-b border-white/[0.03] relative overflow-hidden select-none">

      <div className="absolute right-0 bottom-0 bg-[#ffc114]/[0.015] rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 md:px-8 lg:px-12 relative z-10">

        {/* Header */}
        <div   data-aos="fade-right"
  data-aos-delay="100" className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/[0.04] pb-10 mb-16 gap-6 w-full text-start">
          <div className="space-y-2 flex flex-col items-start justify-center">
            <div className="flex items-center gap-2">
              <FaCrown className="text-[#ffc114] text-[10px] animate-pulse" />
              <h5 className="text-[#ffc114] tracking-[0.3em] uppercase text-[9px] font-black">
                Membership Plans
              </h5>
            </div>
            <h2 className="text-[36px] sm:text-[48px] md:text-[56px] font-gym-brutal uppercase tracking-tight text-white leading-none">
              MEMBERSHIP <span className="text-[#ffc114]">PLANS</span>
            </h2>
          </div>
          <p className="text-zinc-500 text-xs font-light tracking-widest uppercase max-w-sm md:text-right leading-relaxed">
            Simple, honest pricing built for your goals.
          </p>
        </div>

        {/* Plan Rows */}
        <div className="flex flex-col border-t border-white/[0.04] w-full">

          {/* Loading skeleton rows */}
          {loading && [1, 2, 3].map((i) => (
            <div
              key={i}
                data-aos="fade-up"
  data-aos-delay={i * 100}
              className="w-full grid grid-cols-1 md:grid-cols-12 items-center py-8 md:py-12 px-4 sm:px-6 border-b border-white/[0.04] animate-pulse"
            >
              <div className="md:col-span-4 flex items-baseline gap-4">
                <div className="h-3 w-6 bg-zinc-800 rounded" />
                <div className="h-6 w-48 bg-zinc-800 rounded" />
              </div>
              <div className="md:col-span-3 mt-4 md:mt-0">
                <div className="h-12 w-32 bg-zinc-800 rounded" />
              </div>
              <div className="md:col-span-3 mt-4 md:mt-0 space-y-2">
                <div className="h-3 w-28 bg-zinc-800 rounded" />
                <div className="h-3 w-24 bg-zinc-800 rounded" />
                <div className="h-3 w-20 bg-zinc-800 rounded" />
              </div>
              <div className="md:col-span-2 flex justify-end mt-4 md:mt-0">
                <div className="w-12 h-12 bg-zinc-800" />
              </div>
            </div>
          ))}

          {/* Empty state */}
          {!loading && plans.length === 0 && (
            <div  data-aos="fade-up" className="py-20 text-center text-zinc-600 text-xs tracking-widest uppercase">
              No plans available right now.
            </div>
          )}

          {/* Actual plan rows */}
          {!loading && plans.map((plan, idx) => (
            <a
              key={plan._id}
                data-aos="fade-up"
  data-aos-delay={idx * 150}
  data-aos-duration="800"
              href="/membership"
              className="group relative w-full grid grid-cols-1 md:grid-cols-12 items-center py-8 md:py-12 px-4 sm:px-6 border-b border-white/[0.04] transition-all duration-700 ease-out bg-transparent hover:bg-white/[0.01] cursor-pointer text-start"
            >
              {/* Yellow left border on hover */}
              <span className="absolute inset-y-0 left-0 w-[2px] h-0 bg-[#ffc114] transition-all duration-500 ease-out group-hover:h-full" />

              {/* COL 1: Index + Name */}
              <div className="md:col-span-4 flex items-baseline gap-4 pb-4 md:pb-0 justify-start">
                <span className="text-zinc-700 font-mono text-xs font-black shrink-0">
                  // {formatIdx(idx)}
                </span>
                <div   data-aos="fade-right"
  data-aos-delay={idx * 150 + 100} className="space-y-1 flex flex-col items-start">
                  <h3 className="text-[20px] sm:text-[24px] font-black text-white uppercase font-gym-brutal group-hover:text-[#ffc114] transition-colors duration-300 flex items-center flex-wrap gap-2 text-start">
                    {plan.name}
                    {plan.isFeatured && (
                      <span className="text-[8px] tracking-[0.25em] font-sans font-black bg-[#ffc114]/10 text-[#ffc114] border border-[#ffc114]/20 px-2 py-0.5 ml-1 inline-block">
                        POPULAR
                      </span>
                    )}
                    {Number(plan.offerPrice) > 0 && (
                      <span className="text-[8px] tracking-[0.25em] font-sans font-black bg-red-500/10 text-red-400 border border-red-500/20 px-2 py-0.5 ml-1 inline-block">
                        OFFER
                      </span>
                    )}
                  </h3>
                  <p className="text-zinc-500 text-[10px] font-light leading-relaxed max-w-xs tracking-wide uppercase hidden sm:block text-start">
                    {plan.description || plan.planType}
                  </p>
                </div>
              </div>

              {/* COL 2: Price */}
              <div   data-aos="zoom-in"
  data-aos-delay={idx * 150 + 200} className="md:col-span-3 flex items-baseline gap-1 pb-6 md:pb-0 justify-start">
                <span className="text-lg font-bold text-[#ffc114]">₹</span>
                <span className="text-[42px] sm:text-[52px] font-black text-white tracking-tight font-gym-brutal group-hover:scale-105 transition-transform duration-500 origin-left">
                  {displayPrice(plan).toLocaleString('en-IN')}
                </span>
                <div className="ml-2 flex flex-col gap-0.5">
                  {Number(plan.offerPrice) > 0 && (
                    <span className="text-zinc-600 text-[8.5px] font-bold tracking-[0.2em] uppercase line-through">
                      ₹{Number(plan.price).toLocaleString('en-IN')}
                    </span>
                  )}
                  <span className="text-zinc-600 text-[8.5px] font-bold tracking-[0.2em] uppercase">
                    / MONTHLY
                  </span>
                  {Number(plan.admissionFee) > 0 && (
                    <span className="text-zinc-700 text-[8px] tracking-wide">
                      + ₹{Number(plan.admissionFee).toLocaleString('en-IN')} joining
                    </span>
                  )}
                </div>
              </div>

              {/* COL 3: Features */}
              <div   data-aos="fade-left"
  data-aos-delay={idx * 150 + 300} className="md:col-span-3 pb-6 md:pb-0 w-full">
                <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-x-4 gap-y-2 text-[10px] lg:text-[11px] font-medium tracking-wider text-zinc-400 uppercase w-full items-start">
                  {plan.features?.slice(0, 5).map((feat, i) => (
                    <li
                      key={i}
                      className="flex items-center gap-2 font-light text-zinc-500 group-hover:text-zinc-300 transition-colors duration-500 justify-start text-start"
                    >
                      <FiCheck className="text-[#ffc114] text-xs shrink-0" />
                      <span className="truncate">{feat}</span>
                    </li>
                  ))}
                  {(plan.features?.length || 0) > 5 && (
                    <li className="text-zinc-600 text-[9px] tracking-widest pl-4">
                      +{plan.features.length - 5} more
                    </li>
                  )}
                </ul>
              </div>

              {/* COL 4: Arrow */}
              <div   data-aos="zoom-in"
  data-aos-delay={idx * 150 + 400} className="md:col-span-2 flex justify-start md:justify-end w-full">
                <div className="w-12 h-12 rounded-none border border-white/[0.04] group-hover:border-[#ffc114]/40 flex items-center justify-center transition-all duration-500 bg-zinc-900/[0.1] group-hover:bg-[#ffc114]">
                  <FiArrowUpRight className="text-base text-zinc-400 group-hover:text-black transition-all duration-500 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:scale-110" />
                </div>
              </div>
            </a>
          ))}
        </div>

      </div>
    </section>
  );
};

export default MembershipPlans;