import React, { useState } from "react";
import {
  Compass,
  Target,
  Sparkles,
  Award,
  Users,
  CheckCircle2,
  DollarSign,
  ArrowRight,
} from "lucide-react";

function Segmentation({ clusters = [], centroids = [], setActiveTab, onSelectPresetForPrediction }) {
  const [selectedGroupId, setSelectedGroupId] = useState(0);

  const activeGroup =
    clusters.find((c) => c.id === selectedGroupId) || clusters[0] || null;

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Customer Groups & Shopping Profiles
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-700">
              5 Groups
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Detailed breakdown of customer shopping styles, average spending habits, key traits, and practical store strategies.
          </p>
        </div>

        <button
          onClick={() => setActiveTab("prediction")}
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-xs transition"
        >
          <Sparkles size={14} />
          Profile a Customer
        </button>
      </div>

      {/* Customer Group Tab Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {clusters.map((c) => {
          const isSelected = selectedGroupId === c.id;
          return (
            <button
              key={c.id}
              onClick={() => setSelectedGroupId(c.id)}
              className={`p-4 rounded-2xl text-left border transition-all duration-200 relative overflow-hidden ${
                isSelected
                  ? "bg-white border-slate-300 shadow-md ring-2"
                  : "bg-white/70 border-slate-200/70 hover:bg-white hover:border-slate-300"
              }`}
              style={{
                borderColor: isSelected ? c.color : undefined,
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <span
                  className="w-3.5 h-3.5 rounded-full shadow-xs"
                  style={{ backgroundColor: c.color }}
                ></span>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                  Group {c.id + 1}
                </span>
              </div>
              <h4 className="font-bold text-xs text-slate-900 truncate">{c.name}</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">
                {c.count} Shoppers ({c.percentage}%)
              </p>
            </button>
          );
        })}
      </div>

      {/* Active Group In-Depth Profile */}
      {activeGroup && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left 2 Cols: Detailed Persona & Strategy */}
          <div className="lg:col-span-2 space-y-6">
            {/* Persona Hero Card */}
            <div className="bg-white p-7 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-md font-bold text-lg"
                    style={{ backgroundColor: activeGroup.color }}
                  >
                    G{activeGroup.id + 1}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">
                      {activeGroup.name}
                    </h3>
                    <p className="text-xs font-medium text-slate-500">{activeGroup.tag}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs px-3 py-1 rounded-full font-bold bg-slate-100 text-slate-800">
                    {activeGroup.count} Shoppers ({activeGroup.percentage}%)
                  </span>
                </div>
              </div>

              <p className="text-sm text-slate-600 leading-relaxed pt-1">
                {activeGroup.description}
              </p>

              {/* 4 Metric Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[11px] text-slate-500">Typical Income</span>
                  <div className="text-lg font-extrabold text-slate-900 mt-0.5">
                    ${activeGroup.centroid.annual_income}k
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[11px] text-slate-500">Typical Spending</span>
                  <div className="text-lg font-extrabold text-slate-900 mt-0.5">
                    {activeGroup.centroid.spending_score}
                    <span className="text-xs text-slate-400 font-normal"> / 100</span>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[11px] text-slate-500">Average Age</span>
                  <div className="text-lg font-extrabold text-slate-900 mt-0.5">
                    {activeGroup.metrics.avg_age} yrs
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[11px] text-slate-500">Gender Split</span>
                  <div className="text-lg font-extrabold text-slate-900 mt-0.5">
                    {activeGroup.metrics.female_count}F : {activeGroup.metrics.male_count}M
                  </div>
                </div>
              </div>
            </div>

            {/* Behavioral Traits & Retail Strategies */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Behavioral Traits */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
                <div className="flex items-center gap-2">
                  <Target size={18} className="text-indigo-600" />
                  <h4 className="font-bold text-sm text-slate-900">Shopping Habits</h4>
                </div>
                <ul className="space-y-2.5 text-xs text-slate-600">
                  {activeGroup.traits.map((trait, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0"></span>
                      <span>{trait}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Retail Strategies */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
                <div className="flex items-center gap-2">
                  <Sparkles size={18} className="text-emerald-600" />
                  <h4 className="font-bold text-sm text-slate-900">Recommended Marketing Strategy</h4>
                </div>
                <ul className="space-y-2.5 text-xs text-slate-600">
                  {activeGroup.strategies.map((strategy, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                      <span>{strategy}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Right Col: Benchmark Summary Table & Quick Action */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
              <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <Compass size={16} className="text-slate-500" />
                Group Benchmark Averages
              </h4>
              <p className="text-xs text-slate-500">
                Average annual earnings and spending levels for each group
              </p>

              <div className="space-y-3">
                {centroids.map((c) => (
                  <div
                    key={c.cluster}
                    onClick={() => setSelectedGroupId(c.cluster)}
                    className={`p-3 rounded-xl border transition cursor-pointer flex items-center justify-between ${
                      selectedGroupId === c.cluster
                        ? "bg-slate-50 border-slate-400 font-semibold"
                        : "border-slate-100 hover:border-slate-200"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: c.color }}
                      ></span>
                      <span className="text-xs text-slate-800">
                        {c.name.split("/")[0]}
                      </span>
                    </div>

                    <div className="text-right text-xs">
                      <span className="text-slate-900 font-bold">${c.annual_income}k</span>
                      <span className="text-slate-400 mx-1">/</span>
                      <span className="text-slate-900 font-bold">{c.spending_score} pts</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Test Card */}
            <div className="p-6 bg-gradient-to-br from-indigo-50 to-violet-50 rounded-2xl border border-indigo-100 space-y-3">
              <div className="font-bold text-sm text-indigo-950 flex items-center gap-2">
                <Award size={16} className="text-indigo-600" />
                Analyze This Profile
              </div>
              <p className="text-xs text-slate-600">
                Load these benchmark numbers into the Shopper Profiler to see targeted recommendations.
              </p>
              <button
                onClick={() => {
                  if (onSelectPresetForPrediction) {
                    onSelectPresetForPrediction({
                      annual_income: activeGroup.centroid.annual_income,
                      spending_score: activeGroup.centroid.spending_score,
                      age: Math.round(activeGroup.metrics.avg_age),
                      gender: "Female",
                    });
                    setActiveTab("prediction");
                  }
                }}
                className="w-full flex items-center justify-center gap-1.5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs transition"
              >
                <span>Open in Shopper Profiler</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Segmentation;
