import React from 'react';
import { ShieldCheck, Megaphone, Scale, MapPin, CheckCircle, Award } from 'lucide-react';
import StatsBar from '../components/StatsBar';
import CtaBanner from '../components/CtaBanner';
import { AGENTS } from '../data/mockData';

export default function AboutPage({ onOpenContact }) {

  const pillars = [
    {
      title: 'Estrategia Publicitaria',
      description: 'No solo ponemos un letrero. Diseñamos campañas digitales de alto impacto para que tu propiedad sea la protagonista.',
      icon: Megaphone,
      color: 'text-orange-400'
    },
    {
      title: 'Gestión Integral',
      description: 'Expertos en administración, venta y arriendo con filtros de seguridad implacables.',
      icon: ShieldCheck,
      color: 'text-teal-400'
    },
    {
      title: 'Asesoría Especializada',
      description: 'Contamos con abogados y arquitectos para garantizar una operación 100% segura y legal.',
      icon: Scale,
      color: 'text-orange-400'
    }
  ];

  return (
    <div className="min-h-screen bg-[#080c14] text-slate-100">
      
      {/* Hero Banner */}
      <section className="relative py-20 overflow-hidden bg-slate-950 border-b border-slate-800">
        <div className="absolute inset-0 z-0">
          <img
            src="/images/puerto_varas.jpg"
            alt="Nosotros Urbanos"
            className="w-full h-full object-cover object-center filter brightness-[0.3] contrast-125"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#080c14]/80 via-transparent to-[#080c14]" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="text-xs font-bold tracking-[0.2em] text-teal-400 uppercase">
            SOBRE NOSOTROS
          </span>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight">
            En Urbanos no solo movemos propiedades, cerramos negocios
          </h1>
          <p className="max-w-3xl mx-auto text-base sm:text-lg text-slate-200 leading-relaxed font-semibold">
            Somos un equipo de Publicistas y Corredores de Propiedades que fusiona la estrategia digital avanzada con un conocimiento técnico profundo del mercado.
          </p>
        </div>
      </section>

      {/* History & Focus Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          
          <div className="space-y-6">
            <span className="text-xs font-bold tracking-widest text-orange-400 uppercase">ENFOQUE TERRITORIAL</span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white leading-snug">
              Llevamos la seriedad y el sello del sur a la zona central
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              En <strong className="text-white">Urbanos Gestión Inmobiliaria</strong> concentramos nuestra presencia y operaciones estratégicas en:
            </p>

            <div className="space-y-3 pt-1">
              <div className="flex items-start gap-3 text-sm text-slate-200">
                <CheckCircle className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
                <span><strong className="text-white">Región de Los Lagos</strong> (Puerto Montt, Puerto Varas y alrededores).</span>
              </div>
              <div className="flex items-start gap-3 text-sm text-slate-200">
                <CheckCircle className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
                <span><strong className="text-white">V Región</strong> (Quilpué, Villa Alemana y alrededores).</span>
              </div>
              <div className="flex items-start gap-3 text-sm text-slate-200">
                <CheckCircle className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
                <span><strong className="text-white">Región Metropolitana</strong>.</span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800">
              <span className="text-lg sm:text-xl font-extrabold text-orange-400 tracking-wide italic">
                "Hacemos que las cosas pasen….."
              </span>
            </div>
          </div>

          <div className="relative rounded-3xl overflow-hidden border border-slate-800 shadow-2xl h-96">
            <img
              src="/images/frutillar.jpg"
              alt="Cobertura territorial Urbanos"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#080c14] via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 p-4 bg-[#0e1422]/90 backdrop-blur-md rounded-2xl border border-slate-800">
              <div className="flex items-center gap-2 text-teal-400 text-xs font-bold mb-1">
                <MapPin className="w-4 h-4" />
                <span>Estrategia Digital & Presencia Nacional</span>
              </div>
              <span className="text-xs text-slate-300">Conexión directa entre el Sur y la Zona Central de Chile.</span>
            </div>
          </div>

        </div>

        {/* 3 Main Pillars */}
        <div className="space-y-8 pt-8">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold tracking-widest text-teal-400 uppercase">NUESTROS PILARES</span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white">Por qué elegir a Urbanos</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pillars.map((v, i) => {
              const Icon = v.icon;
              return (
                <div key={i} className="bg-[#0e1422] p-8 rounded-3xl border border-slate-800 space-y-4 hover:border-slate-600 transition-all shadow-xl">
                  <div className={`w-14 h-14 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center ${v.color}`}>
                    <Icon className="w-7 h-7 stroke-[1.75]" />
                  </div>
                  <h3 className="text-xl font-bold text-white">{v.title}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed font-normal">{v.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Stats Bar */}
        <StatsBar />

        {/* Team Section */}
        <div className="space-y-8 pt-6">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold tracking-widest text-orange-400 uppercase">NUESTRO EQUIPO</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Corredores y Asesores a cargo</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 max-w-3xl mx-auto gap-6">
            {AGENTS.map((agent) => (
              <div key={agent.id} className="bg-[#0e1422] p-6 rounded-2xl border border-slate-800 flex items-center gap-4">
                <img
                  src={agent.image}
                  alt={agent.name}
                  className="w-20 h-20 rounded-full object-cover border-2 border-orange-500/60 shrink-0"
                />
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-white">{agent.name}</h3>
                  <p className="text-xs text-teal-400 font-semibold">{agent.role}</p>
                  <p className="text-xs text-slate-400">{agent.phone}</p>
                  <a href={`mailto:${agent.email}`} className="text-xs text-orange-400 hover:underline block truncate">
                    {agent.email}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <CtaBanner onOpenContact={onOpenContact} />

      </section>

    </div>
  );
}
