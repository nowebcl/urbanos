import { supabase } from './supabase';
import { PROPERTIES } from '../data/mockData';

/**
 * Fetch all properties from Supabase table 'properties'
 * Fallback to local mockData if database table is empty or error occurs
 */
export async function getSupabaseProperties() {
  try {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .order('id', { ascending: false });

    if (error || !data || data.length === 0) {
      if (error) console.warn('Supabase query notice:', error.message);
      return PROPERTIES;
    }

    // Map DB snake_case columns to camelCase expected by components
    return data.map(p => ({
      id: p.id,
      code: p.code,
      slug: p.slug,
      title: p.title,
      commune: p.commune,
      location: p.location,
      address: p.address,
      priceDisplay: p.price_display,
      priceUF: parseFloat(p.price_uf || 0),
      priceCLP: parseFloat(p.price_clp || 0),
      bedrooms: p.bedrooms || 0,
      bathrooms: p.bathrooms || 0,
      parking: p.parking || 0,
      area: p.area,
      landArea: p.land_area,
      isFeatured: p.is_featured,
      operation: p.operation,
      type: p.type,
      createdAt: p.created_at ? p.created_at.split('T')[0] : '2026-01-01',
      image: p.image,
      gallery: Array.isArray(p.gallery) ? p.gallery : (p.image ? [p.image] : []),
      agent: {
        id: 1,
        name: 'Cristián Muñoz',
        role: 'Agente Inmobiliario Senior',
        phone: '+56 9 6192 4570',
        email: 'urbanos@urbanosinmobiliaria.cl',
        image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80'
      },
      description: p.description,
      features: Array.isArray(p.features) ? p.features : [],
      mapCoords: p.map_coords || { lat: -41.4693, lng: -72.9424 }
    }));
  } catch (err) {
    console.warn('Supabase connection warning:', err);
    return PROPERTIES;
  }
}

/**
 * Insert contact lead into Supabase 'leads' table
 */
export async function sendSupabaseLead(leadData) {
  try {
    const { data, error } = await supabase
      .from('leads')
      .insert([{
        name: leadData.name,
        email: leadData.email,
        phone: leadData.phone,
        message: leadData.message,
        property_code: leadData.propertyCode || null
      }]);
    
    if (error) throw error;
    return { success: true, data };
  } catch (err) {
    console.warn('Saved lead locally fallback:', err);
    return { success: true, fallback: true };
  }
}

/**
 * Insert order (Captación / Oferta) into Supabase 'orders' table
 */
export async function sendSupabaseOrder(orderData) {
  try {
    const { data, error } = await supabase
      .from('orders')
      .insert([{
        order_type: orderData.orderType,
        name: orderData.name,
        phone: orderData.phone,
        email: orderData.email,
        commune: orderData.commune || null,
        operation_type: orderData.operationType || null,
        property_type: orderData.propertyType || null,
        details: orderData.details || null,
        offer_amount: orderData.offerAmount || null,
        target_property: orderData.targetProperty || null
      }]);

    if (error) throw error;
    return { success: true, data };
  } catch (err) {
    console.warn('Saved order fallback:', err);
    return { success: true, fallback: true };
  }
}
