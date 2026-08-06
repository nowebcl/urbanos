import React from 'react';
import { Bookmark, Award, Smile, MapPin } from 'lucide-react';
import { STATS } from '../data/mockData';

export default function StatsBar() {
  const getIcon = (name) => {
    switch (name) {
      case 'Bookmark': return Bookmark;
      case 'Award': return Award;
      case 'Smile': return Smile;
      case 'MapPin': return MapPin;
      default: return Bookmark;
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 my-6">
      <div className="bg-[#0e1422] border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 divide-y sm:divide-y-0 sm:divide-x divide-slate-800/80">
          {STATS.map((stat, idx) => {
            const Icon = getIcon(stat.icon);
            return (
              <div
                key={stat.label}
                className={`flex items-center gap-4 ${idx !== 0 ? 'pt-4 sm:pt-0 sm:pl-6' : ''}`}
              >
                {/* Circular Icon Badge matching Image 1 */}
                <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-700/80 flex items-center justify-center text-teal-400 shrink-0">
                  <Icon className="w-6 h-6 stroke-[1.75]" />
                </div>
                {/* Text */}
                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                    {stat.number}
                  </div>
                  <div className="text-xs sm:text-sm text-slate-400 font-medium mt-0.5">
                    {stat.label}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
