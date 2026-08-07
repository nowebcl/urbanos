import React, { useState } from 'react';
import { MapPin, Phone, Mail, MessageSquare, Send, CheckCircle2 } from 'lucide-react';
import { sendSupabaseLead } from '../lib/supabaseServices';
import EditableText from '../components/EditableText';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    interest: 'comprar',
    message: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    await sendSupabaseLead({
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      message: `[${formData.interest.toUpperCase()}] ${formData.message}`
    });

    setLoading(false);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <div className="min-h-screen bg-[#080c14] text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-bold tracking-[0.2em] text-teal-400 uppercase block">
            <EditableText contentKey="contact_pretitle" fallback="ESTAMOS PARA AYUDARTE" />
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            <EditableText contentKey="contact_main_title" fallback="Contacto & Atención Comercial" />
          </h1>
          <p className="text-sm text-slate-300">
            <EditableText
              contentKey="contact_main_bajada"
              fallback="Ponte en contacto con nuestro equipo de profesionales en la Región de Los Lagos, Valparaíso y Metropolitana."
              multiline
            />
          </p>
        </div>

        {/* Top Info Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#0e1422] p-6 rounded-2xl border border-slate-800 space-y-3 flex flex-col items-center text-center shadow-xl">
            <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400">
              <MapPin className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">
              <EditableText contentKey="contact_card1_title" fallback="Ubicación & Dirección" />
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              <strong className="text-white">
                <EditableText contentKey="contact_address" fallback="Av Austral, Jardín Austral, Puerto Montt" />
              </strong><br />
              <EditableText contentKey="contact_card1_detail" fallback="Puerto Montt, Región de Los Lagos, Chile." /><br />
              <span className="text-slate-400">
                <EditableText contentKey="contact_card1_sub" fallback="Cobertura en Los Lagos, V Región y Metropolitana." />
              </span>
            </p>
          </div>

          <div className="bg-[#0e1422] p-6 rounded-2xl border border-slate-800 space-y-3 flex flex-col items-center text-center shadow-xl">
            <div className="w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400">
              <Phone className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">
              <EditableText contentKey="contact_card2_title" fallback="Teléfono & WhatsApp" />
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Llamadas & Chat: <span className="text-orange-400 font-bold">
                <EditableText contentKey="contact_phone" fallback="+56 9 6192 4570" />
              </span><br />
              <EditableText contentKey="contact_card2_hours" fallback="Atención Comercial continua de Lunes a Sábado." />
            </p>
          </div>

          <div className="bg-[#0e1422] p-6 rounded-2xl border border-slate-800 space-y-3 flex flex-col items-center text-center shadow-xl">
            <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400">
              <Mail className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">
              <EditableText contentKey="contact_card3_title" fallback="Correo Electrónico" />
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              <span className="text-teal-300 font-bold">
                <EditableText contentKey="contact_email" fallback="urbanos@urbanosinmobiliaria.cl" />
              </span><br />
              <EditableText contentKey="contact_card3_note" fallback="Respuesta oportuna en menos de 24 horas hábiles." />
            </p>
          </div>
        </div>

        {/* Main Grid: Form + Map & Direct Channels */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Form */}
          <div className="lg:col-span-7 bg-[#0e1422] p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-2xl space-y-6">
            <div>
              <h2 className="text-2xl font-extrabold text-white">
                <EditableText contentKey="contact_form_title" fallback="Envíanos un mensaje" />
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                <EditableText contentKey="contact_form_subtitle" fallback="Completa el formulario para consultas sobre compras, ventas o tasaciones." />
              </p>
            </div>

            {submitted ? (
              <div className="py-12 text-center space-y-3 bg-teal-500/10 border border-teal-500/30 rounded-2xl p-6">
                <CheckCircle2 className="w-12 h-12 text-teal-400 mx-auto" />
                <h4 className="text-lg font-bold text-white">¡Mensaje Enviado con Éxito!</h4>
                <p className="text-xs text-slate-300 max-w-sm mx-auto">
                  Gracias por escribirnos. Un ejecutivo comercial de Urbanos te responderá a la brevedad.
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
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Tu nombre"
                      className="w-full px-4 py-2.5 bg-[#080c14] border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-teal-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Teléfono Móvil *</label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+56 9 6192 4570"
                      className="w-full px-4 py-2.5 bg-[#080c14] border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-teal-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Correo Electrónico *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="urbanos@urbanosinmobiliaria.cl"
                    className="w-full px-4 py-2.5 bg-[#080c14] border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-teal-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Asunto de Interés</label>
                  <select
                    value={formData.interest}
                    onChange={(e) => setFormData({ ...formData, interest: e.target.value })}
                    className="w-full px-4 py-2.5 bg-[#080c14] border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-teal-400"
                  >
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
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Escribe tu consulta o requerimiento específico..."
                    className="w-full px-4 py-2.5 bg-[#080c14] border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-teal-400"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 btn-orange rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-lg"
                >
                  <Send className="w-4 h-4" />
                  <span>{loading ? 'Enviando...' : 'Enviar Formulario de Contacto'}</span>
                </button>
              </form>
            )}
          </div>

          {/* Right Map & Direct Channels */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Map Block */}
            <div className="bg-[#0e1422] p-6 rounded-3xl border border-slate-800 space-y-4">
              <h3 className="text-lg font-bold text-white">
                <EditableText contentKey="contact_map_title" fallback="Dirección & Ubicación Central" />
              </h3>
              
              <div className="relative h-60 w-full rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 flex items-center justify-center">
                <img
                  src="/images/puerto_montt.jpg"
                  alt="Av Austral, Jardín Austral"
                  className="w-full h-full object-cover filter brightness-[0.5]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0e1422] via-transparent to-transparent" />
                
                <div className="relative z-10 text-center space-y-1 p-4">
                  <div className="w-10 h-10 rounded-full bg-teal-500/20 text-teal-400 flex items-center justify-center mx-auto border border-teal-500/50">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-bold text-white block">
                    <EditableText contentKey="contact_address" fallback="Av Austral, Jardín Austral, Puerto Montt" />
                  </span>
                  <span className="text-xs text-slate-300 block">
                    <EditableText contentKey="contact_map_sub" fallback="Puerto Montt, Región de Los Lagos" />
                  </span>
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
                  <h4 className="text-sm font-bold text-white">
                    <EditableText contentKey="contact_wa_title" fallback="¿Prefieres chatear por WhatsApp?" />
                  </h4>
                  <p className="text-xs text-slate-300">
                    <EditableText contentKey="contact_wa_desc" fallback="Atención inmediata con un asesor a tu disposición." />
                  </p>
                </div>
              </div>

              <a
                href="https://wa.me/56961924570?text=Hola,%20quisiera%20consultar%20por%20sus%20servicios%20de%20gestión%20inmobiliaria"
                target="_blank"
                rel="noreferrer"
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-teal-500 text-slate-950 font-bold text-xs hover:bg-teal-400 transition-all mt-2"
              >
                <MessageSquare className="w-4 h-4" />
                <span><EditableText contentKey="contact_wa_btn" fallback="Iniciar Chat en WhatsApp (+56 9 6192 4570)" /></span>
              </a>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
