import React from 'react';
import { Home, ArrowRight } from 'lucide-react';

export default function CtaBanner({ onOpenContact }) {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-14">
      <div className="relative rounded-3xl overflow-hidden p-6 sm:p-10 bg-[#0c121e] border border-orange-500/40 shadow-2xl">
        
        {/* Glow accent */}
        <div className="absolute inset-0 bg-gradient-to-r from-teal-500/5 via-transparent to-orange-500/5 pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          
          {/* Left Icon + Text */}
          <div className="flex items-start gap-5">
            <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-teal-500/40 flex items-center justify-center text-teal-400 shrink-0 mt-1">
              <Home className="w-7 h-7 stroke-[1.75]" />
            </div>

            <div className="max-w-3xl space-y-2">
              <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                ¿Quieres vender o arrendar tu propiedad de forma segura y eficiente?
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 font-normal leading-relaxed">
                Evaluamos y seleccionamos cuidadosamente a los potenciales compradores, brindando asesoría legal y comercial durante todo el proceso. Desarrollamos una estrategia de difusión en múltiples canales, apoyados por una red de socios comerciales especializados para maximizar la visibilidad de tu propiedad. Nos encargamos de la gestión integral, desde la promoción hasta la entrega final, ofreciendo un servicio profesional, transparente y personalizado para que vendas con seguridad y obtengas los mejores resultados.
              </p>
            </div>
          </div>

          {/* Right Action Button */}
          <button
            onClick={onOpenContact}
            className="w-full md:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-full border border-orange-500 bg-orange-500/10 hover:bg-orange-500/20 text-white font-bold text-xs sm:text-sm tracking-wide transition-all duration-300 shrink-0 shadow-lg"
          >
            <span>Contactar Asesor</span>
            <ArrowRight className="w-4 h-4 text-orange-400" />
          </button>

        </div>
      </div>
    </section>
  );
}
