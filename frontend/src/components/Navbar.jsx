import React from "react";
import { Sparkles, Search, RefreshCw, ShoppingBag } from "lucide-react";

function Navbar({ isOnline, onRefresh, activeTab, setActiveTab, searchQuery, setSearchQuery }) {
  return (
    <header className="h-16 bg-white border-b border-slate-200 sticky top-0 z-30 px-6 flex items-center justify-between shadow-xs">
      {/* Left branding */}
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-indigo-200 shadow-md">
          <ShoppingBag size={22} />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold text-slate-900 tracking-tight">Mall Customer Analyzer</h1>
            <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
              Customer Analytics
            </span>
          </div>
          <p className="text-xs text-slate-500">Customer Insights & Shopping Behavior Analysis</p>
        </div>
      </div>

      {/* Middle search bar */}
      <div className="hidden md:flex items-center relative w-72">
        <Search className="absolute left-3 top-2.5 text-slate-400" size={17} />
        <input
          type="text"
          placeholder="Search customer ID or group..."
          value={searchQuery || ""}
          onChange={(e) => setSearchQuery && setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-4 py-1.5 text-sm bg-slate-100/70 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
        />
      </div>

      {/* Right controls & status */}
      <div className="flex items-center gap-3">
        {/* Connection status badge */}
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border ${
          isOnline
            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
            : "bg-amber-50 text-amber-700 border-amber-200"
        }`}>
          <span className="relative flex h-2 w-2">
            {isOnline && (
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            )}
            <span className={`relative inline-flex rounded-full h-2 w-2 ${isOnline ? "bg-emerald-500" : "bg-amber-500"}`}></span>
          </span>
          <span className="hidden sm:inline">{isOnline ? "Data Live" : "Connecting..."}</span>
        </div>

        {/* Quick Profiler CTA */}
        <button
          onClick={() => setActiveTab("prediction")}
          className={`hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition shadow-xs ${
            activeTab === "prediction"
              ? "bg-indigo-700 text-white"
              : "bg-indigo-600 hover:bg-indigo-700 text-white"
          }`}
        >
          <Sparkles size={14} />
          <span>Profile a Shopper</span>
        </button>

        {/* Refresh button */}
        <button
          onClick={onRefresh}
          title="Refresh Data"
          className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition"
        >
          <RefreshCw size={17} />
        </button>
      </div>
    </header>
  );
}

export default Navbar;
