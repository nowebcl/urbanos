import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, HeartHandshake, Award, Users, MapPin, ArrowRight, CheckCircle } from 'lucide-react';
import StatsBar from '../components/StatsBar';
import CtaBanner from '../components/CtaBanner';
import { AGENTS } from '../data/mockData';

export default function AboutPage({ onOpenContact }) {
  const navigate = useNavigate();

  const values = [
    {
      title: 'Transparencia Total',
      description: 'Garantizamos claridad jurídica, valoración justa y procesos informados en cada etapa de la compraventa o arriendo.',
      icon: ShieldCheck,
      color: 'text-teal-400'
    },
    {
      title: 'Compromiso Humano',
      description: 'Acompañamos a nuestros clientes con asesoría personalizada, escuchando sus objetivos familiares o de inversión.',
      icon: HeartHandshake,
      color: 'text-orange-400'
    },
    {
      title: 'Asesoría Integral 360°',
      description: 'Desde la tasación comercial hasta el cierre ante notario, nos encargamos de todo el flujo operacional y legal.',
      icon: Award,
      color: 'text-teal-400'
    },
    {
      title: 'Red de Especialistas',
      description: 'Contamos con una amplia red de contactos e inversionistas en Región de Los Lagos, Valparaíso y Metropolitana.',
      icon: Users,
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
            CONOCE NUESTRO EQUIPO
          </span>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight">
            Gestión Inmobiliaria Profesional en el Sur de Chile
          </h1>
          <p className="max-w-3xl mx-auto text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
            Más de 12 años conectando a familias e inversionistas con las mejores propiedades en Los Lagos, Valparaíso y Santiago.
          </p>
        </div>
      </section>

      {/* History & Focus Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          
          <div className="space-y-5">
            <span className="text-xs font-bold tracking-widest text-orange-400 uppercase">NUESTRA HISTORIA</span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white leading-snug">
              Experiencia, criterio profesional y conocimiento territorial
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              En <strong className="text-white">Urbanos Gestión Inmobiliaria</strong> nos especializamos en la comercialización y administración de propiedades de alta calidad en la Región de Los Lagos (Puerto Montt, Puerto Varas, Frutillar, Osorno), ampliando nuestra cobertura a sectores estratégicos de la Región de Valparaíso y la Región Metropolitana.
            </p>
            <p className="text-sm text-slate-300 leading-relaxed">
              Comprender el dinamismo del mercado sureño, la normativa urbana y el valor único de terrenos y residencias en entornos naturales es el pilar de nuestro éxito.
            </p>

            <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="flex items-center gap-2 text-slate-200">
                <CheckCircle className="w-4 h-4 text-teal-400" />
                <span>Tasación profesional de mercado</span>
              </div>
              <div className="flex items-center gap-2 text-slate-200">
                <CheckCircle className="w-4 h-4 text-teal-400" />
                <span>Marketing digital avanzado</span>
              </div>
              <div className="flex items-center gap-2 text-slate-200">
                <CheckCircle className="w-4 h-4 text-teal-400" />
                <span>Estudio de títulos y legal</span>
              </div>
              <div className="flex items-center gap-2 text-slate-200">
                <CheckCircle className="w-4 h-4 text-teal-400" />
                <span>Administración integral de arriendos</span>
              </div>
            </div>
          </div>

          <div className="relative rounded-3xl overflow-hidden border border-slate-800 shadow-2xl h-96">
            <img
              src="/images/frutillar.jpg"
              alt="Frutillar y volcanes"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#080c14] via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 p-4 bg-[#0e1422]/90 backdrop-blur-md rounded-2xl border border-slate-800">
              <div className="flex items-center gap-2 text-teal-400 text-xs font-bold mb-1">
                <MapPin className="w-4 h-4" />
                <span>Oficina Central en Puerto Montt</span>
              </div>
              <span className="text-xs text-slate-300">Atención personalizada en toda la Macrozona Sur de Chile.</span>
            </div>
          </div>

        </div>

        {/* 4 Pillars / Values */}
        <div className="space-y-8 pt-8">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold tracking-widest text-teal-400 uppercase">NUESTROS PILARES</span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white">Valores que guián nuestra gestión</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, i) => {
              const Icon = v.icon;
              return (
                <div key={i} className="bg-[#0e1422] p-6 rounded-2xl border border-slate-800 space-y-4 hover:border-slate-600 transition-all">
                  <div className={`w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center ${v.color}`}>
                    <Icon className="w-6 h-6 stroke-[1.75]" />
                  </div>
                  <h3 className="text-lg font-bold text-white">{v.title}</h3>
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
