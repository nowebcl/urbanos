import React, { useState } from 'react';
import { Building, ShieldCheck, FileText, Wrench, Wallet, CheckCircle2, Send, Phone, MessageSquare, Tag, FileSignature, Calendar } from 'lucide-react';

export default function ServicesPage() {
  const [activeTab, setActiveTab] = useState('captacion'); // 'captacion' | 'oferta' | 'administracion'
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
            SERVICIOS INMOBILIARIOS INTEGRALES
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Gestión, Venta & Administración
          </h1>
          <p className="text-sm sm:text-base text-slate-300 font-normal leading-relaxed">
            Cobertura profesional en la Región de Los Lagos, Valparaíso y Metropolitana. Nos encargamos de todo el proceso legal, comercial y de tasación.
          </p>
        </div>

        {/* Administration Services Overview */}
        <div className="space-y-8">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold tracking-widest text-orange-400 uppercase">ADMINISTRACIÓN DE ARRIENDOS</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Tranquilidad total para propietarios de inmuebles
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

        {/* Interactive Action Forms Area: Captación / Orden de Venta / Oferta de Compra */}
        <div className="space-y-8 pt-6 border-t border-slate-800">
          
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => { setActiveTab('captacion'); setFormSubmitted(false); }}
              className={`flex items-center gap-2 px-6 py-3 rounded-full text-xs font-bold transition-all ${
                activeTab === 'captacion'
                  ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20'
                  : 'bg-[#0e1422] border border-slate-700 text-slate-300 hover:text-white'
              }`}
            >
              <Tag className="w-4 h-4" />
              <span>Orden de Venta / Captación</span>
            </button>

            <button
              onClick={() => { setActiveTab('oferta'); setFormSubmitted(false); }}
              className={`flex items-center gap-2 px-6 py-3 rounded-full text-xs font-bold transition-all ${
                activeTab === 'oferta'
                  ? 'bg-teal-500 text-slate-950 shadow-lg shadow-teal-500/20'
                  : 'bg-[#0e1422] border border-slate-700 text-slate-300 hover:text-white'
              }`}
            >
              <FileSignature className="w-4 h-4" />
              <span>Presentar Oferta de Compra</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            
            {/* Left Info Column */}
            <div className="lg:col-span-5 space-y-6">
              {activeTab === 'captacion' ? (
                <>
                  <span className="text-xs font-bold tracking-widest text-orange-400 uppercase block">ORDEN DE VENTA / ARRIENDO</span>
                  <h2 className="text-2xl sm:text-4xl font-extrabold text-white leading-tight">
                    Pon tu propiedad en manos de especialistas
                  </h2>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    Completa la información para autorizar el corretaje y solicitar una **evaluación comercial sin costo** por parte de nuestros agentes.
                  </p>

                  <div className="space-y-3 pt-2">
                    <div className="flex items-start gap-3 text-xs sm:text-sm text-slate-300">
                      <CheckCircle2 className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
                      <span>Publicación en portales líderes y redes sociales de Urbanos.</span>
                    </div>
                    <div className="flex items-start gap-3 text-xs sm:text-sm text-slate-300">
                      <CheckCircle2 className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
                      <span>Sesión de fotografía HD y recorridos guiados.</span>
                    </div>
                    <div className="flex items-start gap-3 text-xs sm:text-sm text-slate-300">
                      <CheckCircle2 className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
                      <span>Verificación y filtro comercial de clientes compradores.</span>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <span className="text-xs font-bold tracking-widest text-teal-400 uppercase block">OFERTA FORMAL DE COMPRA</span>
                  <h2 className="text-2xl sm:text-4xl font-extrabold text-white leading-tight">
                    Presenta una propuesta de adquisición
                  </h2>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    Envía una oferta formal por cualquier propiedad de nuestro catálogo o del mercado. Nuestro equipo negociará en tu representación en los mejores términos.
                  </p>

                  <div className="space-y-3 pt-2">
                    <div className="flex items-start gap-3 text-xs sm:text-sm text-slate-300">
                      <CheckCircle2 className="w-5 h-5 text-orange-400 shrink-0 mt-0.5" />
                      <span>Resguardo legal y formalización mediante promesa.</span>
                    </div>
                    <div className="flex items-start gap-3 text-xs sm:text-sm text-slate-300">
                      <CheckCircle2 className="w-5 h-5 text-orange-400 shrink-0 mt-0.5" />
                      <span>Asesoría en financiamiento e hipotecarios.</span>
                    </div>
                  </div>
                </>
              )}

              <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row gap-3">
                <a
                  href="https://wa.me/56995930321?text=Hola,%20quisiera%20consultar%20por%20servicios%20de%20gestión%20inmobiliaria"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-teal-500/50 bg-teal-500/10 text-teal-300 font-bold text-xs hover:bg-teal-500/20 transition-all"
                >
                  <MessageSquare className="w-4 h-4 text-teal-400" />
                  <span>WhatsApp de Atención (+56 9 9593 0321)</span>
                </a>
              </div>
            </div>

            {/* Right Form Column */}
            <div className="lg:col-span-7 bg-[#0e1422] p-6 sm:p-8 rounded-3xl border border-slate-700/80 shadow-2xl space-y-6">
              <div>
                <h3 className="text-xl font-extrabold text-white">
                  {activeTab === 'captacion' ? 'Formulario de Orden de Venta / Captación' : 'Formulario de Oferta de Compra'}
                </h3>
                <p className="text-xs text-slate-400 mt-1">Ingresa tus datos para procesar la solicitud con un corredor.</p>
              </div>

              {formSubmitted ? (
                <div className="py-12 text-center space-y-3 bg-teal-500/10 border border-teal-500/30 rounded-2xl p-6">
                  <CheckCircle2 className="w-12 h-12 text-teal-400 mx-auto" />
                  <h4 className="text-lg font-bold text-white">¡Solicitud Registrada con Éxito!</h4>
                  <p className="text-xs text-slate-300 max-w-md mx-auto">
                    Un asesor especializado se pondrá en contacto contigo en breve.
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
                        placeholder="Ej: Pedro Morales"
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
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Comuna / Ciudad *</label>
                      <input
                        type="text"
                        required
                        placeholder="Ej: Puerto Varas, Puerto Montt..."
                        className="w-full px-4 py-2.5 bg-[#080c14] border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-orange-500"
                      />
                    </div>
                  </div>

                  {activeTab === 'captacion' ? (
                    <>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-slate-300 mb-1">Tipo de Operación *</label>
                          <select className="w-full px-4 py-2.5 bg-[#080c14] border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-orange-500">
                            <option value="vender">Quiero Vender</option>
                            <option value="arrendar">Quiero Arrendar</option>
                            <option value="administrar">Administración de Arriendo</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-300 mb-1">Tipo de Propiedad *</label>
                          <select className="w-full px-4 py-2.5 bg-[#080c14] border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-orange-500">
                            <option value="casa">Casa</option>
                            <option value="departamento">Departamento</option>
                            <option value="terreno">Terreno / Parcela</option>
                            <option value="comercial">Local Comercial / Oficina</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">Dirección / Características</label>
                        <textarea
                          rows={3}
                          placeholder="Indica m², dorms, valor pretendido..."
                          className="w-full px-4 py-2.5 bg-[#080c14] border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-orange-500"
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-slate-300 mb-1">Código o Propiedad de Interés *</label>
                          <input
                            type="text"
                            required
                            placeholder="Ej: URB-101 o Dirección"
                            className="w-full px-4 py-2.5 bg-[#080c14] border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-teal-400"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-300 mb-1">Valor de la Oferta (UF / $ CLP) *</label>
                          <input
                            type="text"
                            required
                            placeholder="Ej: UF 5.000 o $190.000.000"
                            className="w-full px-4 py-2.5 bg-[#080c14] border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-teal-400"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">Condiciones de Pago / Comentarios</label>
                        <textarea
                          rows={3}
                          placeholder="Ej: Contado, Crédito Hipotecario Aprobado en Banco X, fecha estimada de escrituración..."
                          className="w-full px-4 py-2.5 bg-[#080c14] border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-teal-400"
                        />
                      </div>
                    </>
                  )}

                  <button
                    type="submit"
                    className="w-full py-3.5 btn-orange rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-lg"
                  >
                    <Send className="w-4 h-4" />
                    <span>{activeTab === 'captacion' ? 'Enviar Orden de Venta' : 'Presentar Oferta de Compra'}</span>
                  </button>
                </form>
              )}
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
