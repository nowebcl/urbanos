import React, { useState } from 'react';
import { Building, ShieldCheck, FileText, Wrench, Wallet, CheckCircle2, Send, Phone, MessageSquare } from 'lucide-react';

export default function ServicesPage() {
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormSubmitted(true);
    setTimeout(() => setFormSubmitted(false), 5000);
  };

  const managementFeatures = [
    {
      title: 'Selección Rigurosa de Arrendatarios',
      description: 'Evaluación comercial, financiera (DICOM) y laboral exhaustiva para garantizar postulantes confiables.',
      icon: ShieldCheck
    },
    {
      title: 'Redacción de Contratos Legales',
      description: 'Contratos redactados por abogados especialistas con cláusulas de resguardo ante notario.',
      icon: FileText
    },
    {
      title: 'Cobranza Oportuna y Depósitos',
      description: 'Gestión puntual de cobro mensual de arriendos y transferencia garantizada a tu cuenta bancaria.',
      icon: Wallet
    },
    {
      title: 'Mantenciones e Incidencias 24/7',
      description: 'Coordinación inmediata de servicios técnicos, reparaciones y supervisión de estado del inmueble.',
      icon: Wrench
    }
  ];

  return (
    <div className="min-h-screen bg-[#080c14] text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-bold tracking-[0.2em] text-teal-400 uppercase">
            SERVICIOS PARA PROPIETARIOS
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Administración & Captación de Propiedades
          </h1>
          <p className="text-sm sm:text-base text-slate-300 font-normal leading-relaxed">
            Maximiza la rentabilidad de tu inversión sin preocupaciones. Nos encargamos de todo el ciclo de arrendamiento y venta con estándar profesional.
          </p>
        </div>

        {/* Administration Services Grid */}
        <div className="space-y-8">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold tracking-widest text-orange-400 uppercase">ADMINISTRACIÓN DE ARRIENDOS</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Tranquilidad total para los propietarios
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {managementFeatures.map((f, i) => {
              const Icon = f.icon;
              return (
                <div key={i} className="bg-[#0e1422] p-6 rounded-2xl border border-slate-800 space-y-3 hover:border-slate-600 transition-all">
                  <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-teal-400">
                    <Icon className="w-6 h-6 stroke-[1.75]" />
                  </div>
                  <h3 className="text-base font-bold text-white">{f.title}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed font-normal">{f.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Form & Info Section for Listing / Captación */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start pt-6 border-t border-slate-800">
          
          {/* Left Info Column */}
          <div className="lg:col-span-5 space-y-6">
            <span className="text-xs font-bold tracking-widest text-teal-400 uppercase block">¿QUIERES VENDER O ARRENDAR?</span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white leading-tight">
              Pon tu propiedad en manos de especialistas
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Completa el formulario y uno de nuestros corredores senior realizará una **evaluación comercial y tasación comparativa sin costo** para tu propiedad.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3 text-xs sm:text-sm text-slate-300">
                <CheckCircle2 className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
                <span>Publicación destacada en portales inmobiliarios líderes de Chile.</span>
              </div>
              <div className="flex items-start gap-3 text-xs sm:text-sm text-slate-300">
                <CheckCircle2 className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
                <span>Fotografía profesional HD y tours virtuales.</span>
              </div>
              <div className="flex items-start gap-3 text-xs sm:text-sm text-slate-300">
                <CheckCircle2 className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
                <span>Filtro previo de interesados para visitas seguras.</span>
              </div>
              <div className="flex items-start gap-3 text-xs sm:text-sm text-slate-300">
                <CheckCircle2 className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
                <span>Asesoría legal continua hasta la firma en notaría.</span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row gap-3">
              <a
                href="https://wa.me/56995930321?text=Hola,%20quisiera%20publicar%20mi%20propiedad%20con%20Urbanos"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-teal-500/50 bg-teal-500/10 text-teal-300 font-bold text-xs hover:bg-teal-500/20 transition-all"
              >
                <MessageSquare className="w-4 h-4 text-teal-400" />
                <span>WhatsApp de Captaciones</span>
              </a>
              <a
                href="tel:+56995930321"
                className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-slate-700 bg-slate-900 text-slate-200 font-bold text-xs hover:text-white transition-all"
              >
                <Phone className="w-4 h-4 text-orange-400" />
                <span>Llamar al +56 9 9593 0321</span>
              </a>
            </div>
          </div>

          {/* Right Form Column */}
          <div className="lg:col-span-7 bg-[#0e1422] p-6 sm:p-8 rounded-3xl border border-slate-700/80 shadow-2xl space-y-6">
            <div>
              <h3 className="text-xl font-extrabold text-white">Formulario de Captación de Propiedad</h3>
              <p className="text-xs text-slate-400 mt-1">Ingresa los datos del inmueble para contactarte a la brevedad.</p>
            </div>

            {formSubmitted ? (
              <div className="py-12 text-center space-y-3 bg-teal-500/10 border border-teal-500/30 rounded-2xl p-6">
                <CheckCircle2 className="w-12 h-12 text-teal-400 mx-auto" />
                <h4 className="text-lg font-bold text-white">¡Solicitud Registrada con Éxito!</h4>
                <p className="text-xs text-slate-300 max-w-md mx-auto">
                  Un asesor de captaciones de Urbanos se pondrá en contacto contigo para coordinar la tasación y visita inicial.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Nombre Completo *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ej: Carolina Rojas"
                      className="w-full px-4 py-2.5 bg-[#080c14] border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Teléfono Móvil *</label>
                    <input
                      type="tel"
                      required
                      placeholder="+56 9 1234 5678"
                      className="w-full px-4 py-2.5 bg-[#080c14] border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Correo Electrónico *</label>
                    <input
                      type="email"
                      required
                      placeholder="correo@ejemplo.com"
                      className="w-full px-4 py-2.5 bg-[#080c14] border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Tipo de Operación *</label>
                    <select className="w-full px-4 py-2.5 bg-[#080c14] border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-orange-500">
                      <option value="vender">Quiero Vender</option>
                      <option value="arrendar">Quiero Arrendar mi propiedad</option>
                      <option value="administrar">Quiero Servicio de Administración de Arriendo</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Tipo de Propiedad *</label>
                    <select className="w-full px-4 py-2.5 bg-[#080c14] border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-orange-500">
                      <option value="casa">Casa</option>
                      <option value="departamento">Departamento</option>
                      <option value="terreno">Terreno / Parcela</option>
                      <option value="comercial">Casa Comercial / Oficina</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Comuna / Ciudad *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ej: Puerto Varas, Puerto Montt..."
                      className="w-full px-4 py-2.5 bg-[#080c14] border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Dirección / Detalles Adicionales</label>
                  <textarea
                    rows={3}
                    placeholder="Indica dorms, baños, m², o valor estimado pretendido..."
                    className="w-full px-4 py-2.5 bg-[#080c14] border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-orange-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 btn-orange rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-lg"
                >
                  <Send className="w-4 h-4" />
                  <span>Enviar Formulario de Captación</span>
                </button>
              </form>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
