import React from 'react';
import { MapPin, Bed, Bath, Car, Maximize2, ArrowRight, Clock } from 'lucide-react';
import { formatImageUrl, handleImageError } from '../utils/imageUtils';

export default function PropertiesGrid({
  properties,
  onSelectProperty,
  onViewAll
}) {
  return (
    <section id="propiedades" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Section Header matching Image 1 */}
      <div className="flex items-end justify-between mb-8">
        <div>
          <span className="text-xs font-bold tracking-[0.2em] text-teal-400 uppercase block mb-1">
            SELECCIÓN CURADA
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Propiedades destacadas
          </h2>
        </div>

        <button
          onClick={onViewAll}
          className="inline-flex items-center gap-1.5 text-sm font-bold text-orange-500 hover:text-orange-400 transition-colors group"
        >
          <span>Ver todas</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* Property Cards Grid matching Image 1 */}
      {properties.length === 0 ? (
        <div className="text-center py-16 bg-[#0e1422] rounded-2xl border border-slate-800">
          <p className="text-lg text-slate-300 font-medium">No se encontraron propiedades.</p>
          <button
            onClick={onViewAll}
            className="mt-4 px-6 py-2.5 btn-orange rounded-xl text-sm font-semibold"
          >
            Ver todas las propiedades
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((prop) => (
            <div
              key={prop.id}
              onClick={() => onSelectProperty(prop)}
              className="group bg-[#0e1422] rounded-2xl overflow-hidden cursor-pointer flex flex-col justify-between border border-slate-800 hover:border-slate-600 transition-all duration-300 shadow-xl"
            >
              {/* Photo & Badges Container */}
              <div className="relative h-56 w-full overflow-hidden bg-slate-950">
                <img
                  src={formatImageUrl(prop.image)}
                  alt={prop.title}
                  onError={handleImageError}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 filter brightness-95"
                />
                
                {/* Badges on Top Left */}
                <div className="absolute top-4 left-4 flex flex-wrap items-center gap-2 z-10">
                  {prop.isFeatured && (
                    <span className="px-2.5 py-1 rounded bg-[#10b981] text-slate-950 font-extrabold text-[10px] tracking-wider uppercase shadow">
                      DESTACADO
                    </span>
                  )}
                  <span className={`px-2.5 py-1 rounded font-extrabold text-[10px] tracking-wider uppercase shadow ${
                    prop.operation === 'Vendido' ? 'bg-red-600 text-white' :
                    prop.operation === 'Arrendado' ? 'bg-purple-600 text-white' :
                    prop.operation === 'Arriendo' ? 'bg-blue-600 text-white' :
                    'bg-[#f97316] text-white'
                  }`}>
                    {prop.operation ? prop.operation.toUpperCase() : 'VENTA'}
                  </span>
                </div>
              </div>

              {/* Card Body Content matching Image 1 */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  {/* Location Pin & Commune */}
                  <div className="flex items-center gap-1.5 text-xs text-teal-400 font-semibold mb-2">
                    <MapPin className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{prop.location}</span>
                  </div>

                  {/* Property Title */}
                  <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-orange-400 transition-colors leading-snug line-clamp-2">
                    {prop.title}
                  </h3>
                </div>

                {/* Price Display matching Image 1 */}
                <div>
                  <div className="text-xl sm:text-2xl font-extrabold text-[#f97316] tracking-tight">
                    {prop.priceDisplay}
                  </div>
                </div>

                {/* Specs Bar at Bottom */}
                <div className="pt-3 border-t border-slate-800/90 flex flex-wrap items-center gap-3.5 text-slate-300 text-xs font-semibold">
                  {prop.bedrooms > 0 && (
                    <div className="flex items-center gap-1.5" title={`${prop.bedrooms} dormitorios`}>
                      <Bed className="w-4 h-4 text-slate-400" />
                      <span>{prop.bedrooms}</span>
                    </div>
                  )}
                  {prop.bathrooms > 0 && (
                    <div className="flex items-center gap-1.5" title={`${prop.bathrooms} baños`}>
                      <Bath className="w-4 h-4 text-slate-400" />
                      <span>{prop.bathrooms}</span>
                    </div>
                  )}
                  {prop.parking > 0 && (
                    <div className="flex items-center gap-1.5" title={`${prop.parking} estacionamientos`}>
                      <Car className="w-4 h-4 text-slate-400" />
                      <span>{prop.parking}</span>
                    </div>
                  )}
                  {prop.area && prop.area.trim() !== '' && (
                    <div className="flex items-center gap-1.5" title={`Superficie: ${prop.area}`}>
                      <Maximize2 className="w-4 h-4 text-slate-400" />
                      <span>{prop.area}</span>
                    </div>
                  )}
                  {(!prop.bedrooms && !prop.bathrooms && !prop.parking && (!prop.area || prop.area.trim() === '')) && (
                    <div className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-400 bg-amber-400/10 px-2.5 py-0.5 rounded-full border border-amber-400/30">
                      <Clock className="w-3 h-3 text-amber-400 shrink-0" />
                      <span>Sin información</span>
                    </div>
                  )}
                </div>

              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
