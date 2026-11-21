import React from "react";
import {
  LayoutDashboard,
  Users,
  Compass,
  Sparkles,
  Lightbulb,
  ShoppingBag,
} from "lucide-react";

function Sidebar({ activeTab, setActiveTab, totalCustomers = 200 }) {
  const navItems = [
    {
      id: "dashboard",
      label: "Overview & Metrics",
      icon: LayoutDashboard,
      badge: "Live",
    },
    {
      id: "customers",
      label: "Customer Directory",
      icon: Users,
      badge: `${totalCustomers}`,
    },
    {
      id: "segmentation",
      label: "Customer Groups",
      icon: Compass,
      badge: "5 Groups",
    },
    {
      id: "prediction",
      label: "Shopper Profiler",
      icon: Sparkles,
      badge: "Smart Tool",
      highlight: true,
    },
    {
      id: "insights",
      label: "Growth Strategies",
      icon: Lightbulb,
    },
  ];

  return (
    <aside className="w-64 min-h-[calc(100vh-4rem)] bg-slate-900 text-slate-300 flex flex-col justify-between p-4 border-r border-slate-800 select-none shrink-0">
      <div className="space-y-6">
        {/* Navigation Group */}
        <div>
          <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-2">
            Main Navigation
          </p>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-medium text-sm transition-all duration-150 ${
                    isActive
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                      : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/60"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      size={18}
                      className={isActive ? "text-white" : item.highlight ? "text-amber-400" : "text-slate-400"}
                    />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[11px] px-2 py-0.5 rounded-full font-semibold ${
                        isActive
                          ? "bg-indigo-700 text-white"
                          : "bg-slate-800 text-slate-400"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Customer Groups Legend in Sidebar */}
        <div className="p-3 bg-slate-800/50 rounded-xl border border-slate-800">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2.5">
            5 Customer Groups
          </p>
          <div className="space-y-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
              <span className="text-slate-300">Standard / Balanced</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <span className="text-slate-300">VIP / High Spenders</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-pink-500"></span>
              <span className="text-slate-300">Young Trendsetters</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
              <span className="text-slate-300">Careful Savers</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span>
              <span className="text-slate-300">Budget Shoppers</span>
            </div>
          </div>
        </div>
      </div>

      {/* Helpful Summary Box (replaces technical ML specs) */}
      <div className="p-3.5 bg-slate-950/70 rounded-xl border border-slate-800/80 text-xs space-y-2">
        <div className="flex items-center justify-between text-slate-400">
          <span className="flex items-center gap-1.5 font-medium">
            <ShoppingBag size={13} className="text-indigo-400" />
            Mall Intelligence
          </span>
          <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-500/20 font-medium">
            200 Shoppers
          </span>
        </div>
        <p className="text-[11px] text-slate-400 leading-relaxed">
          Customer profiles are calculated using annual earnings and mall spending patterns to guide targeted marketing.
        </p>
      </div>
    </aside>
  );
}

export default Sidebar;
