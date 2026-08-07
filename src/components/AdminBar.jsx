import React from 'react';
import { useContent } from '../context/ContentContext';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, Edit3, Lock, LogOut } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function AdminBar() {
  const { session, setSession, isEditMode, setIsEditMode } = useContent();
  const navigate = useNavigate();

  // ONLY render when user is authenticated as admin
  if (!session) return null;

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (e) {}
    setIsEditMode(false);
    setSession(null);
    localStorage.removeItem('urbanos_admin_session');
    navigate('/');
  };

  return (
    <div className="bg-[#05080e] border-b border-orange-500/40 text-white text-xs py-2 px-4 sticky top-0 z-50 shadow-2xl backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 font-bold text-orange-400 text-xs sm:text-sm tracking-wide">
          <ShieldCheck className="w-4 h-4 text-orange-400 shrink-0" />
          <span>MODO ADMINISTRADOR</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsEditMode(!isEditMode)}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-bold text-[11px] transition-all ${
              isEditMode
                ? 'bg-orange-500 text-white shadow-md'
                : 'bg-slate-800 text-slate-300 hover:text-white border border-slate-700'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>{isEditMode ? 'Edición de Texto: ACTIVADA' : 'Activar Edición de Texto'}</span>
          </button>

          <Link
            to="/admin"
            className="flex items-center gap-1 text-slate-300 hover:text-teal-400 font-semibold text-[11px] px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800"
          >
            <Lock className="w-3.5 h-3.5 text-teal-400" />
            <span>Panel Admin</span>
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-1 text-red-400 hover:text-red-300 px-2.5 py-1 rounded-lg bg-red-500/10 border border-red-500/20 font-bold text-[11px] transition-all"
            title="Cerrar sesión admin"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Salir</span>
          </button>
        </div>
      </div>
    </div>
  );
}
