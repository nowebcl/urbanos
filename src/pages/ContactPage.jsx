import React, { useState } from 'react';
import { MapPin, Phone, Mail, MessageSquare, Clock, Send, CheckCircle2 } from 'lucide-react';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <div className="min-h-screen bg-[#080c14] text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-bold tracking-[0.2em] text-teal-400 uppercase">
            ESTAMOS PARA AYUDARTE
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Contacto & Atención Comercial
          </h1>
          <p className="text-sm text-slate-300">
            Ponte en contacto con nuestro equipo comercial en Puerto Montt y la Región de Los Lagos.
          </p>
        </div>

        {/* Top Info Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#0e1422] p-6 rounded-2xl border border-slate-800 space-y-3 flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400">
              <MapPin className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">Ubicación & Cobertura</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Puerto Montt, Región de Los Lagos, Chile.<br />
              Atención en Puerto Varas, Frutillar, Osorno y Santiago.
            </p>
          </div>

          <div className="bg-[#0e1422] p-6 rounded-2xl border border-slate-800 space-y-3 flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400">
              <Phone className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">Teléfono & WhatsApp</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Llamadas: <a href="tel:+56995930321" className="text-orange-400 hover:underline">+56 9 9593 0321</a><br />
              Atención Comercial continua de Lunes a Sábado.
            </p>
          </div>

          <div className="bg-[#0e1422] p-6 rounded-2xl border border-slate-800 space-y-3 flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400">
              <Mail className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">Correo Electrónico</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              <a href="mailto:contacto@urbanosgestion.cl" className="text-teal-300 hover:underline">contacto@urbanosgestion.cl</a><br />
              Respuesta en menos de 24 horas hábiles.
            </p>
          </div>
        </div>

        {/* Main Grid: Form + Map & Socials */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Form */}
          <div className="lg:col-span-7 bg-[#0e1422] p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-2xl space-y-6">
            <div>
              <h2 className="text-2xl font-extrabold text-white">Envíanos un mensaje</h2>
              <p className="text-xs text-slate-400 mt-1">Completa el formulario para consultas sobre compras, ventas o tasaciones.</p>
            </div>

            {submitted ? (
              <div className="py-12 text-center space-y-3 bg-teal-500/10 border border-teal-500/30 rounded-2xl p-6">
                <CheckCircle2 className="w-12 h-12 text-teal-400 mx-auto" />
                <h4 className="text-lg font-bold text-white">¡Mensaje Enviado!</h4>
                <p className="text-xs text-slate-300 max-w-sm mx-auto">
                  Gracias por escribirnos. Un ejecutivo comercial te responderá a la brevedad.
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
                      placeholder="Tu nombre"
                      className="w-full px-4 py-2.5 bg-[#080c14] border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-teal-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Teléfono Móvil *</label>
                    <input
                      type="tel"
                      required
                      placeholder="+56 9 ..."
                      className="w-full px-4 py-2.5 bg-[#080c14] border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-teal-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Correo Electrónico *</label>
                  <input
                    type="email"
                    required
                    placeholder="nombre@ejemplo.com"
                    className="w-full px-4 py-2.5 bg-[#080c14] border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-teal-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Asunto de Interés</label>
                  <select className="w-full px-4 py-2.5 bg-[#080c14] border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-teal-400">
                    <option value="comprar">Quiero comprar una propiedad</option>
                    <option value="arrendar">Quiero arrendar un inmueble</option>
                    <option value="vender">Quiero vender mi propiedad</option>
                    <option value="tasacion">Solicitar tasación comercial</option>
                    <option value="otro">Consulta general</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Mensaje *</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Escribe tu consulta o requerimiento específico..."
                    className="w-full px-4 py-2.5 bg-[#080c14] border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-teal-400"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 btn-orange rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-lg"
                >
                  <Send className="w-4 h-4" />
                  <span>Enviar Formulario de Contacto</span>
                </button>
              </form>
            )}
          </div>

          {/* Right Map & Direct Channels */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Map Block */}
            <div className="bg-[#0e1422] p-6 rounded-3xl border border-slate-800 space-y-4">
              <h3 className="text-lg font-bold text-white">Zona de Cobertura Principal</h3>
              
              <div className="relative h-60 w-full rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 flex items-center justify-center">
                <img
                  src="/images/puerto_montt.jpg"
                  alt="Puerto Montt Mapa"
                  className="w-full h-full object-cover filter brightness-[0.5]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0e1422] via-transparent to-transparent" />
                
                <div className="relative z-10 text-center space-y-1 p-4">
                  <div className="w-10 h-10 rounded-full bg-teal-500/20 text-teal-400 flex items-center justify-center mx-auto border border-teal-500/50">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-bold text-white block">Puerto Montt & Macrozona Sur</span>
                  <span className="text-xs text-slate-300 block">Región de Los Lagos, Chile</span>
                </div>
              </div>
            </div>

            {/* Direct WhatsApp Box */}
            <div className="bg-gradient-to-r from-[#0c1a2e] to-[#0e1422] p-6 rounded-3xl border border-teal-500/40 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-teal-500/20 text-teal-400 flex items-center justify-center shrink-0 border border-teal-500/40">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">¿Prefieres chatear por WhatsApp?</h4>
                  <p className="text-xs text-slate-300">Respuesta rápida con nuestros ejecutivos.</p>
                </div>
              </div>

              <a
                href="https://wa.me/56995930321?text=Hola,%20quisiera%20consultar%20por%20sus%20servicios%20de%20gestión%20inmobiliaria"
                target="_blank"
                rel="noreferrer"
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-teal-500 text-slate-950 font-bold text-xs hover:bg-teal-400 transition-all mt-2"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Iniciar Chat en WhatsApp (+56 9 9593 0321)</span>
              </a>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
