import React from 'react';

export default function UrbanosLogo({ className = "", layout = "horizontal" }) {
  const isVertical = layout === "vertical";
  
  return (
    <div className={`flex ${isVertical ? 'flex-col items-start gap-3' : 'items-center gap-3'} select-none ${className}`}>
      
      {/* Exact SVG Icon Mark matching Image 2 */}
      <svg 
        viewBox="0 0 240 160" 
        className="h-10 sm:h-11 w-auto shrink-0 filter drop-shadow-md"
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Blue Frame 1 (Left) */}
        <rect 
          x="12" y="50" width="42" height="95" 
          stroke="#0047AB" strokeWidth="6" 
          rx="2"
        />
        
        {/* Mint/Teal Frame 2 (Tallest Center-Left) */}
        <rect 
          x="38" y="12" width="52" height="133" 
          stroke="#50B498" strokeWidth="6" 
          rx="2"
        />
        
        {/* Red Frame 3 (Horizontal Middle) */}
        <rect 
          x="66" y="88" width="108" height="57" 
          stroke="#D32F2F" strokeWidth="6" 
          rx="2"
        />
        
        {/* Dark Orange Frame 4 (Right High) */}
        <rect 
          x="114" y="56" width="88" height="89" 
          stroke="#E65100" strokeWidth="6" 
          rx="2"
        />
        
        {/* Light Orange Frame 5 (Right Bottom Low) */}
        <rect 
          x="126" y="112" width="90" height="33" 
          stroke="#FF9800" strokeWidth="6" 
          rx="2"
        />
      </svg>

      {/* Brand Typography */}
      <div className="flex flex-col justify-center leading-none">
        <span className="font-heading font-extrabold tracking-[0.08em] text-white text-lg sm:text-xl uppercase leading-none">
          URBANOS
        </span>
        <span className="font-sans text-[8.5px] sm:text-[9.5px] font-bold text-slate-300 tracking-[0.28em] uppercase mt-1 opacity-90">
          GESTIÓN INMOBILIARIA
        </span>
      </div>
    </div>
  );
}
