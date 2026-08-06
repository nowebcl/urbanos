import React, { useState } from 'react';
import UrbanosLogo from './UrbanosLogo';
import { Phone, Menu, X } from 'lucide-react';

export default function Navbar({ onOpenContact, activeSection }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Inicio', href: '#inicio', id: 'inicio' },
    { name: 'Propiedades', href: '#propiedades', id: 'propiedades' },
    { name: 'Nosotros', href: '#nosotros', id: 'nosotros' },
    { name: 'Contacto', href: '#contacto', id: 'contacto' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800/80 backdrop-blur-xl bg-[#080c14]/90 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand Logo matching Image 1 & Image 2 */}
        <a href="#inicio" className="flex items-center group transition-transform duration-300 hover:scale-[1.01]">
          <UrbanosLogo layout="horizontal" />
        </a>

        {/* Desktop Navigation Links & Call Action Button matching exact Image 1 style */}
        <div className="hidden md:flex items-center gap-8">
          <nav className="flex items-center gap-7">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id || (link.id === 'inicio' && !activeSection);
              return (
                <a
                  key={link.name}
                  href={link.href}
                  className={`relative py-1 text-sm font-medium transition-colors duration-200 ${
                    isActive ? 'text-white font-semibold' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-[2.5px] bg-teal-400 rounded-full" />
                  )}
                </a>
              );
            })}
          </nav>

          {/* Call Button matching exact Image 1 style: oval pill, thin orange border */}
          <button
            onClick={onOpenContact}
            className="group flex items-center gap-2 px-6 py-2.5 rounded-full border border-orange-500/80 bg-slate-950/40 hover:bg-orange-500/10 text-white text-sm font-semibold transition-all duration-300 hover:border-orange-400 shadow-[0_0_15px_rgba(249,115,22,0.15)]"
          >
            <Phone className="w-4 h-4 text-orange-400 group-hover:scale-110 transition-transform" />
            <span>Llamar</span>
          </button>
        </div>

        {/* Mobile Hamburger Menu button */}
        <div className="flex md:hidden items-center gap-3">
          <button
            onClick={onOpenContact}
            className="p-2 rounded-full border border-orange-500/80 text-orange-400 bg-orange-500/10"
            aria-label="Llamar"
          >
            <Phone className="w-4.5 h-4.5" />
          </button>
          
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
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-base font-medium text-slate-200 hover:text-orange-400 py-1 transition-colors"
              >
                {link.name}
              </a>
            ))}
          </div>
          
          <div className="pt-2 border-t border-slate-800/80 flex flex-col gap-3">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenContact();
              }}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-full border border-orange-500 bg-orange-500/10 text-white font-semibold text-sm"
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
