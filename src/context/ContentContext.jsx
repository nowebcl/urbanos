import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { PROPERTIES } from '../data/mockData';
import { formatImageUrl, cleanImageUrl } from '../utils/imageUtils';

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

      // Realtime listener for properties table changes across all clients
      const propertiesChannel = supabase
        .channel('public:properties')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'properties' }, () => {
          fetchPropertiesFromSupabase();
        })
        .subscribe();

      return () => {
        subscription.unsubscribe();
        supabase.removeChannel(propertiesChannel);
      };
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

  const getDeletedIds = () => {
    try {
      const saved = localStorage.getItem('urbanos_deleted_properties');
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch (e) {
      return new Set();
    }
  };

  const getEditedMap = () => {
    try {
      const saved = localStorage.getItem('urbanos_edited_properties');
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  };

  const fetchPropertiesFromSupabase = async () => {
    try {
      let data = null;

      // Try Vercel Serverless API Proxy first (Avoids browser Mixed Content & SSL handshake blocks)
      try {
        const res = await fetch('/api/properties');
        if (res.ok) {
          const apiData = await res.json();
          if (Array.isArray(apiData) && apiData.length > 0) {
            data = apiData;
          }
        }
      } catch (e) {}

      // Fallback to Supabase JS Client
      if (!data) {
        const { data: dbData } = await supabase.from('properties').select('*').order('id', { ascending: false });
        data = dbData;
      }

      const deletedIds = getDeletedIds();
      const editedMap = getEditedMap();
      
      const fixUrl = (url) => formatImageUrl(url);

      let dbMapped = [];
      if (data && data.length > 0) {
        dbMapped = data.map(p => {
          const mainImg = fixUrl(p.image);
          const gal = Array.isArray(p.gallery) ? p.gallery.map(fixUrl) : (mainImg ? [mainImg] : []);
          return {
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
            image: mainImg,
            gallery: gal,
            description: p.description || '',
            agent: p.agent || {
              id: 1,
              name: 'Cristián Muñoz',
              role: 'Agente Inmobiliario Senior',
              phone: '+56 9 6192 4570',
              email: 'urbanos@urbanosinmobiliaria.cl',
              image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80'
            }
          };
        });
      }

      // Merge DB properties + initial catalog properties (applying any local edits)
      const dbIds = new Set(dbMapped.map(p => String(p.id)));
      
      const fallbackProps = PROPERTIES
        .filter(p => !dbIds.has(String(p.id)))
        .map(p => editedMap[String(p.id)] ? { ...p, ...editedMap[String(p.id)] } : p);

      const combined = [...dbMapped, ...fallbackProps]
        .filter(p => !deletedIds.has(String(p.id)));

      setProperties(combined);
      localStorage.setItem('urbanos_custom_properties', JSON.stringify(combined));
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
   * Save (Insert or Update) a property in state, localStorage, and Supabase DB
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

    // Store in edited properties map
    try {
      const editedMap = getEditedMap();
      editedMap[String(idToUse)] = updatedProp;
      localStorage.setItem('urbanos_edited_properties', JSON.stringify(editedMap));
    } catch (e) {}

    // Ensure removed from deleted set if re-saved
    try {
      const deletedIds = getDeletedIds();
      if (deletedIds.has(String(idToUse))) {
        deletedIds.delete(String(idToUse));
        localStorage.setItem('urbanos_deleted_properties', JSON.stringify(Array.from(deletedIds)));
      }
    } catch (e) {}

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

    // 2. Persist to Supabase Database via API Proxy or Supabase Client
    try {
      const dbPayload = {
        id: parseInt(idToUse, 10) || idToUse,
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
        image: cleanImageUrl(propData.image),
        gallery: Array.isArray(propData.gallery) ? propData.gallery.map(cleanImageUrl) : propData.gallery,
        description: propData.description
      };

      let savedOk = false;

      // Try Vercel Serverless API proxy first
      try {
        const res = await fetch('/api/properties', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(dbPayload)
        });
        if (res.ok) {
          savedOk = true;
        }
      } catch (e) {}

      // Fallback to Supabase client
      if (!savedOk) {
        await supabase.from('properties').upsert([dbPayload]);
      }

      await fetchPropertiesFromSupabase();
    } catch (err) {
      console.warn('Persist property error notice:', err);
    }
  };

  /**
   * Delete a property from state, localStorage, and Supabase DB
   */
  const deleteProperty = async (id) => {
    const strId = String(id);

    // Save to deleted IDs set so it never reappears
    try {
      const deletedIds = getDeletedIds();
      deletedIds.add(strId);
      localStorage.setItem('urbanos_deleted_properties', JSON.stringify(Array.from(deletedIds)));
    } catch (e) {}

    // 1. Delete locally immediately
    setProperties(prev => {
      const newList = prev.filter(p => String(p.id) !== strId);
      localStorage.setItem('urbanos_custom_properties', JSON.stringify(newList));
      return newList;
    });

    // 2. Delete from Supabase DB
    try {
      let deletedOk = false;
      try {
        const res = await fetch(`/api/properties?id=${id}`, { method: 'DELETE' });
        if (res.ok) deletedOk = true;
      } catch (e) {}

      if (!deletedOk) {
        await supabase.from('properties').delete().eq('id', id);
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
