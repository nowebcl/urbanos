import React from 'react';
import { MapPin } from 'lucide-react';
import { CITIES } from '../data/mockData';
import { handleImageError } from '../utils/imageUtils';

export default function CityExplorer({ onSelectCity, activeCity }) {
  return (
    <section className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 sm:-mt-10 mb-14">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3 sm:gap-4">
        {CITIES.map((city) => {
          const isSelected = activeCity === city.name;
          return (
            <div
              key={city.id}
              onClick={() => onSelectCity(city.name === activeCity ? '' : city.name)}
              className={`group relative h-40 sm:h-44 rounded-2xl overflow-hidden cursor-pointer border transition-all duration-300 ${
                isSelected
                  ? 'border-orange-500 ring-2 ring-orange-500/50 shadow-xl scale-[1.02]'
                  : 'border-slate-800 bg-slate-900/60 hover:border-slate-600'
              }`}
            >
              {/* Background Image */}
              <img
                src={city.image}
                alt={city.name}
                onError={handleImageError}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 filter brightness-[0.75]"
              />

              {/* Dark Gradient Shadow */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#080c14] via-[#080c14]/40 to-transparent" />

              {/* Card Label Content */}
              <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-3.5 flex flex-col justify-end">
                <h3 className="text-base sm:text-lg font-extrabold text-white tracking-tight leading-snug">
                  {city.name}
                </h3>
                <div className="flex items-center gap-1 mt-1 text-slate-300 text-[11px] font-medium leading-tight">
                  <MapPin className="w-3 h-3 text-teal-400 shrink-0" />
                  <span className="truncate">{city.subtitle}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
