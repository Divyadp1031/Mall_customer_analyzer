import React, { useState } from "react";
import {
  Users,
  DollarSign,
  TrendingUp,
  Percent,
  Sparkles,
  ArrowRight,
  Filter,
} from "lucide-react";
import StatCard from "../components/StatCard";

function Dashboard({ stats, scatterData, setActiveTab, onSelectCustomerForPrediction }) {
  const [selectedGroupFilter, setSelectedGroupFilter] = useState("all");
  const [hoveredPoint, setHoveredPoint] = useState(null);

  const total = stats?.total_customers || 200;
  const avgIncome = stats?.avg_income || 60.6;
  const avgSpending = stats?.avg_spending || 50.2;
  const femalePct = stats?.gender_distribution
    ? Math.round((stats.gender_distribution.female / total) * 100)
    : 56;

  const points = scatterData?.points || [];
  const centroids = scatterData?.centroids || [];

  // Filter points if customer group filter is selected
  const visiblePoints =
    selectedGroupFilter === "all"
      ? points
      : points.filter((p) => p.cluster === parseInt(selectedGroupFilter));

  // Coordinate mapping for SVG scatter plot
  const svgWidth = 650;
  const svgHeight = 380;
  const padding = { top: 30, right: 30, bottom: 45, left: 55 };

  const plotWidth = svgWidth - padding.left - padding.right;
  const plotHeight = svgHeight - padding.top - padding.bottom;

  const scaleX = (val) => padding.left + (val / 140) * plotWidth;
  const scaleY = (val) => padding.top + plotHeight - (val / 100) * plotHeight;

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Top Welcome Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 rounded-3xl p-7 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-indigo-200 text-xs font-medium">
            <Sparkles size={14} className="text-amber-300" />
            <span>Shopping Behavior Analysis</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Mall Customer Insights & Behavior Hub
          </h2>
          <p className="text-sm text-indigo-100/80 leading-relaxed">
            Understand how 200 mall shoppers distribute across income and spending habits into 5 clear customer groups to optimize promotions and retail revenue.
          </p>
          <div className="pt-2 flex flex-wrap gap-3">
            <button
              onClick={() => setActiveTab("prediction")}
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500 hover:bg-indigo-400 text-white text-xs font-semibold rounded-xl shadow transition"
            >
              <Sparkles size={14} />
              Profile a Customer
            </button>
            <button
              onClick={() => setActiveTab("segmentation")}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-xl transition border border-white/10"
            >
              Explore Customer Groups
              <ArrowRight size={14} />
            </button>
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute -right-16 -bottom-16 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"></div>
      </div>

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Total Shoppers Analyzed"
          value={total}
          subtitle="Analyzed from mall visits"
          icon={Users}
          color="indigo"
          badge="Full Sample"
        />
        <StatCard
          title="Average Annual Income"
          value={`$${avgIncome}k`}
          subtitle="Range: $15k - $137k"
          icon={DollarSign}
          color="emerald"
          badge="Annual Base"
        />
        <StatCard
          title="Average Spending Score"
          value={`${avgSpending}`}
          subtitle="Score scale: 1 (Low) to 100 (High)"
          icon={TrendingUp}
          color="pink"
          badge="1-100 Scale"
        />
        <StatCard
          title="Shopper Gender Ratio"
          value={`${femalePct}% Female`}
          subtitle={`${100 - femalePct}% Male Shoppers`}
          icon={Percent}
          color="amber"
          badge="Demographics"
        />
      </div>

      {/* Main Visuals: Shopper Map + Group Share */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Shopper Map (2 Cols) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Shopper Map: Income vs Spending Behavior
              </h3>
              <p className="text-xs text-slate-500">
                Each dot represents a customer. Benchmark markers show group centers.
              </p>
            </div>

            {/* Filter pills */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs text-slate-400 mr-1 flex items-center gap-1">
                <Filter size={12} /> Show:
              </span>
              <button
                onClick={() => setSelectedGroupFilter("all")}
                className={`text-xs px-2.5 py-1 rounded-lg font-medium transition ${
                  selectedGroupFilter === "all"
                    ? "bg-slate-900 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                All
              </button>
              {stats?.clusters?.map((c) => (
                <button
                  key={c.cluster}
                  onClick={() => setSelectedGroupFilter(c.cluster.toString())}
                  className={`text-xs px-2.5 py-1 rounded-lg font-medium transition flex items-center gap-1.5 ${
                    selectedGroupFilter === c.cluster.toString()
                      ? "ring-2 ring-slate-800 text-white"
                      : "bg-slate-50 text-slate-700 hover:bg-slate-100"
                  }`}
                  style={{
                    backgroundColor:
                      selectedGroupFilter === c.cluster.toString()
                        ? c.color
                        : undefined,
                  }}
                >
                  <span
                    className="w-2 h-2 rounded-full inline-block"
                    style={{ backgroundColor: c.color }}
                  ></span>
                  Group {c.cluster + 1}
                </button>
              ))}
            </div>
          </div>

          {/* SVG Map Container */}
          <div className="relative w-full bg-slate-50/60 rounded-xl border border-slate-100 p-2 overflow-x-auto">
            <svg
              viewBox={`0 0 ${svgWidth} ${svgHeight}`}
              className="w-full h-auto min-w-[500px]"
            >
              {/* Gridlines */}
              {[20, 40, 60, 80, 100, 120].map((val) => (
                <line
                  key={`gx-${val}`}
                  x1={scaleX(val)}
                  y1={padding.top}
                  x2={scaleX(val)}
                  y2={svgHeight - padding.bottom}
                  stroke="#E2E8F0"
                  strokeDasharray="3 3"
                />
              ))}
              {[20, 40, 60, 80].map((val) => (
                <line
                  key={`gy-${val}`}
                  x1={padding.left}
                  y1={scaleY(val)}
                  x2={svgWidth - padding.right}
                  y2={scaleY(val)}
                  stroke="#E2E8F0"
                  strokeDasharray="3 3"
                />
              ))}

              {/* Axes lines */}
              <line
                x1={padding.left}
                y1={svgHeight - padding.bottom}
                x2={svgWidth - padding.right}
                y2={svgHeight - padding.bottom}
                stroke="#94A3B8"
                strokeWidth="1.5"
              />
              <line
                x1={padding.left}
                y1={padding.top}
                x2={padding.left}
                y2={svgHeight - padding.bottom}
                stroke="#94A3B8"
                strokeWidth="1.5"
              />

              {/* X Axis Labels */}
              {[0, 20, 40, 60, 80, 100, 120, 140].map((val) => (
                <text
                  key={`tx-${val}`}
                  x={scaleX(val)}
                  y={svgHeight - padding.bottom + 18}
                  textAnchor="middle"
                  className="text-[11px] fill-slate-400 font-sans"
                >
                  ${val}k
                </text>
              ))}
              <text
                x={padding.left + plotWidth / 2}
                y={svgHeight - 8}
                textAnchor="middle"
                className="text-xs font-semibold fill-slate-600"
              >
                Annual Income (k$) →
              </text>

              {/* Y Axis Labels */}
              {[0, 20, 40, 60, 80, 100].map((val) => (
                <text
                  key={`ty-${val}`}
                  x={padding.left - 10}
                  y={scaleY(val) + 4}
                  textAnchor="end"
                  className="text-[11px] fill-slate-400 font-sans"
                >
                  {val}
                </text>
              ))}
              <text
                x={-(padding.top + plotHeight / 2)}
                y={16}
                transform="rotate(-90)"
                textAnchor="middle"
                className="text-xs font-semibold fill-slate-600"
              >
                Spending Score (1-100) →
              </text>

              {/* Data Points */}
              {visiblePoints.map((p) => {
                const isHovered = hoveredPoint?.customer_id === p.customer_id;
                return (
                  <circle
                    key={p.customer_id}
                    cx={scaleX(p.annual_income)}
                    cy={scaleY(p.spending_score)}
                    r={isHovered ? 7 : 5}
                    fill={p.cluster_color || "#6366F1"}
                    stroke="#ffffff"
                    strokeWidth={isHovered ? 2 : 1}
                    opacity={isHovered ? 1 : 0.8}
                    className="cursor-pointer transition-all duration-150"
                    onMouseEnter={() => setHoveredPoint(p)}
                    onMouseLeave={() => setHoveredPoint(null)}
                    onClick={() => {
                      if (onSelectCustomerForPrediction) {
                        onSelectCustomerForPrediction(p);
                        setActiveTab("prediction");
                      }
                    }}
                  />
                );
              })}

              {/* Group Benchmark Markers */}
              {centroids.map((c) => {
                const cx = scaleX(c.annual_income);
                const cy = scaleY(c.spending_score);
                const size = 8;

                return (
                  <g key={`benchmark-${c.cluster}`} className="cursor-pointer">
                    <circle
                      cx={cx}
                      cy={cy}
                      r="13"
                      fill="none"
                      stroke="#EF4444"
                      strokeWidth="1.5"
                      strokeDasharray="2 2"
                    />
                    <line
                      x1={cx - size}
                      y1={cy - size}
                      x2={cx + size}
                      y2={cy + size}
                      stroke="#EF4444"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                    <line
                      x1={cx + size}
                      y1={cy - size}
                      x2={cx - size}
                      y2={cy + size}
                      stroke="#EF4444"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                  </g>
                );
              })}
            </svg>

            {/* Hover Tooltip Overlay */}
            {hoveredPoint && (
              <div
                className="absolute z-20 bg-slate-900 text-white text-xs p-3 rounded-xl shadow-xl pointer-events-none space-y-1 border border-slate-700"
                style={{
                  left: `${Math.min(svgWidth - 160, Math.max(10, scaleX(hoveredPoint.annual_income) - 70))}px`,
                  top: `${Math.max(10, scaleY(hoveredPoint.spending_score) - 90)}px`,
                }}
              >
                <div className="font-bold flex items-center justify-between gap-3 text-slate-100">
                  <span>Customer #{hoveredPoint.customer_id}</span>
                  <span
                    className="w-2.5 h-2.5 rounded-full inline-block"
                    style={{ backgroundColor: hoveredPoint.cluster_color }}
                  ></span>
                </div>
                <div className="text-slate-300">
                  Group: <span className="font-semibold">{hoveredPoint.cluster_name}</span>
                </div>
                <div className="text-slate-400 text-[11px]">
                  Income: ${hoveredPoint.annual_income}k • Spending Score: {hoveredPoint.spending_score}
                </div>
                <div className="text-slate-400 text-[11px]">
                  {hoveredPoint.gender}, Age {hoveredPoint.age}
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-slate-300 border border-slate-400"></span>
                Individual Shopper (click to profile)
              </span>
              <span className="flex items-center gap-1.5 text-rose-600 font-medium">
                <span className="w-3.5 h-3.5 flex items-center justify-center font-bold">✕</span>
                Group Average Benchmark
              </span>
            </div>
            <span>Showing {visiblePoints.length} of {points.length} Shoppers</span>
          </div>
        </div>

        {/* Group Distribution Column (1 Col) */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-base font-bold text-slate-900">Shopper Distribution</h3>
              <button
                onClick={() => setActiveTab("segmentation")}
                className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold"
              >
                View Details →
              </button>
            </div>
            <p className="text-xs text-slate-500 mb-5">
              Percentage of mall customers in each shopping group
            </p>

            <div className="space-y-4">
              {stats?.clusters?.map((c) => (
                <div key={c.cluster} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: c.color }}
                      ></span>
                      <span className="font-medium text-slate-800">{c.name}</span>
                    </div>
                    <span className="font-semibold text-slate-900">
                      {c.count} ({c.percentage}%)
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${c.percentage}%`,
                        backgroundColor: c.color,
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick takeaway tip box */}
          <div className="p-4 bg-indigo-50/60 rounded-xl border border-indigo-100 text-xs text-indigo-900 space-y-1.5">
            <div className="font-bold flex items-center gap-1.5 text-indigo-700">
              <Sparkles size={14} />
              Key Marketing Insight
            </div>
            <p className="text-slate-600 leading-relaxed">
              <strong>VIP High Spenders</strong> and <strong>Young Trendsetters</strong> represent the highest immediate store revenue potential. Focus your premium offers and youth fashion campaigns on these two groups!
            </p>
          </div>
        </div>
      </div>

      {/* Customer Groups Overview Cards */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900">Shopper Groups At A Glance</h3>
          <span className="text-xs text-slate-500">Based on 200 Mall Shoppers</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {stats?.clusters?.map((c) => (
            <div
              key={c.cluster}
              onClick={() => setActiveTab("segmentation")}
              className="p-4 bg-white rounded-xl border border-slate-200/80 hover:shadow-md transition cursor-pointer space-y-2.5 group"
            >
              <div className="flex items-center justify-between">
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: c.color }}
                ></span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                  Group {c.cluster + 1}
                </span>
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition">
                  {c.name}
                </h4>
                <p className="text-[11px] text-slate-500">{c.tag}</p>
              </div>
              <div className="pt-1 flex items-baseline justify-between border-t border-slate-100 text-xs">
                <span className="text-slate-500">Group Size:</span>
                <span className="font-bold text-slate-800">{c.count} shoppers</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
