import PocketBase from 'pocketbase';

const OLD_PB_URL = 'https://urbano.noweb.tech';
const OLD_ADMIN_EMAIL = 'contacto@urbanoinmobiliaria.cl';
const OLD_ADMIN_PASS = 'Urbano2026!';

const NEW_PB_URL = 'https://urbanospb.noweb.cl';
const NEW_ADMIN_EMAIL = 'contacto@urbanoinmobiliaria.cl';
const NEW_ADMIN_PASS = 'ServerPro2026!';

const pbOld = new PocketBase(OLD_PB_URL);
pbOld.autoCancellation(false);

const pbNew = new PocketBase(NEW_PB_URL);
pbNew.autoCancellation(false);

function isImageBuffer(buf) {
  if (!buf || buf.length < 4) return false;
  if (buf[0] === 0xFF && buf[1] === 0xD8 && buf[2] === 0xFF) return 'image/jpeg';
  if (buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4E && buf[3] === 0x47) return 'image/png';
  if (buf.toString('ascii', 0, 4) === 'RIFF' && buf.toString('ascii', 8, 12) === 'WEBP') return 'image/webp';
  if (buf.toString('ascii', 0, 3) === 'GIF') return 'image/gif';
  return false;
}

async function fetchBufferWithRetry(url, maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 15000);
      const res = await fetch(url, {
        signal: controller.signal,
        headers: { 'User-Agent': 'Mozilla/5.0 MigrationBot' }
      });
      clearTimeout(timeout);
      if (!res.ok) {
        if (attempt === maxRetries) return null;
        await new Promise(r => setTimeout(r, 1000 * attempt));
        continue;
      }
      const arrayBuf = await res.arrayBuffer();
      const buf = Buffer.from(arrayBuf);
      const mime = isImageBuffer(buf) || 'image/jpeg';
      return { buffer: buf, mime };
    } catch (err) {
      if (attempt === maxRetries) return null;
      await new Promise(r => setTimeout(r, 1000 * attempt));
    }
  }
  return null;
}

async function authenticate() {
  console.log('📡 [1/6] Autenticando en PocketBase antiguo...');
  try {
    await pbOld.collection('_superusers').authWithPassword(OLD_ADMIN_EMAIL, OLD_ADMIN_PASS);
  } catch {
    await pbOld.admins.authWithPassword(OLD_ADMIN_EMAIL, OLD_ADMIN_PASS);
  }
  console.log('  ✅ Conectado a PB Antiguo:', OLD_PB_URL);

  console.log('📡 [2/6] Autenticando en nuevo PocketBase...');
  try {
    await pbNew.collection('_superusers').authWithPassword(NEW_ADMIN_EMAIL, NEW_ADMIN_PASS);
  } catch {
    await pbNew.admins.authWithPassword(NEW_ADMIN_EMAIL, NEW_ADMIN_PASS);
  }
  console.log('  ✅ Conectado a PB Nuevo:', NEW_PB_URL);
}

async function setupCollections() {
  console.log('\n📦 [3/6] Configurando colecciones y esquemas en nuevo PB...');
  const collectionsToSync = ['agents', 'leads', 'orders', 'site_content', 'properties'];

  const existingNewCols = await pbNew.collections.getFullList();
  const existingNewMap = new Map(existingNewCols.map(c => [c.name, c]));

  for (const colName of collectionsToSync) {
    try {
      const oldCol = await pbOld.collections.getOne(colName);
      if (!existingNewMap.has(colName)) {
        console.log(`  Creando colección '${colName}'...`);
        const payload = {
          name: oldCol.name,
          type: oldCol.type,
          listRule: oldCol.listRule,
          viewRule: oldCol.viewRule,
          createRule: oldCol.createRule,
          updateRule: oldCol.updateRule,
          deleteRule: oldCol.deleteRule,
          fields: oldCol.fields.filter(f => !f.system)
        };
        const created = await pbNew.collections.create(payload);
        console.log(`  ✅ Colección '${colName}' creada (id: ${created.id}).`);
      } else {
        console.log(`  ℹ️ Colección '${colName}' ya existe en destino.`);
      }
    } catch (err) {
      console.error(`  ❌ Error al procesar colección '${colName}':`, err.message);
    }
  }
}

