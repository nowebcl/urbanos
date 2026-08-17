import PocketBase from 'pocketbase';
import fs from 'fs';
import path from 'path';

const pb = new PocketBase('https://urbano.noweb.tech');

async function downloadImage(url) {
  try {
    const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    if (!res.ok) return null;
    const arrayBuffer = await res.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const contentType = res.headers.get('content-type') || 'image/jpeg';
    return { buffer, contentType };
  } catch (e) {
    console.warn(`Error descargando ${url}:`, e.message);
    return null;
  }
}

async function testSingleProperty() {
  await pb.collection('_superusers').authWithPassword('contacto@urbanoinmobiliaria.cl', 'Urbano2026!');
  
  // Get first property
  const properties = await pb.collection('properties').getList(1, 1);
  const p = properties.items[0];
  console.log(`Probando propiedad: [${p.code}] ${p.title} (ID: ${p.id})`);
  console.log(`Imagen actual: ${p.image}`);

  const allUrls = [p.image, ...(Array.isArray(p.gallery) ? p.gallery : [])].filter(Boolean);
  const uniqueUrls = [...new Set(allUrls)];
  console.log(`Total URLs a descargar para esta propiedad: ${uniqueUrls.length}`);

  const formData = new FormData();

  let idx = 0;
  for (const u of uniqueUrls) {
    const downloaded = await downloadImage(u);
    if (downloaded) {
      const ext = downloaded.contentType.includes('webp') ? 'webp' : (downloaded.contentType.includes('png') ? 'png' : 'jpg');
      const filename = `photo_${idx}_${Date.now()}.${ext}`;
      const blob = new Blob([downloaded.buffer], { type: downloaded.contentType });
      formData.append('photos', blob, filename);
      idx++;
    }
  }

  if (idx > 0) {
    console.log(`Subiendo ${idx} fotos a PocketBase...`);
    const updatedRecord = await pb.collection('properties').update(p.id, formData);
    console.log('✅ Archivos subidos en PocketBase:', updatedRecord.photos);

    // Build the new URLs
    const baseUrl = `https://urbano.noweb.tech/api/files/properties/${updatedRecord.id}`;
    const newPhotosUrls = updatedRecord.photos.map(filename => `${baseUrl}/${filename}`);
    
    // Update image and gallery
    const mainImgUrl = newPhotosUrls[0] || '';
    await pb.collection('properties').update(p.id, {
      image: mainImgUrl,
      gallery: newPhotosUrls
    });

    console.log('✅ URLs actualizadas a PocketBase:');
    console.log('Nueva imagen principal:', mainImgUrl);
    console.log('Nueva galería:', newPhotosUrls);
  }
}

testSingleProperty().catch(console.error);
