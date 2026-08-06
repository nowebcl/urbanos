import React from 'react';
import { MapPin } from 'lucide-react';
import { CITIES } from '../data/mockData';

export default function CityExplorer({ onSelectCity, activeCity }) {
  return (
    <section className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 sm:-mt-10 mb-14">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {CITIES.map((city) => {
          const isSelected = activeCity === city.name;
          return (
            <div
              key={city.id}
              onClick={() => onSelectCity(city.name === activeCity ? '' : city.name)}
              className={`group relative h-40 sm:h-44 rounded-2xl overflow-hidden cursor-pointer border transition-all duration-300 ${
                isSelected
                  ? 'border-orange-500 ring-2 ring-orange-500/50 shadow-xl'
                  : 'border-slate-800 bg-slate-900/60 hover:border-slate-600'
              }`}
            >
              {/* Background Image */}
              <img
                src={city.image}
                alt={city.name}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 filter brightness-[0.75]"
              />

              {/* Dark Gradient Shadow */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#080c14] via-[#080c14]/30 to-transparent" />

              {/* Card Label Content matching Image 1 */}
              <div className="absolute bottom-0 left-0 right-0 p-4 flex flex-col justify-end">
                <h3 className="text-xl font-extrabold text-white tracking-wide">
                  {city.name}
                </h3>
                <div className="flex items-center gap-1.5 mt-1 text-slate-300 text-xs font-medium">
                  <MapPin className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                  <span>{city.subtitle}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
