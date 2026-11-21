import React from "react";

function StatCard({ title, value, subtitle, icon: Icon, badge, color = "indigo" }) {
  const colorMap = {
    indigo: {
      bg: "bg-indigo-50",
      text: "text-indigo-600",
      badge: "bg-indigo-100 text-indigo-700",
      border: "border-indigo-100",
    },
    emerald: {
      bg: "bg-emerald-50",
      text: "text-emerald-600",
      badge: "bg-emerald-100 text-emerald-700",
      border: "border-emerald-100",
    },
    amber: {
      bg: "bg-amber-50",
      text: "text-amber-600",
      badge: "bg-amber-100 text-amber-700",
      border: "border-amber-100",
    },
    pink: {
      bg: "bg-pink-50",
      text: "text-pink-600",
      badge: "bg-pink-100 text-pink-700",
      border: "border-pink-100",
    },
    purple: {
      bg: "bg-purple-50",
      text: "text-purple-600",
      badge: "bg-purple-100 text-purple-700",
      border: "border-purple-100",
    },
  };

  const scheme = colorMap[color] || colorMap.indigo;

  return (
    <div className={`p-6 bg-white rounded-2xl border ${scheme.border} shadow-sm hover:shadow-md transition duration-200`}>
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-medium text-slate-500">{title}</span>
        {Icon && (
          <div className={`p-2.5 rounded-xl ${scheme.bg} ${scheme.text}`}>
            <Icon size={22} />
          </div>
        )}
      </div>

      <div className="flex items-baseline justify-between">
        <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">{value}</h3>
        {badge && (
          <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${scheme.badge}`}>
            {badge}
          </span>
        )}
      </div>

      {subtitle && <p className="mt-2 text-xs text-slate-500">{subtitle}</p>}
    </div>
  );
}

export default StatCard;
