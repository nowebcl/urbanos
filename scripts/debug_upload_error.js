import PocketBase from 'pocketbase';

const pb = new PocketBase('https://urbano.noweb.tech');

async function debugSingleError() {
  await pb.collection('_superusers').authWithPassword('contacto@urbanoinmobiliaria.cl', 'Urbano2026!');
  
  const p = await pb.collection('properties').getFirstListItem('code="URB-4364"');
  console.log(`Propiedad [${p.code}]:`, p.title);
  console.log('Main image:', p.image);
  console.log('Gallery:', p.gallery);

  const allUrls = [p.image, ...(Array.isArray(p.gallery) ? p.gallery : [])].filter(Boolean);
  const uniqueUrls = [...new Set(allUrls)];

  const formData = new FormData();
  let idx = 0;
  for (const u of uniqueUrls) {
    try {
      const res = await fetch(u);
      const ct = res.headers.get('content-type');
      console.log(`URL ${idx}: HTTP ${res.status} [${ct}] - ${u}`);
      const buf = Buffer.from(await res.arrayBuffer());
      const blob = new Blob([buf], { type: ct || 'image/jpeg' });
      formData.append('photos', blob, `photo_${idx}.jpg`);
      idx++;
    } catch (e) {
      console.log('Error fetch:', e.message);
    }
  }

  try {
    const updated = await pb.collection('properties').update(p.id, formData);
    console.log('Actualizado:', updated.photos);
  } catch (err) {
    console.error('Error detallado de PocketBase:', JSON.stringify(err.response, null, 2));
  }
}

debugSingleError();
