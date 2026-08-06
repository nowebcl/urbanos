import React from 'react';
import { Home, ArrowRight } from 'lucide-react';

export default function CtaBanner({ onOpenContact }) {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-14">
      <div className="relative rounded-2xl overflow-hidden p-6 sm:p-8 bg-[#0c121e] border border-orange-500/40 shadow-2xl">
        
        {/* Glow accent */}
        <div className="absolute inset-0 bg-gradient-to-r from-teal-500/5 via-transparent to-orange-500/5 pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          
          {/* Left Icon + Text matching Image 1 */}
          <div className="flex items-start sm:items-center gap-5">
            <div className="w-14 h-14 rounded-full bg-slate-900 border border-teal-500/40 flex items-center justify-center text-teal-400 shrink-0">
              <Home className="w-6 h-6 stroke-[1.75]" />
            </div>

            <div className="max-w-2xl">
              <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                ¿Quieres vender o arrendar tu propiedad?
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 font-normal mt-1 leading-relaxed">
                Te acompañamos en todo el proceso: tasación, marketing, visitas y cierre. Llámanos y hablemos de tu proyecto.
              </p>
            </div>
          </div>

          {/* Right Action Button matching Image 1 */}
          <button
            onClick={onOpenContact}
            className="w-full md:w-auto flex items-center justify-center gap-2 px-7 py-3 rounded-full border border-orange-500 bg-slate-950/60 hover:bg-orange-500/10 text-white font-bold text-xs sm:text-sm tracking-wide transition-all duration-300 shrink-0"
          >
            <span>Llamar ahora</span>
            <ArrowRight className="w-4 h-4 text-orange-400" />
          </button>

        </div>
      </div>
    </section>
  );
}
