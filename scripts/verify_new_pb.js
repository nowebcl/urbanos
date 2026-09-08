import PocketBase from 'pocketbase';

async function verify() {
  console.log('--- VERIFICANDO NUEVO POCKETBASE (https://urbanospb.noweb.cl) ---');
  const pb = new PocketBase('https://urbanospb.noweb.cl');
  pb.autoCancellation(false);

  // 1. Test anonymous public fetch
  console.log('\n1. Test lectura pública (sin autenticación):');
  const propsPublic = await pb.collection('properties').getList(1, 5);
  console.log('   Total propiedades públicas:', propsPublic.totalItems);
  console.log('   Primera propiedad:', {
    code: propsPublic.items[0].code,
    title: propsPublic.items[0].title,
    image: propsPublic.items[0].image,
    photos_count: propsPublic.items[0].photos ? propsPublic.items[0].photos.length : 0
  });

  const agentsPublic = await pb.collection('agents').getFullList();
  console.log('   Total agentes públicos:', agentsPublic.length);

  // 2. Test Superuser authentication
  console.log('\n2. Test autenticación Superuser:');
  await pb.collection('_superusers').authWithPassword('contacto@urbanoinmobiliaria.cl', 'ServerPro2026!');
  console.log('   Superuser auth: OK');

  const cols = await pb.collections.getFullList();
  for (const c of cols) {
    if (c.name.startsWith('_')) continue;
    const cnt = await pb.collection(c.name).getList(1, 1).then(r => r.totalItems).catch(e => e.message);
    console.log(`   - Colección ${c.name}: ${cnt} registros`);
  }

  // 3. Test HTTP 200 on an uploaded photo
  console.log('\n3. Test integridad de imagen en CDN:');
  const testImgUrl = propsPublic.items[0].image;
  console.log('   Probando URL:', testImgUrl);
  const res = await fetch(testImgUrl, { method: 'HEAD' });
  console.log('   Respuesta HTTP:', res.status, res.statusText, 'Content-Type:', res.headers.get('content-type'), 'Content-Length:', res.headers.get('content-length'));

  // 4. Test users collection
  console.log('\n4. Test colección users:');
  const users = await pb.collection('users').getFullList();
  console.log('   Total usuarios en users:', users.length, users.map(u => u.email));
}

verify().catch(console.error);
