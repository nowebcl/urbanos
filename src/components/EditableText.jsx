import React, { useRef, useState } from 'react';
import { useContent } from '../context/ContentContext';
import { Check, Save } from 'lucide-react';

export default function EditableText({
  contentKey,
  fallback,
  multiline = false,
  className = "",
  tag = "span"
}) {
  const { content, updateContentKey, session, isEditMode } = useContent();
  const [isFocused, setIsFocused] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const elRef = useRef(null);

  const textValue = content[contentKey] || fallback || '';
  const canEdit = session && isEditMode;

  const handleSaveText = async () => {
    if (!canEdit || !elRef.current) return;
    const newText = elRef.current.innerText.trim();
    if (newText && newText !== textValue) {
      setIsSaving(true);
      await updateContentKey(contentKey, newText);
      setIsSaving(false);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2500);
    }
  };

  const handleBlur = async () => {
    setTimeout(async () => {
      // Delay blur check slightly so button clicks register
      if (document.activeElement !== elRef.current) {
        setIsFocused(false);
        await handleSaveText();
      }
    }, 150);
  };

  const handleFocus = () => {
    if (canEdit) {
      setIsFocused(true);
    }
  };

  const handleKeyDown = (e) => {
    if (!multiline && e.key === 'Enter') {
      e.preventDefault();
      elRef.current?.blur();
    }
  };

  const TagComponent = tag;

  return (
    <span className="relative inline-block group/edit">
      <TagComponent
        ref={elRef}
        contentEditable={canEdit}
        suppressContentEditableWarning={true}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className={`${className} ${
          canEdit
            ? 'outline-none hover:outline-dashed hover:outline-1 hover:outline-orange-400 focus:outline-solid focus:outline-2 focus:outline-orange-500 focus:bg-orange-500/10 rounded px-1.5 py-0.5 transition-all'
            : ''
        }`}
        title={canEdit ? 'Haz clic para editar este texto directamente' : undefined}
      >
        {textValue}
      </TagComponent>

      {/* Floating Save Button when Focused */}
      {canEdit && isFocused && (
        <span className="absolute -top-9 right-0 z-50 flex items-center gap-1.5 bg-[#0e1422] border border-orange-500 p-1 px-2.5 rounded-xl shadow-2xl animate-fade-in text-[11px] font-bold text-white whitespace-nowrap">
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault(); // prevent losing focus before click
              handleSaveText();
            }}
            className="flex items-center gap-1 text-orange-400 hover:text-white transition-colors"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{isSaving ? 'Guardando...' : 'Guardar Texto'}</span>
          </button>
        </span>
      )}

      {/* Success Badge */}
      {savedSuccess && (
        <span className="absolute -top-8 right-0 z-50 bg-teal-500 text-slate-950 text-[10px] font-extrabold px-2 py-0.5 rounded-lg shadow-xl flex items-center gap-1 animate-bounce pointer-events-none">
          <Check className="w-3 h-3 stroke-[3]" /> ¡Guardado en Base de Datos!
        </span>
      )}
    </span>
  );
}
