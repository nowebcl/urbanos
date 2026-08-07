import React, { useState } from 'react';
import { useContent } from '../context/ContentContext';
import { Edit3, Check, X } from 'lucide-react';

export default function EditableText({ contentKey, fallback, multiline = false, className = "", tag = "span" }) {
  const { content, updateContentKey, session, isEditMode } = useContent();
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState('');

  const textValue = content[contentKey] || fallback || '';

  const canEdit = session && isEditMode;

  const handleStartEdit = (e) => {
    if (!canEdit) return;
    e.stopPropagation();
    setTempValue(textValue);
    setIsEditing(true);
  };

  const handleSave = async (e) => {
    e.stopPropagation();
    await updateContentKey(contentKey, tempValue);
    setIsEditing(false);
  };

  const handleCancel = (e) => {
    e.stopPropagation();
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <span className="inline-block relative z-50 bg-[#0e1422] p-2 rounded-xl border border-orange-500 shadow-2xl my-1 w-full max-w-2xl text-left">
        {multiline ? (
          <textarea
            rows={4}
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
            className="w-full p-3 bg-[#080c14] text-white border border-slate-700 rounded-lg text-xs font-sans focus:outline-none focus:border-orange-500"
          />
        ) : (
          <input
            type="text"
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
            className="w-full p-2 bg-[#080c14] text-white border border-slate-700 rounded-lg text-xs font-sans focus:outline-none focus:border-orange-500"
          />
        )}

        <div className="flex items-center justify-end gap-2 mt-2">
          <button
            type="button"
            onClick={handleCancel}
            className="flex items-center gap-1 px-3 py-1 bg-slate-800 text-slate-300 rounded-lg text-[11px] font-bold"
          >
            <X className="w-3.5 h-3.5" /> Cancelar
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="flex items-center gap-1 px-3.5 py-1 bg-orange-500 text-white rounded-lg text-[11px] font-bold shadow-md hover:bg-orange-600"
          >
            <Check className="w-3.5 h-3.5" /> Guardar en Supabase
          </button>
        </div>
      </span>
    );
  }

  const TagComponent = tag;

  return (
    <TagComponent
      onClick={canEdit ? handleStartEdit : undefined}
      className={`${className} ${canEdit ? 'cursor-pointer hover:outline-dashed hover:outline-1 hover:outline-orange-400 hover:bg-orange-500/10 p-0.5 rounded transition-all relative group' : ''}`}
      title={canEdit ? 'Haz clic para editar este texto en tiempo real' : undefined}
    >
      {textValue}
      {canEdit && (
        <span className="inline-inline-flex ml-1.5 opacity-40 group-hover:opacity-100 text-orange-400 transition-opacity">
          <Edit3 className="w-3.5 h-3.5 inline align-middle" />
        </span>
      )}
    </TagComponent>
  );
}
