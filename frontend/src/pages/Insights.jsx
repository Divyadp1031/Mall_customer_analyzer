import React from "react";
import {
  TrendingUp,
  Award,
  ShoppingBag,
} from "lucide-react";

function Insights({ stats, setActiveTab }) {
  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Marketing Strategy & Retail Insights
          </h2>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-700">
            Actionable Playbook
          </span>
        </div>
        <p className="text-xs text-slate-500 mt-1">
          Strategic retail guidance to increase customer spending, optimize mall store mix, and build repeat visits.
        </p>
      </div>

      {/* Strategic 2x2 Matrix Overview */}
      <div className="bg-white p-7 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
        <h3 className="font-bold text-base text-slate-900">
          The Mall Customer Positioning Matrix
        </h3>
        <p className="text-xs text-slate-500">
          How income and spending behavior divide customers into 4 distinct commercial quadrants and 1 balanced core.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {/* Top-Right: High Income, High Spend */}
          <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-100 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                Top Tier: VIP / High Spenders
              </span>
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-200 text-emerald-900">
                Highest Revenue
              </span>
            </div>
            <h4 className="font-bold text-slate-900 text-sm">Luxury & Experience Driven</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              These customers generate the highest margin per square foot. They seek luxury fashion, fine dining, complimentary valet perks, and personal shopping services.
            </p>
          </div>

          {/* Top-Left: Low Income, High Spend */}
          <div className="p-5 rounded-2xl bg-pink-50/70 border border-pink-100 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-pink-800 uppercase tracking-wider">
                Youth Tier: Young Trendsetters
              </span>
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-pink-200 text-pink-900">
                High Activity
              </span>
            </div>
            <h4 className="font-bold text-slate-900 text-sm">Fast Fashion & Entertainment</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Younger shoppers who spend enthusiastically on trendy apparel, cafes, cosmetics, and lifestyle pop-ups. Very responsive to social media promotions and modern payment options.
            </p>
          </div>

          {/* Bottom-Right: High Income, Low Spend */}
          <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-100 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">
                Conservative Tier: Careful Savers
              </span>
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-amber-200 text-amber-900">
                High Potential
              </span>
            </div>
            <h4 className="font-bold text-slate-900 text-sm">High Purchasing Power, Deliberate Buying</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Financially secure shoppers who evaluate value before buying. Engage them with premium warranties, long-term durability (electronics, home furnishings), and high-value rebate offers.
            </p>
          </div>

          {/* Bottom-Left: Low Income, Low Spend */}
          <div className="p-5 rounded-2xl bg-purple-50/70 border border-purple-100 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-purple-800 uppercase tracking-wider">
                Budget Tier: Budget Shoppers
              </span>
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-purple-200 text-purple-900">
                Footfall Drivers
              </span>
            </div>
            <h4 className="font-bold text-slate-900 text-sm">Essentials & Discounts</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Drive weekday mall foot traffic through supermarkets, food courts, and seasonal discount events. Essential for maintaining mall energy and retail partner volume.
            </p>
          </div>
        </div>
      </div>

      {/* 3 Executive Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Award size={20} />
          </div>
          <h4 className="font-bold text-sm text-slate-900">Tiered Mall Loyalty System</h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            Replace generic loyalty cards with tailored benefits: free parking and valet for VIP high spenders, cafe perks for trendsetters, and cashback for savers.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <ShoppingBag size={20} />
          </div>
          <h4 className="font-bold text-sm text-slate-900">Smart Store Tenant Layout</h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            Place luxury boutiques near main parking entrances, and position youth apparel brands adjacent to trending beverage and gaming spots.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <TrendingUp size={20} />
          </div>
          <h4 className="font-bold text-sm text-slate-900">Seasonal Campaign Calendar</h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            Host exclusive preview evenings prior to public sales, and organize weekend lifestyle events tailored for younger shoppers and families.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Insights;
