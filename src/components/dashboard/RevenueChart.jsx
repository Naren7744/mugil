import React from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LineChart,
  Line,
} from "recharts";

function RevenueChart() {
  const revenueData = [
    { month: "Jan", revenue: 85000, members: 220 },
    { month: "Feb", revenue: 98000, members: 260 },
    { month: "Mar", revenue: 112000, members: 310 },
    { month: "Apr", revenue: 128000, members: 350 },
    { month: "May", revenue: 145000, members: 420 },
    { month: "Jun", revenue: 182000, members: 510 },
    { month: "Jul", revenue: 210000, members: 620 },
    { month: "Aug", revenue: 248000, members: 710 },
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-[32px] p-8 shadow-sm">

      {/* HEADER */}
      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between mb-8">

        <div>
          <p className="text-violet-600 text-xs uppercase tracking-[3px] font-bold">
            Revenue Analytics
          </p>

          <h2 className="text-slate-900 text-3xl font-bold mt-2">
            Business Performance
          </h2>

          <p className="text-slate-500 mt-2">
            Revenue growth and member acquisition overview
          </p>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-2 gap-4 mt-6 xl:mt-0">

          <div className="bg-slate-50 rounded-2xl px-5 py-4">
            <p className="text-slate-500 text-xs uppercase">
              Revenue
            </p>

            <h3 className="text-slate-900 text-2xl font-bold mt-1">
              ₹2.48L
            </h3>

            <span className="text-emerald-500 text-xs font-semibold">
              +18.2%
            </span>
          </div>

          <div className="bg-slate-50 rounded-2xl px-5 py-4">
            <p className="text-slate-500 text-xs uppercase">
              Members
            </p>

            <h3 className="text-slate-900 text-2xl font-bold mt-1">
              1,248
            </h3>

            <span className="text-blue-500 text-xs font-semibold">
              +12.4%
            </span>
          </div>

        </div>

      </div>

      {/* CHARTS */}
      <div className="grid xl:grid-cols-2 gap-8">

        {/* Revenue */}
        <div>

          <div className="flex items-center justify-between mb-4">

            <h3 className="font-semibold text-slate-800">
              Monthly Revenue
            </h3>

            <span className="text-xs bg-violet-100 text-violet-600 px-3 py-1 rounded-full font-medium">
              Revenue
            </span>

          </div>

          <div className="h-[320px]">

            <ResponsiveContainer width="100%" height="100%">

              <AreaChart data={revenueData}>

                <defs>

                  <linearGradient
                    id="revenueGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor="#7C3AED"
                      stopOpacity={0.4}
                    />
                    <stop
                      offset="95%"
                      stopColor="#7C3AED"
                      stopOpacity={0}
                    />
                  </linearGradient>

                </defs>

                <CartesianGrid
                  stroke="#E5E7EB"
                  strokeDasharray="4 4"
                />

                <XAxis
                  dataKey="month"
                  tick={{ fill: "#64748B" }}
                  axisLine={false}
                  tickLine={false}
                />

                <YAxis
                  tick={{ fill: "#64748B" }}
                  axisLine={false}
                  tickLine={false}
                />

                <Tooltip
                  contentStyle={{
                    borderRadius: "16px",
                    border: "1px solid #E5E7EB",
                    background: "#fff",
                  }}
                />

                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#7C3AED"
                  strokeWidth={4}
                  fill="url(#revenueGradient)"
                />

              </AreaChart>

            </ResponsiveContainer>

          </div>

        </div>

        {/* Members */}
        <div>

          <div className="flex items-center justify-between mb-4">

            <h3 className="font-semibold text-slate-800">
              Member Growth
            </h3>

            <span className="text-xs bg-blue-100 text-blue-600 px-3 py-1 rounded-full font-medium">
              Members
            </span>

          </div>

          <div className="h-[320px]">

            <ResponsiveContainer width="100%" height="100%">

              <LineChart data={revenueData}>

                <CartesianGrid
                  stroke="#E5E7EB"
                  strokeDasharray="4 4"
                />

                <XAxis
                  dataKey="month"
                  tick={{ fill: "#64748B" }}
                  axisLine={false}
                  tickLine={false}
                />

                <YAxis
                  tick={{ fill: "#64748B" }}
                  axisLine={false}
                  tickLine={false}
                />

                <Tooltip
                  contentStyle={{
                    borderRadius: "16px",
                    border: "1px solid #E5E7EB",
                    background: "#fff",
                  }}
                />

                <Line
                  type="monotone"
                  dataKey="members"
                  stroke="#2563EB"
                  strokeWidth={4}
                  dot={{
                    r: 5,
                    fill: "#2563EB",
                  }}
                />

              </LineChart>

            </ResponsiveContainer>

          </div>

        </div>

      </div>

    </div>
  );
}

export default RevenueChart;