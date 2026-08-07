import React from 'react';
import { useContent } from '../context/ContentContext';
import { Link } from 'react-router-dom';
import { ShieldCheck, Edit3, Lock, LogOut, ExternalLink } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function AdminBar() {
  const { session, isEditMode, setIsEditMode } = useContent();

  if (!session) return null;

  return (
    <div className="bg-slate-950 border-b border-orange-500/40 text-white text-xs py-2 px-4 sticky top-0 z-50 shadow-2xl backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 font-bold text-orange-400">
            <ShieldCheck className="w-4 h-4 text-orange-400" />
            ADMINISTRADOR ACTIVO:
          </span>
          <span className="text-slate-300 font-mono text-[11px] truncate max-w-[200px] sm:max-w-none">
            {session.user.email}
          </span>
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
            <span>{isEditMode ? 'Edición Visual: ACTIVADA' : 'Activar Edición Visual'}</span>
          </button>

          <Link
            to="/admin"
            className="flex items-center gap-1 text-slate-300 hover:text-teal-400 font-semibold text-[11px] px-2 py-1"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Panel Admin</span>
          </Link>

          <button
            type="button"
            onClick={() => supabase.auth.signOut()}
            className="text-red-400 hover:text-red-300 p-1"
            title="Cerrar sesión admin"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
