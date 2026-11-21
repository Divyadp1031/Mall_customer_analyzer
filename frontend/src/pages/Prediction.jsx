import React, { useState } from "react";
import {
  Sparkles,
  Target,
  Sliders,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import api from "../services/api";

function Prediction({ initialData, scatterData }) {
  const [income, setIncome] = useState(initialData?.annual_income || 70);
  const [spending, setSpending] = useState(initialData?.spending_score || 50);
  const [age, setAge] = useState(initialData?.age || 32);
  const [gender, setGender] = useState(initialData?.gender || "Female");

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const presets = [
    { label: "VIP High Spender", income: 95, spending: 85, age: 34, gender: "Female", color: "#10B981" },
    { label: "Young Trendsetter", income: 25, spending: 80, age: 22, gender: "Female", color: "#EC4899" },
    { label: "Balanced Regular", income: 55, spending: 50, age: 40, gender: "Male", color: "#3B82F6" },
    { label: "Careful Saver", income: 90, spending: 18, age: 45, gender: "Male", color: "#F59E0B" },
    { label: "Budget Shopper", income: 26, spending: 20, age: 48, gender: "Female", color: "#8B5CF6" },
  ];

  const handlePredict = async (customIncome, customSpending, customAge, customGender) => {
    const inc = customIncome !== undefined ? customIncome : income;
    const spd = customSpending !== undefined ? customSpending : spending;
    const ag = customAge !== undefined ? customAge : age;
    const gen = customGender !== undefined ? customGender : gender;

    setLoading(true);
    setError(null);

    try {
      const data = await api.predictCluster({
        annual_income: parseFloat(inc),
        spending_score: parseFloat(spd),
        age: parseInt(ag),
        gender: gen,
      });

      if (data && data.prediction) {
        setResult(data.prediction);
      } else {
        setError("Unable to analyze shopper profile. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setError("Analysis failed. Please ensure the backend service is running.");
    } finally {
      setLoading(false);
    }
  };

  const handleApplyPreset = (preset) => {
    setIncome(preset.income);
    setSpending(preset.spending);
    setAge(preset.age);
    setGender(preset.gender);
    handlePredict(preset.income, preset.spending, preset.age, preset.gender);
  };

  // Coordinates for mini-map
  const svgWidth = 420;
  const svgHeight = 260;
  const padding = { top: 20, right: 20, bottom: 35, left: 45 };
  const plotWidth = svgWidth - padding.left - padding.right;
  const plotHeight = svgHeight - padding.top - padding.bottom;

  const scaleX = (val) => padding.left + (val / 140) * plotWidth;
  const scaleY = (val) => padding.top + plotHeight - (val / 100) * plotHeight;

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Shopper Profiler & Behavior Analyzer
          </h2>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
            Instant Analysis
          </span>
        </div>
        <p className="text-xs text-slate-500 mt-1">
          Enter a customer's annual income and shopping habit score to identify their customer group, position on the map, and tailored marketing ideas.
        </p>
      </div>

      {/* Preset Pills */}
      <div className="space-y-2">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          Sample Customer Profiles:
        </span>
        <div className="flex items-center gap-2 flex-wrap">
          {presets.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleApplyPreset(p)}
              className="text-xs px-3 py-1.5 rounded-xl font-medium bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 transition flex items-center gap-2 shadow-2xs"
            >
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: p.color }}
              ></span>
              <span>{p.label}</span>
              <span className="text-slate-400 text-[11px]">
                (${p.income}k, {p.spending} pts)
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Two Column Layout: Form & Results */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Form (5 Cols) */}
        <div className="lg:col-span-5 bg-white p-7 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
            <Sliders size={18} className="text-indigo-600" />
            <h3 className="font-bold text-base text-slate-900">Customer Details</h3>
          </div>

          {/* Annual Income */}
          <div className="space-y-2">
            <div className="flex justify-between items-baseline">
              <label className="text-xs font-bold text-slate-700">
                Annual Income (in Thousands)
              </label>
              <div className="flex items-center gap-1 font-bold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-lg text-sm">
                ${income}k
              </div>
            </div>
            <input
              type="range"
              min="10"
              max="140"
              step="1"
              value={income}
              onChange={(e) => setIncome(Number(e.target.value))}
              className="w-full accent-indigo-600 cursor-pointer h-2 bg-slate-100 rounded-lg"
            />
            <div className="flex justify-between text-[11px] text-slate-400">
              <span>$10k</span>
              <span>$75k</span>
              <span>$140k</span>
            </div>
          </div>

          {/* Spending Score */}
          <div className="space-y-2">
            <div className="flex justify-between items-baseline">
              <label className="text-xs font-bold text-slate-700">
                Spending Habit Score (1 - 100)
              </label>
              <div className="flex items-center gap-1 font-bold text-pink-600 bg-pink-50 px-2.5 py-0.5 rounded-lg text-sm">
                {spending}
              </div>
            </div>
            <input
              type="range"
              min="1"
              max="100"
              step="1"
              value={spending}
              onChange={(e) => setSpending(Number(e.target.value))}
              className="w-full accent-pink-600 cursor-pointer h-2 bg-slate-100 rounded-lg"
            />
            <div className="flex justify-between text-[11px] text-slate-400">
              <span>1 (Cautious)</span>
              <span>50 (Moderate)</span>
              <span>100 (Frequent High Spender)</span>
            </div>
          </div>

          {/* Demographics: Age & Gender */}
          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Age</label>
              <input
                type="number"
                min="18"
                max="85"
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Gender</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              >
                <option value="Female">Female</option>
                <option value="Male">Male</option>
              </select>
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={() => handlePredict()}
            disabled={loading}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-md shadow-indigo-600/20 cursor-pointer"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
                Analyzing Profile...
              </span>
            ) : (
              <>
                <Sparkles size={16} />
                Identify Customer Profile
              </>
            )}
          </button>

          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
              <AlertCircle size={14} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Right Results & Visual Placement (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {result ? (
            <div className="space-y-6">
              {/* Classification Banner */}
              <div
                className="p-6 rounded-3xl text-white shadow-lg space-y-3 relative overflow-hidden"
                style={{ backgroundColor: result.color || "#6366F1" }}
              >
                <div className="relative z-10">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-md">
                      Customer Profile Identified
                    </span>
                    <span className="text-xs bg-white/20 px-2.5 py-0.5 rounded-full font-semibold">
                      Profile Match: {result.confidence_score}%
                    </span>
                  </div>

                  <h3 className="text-2xl font-extrabold mt-2 tracking-tight">
                    {result.cluster_name}
                  </h3>
                  <p className="text-xs text-white/90 font-medium">{result.cluster_tag}</p>

                  <p className="text-xs text-white/90 mt-2 leading-relaxed">
                    {result.description}
                  </p>
                </div>

                <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
              </div>

              {/* Shopper Map Placement */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Target size={14} className="text-indigo-600" />
                    Where This Shopper Stands on the Mall Map
                  </h4>
                  <span className="text-[11px] text-slate-500 font-medium">
                    Profile: ${income}k Income, {spending} Spending Score
                  </span>
                </div>

                <div className="bg-slate-50/60 rounded-xl p-2 border border-slate-100 flex justify-center">
                  <svg
                    viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                    className="w-full max-w-[500px] h-auto"
                  >
                    {/* Gridlines */}
                    {[20, 60, 100].map((val) => (
                      <line
                        key={`gx-${val}`}
                        x1={scaleX(val)}
                        y1={padding.top}
                        x2={scaleX(val)}
                        y2={svgHeight - padding.bottom}
                        stroke="#E2E8F0"
                        strokeDasharray="2 2"
                      />
                    ))}
                    {[20, 50, 80].map((val) => (
                      <line
                        key={`gy-${val}`}
                        x1={padding.left}
                        y1={scaleY(val)}
                        x2={svgWidth - padding.right}
                        y2={scaleY(val)}
                        stroke="#E2E8F0"
                        strokeDasharray="2 2"
                      />
                    ))}

                    {/* Group Centers */}
                    {scatterData?.centroids?.map((c) => (
                      <g key={c.cluster}>
                        <circle
                          cx={scaleX(c.annual_income)}
                          cy={scaleY(c.spending_score)}
                          r="6"
                          fill={c.color}
                          opacity="0.85"
                        />
                        <text
                          x={scaleX(c.annual_income)}
                          y={scaleY(c.spending_score) - 9}
                          textAnchor="middle"
                          className="text-[9px] fill-slate-500 font-medium"
                        >
                          Group {c.cluster + 1}
                        </text>
                      </g>
                    ))}

                    {/* Candidate Customer Point */}
                    <circle
                      cx={scaleX(income)}
                      cy={scaleY(spending)}
                      r="10"
                      fill={result.color}
                      stroke="#ffffff"
                      strokeWidth="3"
                      className="animate-bounce"
                    />
                    <circle
                      cx={scaleX(income)}
                      cy={scaleY(spending)}
                      r="16"
                      fill="none"
                      stroke={result.color}
                      strokeWidth="1.5"
                      strokeDasharray="2 2"
                    />

                    {/* Axes */}
                    <line
                      x1={padding.left}
                      y1={svgHeight - padding.bottom}
                      x2={svgWidth - padding.right}
                      y2={svgHeight - padding.bottom}
                      stroke="#94A3B8"
                    />
                    <line
                      x1={padding.left}
                      y1={padding.top}
                      x2={padding.left}
                      y2={svgHeight - padding.bottom}
                      stroke="#94A3B8"
                    />

                    <text
                      x={padding.left + plotWidth / 2}
                      y={svgHeight - 8}
                      textAnchor="middle"
                      className="text-[10px] font-semibold fill-slate-600"
                    >
                      Annual Income (k$) →
                    </text>
                    <text
                      x={-(padding.top + plotHeight / 2)}
                      y={14}
                      transform="rotate(-90)"
                      textAnchor="middle"
                      className="text-[10px] font-semibold fill-slate-600"
                    >
                      Spending Score →
                    </text>
                  </svg>
                </div>
              </div>

              {/* Recommended Action Items */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
                <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Sparkles size={14} className="text-emerald-600" />
                  Targeted Marketing Strategy for this Customer
                </h4>
                <div className="space-y-2">
                  {result.strategies.map((str, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2.5 p-2.5 bg-slate-50 rounded-xl text-xs text-slate-700"
                    >
                      <CheckCircle2 size={15} className="text-emerald-500 shrink-0 mt-0.5" />
                      <span>{str}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* Placeholder state before analysis */
            <div className="bg-white p-12 rounded-3xl border border-dashed border-slate-300 text-center space-y-4">
              <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto">
                <Sparkles size={28} />
              </div>
              <div className="max-w-md mx-auto space-y-1">
                <h4 className="font-bold text-slate-800 text-base">
                  Ready to Profile a Customer
                </h4>
                <p className="text-xs text-slate-500">
                  Select a sample profile above or adjust the Income and Spending sliders on the left, then click <strong>"Identify Customer Profile"</strong>.
                </p>
              </div>
              <button
                onClick={() => handlePredict()}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs transition"
              >
                Analyze Sample Shopper ($70k / 50 Score)
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Prediction;