async function migrateUsers() {
  console.log('\n👤 [4/6] Migrando cuentas de administradores a la colección users...');
  const usersToCreate = [
    {
      email: 'contacto@urbanoinmobiliaria.cl',
      password: 'ServerPro2026!',
      passwordConfirm: 'ServerPro2026!',
      name: 'Admin Urbano'
    },
    {
      email: 'admin@urbanosinmobiliaria.cl',
      password: 'Urbanos2026!*',
      passwordConfirm: 'Urbanos2026!*',
      name: 'Admin Urbanos'
    },
    {
      email: 'admin@urbanoinmobiliaria.cl',
      password: 'ServerPro2026!',
      passwordConfirm: 'ServerPro2026!',
      name: 'Admin Urbanos Alias'
    }
  ];

  for (const u of usersToCreate) {
    try {
      const existing = await pbNew.collection('users').getFirstListItem(`email="${u.email}"`).catch(() => null);
      if (!existing) {
        await pbNew.collection('users').create(u);
        console.log(`  ✅ Usuario '${u.email}' creado.`);
      } else {
        console.log(`  ℹ️ Usuario '${u.email}' ya existe.`);
      }
    } catch (err) {
      console.error(`  ❌ Error al crear usuario '${u.email}':`, err.message);
    }
  }
}

async function migrateBaseCollections() {
  console.log('\n👥 [5/6] Migrando Agentes, Leads, Orders y Site Content...');

  // 1. Agents
  try {
    const oldAgents = await pbOld.collection('agents').getFullList();
    const newAgents = await pbNew.collection('agents').getFullList();
    const existingAgentIds = new Set(newAgents.map(a => a.id));

    for (const ag of oldAgents) {
      if (!existingAgentIds.has(ag.id)) {
        await pbNew.collection('agents').create({
          id: ag.id,
          name: ag.name,
          role: ag.role || '',
          phone: ag.phone || '',
          email: ag.email || '',
          image: ag.image || ''
        });
        console.log(`  ✅ Agente migrado: ${ag.name} (${ag.id})`);
      } else {
        console.log(`  ℹ️ Agente ya existe: ${ag.name} (${ag.id})`);
      }
    }
  } catch (err) {
    console.error('  ❌ Error migrando agents:', err.message);
  }

  // 2. Leads
  try {
    const oldLeads = await pbOld.collection('leads').getFullList();
    const newLeads = await pbNew.collection('leads').getFullList();
    const existingLeadIds = new Set(newLeads.map(l => l.id));

    for (const ld of oldLeads) {
      if (!existingLeadIds.has(ld.id)) {
        await pbNew.collection('leads').create({
          id: ld.id,
          name: ld.name,
          email: ld.email,
          phone: ld.phone || '',
          message: ld.message || '',
          property_code: ld.property_code || ''
        });
        console.log(`  ✅ Lead migrado: ${ld.name} (${ld.email})`);
      } else {
        console.log(`  ℹ️ Lead ya existe: ${ld.name} (${ld.email})`);
      }
    }
  } catch (err) {
    console.error('  ❌ Error migrando leads:', err.message);
  }

  // 3. Site content
  try {
    const oldContent = await pbOld.collection('site_content').getFullList();
    const newContent = await pbNew.collection('site_content').getFullList();
    const existingContentIds = new Set(newContent.map(c => c.id));

    for (const item of oldContent) {
      if (!existingContentIds.has(item.id)) {
        await pbNew.collection('site_content').create({
          id: item.id,
          key: item.key,
          content: item.content
        });
        console.log(`  ✅ Site content migrado: ${item.key}`);
      }
    }
  } catch (err) {
    console.error('  ❌ Error migrando site_content:', err.message);
  }
}

