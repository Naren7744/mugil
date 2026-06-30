import React, { useState, useEffect } from "react";
import {
  FiPlus,
  FiMinus,
  FiArrowRight,
  FiPercent,
  FiAward,
  FiShield,
  FiChevronDown,
} from "react-icons/fi";
import { FaCrown, FaDumbbell } from "react-icons/fa";

// ── Change this to match your backend URL ─────────────────────────────────────
import api from "../services/api";

const Membership = () => {
  const [selectedDuration, setSelectedDuration] = useState("1 Month");
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeDetailPlan, setActiveDetailPlan] = useState(null);
  const [expandedFaq, setExpandedFaq] = useState(null);

  // ── Fetch active plans from backend ────────────────────────────────────────
  useEffect(() => {
    const loadPlans = async () => {
      try {
        const { data } = await api.get("/plans/public");

        setPlans(data.data || []);
      } catch (err) {
        console.error("Failed to load plans:", err);
      } finally {
        setLoading(false);
      }
    };

    loadPlans();
  }, []);

  // Filter by selected duration and exclude inactive plans
  const visiblePlans = plans.filter(
    (plan) => plan.duration === selectedDuration && plan.status !== "Inactive",
  );

  const durations = ["1 Month", "3 Months", "6 Months"];

  // Helper: display price (offer price if set, otherwise regular price)
  const displayPrice = (plan) =>
    Number(plan.offerPrice) > 0 ? Number(plan.offerPrice) : Number(plan.price);

  // Helper: plan icon based on type
  const planIcon = (planType) => {
    if (planType === "Weight Loss")
      return <FaCrown className="text-[#ffc114] text-sm animate-pulse" />;
    return <FaDumbbell className="text-zinc-500 text-sm" />;
  };

  // ── Add-ons (static — update if you add an addons model to backend) ────────
  const addons = [
    {
      title: "Personal Coach",
      price: "₹8,000",
      period: "month",
      desc: "1-on-1 training with Udhaya Suryan or Coach Sivaprakash.",
    },
    {
      title: "Steam & Spa",
      price: "₹2,500",
      period: "month",
      desc: "Unlimited access to sauna, steam room, and cold plunge pool.",
    },
    {
      title: "Meal Box",
      price: "₹350",
      period: "meal",
      desc: "Fresh high-protein meals mapped to your calorie needs, delivered to the lounge.",
    },
  ];

  const faqs = [
    {
      q: "Can I pause my membership?",
      a: "Yes. Monthly members can pause up to 15 days. Members on longer plans can pause up to 30 days — no extra charges.",
    },
    {
      q: "Are taxes included in the prices shown?",
      a: "Yes. All prices include GST and facility charges. No surprise fees at checkout.",
    },
    {
      q: "Can I switch plans later?",
      a: "Yes, you can upgrade at any time by paying the price difference at the front desk.",
    },
  ];

  return (
    <div className="bg-[#030303] text-zinc-400 font-sans tracking-normal antialiased selection:bg-[#ffc114]/20 selection:text-[#ffc114]">
      {/* ── SECTION 1: HEADER ─────────────────────────────────────────────── */}
      <section className="pt-30 pb-12 px-6 md:px-12 lg:px-24 bg-[#030303] border-b border-zinc-900 text-center relative">
        <div className="absolute left-1/2 top-0 -translate-x-1/2 w-[600px] h-[200px] bg-[#ffc114]/5 rounded-full blur-[140px] pointer-events-none" />
        <div
          data-aos="fade-down"
          data-aos-duration="1000"
          className="max-w-[1400px] mx-auto space-y-4"
        >
          <div className="inline-flex items-center gap-2 bg-[#0a0a0a] border border-zinc-800 px-4 py-1.5 shadow-sm">
            <div className="w-1.5 h-1.5 bg-[#ffc114] rounded-full animate-pulse" />
            <span className="text-[#ffc114] text-[9px] font-bold tracking-[0.35em] uppercase">
              Membership Plans
            </span>
          </div>

          <h2 className="text-white font-gym-brutal text-3xl sm:text-4xl md:text-6xl uppercase tracking-tight">
            CHOOSE YOUR <span className="text-[#ffc114]">PLAN</span>
          </h2>

          <p className="text-zinc-500 text-xs sm:text-sm font-light max-w-xl mx-auto leading-relaxed">
            Simple, honest plans built around your goals. Pick a duration, see
            what's included, and get started.
          </p>

          {/* Duration tabs */}
          <div className="mt-12 inline-flex flex-col sm:flex-row items-center justify-center bg-[#0a0a0a] border border-zinc-800 p-1.5 shadow-sm rounded-none w-full sm:w-auto gap-1 sm:gap-0">
            {durations.map((dur) => (
              <button
                key={dur}
                data-aos="zoom-in"
                data-aos-delay={100}
                onClick={() => {
                  setSelectedDuration(dur);
                  setActiveDetailPlan(null);
                }}
                className={`w-full sm:w-auto px-6 sm:px-8 py-3 font-bold text-[10px] tracking-widest uppercase transition-all duration-300 cursor-pointer flex items-center justify-center gap-2 rounded-none ${
                  selectedDuration === dur
                    ? "bg-[#ffc114] text-black shadow-xs"
                    : "text-zinc-500 hover:text-white"
                }`}
              >
                <span>{dur}</span>
                {dur !== "1 Month" && (
                  <span className="bg-red-950 text-red-400 border border-red-900/40 text-[8px] font-bold px-1.5 py-0.5 tracking-normal">
                    NO JOINING FEE
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 2: PLAN CARDS ─────────────────────────────────────────── */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 md:px-12 lg:px-24 bg-[#030303]">
        <div className="max-w-[1300px] mx-auto space-y-6">
          {/* Loading state */}
          {loading && (
            <div className="text-center py-20 text-zinc-500 text-sm">
              Loading plans...
            </div>
          )}

          {/* Empty state */}
          {!loading && visiblePlans.length === 0 && (
            <div className="text-center py-20 text-zinc-500 text-sm">
              No plans available for {selectedDuration} right now. Try another
              duration.
            </div>
          )}

          {/* Plan rows */}
          {visiblePlans.map((plan, idx) => {
            const isExpanded = activeDetailPlan === idx;
            const price = displayPrice(plan);
            const admissionFee = Number(plan.admissionFee || 0);
            const isOffer = Number(plan.offerPrice) > 0;
            const totalCost = price + admissionFee;

            return (
              <div
                key={plan._id}
                data-aos="fade-up"
                data-aos-delay={idx * 120}
                data-aos-duration="800"
                className={`bg-[#0a0a0a] border transition-all duration-500 rounded-none overflow-hidden ${
                  isExpanded
                    ? "border-[#ffc114] shadow-xl shadow-yellow-500/5"
                    : "border-zinc-900 hover:border-zinc-800"
                }`}
              >
                {/* Clickable header row */}
                <div
                  onClick={() => setActiveDetailPlan(isExpanded ? null : idx)}
                  className="p-5 sm:p-8 md:p-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 lg:gap-8 cursor-pointer select-none"
                >
                  {/* Left: name & description */}
                  <div className="space-y-2 max-w-md w-full">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-zinc-950 border border-zinc-900 flex items-center justify-center shadow-xs">
                        {planIcon(plan.planType)}
                      </div>
                      <div>
                        <h3 className="text-white font-gym-brutal text-base sm:text-lg tracking-wide uppercase">
                          {plan.name}
                        </h3>
                        {plan.isFeatured && (
                          <span className="text-[#ffc114] text-[9px] font-bold tracking-widest uppercase">
                            ⭐ Popular
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="text-zinc-500 text-xs sm:text-sm font-light leading-relaxed">
                      {plan.description ||
                        `${plan.planType} · ${plan.duration}`}
                    </p>
                  </div>

                  {/* Center: feature tags (desktop only) */}
                  <div className="hidden xl:flex flex-wrap items-center gap-2">
                    {plan.features?.slice(0, 3).map((feat, fIdx) => (
                      <span
                        key={fIdx}
                        className="bg-zinc-950 border border-zinc-800 text-zinc-400 text-[9px] font-bold tracking-wider uppercase px-3 py-1.5 rounded-none"
                      >
                        {feat}
                      </span>
                    ))}
                    {(plan.features?.length || 0) > 3 && (
                      <span className="text-zinc-600 text-[9px] font-bold">
                        +{plan.features.length - 3} more
                      </span>
                    )}
                  </div>

                  {/* Right: price & expand toggle */}
                  <div className="flex flex-row items-center justify-between lg:justify-end w-full lg:w-auto gap-4 sm:gap-8 border-t lg:border-t-0 border-zinc-900/80 pt-4 lg:pt-0">
                    <div className="text-left lg:text-right">
                      {isOffer && (
                        <div className="flex items-center gap-2 mb-1">
                          <span className="line-through text-zinc-600 text-sm">
                            ₹{Number(plan.price).toLocaleString("en-IN")}
                          </span>
                          <span className="bg-red-950 text-red-400 border border-red-900/40 text-[8px] font-bold px-1.5 py-0.5">
                            SAVE ₹
                            {(plan.price - plan.offerPrice).toLocaleString(
                              "en-IN",
                            )}
                          </span>
                        </div>
                      )}
                      <div className="flex items-baseline gap-1">
                        <span className="text-white font-gym-brutal text-2xl sm:text-4xl tracking-tight">
                          ₹{price.toLocaleString("en-IN")}
                        </span>
                        <span className="text-zinc-600 text-[10px] font-bold tracking-wider">
                          / {plan.duration}
                        </span>
                      </div>
                      <span className="text-[10px] sm:text-[11px] font-medium tracking-wide block mt-0.5 text-zinc-500">
                        {admissionFee > 0 ? (
                          `+ ₹${admissionFee.toLocaleString("en-IN")} joining fee`
                        ) : (
                          <span className="text-emerald-500 font-bold uppercase">
                            No joining fee
                          </span>
                        )}
                      </span>
                    </div>

                    <div
                      className={`w-9 h-9 rounded-full border flex items-center justify-center transition-all duration-300 shrink-0 ${
                        isExpanded
                          ? "bg-[#ffc114] border-[#ffc114] text-black rotate-180"
                          : "border-zinc-800 text-zinc-400"
                      }`}
                    >
                      {isExpanded ? <FiMinus /> : <FiPlus />}
                    </div>
                  </div>
                </div>

                {/* Expandable details */}
                <div
                  data-aos="fade-up"
                  className={`transition-all duration-500 ease-in-out bg-black border-t border-zinc-900/60 overflow-hidden ${
                    isExpanded
                      ? "max-h-[1200px] opacity-100 p-5 sm:p-10"
                      : "max-h-0 opacity-0 pointer-events-none"
                  }`}
                >
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Feature list */}
                    <div className="lg:col-span-8">
                      <span className="text-zinc-600 text-[9px] font-bold tracking-widest uppercase block mb-4">
                        // What's included
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3.5">
                        {plan.features?.map((feat, fIdx) => (
                          <div
                            key={fIdx}
                            className="flex items-start gap-2.5 text-[13px] text-zinc-400 font-light"
                          >
                            <span className="text-[#ffc114] font-bold mt-0.5">
                              ✓
                            </span>
                            <span>{feat}</span>
                          </div>
                        ))}
                      </div>

                      {/* Extra boolean flags from backend */}
                      <div className="mt-4 flex flex-wrap gap-2">
                        {plan.dietPlanIncluded && (
                          <span className="bg-zinc-950 border border-zinc-800 text-emerald-400 text-[9px] font-bold tracking-wider uppercase px-3 py-1.5">
                            ✓ Diet plan
                          </span>
                        )}
                        {plan.trainerSupport && (
                          <span className="bg-zinc-950 border border-zinc-800 text-emerald-400 text-[9px] font-bold tracking-wider uppercase px-3 py-1.5">
                            ✓ Trainer support
                          </span>
                        )}
                        {plan.lockerIncluded && (
                          <span className="bg-zinc-950 border border-zinc-800 text-emerald-400 text-[9px] font-bold tracking-wider uppercase px-3 py-1.5">
                            ✓ Locker
                          </span>
                        )}
                        {plan.cardioIncluded && (
                          <span className="bg-zinc-950 border border-zinc-800 text-emerald-400 text-[9px] font-bold tracking-wider uppercase px-3 py-1.5">
                            ✓ Cardio floor
                          </span>
                        )}
                        {plan.steamBathIncluded && (
                          <span className="bg-zinc-950 border border-zinc-800 text-emerald-400 text-[9px] font-bold tracking-wider uppercase px-3 py-1.5">
                            ✓ Steam bath
                          </span>
                        )}
                        {plan.personalTrainingIncluded && (
                          <span className="bg-zinc-950 border border-zinc-800 text-emerald-400 text-[9px] font-bold tracking-wider uppercase px-3 py-1.5">
                            ✓ Personal training
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Price breakdown + CTA */}
                    <div className="lg:col-span-4 lg:border-l lg:border-zinc-900 lg:pl-8 w-full">
                      <div className="space-y-3 mb-4">
                        <div className="text-zinc-500 text-xs space-y-2">
                          <div className="flex justify-between">
                            <span>Plan fee</span>
                            <span className="text-white font-bold">
                              ₹{price.toLocaleString("en-IN")}
                            </span>
                          </div>
                          {admissionFee > 0 && (
                            <div className="flex justify-between">
                              <span>Joining fee</span>
                              <span className="text-white font-bold">
                                ₹{admissionFee.toLocaleString("en-IN")}
                              </span>
                            </div>
                          )}
                          {isOffer && (
                            <div className="flex justify-between text-emerald-500">
                              <span>You save</span>
                              <span className="font-bold">
                                ₹
                                {(plan.price - plan.offerPrice).toLocaleString(
                                  "en-IN",
                                )}
                              </span>
                            </div>
                          )}
                          <div className="flex justify-between border-t border-zinc-900 pt-2">
                            <span className="text-zinc-300 font-bold">
                              Total
                            </span>
                            <span className="text-[#ffc114] font-bold">
                              ₹{totalCost.toLocaleString("en-IN")}
                            </span>
                          </div>
                        </div>
                      </div>

                      <button
                        data-aos="zoom-in"
                        data-aos-delay="200"
                        className="w-full bg-[#ffc114] text-black hover:bg-white font-bold text-[10px] tracking-[0.25em] py-4 rounded-none uppercase transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xl shadow-yellow-500/5"
                      >
                        <span>Join Now</span>
                        <FiArrowRight />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── SECTION 4: TRUST POINTS ───────────────────────────────────────── */}
      <section className="py-20 px-6 md:px-12 lg:px-24 bg-[#030303] select-none">
        <div
          data-aos="fade-up"
          className="max-w-[1300px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-10"
        >
          <div
            data-aos="flip-left"
            data-aos-delay="100"
            className="flex items-start gap-4"
          >
            <div className="w-10 h-10 bg-[#0a0a0a] border border-zinc-900 flex items-center justify-center text-[#ffc114] shrink-0 shadow-lg">
              <FiPercent className="text-base" />
            </div>
            <div className="space-y-1">
              <h4 className="text-white font-bold text-xs tracking-wider uppercase">
                Save on longer plans
              </h4>
              <p className="text-zinc-500 text-xs font-light leading-relaxed">
                Sign up for 3 or 6 months and the ₹250 joining fee is waived
                completely.
              </p>
            </div>
          </div>

          <div
            data-aos="flip-left"
            data-aos-delay="250"
            className="flex items-start gap-4"
          >
            <div className="w-10 h-10 bg-[#0a0a0a] border border-zinc-900 flex items-center justify-center text-[#ffc114] shrink-0 shadow-lg">
              <FiAward className="text-base" />
            </div>
            <div className="space-y-1">
              <h4 className="text-white font-bold text-xs tracking-wider uppercase">
                Full equipment access
              </h4>
              <p className="text-zinc-500 text-xs font-light leading-relaxed">
                Every plan gives you access to all machines, free weights, and
                training areas.
              </p>
            </div>
          </div>

          <div
            data-aos="flip-left"
            data-aos-delay="400"
            className="flex items-start gap-4"
          >
            <div className="w-10 h-10 bg-[#0a0a0a] border border-zinc-900 flex items-center justify-center text-[#ffc114] shrink-0 shadow-lg">
              <FiShield className="text-base" />
            </div>
            <div className="space-y-1">
              <h4 className="text-white font-bold text-xs tracking-wider uppercase">
                No hidden fees
              </h4>
              <p className="text-zinc-500 text-xs font-light leading-relaxed">
                The price you see is what you pay. No extra charges added later.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 5: FAQS ──────────────────────────────────────────────── */}
      <section className="py-24 px-6 md:px-12 lg:px-24 bg-[#060606] border-t border-b border-zinc-900/60">
        <div className="max-w-[1000px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div
            data-aos="fade-right"
            className="lg:col-span-4 space-y-2 select-none"
          >
            <span className="text-[#ffc114] text-[10px] font-bold tracking-[0.3em] uppercase block">
              // Questions
            </span>
            <h2 className="text-white font-gym-brutal text-2xl uppercase tracking-tight">
              Common FAQs
            </h2>
            <p className="text-zinc-500 text-xs font-light leading-relaxed">
              Everything you need to know before signing up.
            </p>
          </div>

          <div
            data-aos="fade-left"
            className="lg:col-span-8 divide-y divide-zinc-900 border-t border-b border-zinc-900 bg-[#0a0a0a] shadow-2xl"
          >
            {faqs.map((faq, fIdx) => {
              const isOpen = expandedFaq === fIdx;
              return (
                <div
                  key={fIdx}
                  data-aos="fade-up"
                  data-aos-delay={fIdx * 120}
                  data-aos="fade-right"
                  data-aos-delay={fIdx * 50}
                  className="p-5 cursor-pointer transition-all duration-300"
                  onClick={() => setExpandedFaq(isOpen ? null : fIdx)}
                >
                  <div className="flex justify-between items-center gap-4">
                    <h4 className="text-white font-bold text-xs tracking-wide">
                      {faq.q}
                    </h4>
                    <FiChevronDown
                      className={`text-zinc-400 transition-transform duration-300 shrink-0 ${
                        isOpen ? "rotate-180 text-[#ffc114]" : ""
                      }`}
                    />
                  </div>
                  <div
                    className={`transition-all duration-500 overflow-hidden ${
                      isOpen
                        ? "max-h-40 opacity-100 mt-3 pt-3 border-t border-zinc-900"
                        : "max-h-0 opacity-0 pointer-events-none"
                    }`}
                  >
                    <p className="text-zinc-500 text-xs sm:text-sm font-light leading-relaxed">
                      {faq.a}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── SECTION 6: CONTACT ───────────────────────────────────────────── */}
      <section className="py-24 px-6 md:px-12 lg:px-24 bg-[#030303] relative">
        <div
          data-aos="zoom-in"
          data-aos-duration="1000"
          className="max-w-[900px] mx-auto bg-[#0a0a0a] border border-zinc-900 p-8 sm:p-12 text-center relative shadow-2xl"
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#ffc114] text-black font-bold text-[9px] tracking-widest px-4 py-1.5 uppercase rounded-none">
            Contact Us
          </div>

          <h3 className="text-white font-gym-brutal text-2xl sm:text-3xl uppercase tracking-wider mb-4">
            Need a Corporate Plan?
          </h3>
          <p className="text-zinc-500 text-xs sm:text-sm max-w-xl mx-auto font-light leading-relaxed mb-8">
            Want bulk memberships for your team or company? We'll put together a
            custom plan. Get in touch and we'll handle the rest.
          </p>

          <div
            data-aos="fade-up"
            data-aos-delay="200"
            className="flex flex-col sm:flex-row items-center justify-center gap-4 text-[10px] font-bold tracking-widest uppercase"
          >
            <a
              href="tel:+919876543210"
              className="w-full sm:w-auto bg-zinc-950 border border-zinc-800 text-white hover:border-[#ffc114] px-8 py-4 transition-all text-center"
            >
              Call Us
            </a>
            <button
              onClick={() => {
                setSelectedDuration("3 Months");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="w-full sm:w-auto bg-[#ffc114] text-black hover:bg-white px-8 py-4 transition-all shadow-xl shadow-yellow-500/5"
            >
              See 3-Month Plans
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Membership;
