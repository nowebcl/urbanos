import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { PROPERTIES } from '../data/mockData';

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
  const [properties, setProperties] = useState(() => {
    try {
      const saved = localStorage.getItem('urbanos_custom_properties');
      return saved ? JSON.parse(saved) : PROPERTIES;
    } catch (e) {
      return PROPERTIES;
    }
  });

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
    fetchPropertiesFromSupabase();

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
      const { data } = await supabase.from('site_content').select('*');
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

  const fetchPropertiesFromSupabase = async () => {
    try {
      const { data, error } = await supabase.from('properties').select('*').order('id', { ascending: false });
      
      if (data && data.length > 0) {
        // Map database fields to standard property format used in components
        const mapped = data.map(p => ({
          id: p.id,
          code: p.code,
          slug: p.slug,
          title: p.title,
          commune: p.commune,
          location: p.location || p.address,
          address: p.address || p.location,
          priceDisplay: p.price_display,
          priceUF: parseFloat(p.price_uf || 0),
          priceCLP: parseFloat(p.price_clp || 0),
          bedrooms: p.bedrooms || 0,
          bathrooms: p.bathrooms || 0,
          parking: p.parking || 0,
          area: p.area,
          landArea: p.land_area || p.landArea,
          isFeatured: p.is_featured ?? true,
          operation: p.operation || 'Venta',
          type: p.type || 'Departamento',
          createdAt: p.created_at ? p.created_at.split('T')[0] : '2026-01-01',
          image: p.image,
          gallery: Array.isArray(p.gallery) ? p.gallery : (p.image ? [p.image] : []),
          description: p.description || '',
          agent: p.agent || {
            id: 1,
            name: 'Cristián Muñoz',
            role: 'Agente Inmobiliario Senior',
            phone: '+56 9 6192 4570',
            email: 'urbanos@urbanosinmobiliaria.cl',
            image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80'
          }
        }));

        setProperties(mapped);
        localStorage.setItem('urbanos_custom_properties', JSON.stringify(mapped));
      }
    } catch (err) {
      console.warn('Supabase fetch properties error:', err);
    }
  };

  const updateContentKey = async (key, newValue) => {
    setContent(prev => ({ ...prev, [key]: newValue }));

    try {
      await supabase
        .from('site_content')
        .upsert([{ key, content: newValue, updated_at: new Date().toISOString() }], { onConflict: 'key' });
    } catch (err) {
      console.error('Connection error saving site content:', err);
    }
  };

  /**
   * Save (Insert or Update) a property in state, localStorage, and Supabase
   */
  const saveProperty = async (propData, editingId = null) => {
    const idToUse = editingId || propData.id || Math.floor(Math.random() * 90000) + 10000;
    
    // Normalized property object for local components
    const updatedProp = {
      ...propData,
      id: idToUse,
      priceDisplay: propData.price_display || propData.priceDisplay,
      priceUF: propData.price_uf ?? propData.priceUF ?? 0,
      priceCLP: propData.price_clp ?? propData.priceCLP ?? 0,
      landArea: propData.land_area || propData.landArea,
      isFeatured: propData.is_featured ?? propData.isFeatured ?? true
    };

    // 1. Update React state & localStorage immediately for instant feedback
    setProperties(prev => {
      const exists = prev.some(p => String(p.id) === String(idToUse));
      let newList;
      if (exists) {
        newList = prev.map(p => String(p.id) === String(idToUse) ? { ...p, ...updatedProp } : p);
      } else {
        newList = [updatedProp, ...prev];
      }
      localStorage.setItem('urbanos_custom_properties', JSON.stringify(newList));
      return newList;
    });

    // 2. Persist to Supabase Database via Upsert
    try {
      const dbPayload = {
        id: idToUse,
        code: propData.code,
        slug: propData.slug,
        title: propData.title,
        commune: propData.commune,
        location: propData.location || propData.address,
        address: propData.address || propData.location,
        price_display: propData.priceDisplay || propData.price_display,
        price_uf: propData.priceUF ?? propData.price_uf ?? 0,
        price_clp: propData.priceCLP ?? propData.price_clp ?? 0,
        bedrooms: parseInt(propData.bedrooms, 10) || 0,
        bathrooms: parseInt(propData.bathrooms, 10) || 0,
        parking: parseInt(propData.parking, 10) || 2,
        area: propData.area,
        land_area: propData.landArea || propData.land_area,
        is_featured: propData.isFeatured ?? propData.is_featured ?? true,
        operation: propData.operation,
        type: propData.type,
        image: propData.image,
        gallery: propData.gallery,
        description: propData.description
      };

      const { error } = await supabase.from('properties').upsert([dbPayload]);
      if (error) {
        console.error('Error al guardar propiedad en Supabase DB:', error);
        alert('Aviso Supabase RLS: La propiedad se guardó localmente, pero falta activar las políticas de escritura (INSERT/UPDATE) en la tabla "properties" de Supabase.');
      }
    } catch (err) {
      console.warn('Supabase upsert property error (saved locally):', err);
    }
  };

  /**
   * Delete a property from state, localStorage, and Supabase
   */
  const deleteProperty = async (id) => {
    // 1. Delete locally immediately
    setProperties(prev => {
      const newList = prev.filter(p => String(p.id) !== String(id));
      localStorage.setItem('urbanos_custom_properties', JSON.stringify(newList));
      return newList;
    });

    // 2. Delete from Supabase
    try {
      const { error } = await supabase.from('properties').delete().eq('id', id);
      if (error) {
        console.error('Error al eliminar propiedad en Supabase:', error);
      }
    } catch (err) {
      console.warn('Supabase delete property error:', err);
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
        properties,
        saveProperty,
        deleteProperty,
        refetchProperties: fetchPropertiesFromSupabase,
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
      properties: PROPERTIES,
      saveProperty: async () => {},
      deleteProperty: async () => {},
      refetchProperties: () => {},
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
