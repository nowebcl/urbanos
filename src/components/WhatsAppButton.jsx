import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useContent } from '../context/ContentContext';

export default function WhatsAppButton() {
  const location = useLocation();
  const { content } = useContent();
  const [isHovered, setIsHovered] = useState(false);

  // Do not display on admin view
  if (location.pathname.startsWith('/admin')) {
    return null;
  }

  // Format phone number for wa.me link
  const rawPhone = content?.contact_phone || '+56 9 6192 4570';
  let cleanPhone = rawPhone.replace(/\D/g, '');
  if (cleanPhone.length === 9 && !cleanPhone.startsWith('56')) {
    cleanPhone = `56${cleanPhone}`;
  }
  if (!cleanPhone) {
    cleanPhone = '56961924570';
  }

  const defaultMessage = encodeURIComponent(
    '¡Hola Urbanos Gestión Inmobiliaria! Quisiera realizar una consulta sobre sus propiedades y servicios.'
  );
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${defaultMessage}`;

  return (
    <div className="fixed bottom-6 left-6 z-40 flex items-center group select-none">
      {/* WhatsApp Link Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contactar por WhatsApp"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="relative flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#25D366] text-white shadow-[0_6px_25px_rgba(37,211,102,0.45)] hover:shadow-[0_8px_30px_rgba(37,211,102,0.65)] hover:scale-110 active:scale-95 transition-all duration-300 ease-out focus:outline-none focus:ring-4 focus:ring-emerald-400/40"
      >
        {/* Subtle Radar Pulse Wave */}
        <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-75 animate-ping pointer-events-none -z-10" />

        {/* Subtle Glow Ring */}
        <span className="absolute -inset-1 rounded-full bg-gradient-to-r from-emerald-400 to-green-500 opacity-30 blur-sm pointer-events-none" />

        {/* WhatsApp Official SVG Icon */}
        <svg
          className="w-7 h-7 sm:w-8 sm:h-8 fill-current relative z-10 drop-shadow-sm"
          viewBox="0 0 24 24"
        >
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
        </svg>

        {/* Online Status Dot Badge */}
        <span className="absolute top-0 right-0 w-3.5 h-3.5 sm:w-4 sm:h-4 bg-emerald-300 border-2 border-[#080c14] rounded-full shadow-sm" />
      </a>

      {/* Floating Tooltip / Label next to the button on the left-to-right axis */}
      <div
        className={`ml-3 px-3.5 py-1.5 rounded-full bg-[#0e1726]/95 border border-emerald-500/40 text-emerald-300 text-xs font-semibold shadow-xl backdrop-blur-md transition-all duration-300 pointer-events-none hidden sm:flex items-center gap-2 ${
          isHovered
            ? 'opacity-100 translate-x-0'
            : 'opacity-0 -translate-x-2'
        }`}
      >
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span>¿En qué podemos ayudarte?</span>
      </div>
    </div>
  );
}
