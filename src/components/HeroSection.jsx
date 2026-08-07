import React from 'react';
import { MapPin, Search, Home, Building2, Briefcase, Trees, ArrowRight } from 'lucide-react';

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
    <section id="inicio" className="relative pt-8 pb-16 md:pt-12 md:pb-24 overflow-hidden flex flex-col justify-center">
      
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/hero_bg.jpg"
          alt="Urbanos Gestión Inmobiliaria"
          className="w-full h-full object-cover object-center filter brightness-[0.45] contrast-125"
        />
        {/* Dark Gradients */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#080c14]/90 via-[#080c14]/50 to-[#080c14]" />
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
        
        {/* Top Pill Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0c121e]/90 border border-teal-500/40 text-slate-100 text-xs sm:text-sm font-medium mb-5 shadow-lg backdrop-blur-md">
          <MapPin className="w-4 h-4 text-teal-400" />
          <span>Gestión Inmobiliaria Integral</span>
        </div>

        {/* Main Title */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-[1.1] mb-4 text-balance">
          Encuentra el hogar ideal para comenzar tu próxima historia
        </h1>

        {/* Subtitle / Bajada */}
        <p className="max-w-3xl text-xs sm:text-sm md:text-base text-slate-200 font-normal leading-relaxed mb-7 text-balance">
          En Urbanos Gestión Inmobiliaria hacemos que cada operación inmobiliaria sea más simple, segura y exitosa. Te acompañamos con asesoría personalizada en la compra, venta, arriendo y administración de propiedades, ofreciendo un servicio cercano, transparente y comprometido con lograr los mejores resultados para nuestros clientes.
        </p>

        {/* Main Search Card Box */}
        <div className="w-full max-w-2xl bg-[#0f172a] border border-slate-700/80 rounded-2xl p-4 sm:p-5 shadow-2xl text-left">
          
          {/* Operation Tabs (Venta / Arriendo) */}
          <div className="flex items-center gap-2 mb-3.5">
            <button
              type="button"
              onClick={() => setSelectedOperation('Venta')}
              className={`px-4 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                selectedOperation === 'Venta'
                  ? 'bg-slate-800 text-white border border-slate-600 shadow'
                  : 'text-slate-400 hover:text-slate-200 bg-transparent'
              }`}
            >
              Venta
            </button>
            <button
              type="button"
              onClick={() => setSelectedOperation('Arriendo')}
              className={`px-4 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                selectedOperation === 'Arriendo'
                  ? 'bg-slate-800 text-white border border-slate-600 shadow'
                  : 'text-slate-400 hover:text-slate-200 bg-transparent'
              }`}
            >
              Arriendo
            </button>
          </div>

          {/* Search Input Row */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              onExecuteSearch();
            }}
            className="flex flex-col sm:flex-row items-center gap-2.5 mb-3.5"
          >
            <div className="relative flex-1 w-full flex items-center">
              <Search className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none z-10" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Comuna, ciudad o palabra clave (ej: Puerto Varas, Puerto Montt, Quilpué)..."
                className="w-full pl-10 pr-3.5 py-2.5 bg-[#080c14] border border-slate-700 rounded-xl text-white placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:border-teal-400 transition-all"
              />
            </div>
            
            <button
              type="submit"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 btn-orange rounded-xl text-xs sm:text-sm font-bold tracking-wide transition-all whitespace-nowrap shadow-lg shrink-0"
            >
              <span>Buscar</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Property Category Chips */}
          <div className="flex flex-wrap items-center gap-2 pt-0.5">
            {propertyTypes.map((type) => {
              const Icon = type.icon;
              const isSelected = selectedType === type.id;
              return (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => setSelectedType(selectedType === type.id ? 'All' : type.id)}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border transition-all ${
                    isSelected
                      ? 'bg-teal-500/20 border-teal-400 text-white'
                      : 'bg-slate-900/90 border-slate-700 text-slate-300 hover:border-slate-500 hover:text-white'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 text-slate-400" />
                  <span>{type.label}</span>
                </button>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
}
