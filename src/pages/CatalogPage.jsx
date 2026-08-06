import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Search, RefreshCw, ArrowUpDown, MapPin, Bed, Bath, Car, Maximize2, ChevronLeft, ChevronRight } from 'lucide-react';
import { PROPERTIES, CITIES } from '../data/mockData';

const ITEMS_PER_PAGE = 12;

export default function CatalogPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Filters read from URL params or local state
  const initialOperation = searchParams.get('operation') || 'All';
  const initialCity = searchParams.get('city') || 'All';
  const initialType = searchParams.get('type') || 'All';
  const initialQuery = searchParams.get('query') || '';

  const [operation, setOperation] = useState(initialOperation);
  const [city, setCity] = useState(initialCity);
  const [type, setType] = useState(initialType);
  const [query, setQuery] = useState(initialQuery);
  const [minPriceUF, setMinPriceUF] = useState('');
  const [maxPriceUF, setMaxPriceUF] = useState('');
  const [minBeds, setMinBeds] = useState('All');
  const [sortBy, setSortBy] = useState('newest'); // newest, price-desc, price-asc
  const [currentPage, setCurrentPage] = useState(1);

  // Reset pagination to page 1 whenever filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [operation, city, type, query, minBeds, minPriceUF, maxPriceUF, sortBy]);

  // Filter & sort logic
  const filteredAndSortedProperties = useMemo(() => {
    let result = PROPERTIES.filter(item => {
      // Operation
      if (operation !== 'All' && item.operation !== operation) return false;

      // City / Commune
      if (city !== 'All' && !item.commune.toLowerCase().includes(city.toLowerCase())) return false;

      // Type
      if (type !== 'All' && item.type !== type) return false;

      // Text query
      if (query.trim() !== '') {
        const q = query.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(q);
        const matchesLoc = item.location.toLowerCase().includes(q);
        const matchesCommune = item.commune.toLowerCase().includes(q);
        const matchesCode = item.code.toLowerCase().includes(q);
        if (!matchesTitle && !matchesLoc && !matchesCommune && !matchesCode) return false;
      }

      // Min Bedrooms
      if (minBeds !== 'All' && item.bedrooms < parseInt(minBeds, 10)) return false;

      // Min UF Price
      if (minPriceUF && item.priceUF < parseFloat(minPriceUF)) return false;

      // Max UF Price
      if (maxPriceUF && item.priceUF > parseFloat(maxPriceUF)) return false;

      return true;
    });

    // Sorting
    if (sortBy === 'price-desc') {
      result.sort((a, b) => b.priceUF - a.priceUF);
    } else if (sortBy === 'price-asc') {
      result.sort((a, b) => a.priceUF - b.priceUF);
    } else if (sortBy === 'newest') {
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    return result;
  }, [operation, city, type, query, minBeds, minPriceUF, maxPriceUF, sortBy]);

  const totalPages = Math.ceil(filteredAndSortedProperties.length / ITEMS_PER_PAGE) || 1;

  const paginatedProperties = useMemo(() => {
    const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredAndSortedProperties.slice(startIdx, startIdx + ITEMS_PER_PAGE);
  }, [filteredAndSortedProperties, currentPage]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 250, behavior: 'smooth' });
    }
  };

  const handleReset = () => {
    setOperation('All');
    setCity('All');
    setType('All');
    setQuery('');
    setMinPriceUF('');
    setMaxPriceUF('');
    setMinBeds('All');
    setSortBy('newest');
    setCurrentPage(1);
    setSearchParams({});
  };

  // Helper for page numbers list
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    let start = Math.max(1, currentPage - 2);
    let end = Math.min(totalPages, start + maxVisiblePages - 1);

    if (end - start < maxVisiblePages - 1) {
      start = Math.max(1, end - maxVisiblePages + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="min-h-screen bg-[#080c14] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Page Header */}
        <div className="border-b border-slate-800 pb-6">
          <span className="text-xs font-bold tracking-[0.2em] text-teal-400 uppercase">
            CATÁLOGO INMOBILIARIO
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mt-1">
            Propiedades en el Sur de Chile
          </h1>
          <p className="text-sm text-slate-400 mt-2 max-w-2xl">
            Explora nuestra selección completa de casas, departamentos, terrenos y locales comerciales en la Región de Los Lagos y alrededores.
          </p>
        </div>

        {/* Persistent Filter Bar Container */}
        <div className="bg-[#0f172a] border border-slate-700/80 rounded-2xl p-5 shadow-2xl space-y-4">
          
          {/* Top Row: Search text + Action buttons */}
          <div className="flex flex-col lg:flex-row items-center gap-3">
            <div className="relative flex-1 w-full flex items-center">
              <Search className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar por título, comuna, sector o código (ej: URB-1047)..."
                className="w-full pl-10 pr-4 py-2.5 bg-[#080c14] border border-slate-700 rounded-xl text-white placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:border-teal-400"
              />
            </div>

            <div className="flex items-center gap-2 w-full lg:w-auto justify-between lg:justify-end">
              <button
                onClick={handleReset}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 text-xs font-semibold transition-all"
              >
                <RefreshCw className="w-3.5 h-3.5 text-teal-400" />
                <span>Limpiar Filtros</span>
              </button>
            </div>
          </div>

          {/* Bottom Filter Controls */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-2 border-t border-slate-800/80">
            
            {/* Operación */}
            <div>
              <label className="block text-[11px] font-bold text-slate-400 mb-1 uppercase tracking-wider">Operación</label>
              <select
                value={operation}
                onChange={(e) => setOperation(e.target.value)}
                className="w-full px-3 py-2 bg-[#080c14] border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-teal-400"
              >
                <option value="All">Todas</option>
                <option value="Venta">Venta</option>
                <option value="Arriendo">Arriendo</option>
              </select>
            </div>

            {/* Ciudad/Comuna */}
            <div>
              <label className="block text-[11px] font-bold text-slate-400 mb-1 uppercase tracking-wider">Comuna</label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3 py-2 bg-[#080c14] border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-teal-400"
              >
                <option value="All">Todas las Comunas</option>
                {CITIES.map(c => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>

            {/* Tipo de Inmueble */}
            <div>
              <label className="block text-[11px] font-bold text-slate-400 mb-1 uppercase tracking-wider">Tipo Inmueble</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full px-3 py-2 bg-[#080c14] border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-teal-400"
              >
                <option value="All">Todos los Tipos</option>
                <option value="Casa">Casa</option>
                <option value="Departamento">Departamento</option>
                <option value="Terreno">Terreno</option>
                <option value="Casa Comercial">Casa Comercial</option>
              </select>
            </div>

            {/* Dormitorios */}
            <div>
              <label className="block text-[11px] font-bold text-slate-400 mb-1 uppercase tracking-wider">Dormitorios</label>
              <select
                value={minBeds}
                onChange={(e) => setMinBeds(e.target.value)}
                className="w-full px-3 py-2 bg-[#080c14] border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-teal-400"
              >
                <option value="All">Cualquiera</option>
                <option value="1">1+ Dormitorios</option>
                <option value="2">2+ Dormitorios</option>
                <option value="3">3+ Dormitorios</option>
                <option value="4">4+ Dormitorios</option>
              </select>
            </div>

            {/* Precio Min UF */}
            <div>
              <label className="block text-[11px] font-bold text-slate-400 mb-1 uppercase tracking-wider">Precio Mín (UF)</label>
              <input
                type="number"
                value={minPriceUF}
                onChange={(e) => setMinPriceUF(e.target.value)}
                placeholder="Ej: 3000"
                className="w-full px-3 py-2 bg-[#080c14] border border-slate-700 rounded-xl text-white placeholder-slate-500 text-xs focus:outline-none focus:border-teal-400"
              />
            </div>

            {/* Precio Max UF */}
            <div>
              <label className="block text-[11px] font-bold text-slate-400 mb-1 uppercase tracking-wider">Precio Máx (UF)</label>
              <input
                type="number"
                value={maxPriceUF}
                onChange={(e) => setMaxPriceUF(e.target.value)}
                placeholder="Ej: 10000"
                className="w-full px-3 py-2 bg-[#080c14] border border-slate-700 rounded-xl text-white placeholder-slate-500 text-xs focus:outline-none focus:border-teal-400"
              />
            </div>

          </div>

        </div>

        {/* Status Bar & Sort Selector */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#0e1422] p-4 rounded-xl border border-slate-800">
          <div className="text-xs sm:text-sm text-slate-300 font-semibold">
            Mostrando <span className="text-teal-400 font-bold">{paginatedProperties.length}</span> de <span className="text-white font-bold">{filteredAndSortedProperties.length}</span> propiedades (Página {currentPage} de {totalPages})
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <ArrowUpDown className="w-4 h-4 text-slate-400 shrink-0" />
            <span className="text-xs text-slate-400 whitespace-nowrap">Ordenar por:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-1.5 bg-[#080c14] border border-slate-700 rounded-lg text-white text-xs font-medium focus:outline-none focus:border-teal-400"
            >
              <option value="newest">Más recientes</option>
              <option value="price-desc">Precio: Mayor a Menor</option>
              <option value="price-asc">Precio: Menor a Mayor</option>
            </select>
          </div>
        </div>

        {/* Results Grid */}
        {filteredAndSortedProperties.length === 0 ? (
          <div className="text-center py-20 bg-[#0e1422] rounded-2xl border border-slate-800">
            <h3 className="text-xl font-bold text-white mb-2">No se encontraron propiedades</h3>
            <p className="text-sm text-slate-400 mb-6">Prueba ajustando o limpiando los criterios de búsqueda.</p>
            <button
              onClick={handleReset}
              className="px-6 py-2.5 btn-orange rounded-xl text-xs font-bold"
            >
              Restablecer Filtros
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedProperties.map((prop) => (
                <div
                  key={prop.id}
                  onClick={() => navigate(`/propiedades/${prop.slug}`)}
                  className="group bg-[#0e1422] rounded-2xl overflow-hidden cursor-pointer flex flex-col justify-between border border-slate-800 hover:border-slate-600 transition-all duration-300 shadow-xl"
                >
                  <div className="relative h-56 w-full overflow-hidden bg-slate-950">
                    <img
                      src={prop.image}
                      alt={prop.title}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 filter brightness-95"
                    />
                    
                    <div className="absolute top-4 left-4 flex items-center gap-2 z-10">
                      {prop.isFeatured && (
                        <span className="px-2.5 py-1 rounded bg-[#10b981] text-slate-950 font-extrabold text-[10px] tracking-wider uppercase shadow">
                          DESTACADO
                        </span>
                      )}
                      <span className="px-2.5 py-1 rounded bg-[#f97316] text-white font-extrabold text-[10px] tracking-wider uppercase shadow">
                        {prop.operation.toUpperCase()}
                      </span>
                    </div>

                    <span className="absolute bottom-3 right-3 px-2 py-0.5 rounded bg-slate-950/80 text-slate-300 font-mono text-[10px] font-semibold border border-slate-700">
                      {prop.code}
                    </span>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <div className="flex items-center gap-1.5 text-xs text-teal-400 font-semibold mb-2">
                        <MapPin className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">{prop.location}</span>
                      </div>

                      <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-orange-400 transition-colors leading-snug line-clamp-2">
                        {prop.title}
                      </h3>
                    </div>

                    <div>
                      <div className="text-xl sm:text-2xl font-extrabold text-[#f97316] tracking-tight">
                        {prop.priceDisplay}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        Aprox. ${prop.priceCLP.toLocaleString('es-CL')} CLP
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-800/90 flex items-center gap-4 text-slate-300 text-xs font-semibold">
                      {prop.bedrooms > 0 && (
                        <div className="flex items-center gap-1.5" title="Dormitorios">
                          <Bed className="w-4 h-4 text-slate-400" />
                          <span>{prop.bedrooms}</span>
                        </div>
                      )}
                      {prop.bathrooms > 0 && (
                        <div className="flex items-center gap-1.5" title="Baños">
                          <Bath className="w-4 h-4 text-slate-400" />
                          <span>{prop.bathrooms}</span>
                        </div>
                      )}
                      {prop.parking > 0 && (
                        <div className="flex items-center gap-1.5" title="Estacionamientos">
                          <Car className="w-4 h-4 text-slate-400" />
                          <span>{prop.parking}</span>
                        </div>
                      )}
                      {prop.area && (
                        <div className="flex items-center gap-1.5" title="Superficie">
                          <Maximize2 className="w-4 h-4 text-slate-400" />
                          <span>{prop.area}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Instant Numbered Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-800">
                <span className="text-xs text-slate-400 font-semibold">
                  Página {currentPage} de {totalPages} ({filteredAndSortedProperties.length} propiedades totales)
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2.5 rounded-xl border border-slate-700 bg-[#0e1422] text-slate-300 hover:text-white hover:border-slate-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                    aria-label="Página anterior"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  {getPageNumbers().map(p => (
                    <button
                      key={p}
                      onClick={() => handlePageChange(p)}
                      className={`w-9 h-9 rounded-xl text-xs font-extrabold transition-all ${
                        currentPage === p
                          ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30 border border-orange-400'
                          : 'bg-[#0e1422] border border-slate-700 text-slate-300 hover:text-white hover:border-slate-500'
                      }`}
                    >
                      {p}
                    </button>
                  ))}

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2.5 rounded-xl border border-slate-700 bg-[#0e1422] text-slate-300 hover:text-white hover:border-slate-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                    aria-label="Página siguiente"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
