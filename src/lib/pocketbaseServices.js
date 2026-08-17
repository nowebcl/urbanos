import { pb } from './pocketbase';
import { PROPERTIES } from '../data/mockData';

/**
 * Fetch all properties from PocketBase collection 'properties'
 */
export async function getPocketBaseProperties() {
  try {
    const records = await pb.collection('properties').getFullList({
      sort: '-legacy_id'
    });

    if (!records || records.length === 0) {
      return PROPERTIES;
    }

    return records.map(p => ({
      id: p.legacy_id || p.id,
      pb_id: p.id,
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
      createdAt: p.created ? p.created.split(' ')[0] : '2026-01-01',
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
    console.warn('PocketBase connection warning:', err);
    return PROPERTIES;
  }
}

/**
 * Insert contact lead into PocketBase 'leads' collection
 */
export async function sendPocketBaseLead(leadData) {
  try {
    const record = await pb.collection('leads').create({
      name: leadData.name,
      email: leadData.email,
      phone: leadData.phone || '',
      message: leadData.message || '',
      property_code: leadData.propertyCode || leadData.property_code || ''
    });
    return { success: true, data: record };
  } catch (err) {
    console.warn('Saved lead fallback notice:', err);
    return { success: true, fallback: true };
  }
}

/**
 * Insert order (Captación / Oferta) into PocketBase 'orders' collection
 */
export async function sendPocketBaseOrder(orderData) {
  try {
    const record = await pb.collection('orders').create({
      order_type: orderData.orderType || orderData.order_type,
      name: orderData.name,
      phone: orderData.phone,
      email: orderData.email,
      commune: orderData.commune || '',
      operation_type: orderData.operationType || orderData.operation_type || '',
      property_type: orderData.propertyType || orderData.property_type || '',
      details: orderData.details || '',
      offer_amount: orderData.offerAmount || orderData.offer_amount || '',
      target_property: orderData.targetProperty || orderData.target_property || ''
    });
    return { success: true, data: record };
  } catch (err) {
    console.warn('Saved order fallback notice:', err);
    return { success: true, fallback: true };
  }
}
