import React from 'react';

export default function UrbanosLogo({ className = "" }) {
  return (
    <div className={`flex items-center select-none ${className}`}>
      <img 
        src="/images/logo.png" 
        alt="Urbanos Gestión Inmobiliaria" 
        className="h-14 sm:h-16 md:h-18 w-auto object-contain filter drop-shadow-md transition-transform duration-300 hover:scale-[1.02]"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = '/logo.png';
        }}
      />
    </div>
  );
}
