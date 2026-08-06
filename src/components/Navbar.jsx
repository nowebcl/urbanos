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
    <header className="sticky top-0 z-50 w-full border-b border-slate-800/80 backdrop-blur-xl bg-[#080c14]/90 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link to="/" className="flex items-center group transition-transform duration-300 hover:scale-[1.01]">
          <UrbanosLogo layout="horizontal" />
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-8">
          <nav className="flex items-center gap-7">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path || (link.path !== '/' && location.pathname.startsWith(link.path));
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`relative py-1 text-sm font-medium transition-colors duration-200 ${
                    isActive ? 'text-white font-semibold' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-[2.5px] bg-teal-400 rounded-full shadow-[0_0_8px_rgba(45,212,191,0.8)]" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Call / WhatsApp Actions */}
          <div className="flex items-center gap-3">
            <a
              href="https://wa.me/56995930321?text=Hola,%20quisiera%20consultar%20por%20sus%20servicios%20en%20Urbanos%20Gestión%20Inmobiliaria"
              target="_blank"
              rel="noreferrer"
              className="hidden lg:flex items-center gap-1.5 px-4 py-2 rounded-full border border-teal-500/40 bg-teal-500/10 hover:bg-teal-500/20 text-teal-300 text-xs font-semibold transition-all"
              title="Contacto por WhatsApp"
            >
              <MessageSquare className="w-3.5 h-3.5 text-teal-400" />
              <span>WhatsApp</span>
            </a>

            <button
              onClick={onOpenContact}
              className="group flex items-center gap-2 px-5 py-2.5 rounded-full border border-orange-500/80 bg-slate-950/40 hover:bg-orange-500/10 text-white text-xs sm:text-sm font-semibold transition-all duration-300 hover:border-orange-400 shadow-[0_0_15px_rgba(249,115,22,0.15)]"
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
            className="p-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 hover:text-white"
            aria-label="Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-800 bg-[#080c14]/98 backdrop-blur-2xl px-6 pt-4 pb-6 space-y-4">
          <div className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className="text-base font-medium text-slate-200 hover:text-orange-400 py-1 transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>
          
          <div className="pt-3 border-t border-slate-800/80 flex flex-col gap-2.5">
            <a
              href="https://wa.me/56995930321?text=Hola,%20quisiera%20consultar%20por%20propiedades%20en%20Urbanos"
              target="_blank"
              rel="noreferrer"
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-full border border-teal-500/50 bg-teal-500/10 text-teal-300 font-semibold text-xs"
            >
              <MessageSquare className="w-4 h-4 text-teal-400" />
              <span>WhatsApp Directo</span>
            </a>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenContact();
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-full border border-orange-500 bg-orange-500/10 text-white font-semibold text-xs"
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
