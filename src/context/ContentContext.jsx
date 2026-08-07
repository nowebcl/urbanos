import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export const DEFAULT_CONTENT = {
  hero_badge: 'Gestión Inmobiliaria Integral & Estrategia Digital',
  hero_title: 'Encuentra el hogar ideal para comenzar tu próxima historia',
  hero_bajada: 'En Urbanos Gestión Inmobiliaria hacemos que cada operación inmobiliaria sea más simple, segura y exitosa. Te acompañamos con asesoría personalizada en la compra, venta, arriendo y administración de propiedades.',
  
  cta_title: '¿Quieres vender o arrendar tu propiedad de forma segura y eficiente?',
  cta_description: 'Evaluamos y seleccionamos cuidadosamente a los potenciales compradores, brindando asesoría legal y comercial durante todo el proceso. Desarrollamos una estrategia de difusión en múltiples canales, apoyados por una red de socios comerciales especializados para maximizar la visibilidad de tu propiedad.',
  
  about_title: 'En Urbanos no solo movemos propiedades, cerramos negocios',
  about_subtitle: 'Somos un equipo de Publicistas y Corredores de Propiedades que fusiona la estrategia digital avanzada con un conocimiento técnico profundo del mercado.',
  about_motto: 'Hacemos que las cosas pasen…..',

  about_pillar1_title: 'Estrategia Publicitaria',
  about_pillar1_desc: 'No solo ponemos un letrero. Diseñamos campañas digitales de alto impacto para que tu propiedad sea la protagonista.',
  about_pillar2_title: 'Gestión Integral',
  about_pillar2_desc: 'Expertos en administración, venta y arriendo con filtros de seguridad implacables.',
  about_pillar3_title: 'Asesoría Especializada',
  about_pillar3_desc: 'Contamos con abogados y arquitectos para garantizar una operación 100% segura y legal.',

  contact_phone: '+56 9 6192 4570',
  contact_email: 'urbanos@urbanosinmobiliaria.cl',
  contact_address: 'Av Austral, Jardín Austral, Puerto Montt'
};

const ContentContext = createContext(null);

export function ContentProvider({ children }) {
  const [content, setContent] = useState(DEFAULT_CONTENT);
  const [session, setSession] = useState(() => {
    try {
      const saved = localStorage.getItem('urbanos_admin_session');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });
  const [isEditMode, setIsEditMode] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContentFromSupabase();

    try {
      supabase.auth.getSession().then(({ data: { session: supSession } }) => {
        if (supSession) {
          setSession(supSession);
          localStorage.setItem('urbanos_admin_session', JSON.stringify(supSession));
        }
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, supSession) => {
        if (supSession) {
          setSession(supSession);
          localStorage.setItem('urbanos_admin_session', JSON.stringify(supSession));
        }
      });

      return () => subscription.unsubscribe();
    } catch (e) {
      console.warn('Auth subscription notice:', e);
    }
  }, []);

  const fetchContentFromSupabase = async () => {
    try {
      const { data, error } = await supabase.from('site_content').select('*');
      if (data && data.length > 0) {
        const dbContent = { ...DEFAULT_CONTENT };
        data.forEach(item => {
          dbContent[item.key] = item.content;
        });
        setContent(dbContent);
      }
    } catch (err) {
      console.warn('Supabase site_content query notice:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateContentKey = async (key, newValue) => {
    // Optimistic local state update
    setContent(prev => ({ ...prev, [key]: newValue }));

    try {
      const { error } = await supabase
        .from('site_content')
        .upsert([{ key, content: newValue, updated_at: new Date().toISOString() }], { onConflict: 'key' });

      if (error) {
        console.error('Error saving to Supabase DB:', error);
      }
    } catch (err) {
      console.error('Connection error saving site content:', err);
    }
  };

  const setAdminSession = (newSession) => {
    setSession(newSession);
    if (newSession) {
      localStorage.setItem('urbanos_admin_session', JSON.stringify(newSession));
    } else {
      localStorage.removeItem('urbanos_admin_session');
    }
  };

  return (
    <ContentContext.Provider
      value={{
        content,
        updateContentKey,
        session,
        setSession: setAdminSession,
        isEditMode,
        setIsEditMode,
        loading,
        refetchContent: fetchContentFromSupabase
      }}
    >
      {children}
    </ContentContext.Provider>
  );
}

export function useContent() {
  const context = useContext(ContentContext);
  if (!context) {
    return {
      content: DEFAULT_CONTENT,
      updateContentKey: async () => {},
      session: null,
      setSession: () => {},
      isEditMode: false,
      setIsEditMode: () => {},
      loading: false,
      refetchContent: () => {}
    };
  }
  return context;
}
