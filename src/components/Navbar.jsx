import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import UrbanosLogo from './UrbanosLogo';
import { Phone, Menu, X, MessageSquare } from 'lucide-react';

export default function Navbar({ onOpenContact }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Inicio', path: '/' },
    { name: 'Propiedades', path: '/propiedades' },
    { name: 'Nosotros', path: '/nosotros' },
    { name: 'Servicios', path: '/servicios' },
    { name: 'Contacto', path: '/contacto' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800/90 backdrop-blur-xl bg-[#080c14]/95 transition-all shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-24 sm:h-28 flex items-center justify-between">
        
        {/* Brand Logo - Prominent */}
        <Link to="/" className="flex items-center group transition-transform duration-300 hover:scale-[1.02]">
          <UrbanosLogo layout="horizontal" />
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-9">
          <nav className="flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path || (link.path !== '/' && location.pathname.startsWith(link.path));
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`relative py-1.5 text-base font-semibold transition-colors duration-200 ${
                    isActive ? 'text-white font-bold' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-[3px] bg-teal-400 rounded-full shadow-[0_0_10px_rgba(45,212,191,0.9)]" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Call / WhatsApp Actions */}
          <div className="flex items-center gap-3.5">
            <a
              href="https://wa.me/56995930321?text=Hola,%20quisiera%20consultar%20por%20sus%20servicios%20en%20Urbanos%20Gestión%20Inmobiliaria"
              target="_blank"
              rel="noreferrer"
              className="hidden lg:flex items-center gap-2 px-5 py-2.5 rounded-full border border-teal-500/40 bg-teal-500/10 hover:bg-teal-500/20 text-teal-300 text-xs sm:text-sm font-bold transition-all shadow-lg"
              title="Contacto por WhatsApp"
            >
              <MessageSquare className="w-4 h-4 text-teal-400" />
              <span>WhatsApp</span>
            </a>

            <button
              onClick={onOpenContact}
              className="group flex items-center gap-2 px-6 py-3 rounded-full border border-orange-500/80 bg-slate-950/60 hover:bg-orange-500/20 text-white text-xs sm:text-sm font-bold transition-all duration-300 hover:border-orange-400 shadow-[0_0_20px_rgba(249,115,22,0.2)]"
            >
              <Phone className="w-4 h-4 text-orange-400 group-hover:scale-110 transition-transform" />
              <span>Llamar</span>
            </button>
          </div>
        </div>

        {/* Mobile Hamburger Menu button */}
        <div className="flex md:hidden items-center">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 hover:text-white shadow-lg"
            aria-label="Menu"
          >
            {mobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-800 bg-[#080c14]/98 backdrop-blur-2xl px-6 pt-5 pb-7 space-y-5">
          <div className="flex flex-col space-y-3.5">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className="text-lg font-semibold text-slate-200 hover:text-orange-400 py-1 transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>
          
          <div className="pt-4 border-t border-slate-800/80 flex flex-col gap-3">
            <a
              href="https://wa.me/56995930321?text=Hola,%20quisiera%20consultar%20por%20propiedades%20en%20Urbanos"
              target="_blank"
              rel="noreferrer"
              className="w-full flex items-center justify-center gap-2 py-3 rounded-full border border-teal-500/50 bg-teal-500/10 text-teal-300 font-bold text-xs sm:text-sm"
            >
              <MessageSquare className="w-4 h-4 text-teal-400" />
              <span>WhatsApp Directo</span>
            </a>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenContact();
              }}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-full border border-orange-500 bg-orange-500/10 text-white font-bold text-xs sm:text-sm"
            >
              <Phone className="w-4 h-4 text-orange-400" />
              <span>Llamar a Asesor</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
