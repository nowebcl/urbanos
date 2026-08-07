import React, { useRef, useState, useEffect } from 'react';
import { useContent } from '../context/ContentContext';
import { Check } from 'lucide-react';

export default function EditableText({
  contentKey,
  fallback,
  multiline = false,
  className = "",
  tag = "span"
}) {
  const { content, updateContentKey, session, isEditMode } = useContent();
  const [savedSuccess, setSavedSuccess] = useState(false);
  const elRef = useRef(null);

  const textValue = content[contentKey] || fallback || '';
  const canEdit = session && isEditMode;

  const handleBlur = async () => {
    if (!canEdit || !elRef.current) return;
    const newText = elRef.current.innerText.trim();
    if (newText && newText !== textValue) {
      await updateContentKey(contentKey, newText);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2500);
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
    <TagComponent
      ref={elRef}
      contentEditable={canEdit}
      suppressContentEditableWarning={true}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      className={`${className} ${
        canEdit
          ? 'outline-none hover:outline-dashed hover:outline-1 hover:outline-orange-400 focus:outline-solid focus:outline-2 focus:outline-orange-500 focus:bg-orange-500/10 rounded px-1 transition-all'
          : ''
      } relative inline-block`}
      title={canEdit ? 'Haz clic para editar este texto directamente' : undefined}
    >
      {textValue}
      {savedSuccess && (
        <span className="absolute -top-6 right-0 bg-teal-500 text-slate-950 text-[10px] font-bold px-2 py-0.5 rounded shadow-lg flex items-center gap-1 animate-fade-in pointer-events-none">
          <Check className="w-3 h-3 stroke-[3]" /> Guardado en DB
        </span>
      )}
    </TagComponent>
  );
}
