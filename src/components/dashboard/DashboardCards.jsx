import React from "react";
import {
  FiUsers,
  FiDollarSign,
  FiAlertTriangle,
  FiTrendingUp,
  FiArrowUpRight,
} from "react-icons/fi";

function DashboardCards() {
  const stats = [
    {
      title: "Total Members",
      value: "1,248",
      growth: "+12.4%",
      icon: FiUsers,
      color: "from-violet-500 to-violet-600",
      bg: "bg-violet-50",
      text: "text-violet-600",
    },
    {
      title: "Monthly Revenue",
      value: "₹1.82L",
      growth: "+18.2%",
      icon: FiDollarSign,
      color: "from-emerald-500 to-emerald-600",
      bg: "bg-emerald-50",
      text: "text-emerald-600",
    },
    {
      title: "Pending Fees",
      value: "₹24,500",
      growth: "12 Members",
      icon: FiAlertTriangle,
      color: "from-rose-500 to-red-500",
      bg: "bg-rose-50",
      text: "text-rose-600",
    },
    {
      title: "Growth Rate",
      value: "22%",
      growth: "+4.3%",
      icon: FiTrendingUp,
      color: "from-blue-500 to-cyan-500",
      bg: "bg-blue-50",
      text: "text-blue-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

      {stats.map((item, index) => {
        const Icon = item.icon;

        return (
          <div
            key={index}
            className="
              bg-white
              rounded-[28px]
              border
              border-slate-200
              p-6
              shadow-sm
              hover:shadow-xl
              hover:-translate-y-1
              transition-all
              duration-300
            "
          >

            <div className="flex items-start justify-between">

              <div>

                <p className="text-slate-500 text-sm font-medium">
                  {item.title}
                </p>

                <h2 className="text-4xl font-bold text-slate-900 mt-3">
                  {item.value}
                </h2>

              </div>

              <div
                className={`
                  w-14 h-14
                  rounded-2xl
                  flex
                  items-center
                  justify-center
                  ${item.bg}
                `}
              >
                <Icon
                  className={`text-xl ${item.text}`}
                />
              </div>

            </div>

            <div className="mt-6 flex items-center justify-between">

              <div className="flex items-center gap-2">

                <span
                  className="
                    inline-flex
                    items-center
                    gap-1
                    px-3
                    py-1
                    rounded-full
                    bg-emerald-50
                    text-emerald-600
                    text-xs
                    font-semibold
                  "
                >
                  <FiArrowUpRight />
                  {item.growth}
                </span>

              </div>

              <div
                className={`
                  h-2
                  w-20
                  rounded-full
                  bg-gradient-to-r
                  ${item.color}
                `}
              />

            </div>

          </div>
        );
      })}

      {/* Membership Alert Card */}

      <div
        className="
          md:col-span-2
          xl:col-span-4
          bg-gradient-to-r
          from-violet-600
          to-blue-600
          rounded-[30px]
          p-8
          text-white
          shadow-xl
        "
      >

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">

          <div>

            <p className="uppercase tracking-[3px] text-xs opacity-80">
              Membership Expiry Alerts
            </p>

            <h2 className="text-3xl font-bold mt-3">
              14 Memberships Expiring This Week
            </h2>

            <p className="mt-3 opacity-90 max-w-xl">
              Members whose subscriptions are ending within the next 7 days.
              Collect renewals and prevent membership interruptions.
            </p>

          </div>

          <button
            className="
              mt-6 lg:mt-0
              bg-white
              text-slate-900
              px-6
              py-3
              rounded-2xl
              font-semibold
              hover:scale-105
              transition
            "
          >
            View Expiry List
          </button>

        </div>

      </div>

    </div>
  );
}

export default DashboardCards;