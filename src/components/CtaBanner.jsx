import React from 'react';
import { Home, ArrowRight, ShieldCheck, Megaphone, CheckCircle2 } from 'lucide-react';

export default function CtaBanner({ onOpenContact }) {
  const highlights = [
    'Evaluación & Filtro de Compradores',
    'Asesoría Legal y Comercial',
    'Difusión Multicanal Digital',
    'Gestión Integral hasta la Entrega'
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-14">
      <div className="relative rounded-3xl overflow-hidden p-6 sm:p-10 bg-[#0c121e] border border-orange-500/40 shadow-2xl">
        
        {/* Glow accent */}
        <div className="absolute inset-0 bg-gradient-to-r from-teal-500/10 via-transparent to-orange-500/10 pointer-events-none" />

        <div className="relative z-10 space-y-6">
          
          {/* Header Row */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-slate-800">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400 shrink-0">
                <Home className="w-7 h-7 stroke-[1.75]" />
              </div>

              <div>
                <span className="text-xs font-bold tracking-widest text-teal-400 uppercase block mb-1">
                  ORDEN DE VENTA & ARRIENDO
                </span>
                <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                  ¿Quieres vender o arrendar tu propiedad de forma segura y eficiente?
                </h3>
              </div>
            </div>

            <button
              onClick={onOpenContact}
              className="w-full md:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl btn-orange font-bold text-xs sm:text-sm tracking-wide transition-all shadow-xl shrink-0"
            >
              <span>Contactar Asesor</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Clean 4 Feature Badges Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
            {highlights.map((text, i) => (
              <div key={i} className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs font-medium text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
                <span>{text}</span>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
