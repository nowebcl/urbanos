import React from 'react';
import { MapPin, Search, Home, Building2, Briefcase, Trees, ArrowRight, ShieldCheck, TrendingUp } from 'lucide-react';
import EditableText from './EditableText';

export default function HeroSection({
  selectedOperation,
  setSelectedOperation,
  searchQuery,
  setSearchQuery,
  selectedType,
  setSelectedType,
  onExecuteSearch
}) {
  const propertyTypes = [
    { id: 'Casa', label: 'Casa', icon: Home },
    { id: 'Departamento', label: 'Departamento', icon: Building2 },
    { id: 'Casa Comercial', label: 'Casa Comercial', icon: Briefcase },
    { id: 'Terreno', label: 'Terreno', icon: Trees },
  ];

  return (
    <section id="inicio" className="relative pt-10 pb-16 md:pt-14 md:pb-24 overflow-hidden flex flex-col justify-center">
      
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/hero_bg.jpg"
          alt="Urbanos Gestión Inmobiliaria"
          className="w-full h-full object-cover object-center filter brightness-[0.75] sm:brightness-[0.45] contrast-110 scale-105 transition-transform duration-1000"
        />
        {/* Responsive Dark Gradients */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#080c14]/70 via-[#080c14]/35 to-[#080c14] sm:from-[#080c14]/90 sm:via-[#080c14]/60 sm:to-[#080c14]" />
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
        
        {/* Top Pill Badge */}
        <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-[#0c121e]/90 border border-teal-500/40 text-slate-100 text-xs sm:text-sm font-medium mb-5 shadow-xl backdrop-blur-md">
          <EditableText
            contentKey="hero_badge"
            fallback="Gestión Inmobiliaria Integral & Estrategia Digital"
          />
        </div>

        {/* Main Title - Proportioned size */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.18] mb-5 text-balance">
          <EditableText
            contentKey="hero_title"
            fallback="Encuentra el hogar ideal para comenzar tu próxima historia"
            multiline
          />
        </h1>

        {/* Subtitle / Bajada - Enhanced readable size */}
        <p className="max-w-3xl text-base sm:text-lg text-slate-200 font-normal leading-relaxed mb-8 text-balance">
          <EditableText
            contentKey="hero_bajada"
            fallback="Hacemos que cada operación inmobiliaria sea simple, segura y exitosa. Asesoría personalizada en compra, venta, arriendo y administración."
            multiline
          />
        </p>

        {/* Main Search Card Box - Expanded and spacious */}
        <div className="w-full max-w-3xl bg-[#0f172a]/95 border border-slate-700/80 rounded-3xl p-6 sm:p-7 shadow-2xl text-left backdrop-blur-xl space-y-4">
          
          {/* Operation Tabs (Venta / Arriendo) */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSelectedOperation('Venta')}
              className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
                selectedOperation === 'Venta'
                  ? 'bg-slate-800 text-white border border-slate-600 shadow-md'
                  : 'text-slate-400 hover:text-slate-200 bg-transparent'
              }`}
            >
              Venta
            </button>
            <button
              type="button"
              onClick={() => setSelectedOperation('Arriendo')}
              className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
                selectedOperation === 'Arriendo'
                  ? 'bg-slate-800 text-white border border-slate-600 shadow-md'
                  : 'text-slate-400 hover:text-slate-200 bg-transparent'
              }`}
            >
              Arriendo
            </button>
          </div>

          {/* Search Input Row - Generous inputs */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              onExecuteSearch();
            }}
            className="flex flex-col sm:flex-row items-center gap-3"
          >
            <div className="relative flex-1 w-full flex items-center">
              <Search className="absolute left-4 w-5 h-5 text-slate-400 pointer-events-none z-10" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Comuna, ciudad o palabra clave..."
                className="w-full pl-12 pr-4 py-3.5 bg-[#080c14] border border-slate-700 rounded-2xl text-white placeholder-slate-400 text-sm sm:text-base focus:outline-none focus:border-teal-400 transition-all shadow-inner"
              />
            </div>
            
            <button
              type="submit"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 btn-orange rounded-2xl text-sm sm:text-base font-bold tracking-wide transition-all whitespace-nowrap shadow-xl shrink-0"
            >
              <span>Buscar</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>

          {/* Property Category Chips */}
          <div className="flex flex-wrap items-center gap-2.5 pt-2 border-t border-slate-800/80">
            {propertyTypes.map((type) => {
              const Icon = type.icon;
              const isSelected = selectedType === type.id;
              return (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => setSelectedType(selectedType === type.id ? 'All' : type.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold border transition-all ${
                    isSelected
                      ? 'bg-teal-500/20 border-teal-400 text-white'
                      : 'bg-slate-900/90 border-slate-700 text-slate-300 hover:border-slate-500 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4 text-slate-400" />
                  <span>{type.label}</span>
                </button>
              );
            })}
          </div>

        </div>

        {/* Feature Badges Bar */}
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 mt-8 text-xs sm:text-sm font-medium text-slate-300">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4.5 h-4.5 text-teal-400" />
            <span>Filtros de Seguridad Legal</span>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4.5 h-4.5 text-orange-400" />
            <span>Estrategia Digital Multicanal</span>
          </div>
        </div>

      </div>
    </section>
  );
}
