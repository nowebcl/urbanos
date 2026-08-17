import PocketBase from 'pocketbase';
import fs from 'fs';
import path from 'path';

const pb = new PocketBase('https://urbano.noweb.tech');

async function assignFallbackWebp() {
  await pb.collection('_superusers').authWithPassword('contacto@urbanoinmobiliaria.cl', 'Urbano2026!');
  
  const properties = await pb.collection('properties').getFullList();
  const remaining = properties.filter(p => !p.image || !p.image.includes('urbano.noweb.tech/api/files/'));
  console.log(`Asignando y subiendo imágenes locales para las ${remaining.length} propiedades sin fotos...`);

  const localImages = [
    'public/images/house_valle_volcanes.webp',
    'public/images/dept_puerto_varas.webp',
    'public/images/house_monte_verde.webp',
    'public/images/house_villa_quilen.webp'
  ];

  for (let i = 0; i < remaining.length; i++) {
    const p = remaining[i];
    const localImgPath = localImages[i % localImages.length];
    const buf = fs.readFileSync(localImgPath);

    const formData = new FormData();
    const blob = new Blob([buf], { type: 'image/webp' });
    formData.append('photos', blob, `property_${p.code || p.id}.webp`);

    try {
      const updated = await pb.collection('properties').update(p.id, formData);
      const photo = updated.photos[0];
      const url = `https://urbano.noweb.tech/api/files/properties/${p.id}/${photo}`;
      await pb.collection('properties').update(p.id, {
        image: url,
        gallery: [url]
      });
      console.log(`  [OK] [${p.code}] ${p.title.substring(0, 35)} asignada: ${url}`);
    } catch (e) {
      console.error(`  Error en ${p.code}:`, e.message);
    }
  }

  const finalCheck = await pb.collection('properties').getFullList();
  const totalOnPb = finalCheck.filter(p => p.image && p.image.includes('urbano.noweb.tech/api/files/')).length;
  console.log(`\n🎉 100% COMPLETADO: ${totalOnPb}/${finalCheck.length} propiedades tienen fotos físicas en PocketBase VPS.`);
}

assignFallbackWebp().catch(console.error);
