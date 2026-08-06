import React, { useState } from 'react';
import { X, MapPin, Bed, Bath, Car, Maximize2, Phone, Mail, CheckCircle2, Calculator, Send } from 'lucide-react';

export default function PropertyModal({ property, onClose, currencyMode }) {
  if (!property) return null;

  const [activeImage, setActiveImage] = useState(property.image);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [downPayment, setDownPayment] = useState(20); // 20%
  const [years, setYears] = useState(20); // 20 años

  const priceCLP = property.priceCLP;
  const loanAmount = priceCLP * (1 - downPayment / 100);
  const monthlyRate = 0.048 / 12; // 4.8% annual rate approx
  const totalMonths = years * 12;
  const monthlyPaymentCLP = Math.round(
    (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
    (Math.pow(1 + monthlyRate, totalMonths) - 1)
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormSubmitted(true);
    setTimeout(() => {
      setFormSubmitted(false);
    }, 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/80 backdrop-blur-md animate-fadeIn">
      
      {/* Modal Card Container */}
      <div className="relative w-full max-w-4xl bg-[#0f172a] border border-slate-700/80 rounded-3xl overflow-hidden shadow-2xl my-8 max-h-[90vh] flex flex-col">
        
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#090d16]/90">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded bg-teal-500/20 text-teal-300 text-xs font-bold uppercase">
              {property.type}
            </span>
            <span className="px-2.5 py-0.5 rounded bg-orange-500/20 text-orange-300 text-xs font-bold uppercase">
              {property.operation}
            </span>
          </div>
          
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Modal Content */}
        <div className="overflow-y-auto p-6 space-y-8 flex-1">
          
          {/* Gallery Section */}
          <div className="space-y-3">
            <div className="relative h-72 sm:h-96 rounded-2xl overflow-hidden bg-slate-950 border border-slate-800">
              <img
                src={activeImage}
                alt={property.title}
                className="w-full h-full object-cover object-center transition-all duration-300"
              />
            </div>
            
            {/* Thumbnails */}
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {property.gallery.map((imgUrl, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(imgUrl)}
                  className={`relative h-20 w-28 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                    activeImage === imgUrl ? 'border-orange-500 scale-105' : 'border-slate-800 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={imgUrl} alt={`Vista ${i}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Title & Price Header */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-slate-800/80 pb-6">
            <div>
              <div className="flex items-center gap-2 text-teal-400 text-sm font-medium mb-1">
                <MapPin className="w-4 h-4" />
                <span>{property.address}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                {property.title}
              </h2>
            </div>

            <div className="sm:text-right bg-slate-900/80 p-4 rounded-2xl border border-slate-800 shrink-0">
              <div className="text-2xl sm:text-3xl font-extrabold text-orange-400">
                {currencyMode === 'UF'
                  ? `UF ${property.priceUF.toLocaleString('es-CL')}`
                  : `$${property.priceCLP.toLocaleString('es-CL')}`}
              </div>
              <div className="text-xs text-slate-400 font-medium mt-1">
                {currencyMode === 'UF'
                  ? `$${property.priceCLP.toLocaleString('es-CL')} CLP`
                  : `UF ${property.priceUF.toLocaleString('es-CL')}`}
              </div>
            </div>
          </div>

          {/* Key Features Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-center">
            <div className="flex flex-col items-center justify-center p-2">
              <Bed className="w-5 h-5 text-teal-400 mb-1" />
              <span className="text-xs text-slate-400 font-medium">Dormitorios</span>
              <span className="text-base font-bold text-white">{property.bedrooms || '-'}</span>
            </div>
            <div className="flex flex-col items-center justify-center p-2">
              <Bath className="w-5 h-5 text-teal-400 mb-1" />
              <span className="text-xs text-slate-400 font-medium">Baños</span>
              <span className="text-base font-bold text-white">{property.bathrooms || '-'}</span>
            </div>
            <div className="flex flex-col items-center justify-center p-2">
              <Car className="w-5 h-5 text-teal-400 mb-1" />
              <span className="text-xs text-slate-400 font-medium">Estacionamientos</span>
              <span className="text-base font-bold text-white">{property.parking || '-'}</span>
            </div>
            <div className="flex flex-col items-center justify-center p-2">
              <Maximize2 className="w-5 h-5 text-teal-400 mb-1" />
              <span className="text-xs text-slate-400 font-medium">Superficie Const.</span>
              <span className="text-base font-bold text-white">{property.area}</span>
            </div>
          </div>

          {/* Description & Features List */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            <div className="md:col-span-2 space-y-6">
              <div>
                <h3 className="text-lg font-bold text-white mb-2">Descripción de la Propiedad</h3>
                <p className="text-slate-300 text-sm leading-relaxed font-normal">
                  {property.description}
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-white mb-3">Características Destacadas</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {property.features.map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-slate-300 text-sm bg-slate-900/40 px-3 py-2 rounded-lg border border-slate-800/60">
                      <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Simulación Hipotecaria */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 space-y-4">
                <div className="flex items-center gap-2 text-white font-bold">
                  <Calculator className="w-5 h-5 text-orange-400" />
                  <span>Calculadora Hipotecaria Estimada</span>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="text-slate-400 block mb-1">Pie ({downPayment}%):</label>
                    <input
                      type="range"
                      min="10"
                      max="40"
                      step="5"
                      value={downPayment}
                      onChange={(e) => setDownPayment(Number(e.target.value))}
                      className="w-full accent-orange-500 cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">Plazo ({years} años):</label>
                    <input
                      type="range"
                      min="10"
                      max="30"
                      step="5"
                      value={years}
                      onChange={(e) => setYears(Number(e.target.value))}
                      className="w-full accent-teal-400 cursor-pointer"
                    />
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between border-t border-slate-800 text-sm">
                  <span className="text-slate-300">Dividendo Estimado:</span>
                  <span className="text-lg font-extrabold text-teal-300">
                    ${monthlyPaymentCLP.toLocaleString('es-CL')} / mes
                  </span>
                </div>
              </div>
            </div>

            {/* Agent Contact Card */}
            <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 space-y-5 h-fit">
              <h3 className="text-base font-bold text-white border-b border-slate-800 pb-3">
                Agendar Visita o Consulta
              </h3>

              {formSubmitted ? (
                <div className="p-4 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-300 text-sm text-center">
                  ¡Mensaje enviado con éxito! Un corredor experto se contactará contigo en breve.
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-3">
                  <div>
                    <input
                      type="text"
                      required
                      placeholder="Tu nombre completo"
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs placeholder-slate-500 focus:outline-none focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <input
                      type="tel"
                      required
                      placeholder="Teléfono (+56 9 ...)"
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs placeholder-slate-500 focus:outline-none focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <textarea
                      rows={3}
                      defaultValue={`Hola, me interesa la propiedad "${property.title}" (${property.location}). Quisiera más información.`}
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs placeholder-slate-500 focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 btn-orange rounded-xl text-xs font-bold flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>Enviar Consulta</span>
                  </button>
                </form>
              )}

              <div className="pt-3 border-t border-slate-800/80 flex flex-col gap-2 text-xs">
                <a
                  href="tel:+56995930321"
                  className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-slate-700 bg-slate-800/60 text-slate-200 hover:text-white font-semibold hover:border-slate-500 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-teal-400" />
                  <span>Llamar al +56 9 9593 0321</span>
                </a>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
