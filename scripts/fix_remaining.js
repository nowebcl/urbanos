import PocketBase from 'pocketbase';

const pb = new PocketBase('https://urbano.noweb.tech');

async function fixRemaining20() {
  await pb.collection('_superusers').authWithPassword('contacto@urbanoinmobiliaria.cl', 'Urbano2026!');
  
  const properties = await pb.collection('properties').getFullList();
  const remaining = properties.filter(p => !p.image || !p.image.includes('urbano.noweb.tech/api/files/'));
  console.log(`Procesando las ${remaining.length} restantes...`);

  for (const p of remaining) {
    console.log(`\nDescargando fotos para [${p.code}] ${p.title.substring(0, 40)}...`);
    const allUrls = [p.image, ...(Array.isArray(p.gallery) ? p.gallery : [])].filter(Boolean);
    const unique = [...new Set(allUrls)];

    const formData = new FormData();
    let count = 0;

    for (const u of unique) {
      try {
        const res = await fetch(u, { headers: { 'User-Agent': 'Mozilla/5.0' } });
        if (res.ok) {
          const ct = res.headers.get('content-type') || '';
          if (!ct.includes('text/html')) {
            const buf = Buffer.from(await res.arrayBuffer());
            const blob = new Blob([buf], { type: ct || 'image/jpeg' });
            formData.append('photos', blob, `img_${count}_${Date.now()}.jpg`);
            count++;
          }
        }
      } catch (e) {}
    }

    if (count > 0) {
      try {
        const updated = await pb.collection('properties').update(p.id, formData);
        const photos = updated.photos || [];
        if (photos.length > 0) {
          const baseUrl = `https://urbano.noweb.tech/api/files/properties/${p.id}`;
          const newGallery = photos.map(fn => `${baseUrl}/${fn}`);
          await pb.collection('properties').update(p.id, {
            image: newGallery[0],
            gallery: newGallery
          });
          console.log(`  -> [OK] ${photos.length} fotos guardadas en VPS.`);
        }
      } catch (err) {
        console.error(`  -> Error guardando: ${err.message}`);
      }
    } else {
      console.log(`  -> No se pudieron descargar imágenes de los links originales.`);
    }
  }

  const finalCheck = await pb.collection('properties').getFullList();
  const onPb = finalCheck.filter(p => p.image && p.image.includes('urbano.noweb.tech/api/files/')).length;
  console.log(`\n🎯 RESULTADO FINAL: ${onPb}/${finalCheck.length} propiedades con fotos alojadas 100% en PocketBase VPS.`);
}

fixRemaining20().catch(console.error);
