import PocketBase from 'pocketbase';
import fs from 'fs';

const PB_URL = 'https://urbano.noweb.tech';
const ADMIN_EMAIL = 'contacto@urbanoinmobiliaria.cl';
const ADMIN_PASS = 'Urbano2026!';

const pb = new PocketBase(PB_URL);

async function parseSqlAndInsertMissing() {
  await pb.collection('_superusers').authWithPassword(ADMIN_EMAIL, ADMIN_PASS);
  console.log('Autenticado en PocketBase.');

  const existing = await pb.collection('properties').getFullList({ fields: 'id,code,slug' });
  const existingSlugs = new Set(existing.map(p => p.slug).filter(Boolean));
  const existingCodes = new Set(existing.map(p => p.code).filter(Boolean));
  console.log(`Propiedades actuales en PocketBase: ${existing.length}`);

  const sql = fs.readFileSync('supabase_setup.sql', 'utf-8');
  
  // Find INSERT INTO public.properties
  const startIdx = sql.indexOf('INSERT INTO public.properties');
  if (startIdx === -1) return;

  const valuesPart = sql.substring(startIdx);
  // Match tuples like (id, 'code', 'slug', ...)
  // Regex to extract tuples
  const regex = /\((\d+),\s*'([^']+)',\s*'([^']+)',\s*'([^']+)',\s*'([^']+)',\s*'([^']+)',\s*('[^']*'|NULL),\s*'([^']+)',\s*([0-9.]+),\s*([0-9.]+),\s*(\d+),\s*(\d+),\s*(\d+),\s*'([^']*)',\s*'([^']*)',\s*(TRUE|FALSE),\s*'([^']+)',\s*'([^']+)',\s*'([^']*)',\s*'(\[.*?\])'::jsonb,\s*'([^']*)',\s*'(\[.*?\])'::jsonb,\s*'(\{.*?\})'::jsonb\)/g;

  let match;
  let added = 0;

  while ((match = regex.exec(valuesPart)) !== null) {
    const [
      _,
      idStr, code, slug, title, commune, location, addressRaw,
      price_display, price_uf, price_clp, bedrooms, bathrooms, parking,
      area, land_area, is_featured, operation, type, image, galleryJson,
      description, featuresJson, mapCoordsJson
    ] = match;

    if (existingSlugs.has(slug) || existingCodes.has(code)) {
      continue;
    }

    const address = addressRaw === 'NULL' ? '' : addressRaw.replace(/^'|'$/g, '');
    let gallery = [];
    let features = [];
    let mapCoords = { lat: -41.4693, lng: -72.9424 };

    try { gallery = JSON.parse(galleryJson); } catch (e) {}
    try { features = JSON.parse(featuresJson); } catch (e) {}
    try { mapCoords = JSON.parse(mapCoordsJson); } catch (e) {}

    const payload = {
      legacy_id: parseInt(idStr, 10),
      code,
      slug,
      title,
      commune,
      location,
      address,
      price_display,
      price_uf: parseFloat(price_uf) || 0,
      price_clp: parseFloat(price_clp) || 0,
      bedrooms: parseInt(bedrooms, 10) || 0,
      bathrooms: parseInt(bathrooms, 10) || 0,
      parking: parseInt(parking, 10) || 0,
      area,
      land_area,
      is_featured: is_featured === 'TRUE',
      operation,
      type,
      image,
      gallery,
      description,
      features,
      map_coords: mapCoords
    };

    try {
      await pb.collection('properties').create(payload);
      existingSlugs.add(slug);
      existingCodes.add(code);
      added++;
    } catch (e) {
      console.error(`Error agregando ${code}:`, e.message);
    }
  }

  const finalTotal = await pb.collection('properties').getFullList({ fields: 'id' });
  console.log(`✅ Agregadas ${added} propiedades adicionales desde SQL.`);
  console.log(`🎯 Total final de propiedades en PocketBase: ${finalTotal.length}`);
}

parseSqlAndInsertMissing().catch(console.error);
