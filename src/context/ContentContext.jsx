import React, { createContext, useContext, useState, useEffect } from 'react';
import { pb } from '../lib/pocketbase';
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
      if (pb.authStore.isValid) {
        return { user: pb.authStore.model, token: pb.authStore.token };
      }
      const saved = localStorage.getItem('urbanos_admin_session');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });
  
  const [isEditMode, setIsEditMode] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContentFromPocketBase();
    fetchPropertiesFromPocketBase();

    // Listen to PocketBase auth state changes
    const unsubscribeAuth = pb.authStore.onChange((token, model) => {
      if (token && model) {
        const newSession = { user: model, token };
        setSession(newSession);
        localStorage.setItem('urbanos_admin_session', JSON.stringify(newSession));
      } else {
        setSession(null);
        localStorage.removeItem('urbanos_admin_session');
      }
    });

    // Realtime subscription for properties collection
    let unsubscribeProps = null;
    try {
      pb.collection('properties').subscribe('*', () => {
        fetchPropertiesFromPocketBase();
      }).then(unsub => {
        unsubscribeProps = unsub;
      }).catch(e => {
        console.warn('Realtime PocketBase subscribe notice:', e);
      });
    } catch (e) {
      console.warn('PocketBase realtime error:', e);
    }

    return () => {
      if (typeof unsubscribeAuth === 'function') unsubscribeAuth();
      if (typeof unsubscribeProps === 'function') unsubscribeProps();
      else if (unsubscribeProps) pb.collection('properties').unsubscribe('*').catch(() => {});
    };
  }, []);

  const fetchContentFromPocketBase = async () => {
    try {
      const records = await pb.collection('site_content').getFullList();
      if (records && records.length > 0) {
        const dbContent = { ...DEFAULT_CONTENT };
        records.forEach(item => {
          dbContent[item.key] = item.content;
        });
        setContent(dbContent);
      }
    } catch (err) {
      console.warn('PocketBase site_content notice:', err.message);
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

  const fetchPropertiesFromPocketBase = async () => {
    try {
      let records = [];
      try {
        records = await pb.collection('properties').getFullList({
          sort: '-legacy_id'
        });
      } catch (e) {
        console.warn('Error fetching from PocketBase:', e.message);
      }

      const deletedIds = getDeletedIds();
      const editedMap = getEditedMap();
      const fixUrl = (url) => formatImageUrl(url);

      let dbMapped = [];
      if (records && records.length > 0) {
        dbMapped = records.map(p => {
          const mainImg = fixUrl(p.image);
          const gal = Array.isArray(p.gallery) ? p.gallery.map(fixUrl) : (mainImg ? [mainImg] : []);
          return {
            id: p.legacy_id || p.id,
            pb_id: p.id,
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
            createdAt: p.created ? p.created.split(' ')[0] : '2026-01-01',
            image: mainImg,
            gallery: gal,
            description: p.description || '',
            features: Array.isArray(p.features) ? p.features : [],
            mapCoords: p.map_coords || { lat: -41.4693, lng: -72.9424 },
            agent: {
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

      if (dbMapped.length > 0) {
        const filtered = dbMapped.filter(p => !deletedIds.has(String(p.id)) && !deletedIds.has(String(p.pb_id)));
        setProperties(filtered);
        localStorage.setItem('urbanos_custom_properties', JSON.stringify(filtered));
      } else {
        // Fallback to local properties if offline
        const fallbackProps = PROPERTIES
          .map(p => editedMap[String(p.id)] ? { ...p, ...editedMap[String(p.id)] } : p)
          .filter(p => !deletedIds.has(String(p.id)));
        setProperties(fallbackProps);
      }
    } catch (err) {
      console.warn('PocketBase fetch properties error:', err);
    }
  };

  const updateContentKey = async (key, newValue) => {
    setContent(prev => ({ ...prev, [key]: newValue }));

    try {
      const existing = await pb.collection('site_content').getFirstListItem(`key="${key}"`).catch(() => null);
      if (existing) {
        await pb.collection('site_content').update(existing.id, { content: newValue });
      } else {
        await pb.collection('site_content').create({ key, content: newValue });
      }
    } catch (err) {
      console.error('Error saving site content to PocketBase:', err);
    }
  };

  /**
   * Save (Insert or Update) a property in state, localStorage, and PocketBase DB
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
      const exists = prev.some(p => String(p.id) === String(idToUse) || String(p.pb_id) === String(idToUse));
      let newList;
      if (exists) {
        newList = prev.map(p => (String(p.id) === String(idToUse) || String(p.pb_id) === String(idToUse)) ? { ...p, ...updatedProp } : p);
      } else {
        newList = [updatedProp, ...prev];
      }
      localStorage.setItem('urbanos_custom_properties', JSON.stringify(newList));
      return newList;
    });

    // 2. Persist to PocketBase DB
    try {
      const pbPayload = {
        legacy_id: parseInt(idToUse, 10) || 0,
        code: propData.code || '',
        slug: propData.slug || '',
        title: propData.title,
        commune: propData.commune || '',
        location: propData.location || propData.address || '',
        address: propData.address || propData.location || '',
        price_display: propData.priceDisplay || propData.price_display || '',
        price_uf: propData.priceUF ?? propData.price_uf ?? 0,
        price_clp: propData.priceCLP ?? propData.price_clp ?? 0,
        bedrooms: parseInt(propData.bedrooms, 10) || 0,
        bathrooms: parseInt(propData.bathrooms, 10) || 0,
        parking: parseInt(propData.parking, 10) || 2,
        area: String(propData.area || ''),
        land_area: String(propData.landArea || propData.land_area || ''),
        is_featured: propData.isFeatured ?? propData.is_featured ?? true,
        operation: propData.operation || 'Venta',
        type: propData.type || 'Casa',
        image: cleanImageUrl(propData.image),
        gallery: Array.isArray(propData.gallery) ? propData.gallery.map(cleanImageUrl) : propData.gallery,
        description: propData.description || '',
        features: Array.isArray(propData.features) ? propData.features : [],
        map_coords: propData.map_coords || propData.mapCoords || { lat: -41.4693, lng: -72.9424 }
      };

      // Search if record already exists in PocketBase
      let existingRecord = null;
      if (propData.pb_id) {
        existingRecord = await pb.collection('properties').getOne(propData.pb_id).catch(() => null);
      }
      if (!existingRecord && propData.code) {
        existingRecord = await pb.collection('properties').getFirstListItem(`code="${propData.code}"`).catch(() => null);
      }
      if (!existingRecord && propData.slug) {
        existingRecord = await pb.collection('properties').getFirstListItem(`slug="${propData.slug}"`).catch(() => null);
      }
      if (!existingRecord && parseInt(idToUse, 10)) {
        existingRecord = await pb.collection('properties').getFirstListItem(`legacy_id=${parseInt(idToUse, 10)}`).catch(() => null);
      }

      if (existingRecord) {
        await pb.collection('properties').update(existingRecord.id, pbPayload);
      } else {
        await pb.collection('properties').create(pbPayload);
      }

      await fetchPropertiesFromPocketBase();
    } catch (err) {
      console.warn('Persist property PocketBase error notice:', err);
    }
  };

  /**
   * Delete a property from state, localStorage, and PocketBase DB
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
      const newList = prev.filter(p => String(p.id) !== strId && String(p.pb_id) !== strId);
      localStorage.setItem('urbanos_custom_properties', JSON.stringify(newList));
      return newList;
    });

    // 2. Delete from PocketBase DB
    try {
      let recordToDelete = null;
      try {
        recordToDelete = await pb.collection('properties').getOne(id);
      } catch (e) {
        if (parseInt(id, 10)) {
          recordToDelete = await pb.collection('properties').getFirstListItem(`legacy_id=${parseInt(id, 10)}`).catch(() => null);
        }
      }

      if (recordToDelete) {
        await pb.collection('properties').delete(recordToDelete.id);
      }
    } catch (err) {
      console.warn('PocketBase delete property error:', err);
    }
  };

  const setAdminSession = (newSession) => {
    setSession(newSession);
    if (newSession) {
      localStorage.setItem('urbanos_admin_session', JSON.stringify(newSession));
    } else {
      localStorage.removeItem('urbanos_admin_session');
      pb.authStore.clear();
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
        refetchProperties: fetchPropertiesFromPocketBase,
        session,
        setSession: setAdminSession,
        isEditMode,
        setIsEditMode,
        loading,
        refetchContent: fetchContentFromPocketBase
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
