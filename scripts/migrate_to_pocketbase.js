import PocketBase from 'pocketbase';
import fs from 'fs';

const PB_URL = 'https://urbano.noweb.tech';
const ADMIN_EMAIL = 'contacto@urbanoinmobiliaria.cl';
const ADMIN_PASS = 'Urbano2026!';

const pb = new PocketBase(PB_URL);

async function main() {
  console.log(`📡 Conectando a PocketBase en ${PB_URL}...`);
  try {
    await pb.collection('_superusers').authWithPassword(ADMIN_EMAIL, ADMIN_PASS);
    console.log('[OK] Autenticado como Superuser en PocketBase.');
  } catch (err) {
    console.error('[ERROR] Fallo al autenticar:', err.message);
    process.exit(1);
  }

  // 1. Colecciones necesarias
  const collectionsToCreate = [
    {
      name: 'properties',
      type: 'base',
      fields: [
        { name: 'legacy_id', type: 'number' },
        { name: 'code', type: 'text' },
        { name: 'slug', type: 'text' },
        { name: 'title', type: 'text', required: true },
        { name: 'commune', type: 'text' },
        { name: 'location', type: 'text' },
        { name: 'address', type: 'text' },
        { name: 'price_display', type: 'text' },
        { name: 'price_uf', type: 'number' },
        { name: 'price_clp', type: 'number' },
        { name: 'bedrooms', type: 'number' },
        { name: 'bathrooms', type: 'number' },
        { name: 'parking', type: 'number' },
        { name: 'area', type: 'text' },
        { name: 'land_area', type: 'text' },
        { name: 'is_featured', type: 'bool' },
        { name: 'operation', type: 'text' },
        { name: 'type', type: 'text' },
        { name: 'image', type: 'text' },
        { name: 'gallery', type: 'json' },
        { name: 'description', type: 'text' },
        { name: 'features', type: 'json' },
        { name: 'map_coords', type: 'json' }
      ],
      listRule: '',
      viewRule: '',
      createRule: '',
      updateRule: '',
      deleteRule: ''
    },
    {
      name: 'leads',
      type: 'base',
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'email', type: 'text', required: true },
        { name: 'phone', type: 'text' },
        { name: 'message', type: 'text' },
        { name: 'property_code', type: 'text' }
      ],
      listRule: '@request.auth.id != ""',
      viewRule: '@request.auth.id != ""',
      createRule: '',
      updateRule: '@request.auth.id != ""',
      deleteRule: '@request.auth.id != ""'
    },
    {
      name: 'orders',
      type: 'base',
      fields: [
        { name: 'order_type', type: 'text', required: true },
        { name: 'name', type: 'text', required: true },
        { name: 'phone', type: 'text', required: true },
        { name: 'email', type: 'text', required: true },
        { name: 'commune', type: 'text' },
        { name: 'operation_type', type: 'text' },
        { name: 'property_type', type: 'text' },
        { name: 'details', type: 'text' },
        { name: 'offer_amount', type: 'text' },
        { name: 'target_property', type: 'text' }
      ],
      listRule: '@request.auth.id != ""',
      viewRule: '@request.auth.id != ""',
      createRule: '',
      updateRule: '@request.auth.id != ""',
      deleteRule: '@request.auth.id != ""'
    },
    {
      name: 'site_content',
      type: 'base',
      fields: [
        { name: 'key', type: 'text', required: true },
        { name: 'content', type: 'json' }
      ],
      listRule: '',
      viewRule: '',
      createRule: '',
      updateRule: '',
      deleteRule: ''
    }
  ];

  console.log('\n--- Verificando / Creando Colecciones ---');
  for (const col of collectionsToCreate) {
    try {
      const existing = await pb.collections.getOne(col.name).catch(() => null);
      if (!existing) {
        console.log(`Creando colección '${col.name}'...`);
        await pb.collections.create(col);
        console.log(`[OK] Colección '${col.name}' creada.`);
      } else {
        console.log(`Colección '${col.name}' ya existe.`);
      }
    } catch (err) {
      console.error(`Error al procesar colección '${col.name}':`, err.message);
    }
  }

  // 2. Migrar Propiedades
  console.log('\n--- Migrando Propiedades ---');
  let propertiesToMigrate = [];
  if (fs.existsSync('scripts/supabase_dump_properties.json')) {
    const raw = fs.readFileSync('scripts/supabase_dump_properties.json', 'utf-8');
    propertiesToMigrate = JSON.parse(raw);
  }

  console.log(`Total propiedades a revisar: ${propertiesToMigrate.length}`);

  // Fetch existing in PB
  const existingPbProps = await pb.collection('properties').getFullList({
    fields: 'id,code,slug'
  });
  const existingCodes = new Set(existingPbProps.map(p => p.code).filter(Boolean));
  const existingSlugs = new Set(existingPbProps.map(p => p.slug).filter(Boolean));

  let countNew = 0;
  let countSkipped = 0;

  for (const p of propertiesToMigrate) {
    if (existingCodes.has(p.code) || existingSlugs.has(p.slug)) {
      countSkipped++;
      continue;
    }

    const payload = {
      legacy_id: p.id,
      code: p.code || '',
      slug: p.slug || '',
      title: p.title || 'Propiedad sin título',
      commune: p.commune || '',
      location: p.location || '',
      address: p.address || '',
      price_display: p.price_display || '',
      price_uf: Number(p.price_uf) || 0,
      price_clp: Number(p.price_clp) || 0,
      bedrooms: Number(p.bedrooms) || 0,
      bathrooms: Number(p.bathrooms) || 0,
      parking: Number(p.parking) || 0,
      area: String(p.area || ''),
      land_area: String(p.land_area || ''),
      is_featured: Boolean(p.is_featured),
      operation: p.operation || 'Venta',
      type: p.type || 'Casa',
      image: p.image || '',
      gallery: Array.isArray(p.gallery) ? p.gallery : [],
      description: p.description || '',
      features: Array.isArray(p.features) ? p.features : [],
      map_coords: p.map_coords || { lat: -41.4693, lng: -72.9424 }
    };

    try {
      await pb.collection('properties').create(payload);
      countNew++;
      if (countNew % 10 === 0 || countNew === propertiesToMigrate.length) {
        console.log(`  -> ${countNew} propiedades migradas...`);
      }
    } catch (err) {
      console.error(`  [ERROR] Al insertar propiedad ${p.code} (${p.title}):`, err.message);
    }
  }

  console.log(`\n[RESUMEN PROPIEDADES]`);
  console.log(`  Insertadas: ${countNew}`);
  console.log(`  Omitidas (ya existían): ${countSkipped}`);
  console.log(`  Total en PocketBase: ${existingPbProps.length + countNew}`);

  // 3. Migrar Agentes
  console.log('\n--- Migrando Agentes ---');
  const agents = [
    {
      name: 'Cristián Muñoz',
      role: 'Agente Inmobiliario Senior',
      phone: '+56 9 6192 4570',
      email: 'urbanos@urbanosinmobiliaria.cl',
      image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80'
    },
    {
      name: 'Felipe Loyola',
      role: 'Director Comercial & Broker',
      phone: '+56 9 9593 0321',
      email: 'contacto@urbanosgestion.cl',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80'
    }
  ];

  const existingAgents = await pb.collection('agents').getFullList();
  const existingAgentNames = new Set(existingAgents.map(a => a.name));

  for (const ag of agents) {
    if (!existingAgentNames.has(ag.name)) {
      await pb.collection('agents').create(ag);
      console.log(`  [OK] Agente '${ag.name}' insertado.`);
    } else {
      console.log(`  Agente '${ag.name}' ya existe.`);
    }
  }

  console.log('\n[TODO COMPLETO] Base de datos en PocketBase lista.');
}

main().catch(console.error);