async function migrateProperties() {
  console.log('\n🏡 [6/6] Migrando 94 Propiedades y descargando/subiendo fotos físicas...');

  const oldProperties = await pbOld.collection('properties').getFullList({
    sort: '-legacy_id'
  });
  console.log(`  Total propiedades encontradas en origen: ${oldProperties.length}`);

  const existingNewProps = await pbNew.collection('properties').getFullList({
    fields: 'id,code,slug,photos'
  });
  const existingPropMap = new Map(existingNewProps.map(p => [p.id, p]));

  let createdCount = 0;
  let skippedCount = 0;
  let photosTransferred = 0;

  for (let i = 0; i < oldProperties.length; i++) {
    const p = oldProperties[i];
    const progress = `[${i + 1}/${oldProperties.length}]`;

    // If property already exists and has photos uploaded, skip
    if (existingPropMap.has(p.id)) {
      const existing = existingPropMap.get(p.id);
      if (existing.photos && existing.photos.length > 0) {
        skippedCount++;
        continue;
      }
    }

    console.log(`\n  ${progress} Procesando ${p.code || p.id} - "${p.title.substring(0, 40)}"...`);

    // Download photos from old PocketBase
    const photoFiles = p.photos || [];
    const downloadedBlobs = [];

    for (const photoFn of photoFiles) {
      const oldPhotoUrl = `${OLD_PB_URL}/api/files/properties/${p.id}/${photoFn}`;
      const img = await fetchBufferWithRetry(oldPhotoUrl);
      if (img) {
        let ext = 'webp';
        if (img.mime === 'image/jpeg') ext = 'jpg';
        if (img.mime === 'image/png') ext = 'png';
        const fn = photoFn.includes('.') ? photoFn : `photo_${Date.now()}.${ext}`;
        const blob = new Blob([img.buffer], { type: img.mime });
        downloadedBlobs.push({ blob, filename: fn });
      } else {
        console.warn(`    ⚠️ No se pudo descargar foto: ${oldPhotoUrl}`);
      }
    }

    // Build FormData
    const formData = new FormData();
    formData.append('id', p.id);
    if (p.legacy_id !== undefined && p.legacy_id !== null) formData.append('legacy_id', String(p.legacy_id));
    formData.append('code', p.code || '');
    formData.append('slug', p.slug || '');
    formData.append('title', p.title || 'Propiedad');
    formData.append('commune', p.commune || '');
    formData.append('location', p.location || '');
    formData.append('address', p.address || '');
    formData.append('price_display', p.price_display || '');
    formData.append('price_uf', String(p.price_uf || 0));
    formData.append('price_clp', String(p.price_clp || 0));
    formData.append('bedrooms', String(p.bedrooms || 0));
    formData.append('bathrooms', String(p.bathrooms || 0));
    formData.append('parking', String(p.parking || 0));
    formData.append('area', String(p.area || ''));
    formData.append('land_area', String(p.land_area || ''));
    formData.append('is_featured', String(Boolean(p.is_featured)));
    formData.append('operation', p.operation || 'Venta');
    formData.append('type', p.type || 'Casa');
    formData.append('description', p.description || '');

    // JSON fields
    formData.append('features', JSON.stringify(Array.isArray(p.features) ? p.features : []));
    formData.append('map_coords', JSON.stringify(p.map_coords || { lat: -41.4693, lng: -72.9424 }));

    // Append photo files
    for (const item of downloadedBlobs) {
      formData.append('photos', item.blob, item.filename);
    }

    try {
      let savedRecord;
      if (existingPropMap.has(p.id)) {
        savedRecord = await pbNew.collection('properties').update(p.id, formData);
      } else {
        savedRecord = await pbNew.collection('properties').create(formData);
      }

      // Now update image and gallery URLs pointing to the new domain
      const newUploadedFiles = savedRecord.photos || [];
      photosTransferred += newUploadedFiles.length;

      let newMainImage = '';
      let newGallery = [];

      if (newUploadedFiles.length > 0) {
        const baseUrl = `${NEW_PB_URL}/api/files/properties/${savedRecord.id}`;
        newGallery = newUploadedFiles.map(fn => `${baseUrl}/${fn}`);
        newMainImage = newGallery[0] || '';
      } else if (p.image) {
        // If had external fallback URL
        newMainImage = p.image.replace(OLD_PB_URL, NEW_PB_URL);
        newGallery = (Array.isArray(p.gallery) ? p.gallery : []).map(u => u.replace(OLD_PB_URL, NEW_PB_URL));
      }

      await pbNew.collection('properties').update(savedRecord.id, {
        image: newMainImage,
        gallery: newGallery
      });

      createdCount++;
      console.log(`    ✅ Guardada propiedad ${p.code} con ${newUploadedFiles.length} fotos.`);
    } catch (err) {
      console.error(`    ❌ Error guardando propiedad ${p.code} (${p.id}):`, err.message);
      if (err.data) console.error('       Detalle:', JSON.stringify(err.data));
    }
  }

  console.log('\n=============================================');
  console.log('🎉 RESUMEN DE MIGRACIÓN DE PROPIEDADES');
  console.log(`  Propiedades procesadas e insertadas: ${createdCount}`);
  console.log(`  Propiedades omitidas (ya existían con fotos): ${skippedCount}`);
  console.log(`  Total fotos físicas transferidas: ${photosTransferred}`);
  console.log('=============================================');
}

async function run() {
  const startTime = Date.now();
  try {
    await authenticate();
    await setupCollections();
    await migrateUsers();
    await migrateBaseCollections();
    await migrateProperties();

    const elapsed = Math.round((Date.now() - startTime) / 1000);
    console.log(`\n🚀 ¡MIGRACIÓN COMPLETADA EXITOSAMENTE en ${elapsed} segundos!`);
  } catch (err) {
    console.error('\n❌ ERROR FATAL EN MIGRACIÓN:', err);
    process.exit(1);
  }
}

run();
