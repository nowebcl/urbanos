import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { MapPin, Bed, Bath, Car, Maximize2, CheckCircle2, Phone, Mail, MessageSquare, Send, ArrowLeft, Share2, Calculator } from 'lucide-react';
import { PROPERTIES } from '../data/mockData';

export default function PropertyDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();

  // Find property by slug or ID
  const property = PROPERTIES.find(p => p.slug === slug || p.id.toString() === slug) || PROPERTIES[0];

  const [activeImage, setActiveImage] = useState(property.image);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);

  // Mortgage Calculator state
  const [downPayment, setDownPayment] = useState(20);
  const [years, setYears] = useState(20);

  const priceCLP = property.priceCLP;
  const loanAmount = priceCLP * (1 - downPayment / 100);
  const monthlyRate = 0.048 / 12;
  const totalMonths = years * 12;
  const monthlyPaymentCLP = Math.round(
    (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
    (Math.pow(1 + monthlyRate, totalMonths) - 1)
  );

  // Related properties (same commune or operation)
  const relatedProperties = PROPERTIES.filter(
    p => p.id !== property.id && (p.commune === property.commune || p.type === property.type)
  ).slice(0, 3);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormSubmitted(true);
    setTimeout(() => setFormSubmitted(false), 4000);
  };

  const whatsappMessage = encodeURIComponent(
    `Hola, me interesa la propiedad "${property.title}" (Código: ${property.code}). Quisiera solicitar una visita.`
  );
  const whatsappUrl = `https://wa.me/56995930321?text=${whatsappMessage}`;

  return (
    <div className="min-h-screen bg-[#080c14] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Top Breadcrumb Nav */}
        <div className="flex items-center justify-between text-xs text-slate-400">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver a propiedades</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300 font-mono">
              Código: <strong className="text-teal-400">{property.code}</strong>
            </span>
            <button
              onClick={handleShare}
              className="flex items-center gap-1 px-3 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition-colors"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{copied ? '¡Enlace copiado!' : 'Compartir'}</span>
            </button>
          </div>
        </div>

        {/* Property Main Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800 pb-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              {property.isFeatured && (
                <span className="px-2.5 py-0.5 rounded bg-[#10b981] text-slate-950 font-extrabold text-[10px] uppercase">
                  DESTACADO
                </span>
              )}
              <span className="px-2.5 py-0.5 rounded bg-[#f97316] text-white font-extrabold text-[10px] uppercase">
                {property.operation}
              </span>
              <span className="px-2.5 py-0.5 rounded bg-slate-800 text-slate-300 font-semibold text-[10px] uppercase">
                {property.type}
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              {property.title}
            </h1>

            <div className="flex items-center gap-2 text-xs sm:text-sm text-teal-400 font-medium">
              <MapPin className="w-4 h-4 shrink-0" />
              <span>{property.address}, {property.location}</span>
            </div>
          </div>

          {/* Price Header Card */}
          <div className="bg-[#0e1422] p-4 rounded-2xl border border-slate-800 shrink-0 text-left md:text-right">
            <div className="text-2xl sm:text-4xl font-extrabold text-[#f97316]">
              {property.priceDisplay}
            </div>
            <div className="text-xs text-slate-400 font-medium mt-1">
              Aprox. ${property.priceCLP.toLocaleString('es-CL')} CLP
            </div>
          </div>
        </div>

        {/* Gallery Section */}
        <div className="space-y-3">
          <div className="relative h-80 sm:h-[480px] w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-800">
            <img
              src={activeImage}
              alt={property.title}
              className="w-full h-full object-cover object-center transition-all duration-300"
            />
          </div>

          {/* Gallery Thumbnail Selector */}
          <div className="flex items-center gap-3 overflow-x-auto pb-2">
            {property.gallery.map((imgUrl, i) => (
              <button
                key={i}
                onClick={() => setActiveImage(imgUrl)}
                className={`relative h-20 w-32 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                  activeImage === imgUrl ? 'border-orange-500 scale-105 shadow-lg' : 'border-slate-800 opacity-60 hover:opacity-100'
                }`}
              >
                <img src={imgUrl} alt={`Vista ${i}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Quick Specs Summary Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 p-4 rounded-2xl bg-[#0e1422] border border-slate-800 text-center">
          <div className="p-2 border-r border-slate-800 last:border-r-0">
            <Bed className="w-5 h-5 text-teal-400 mx-auto mb-1" />
            <span className="text-[11px] text-slate-400 block font-medium">Dormitorios</span>
            <span className="text-base font-bold text-white">{property.bedrooms || '-'}</span>
          </div>
          <div className="p-2 border-r border-slate-800 last:border-r-0">
            <Bath className="w-5 h-5 text-teal-400 mx-auto mb-1" />
            <span className="text-[11px] text-slate-400 block font-medium">Baños</span>
            <span className="text-base font-bold text-white">{property.bathrooms || '-'}</span>
          </div>
          <div className="p-2 border-r border-slate-800 last:border-r-0">
            <Car className="w-5 h-5 text-teal-400 mx-auto mb-1" />
            <span className="text-[11px] text-slate-400 block font-medium">Estacionamientos</span>
            <span className="text-base font-bold text-white">{property.parking || '-'}</span>
          </div>
          <div className="p-2 border-r border-slate-800 last:border-r-0">
            <Maximize2 className="w-5 h-5 text-teal-400 mx-auto mb-1" />
            <span className="text-[11px] text-slate-400 block font-medium">Sup. Construida</span>
            <span className="text-base font-bold text-white">{property.area || '-'}</span>
          </div>
          <div className="p-2 col-span-2 sm:col-span-1">
            <Maximize2 className="w-5 h-5 text-teal-400 mx-auto mb-1" />
            <span className="text-[11px] text-slate-400 block font-medium">Sup. Terreno</span>
            <span className="text-base font-bold text-white">{property.landArea || '-'}</span>
          </div>
        </div>

        {/* Main Content Grid: Description vs Sticky Sidebar Widget */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Description, Features, Map */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Description */}
            <div className="bg-[#0e1422] p-6 rounded-2xl border border-slate-800 space-y-3">
              <h2 className="text-xl font-bold text-white">Descripción Comercial</h2>
              <p className="text-sm text-slate-300 leading-relaxed font-normal whitespace-pre-line">
                {property.description}
              </p>
            </div>

            {/* Features Checklist */}
            <div className="bg-[#0e1422] p-6 rounded-2xl border border-slate-800 space-y-4">
              <h2 className="text-xl font-bold text-white">Características y Amenidades</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {property.features.map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-300 bg-[#080c14] p-3 rounded-xl border border-slate-800/80">
                    <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Mortgage Calculator */}
            <div className="bg-[#0e1422] p-6 rounded-2xl border border-slate-800 space-y-4">
              <div className="flex items-center gap-2 text-white font-bold text-lg">
                <Calculator className="w-5 h-5 text-orange-400" />
                <span>Simulador de Crédito Hipotecario</span>
              </div>
              <p className="text-xs text-slate-400">
                Calcula una cuota referencial según el porcentaje de pie y plazo deseado.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2">
                <div>
                  <label className="text-slate-300 block mb-1">Pie ({downPayment}%):</label>
                  <input
                    type="range"
                    min="10"
                    max="40"
                    step="5"
                    value={downPayment}
                    onChange={(e) => setDownPayment(Number(e.target.value))}
                    className="w-full accent-orange-500 cursor-pointer"
                  />
                  <span className="text-[11px] text-slate-400 font-mono">
                    ${Math.round(priceCLP * (downPayment / 100)).toLocaleString('es-CL')} CLP
                  </span>
                </div>
                <div>
                  <label className="text-slate-300 block mb-1">Plazo ({years} años):</label>
                  <input
                    type="range"
                    min="10"
                    max="30"
                    step="5"
                    value={years}
                    onChange={(e) => setYears(Number(e.target.value))}
                    className="w-full accent-teal-400 cursor-pointer"
                  />
                  <span className="text-[11px] text-slate-400 font-mono">{years * 12} cuotas mensuales</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-300 font-semibold">Dividendo Estimado:</span>
                <span className="text-lg font-extrabold text-teal-300">
                  ${monthlyPaymentCLP.toLocaleString('es-CL')} / mes
                </span>
              </div>
            </div>

            {/* Map Simulator */}
            <div className="bg-[#0e1422] p-6 rounded-2xl border border-slate-800 space-y-3">
              <h2 className="text-xl font-bold text-white">Ubicación Referencial</h2>
              <p className="text-xs text-slate-400">
                Sector {property.address}, {property.commune}. (Ubicación aproximada por privacidad).
              </p>
              
              <div className="relative h-64 w-full rounded-xl overflow-hidden bg-slate-900 border border-slate-800 flex items-center justify-center">
                {/* Simulated dark map */}
                <div className="absolute inset-0 bg-[#080c14] opacity-90" />
                <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px]" />
                
                <div className="relative z-10 text-center space-y-2 p-4">
                  <div className="w-12 h-12 rounded-full bg-teal-500/20 text-teal-400 flex items-center justify-center mx-auto border border-teal-500/50 shadow-lg">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <span className="text-sm font-bold text-white block">{property.commune}</span>
                  <span className="text-xs text-slate-400 block">{property.address}</span>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(property.address + ' ' + property.commune)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-block px-4 py-1.5 rounded-full bg-slate-800 text-teal-400 text-xs font-semibold hover:bg-slate-700 transition-colors mt-2"
                  >
                    Ver en Google Maps →
                  </a>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Sticky Contact Widget & Assigned Agent */}
          <div className="space-y-6">
            
            {/* Sticky Form Widget */}
            <div className="sticky top-24 bg-[#0e1422] p-6 rounded-2xl border border-slate-700/80 shadow-2xl space-y-5">
              <div>
                <span className="text-[10px] font-extrabold tracking-widest text-teal-400 uppercase block">CONSULTA DIRECTA</span>
                <h3 className="text-lg font-extrabold text-white">Consultar por esta propiedad</h3>
              </div>

              {formSubmitted ? (
                <div className="p-4 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs text-center leading-relaxed">
                  ¡Gracias por tu mensaje! El agente a cargo se pondrá en contacto contigo en breve.
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-3.5">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">Tu Nombre</label>
                    <input
                      type="text"
                      required
                      placeholder="Ej: Juan Pérez"
                      className="w-full px-3.5 py-2.5 bg-[#080c14] border border-slate-700 rounded-xl text-white text-xs placeholder-slate-500 focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">Teléfono</label>
                    <input
                      type="tel"
                      required
                      placeholder="+56 9 1234 5678"
                      className="w-full px-3.5 py-2.5 bg-[#080c14] border border-slate-700 rounded-xl text-white text-xs placeholder-slate-500 focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">Correo Electrónico</label>
                    <input
                      type="email"
                      required
                      placeholder="nombre@ejemplo.com"
                      className="w-full px-3.5 py-2.5 bg-[#080c14] border border-slate-700 rounded-xl text-white text-xs placeholder-slate-500 focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">Mensaje</label>
                    <textarea
                      rows={3}
                      defaultValue={`Hola, me interesa la propiedad "${property.title}" (Código: ${property.code}). Quisiera coordinar una visita.`}
                      className="w-full px-3.5 py-2.5 bg-[#080c14] border border-slate-700 rounded-xl text-white text-xs placeholder-slate-500 focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 btn-orange rounded-xl text-xs font-bold flex items-center justify-center gap-2"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Enviar Mensaje</span>
                  </button>
                </form>
              )}

              {/* WhatsApp Quick CTA Button */}
              <div className="pt-3 border-t border-slate-800 space-y-2">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-teal-500/60 bg-teal-500/10 hover:bg-teal-500/20 text-teal-300 font-bold text-xs transition-colors"
                >
                  <MessageSquare className="w-4 h-4 text-teal-400" />
                  <span>Contactar por WhatsApp</span>
                </a>
              </div>

              {/* Agent Card */}
              {property.agent && (
                <div className="pt-4 border-t border-slate-800 flex items-center gap-3">
                  <img
                    src={property.agent.image}
                    alt={property.agent.name}
                    className="w-12 h-12 rounded-full object-cover border border-slate-700 shrink-0"
                  />
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Agente a cargo</span>
                    <span className="text-xs font-bold text-white block">{property.agent.name}</span>
                    <span className="text-[11px] text-teal-400 block">{property.agent.phone}</span>
                  </div>
                </div>
              )}

            </div>

          </div>

        </div>

        {/* Similar Properties Section */}
        {relatedProperties.length > 0 && (
          <div className="pt-12 border-t border-slate-800 space-y-6">
            <h2 className="text-2xl font-bold text-white">Propiedades Similares Sugeridas</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedProperties.map((relProp) => (
                <div
                  key={relProp.id}
                  onClick={() => navigate(`/propiedades/${relProp.slug}`)}
                  className="group bg-[#0e1422] rounded-2xl overflow-hidden cursor-pointer flex flex-col justify-between border border-slate-800 hover:border-slate-600 transition-all duration-300 shadow-xl"
                >
                  <div className="relative h-48 w-full overflow-hidden bg-slate-950">
                    <img
                      src={relProp.image}
                      alt={relProp.title}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-4 space-y-2">
                    <span className="text-[10px] font-bold text-teal-400">{relProp.location}</span>
                    <h3 className="text-sm font-bold text-white line-clamp-1 group-hover:text-orange-400">{relProp.title}</h3>
                    <div className="text-lg font-extrabold text-orange-400">{relProp.priceDisplay}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
