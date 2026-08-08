import React, { useState } from 'react';
import { X, Phone, Mail, MessageSquare, Check, Sparkles } from 'lucide-react';

export default function ContactModal({ isOpen, onClose }) {
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 3500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg bg-[#0f172a] border border-slate-700/80 rounded-3xl overflow-hidden shadow-2xl p-6 sm:p-8">
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400 shrink-0">
            <Phone className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-white">
              Contacto Directo
            </h3>
            <p className="text-xs text-slate-400">Urbanos Gestión Inmobiliaria</p>
          </div>
        </div>

        {submitted ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-teal-500/20 text-teal-400 flex items-center justify-center mx-auto border border-teal-500/40">
              <Check className="w-8 h-8" />
            </div>
            <h4 className="text-xl font-bold text-white">¡Solicitud recibida!</h4>
            <p className="text-sm text-slate-300">
              Un asesor de nuestro equipo en el Sur de Chile se pondrá en contacto contigo en breve.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            
            {/* Quick Call Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <a
                href="tel:+56995930321"
                className="flex items-center justify-center gap-2 p-3.5 rounded-xl border border-orange-500/50 bg-orange-500/10 text-white font-semibold text-xs hover:bg-orange-500/20 transition-colors"
              >
                <Phone className="w-4 h-4 text-orange-400" />
                <span>+56 9 9593 0321</span>
              </a>
              <a
                href="https://wa.me/56995930321?text=Hola,%20quisiera%20consultar%20por%20una%20propiedad%20en%20Urbanos"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 p-3.5 rounded-xl border border-teal-500/50 bg-teal-500/10 text-white font-semibold text-xs hover:bg-teal-500/20 transition-colors"
              >
                <MessageSquare className="w-4 h-4 text-teal-400" />
                <span>WhatsApp Directo</span>
              </a>
            </div>

            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-slate-800"></div>
              <span className="flex-shrink mx-4 text-slate-500 text-xs font-semibold uppercase">O envíanos un mensaje</span>
              <div className="flex-grow border-t border-slate-800"></div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Nombre Completo</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: María González"
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Teléfono o WhatsApp</label>
                <input
                  type="tel"
                  required
                  placeholder="+56 9 1234 5678"
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">¿Qué necesitas?</label>
                <select className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-orange-500">
                  <option value="comprar">Quiero Comprar una propiedad</option>
                  <option value="vender">Quiero Vender mi propiedad</option>
                  <option value="arrendar">Quiero Arrendar</option>
                  <option value="tasacion">Solicitar Tasación Gratuita</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 btn-orange rounded-xl text-sm font-bold shadow-lg mt-2"
              >
                Solicitar Contacto Comercial
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}
