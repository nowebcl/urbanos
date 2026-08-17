import PocketBase from 'pocketbase';

const PB_URL = 'https://urbano.noweb.tech';
const ADMIN_EMAIL = 'contacto@urbanoinmobiliaria.cl';
const ADMIN_PASS = 'Urbano2026!';

const pb = new PocketBase(PB_URL);
pb.autoCancellation(false);

function isImageBuffer(buf) {
  if (!buf || buf.length < 4) return false;
  // JPEG: FF D8 FF
  if (buf[0] === 0xFF && buf[1] === 0xD8 && buf[2] === 0xFF) return 'image/jpeg';
  // PNG: 89 50 4E 47
  if (buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4E && buf[3] === 0x47) return 'image/png';
  // WEBP: RIFF....WEBP
  if (buf.toString('ascii', 0, 4) === 'RIFF' && buf.toString('ascii', 8, 12) === 'WEBP') return 'image/webp';
  // GIF: GIF8
  if (buf.toString('ascii', 0, 3) === 'GIF') return 'image/gif';
  return false;
}

async function fetchBufferWithTimeout(url) {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);

    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    clearTimeout(timeout);

    if (!res.ok) return null;
    const ct = res.headers.get('content-type') || '';
    if (ct.includes('text/html')) return null;

    const arrayBuffer = await res.arrayBuffer();
    const buf = Buffer.from(arrayBuffer);
    const detectedMime = isImageBuffer(buf);

    if (detectedMime) {
      return { buffer: buf, mime: detectedMime };
    }
    return null;
  } catch (e) {
    return null;
  }
}

async function downloadValidImage(url) {
  if (!url || typeof url !== 'string') return null;
  if (url.includes('urbano.noweb.tech/api/files/')) return null;

  // 1. Try the direct URL
  let result = await fetchBufferWithTimeout(url);
  if (result) return result;

  // 2. If it's a WordPress cropped thumbnail (e.g. -150x150, -225x300, -scaled), try full resolution
  const uncroppedUrl = url.replace(/-\d+x\d+(\.[a-zA-Z]+)$/, '$1').replace(/-scaled(\.[a-zA-Z]+)$/, '$1');
  if (uncroppedUrl !== url) {
    result = await fetchBufferWithTimeout(uncroppedUrl);
    if (result) return result;
  }

  return null;
}

async function main() {
  console.log('📡 Conectando a PocketBase...');
  await pb.collection('_superusers').authWithPassword(ADMIN_EMAIL, ADMIN_PASS);
  console.log('[OK] Autenticado como Superuser.');

  const properties = await pb.collection('properties').getFullList({
    sort: '-legacy_id'
  });

  console.log(`Total propiedades a revisar: ${properties.length}`);

  let totalUpdated = 0;
  let totalSkipped = 0;
  let totalPhotosSaved = 0;

  for (let i = 0; i < properties.length; i++) {
    const p = properties[i];
    const progress = `[${i + 1}/${properties.length}]`;

    // Check if property is already fully migrated to PocketBase
    const hasExternalImage = p.image && !p.image.includes('urbano.noweb.tech/api/files/');
    const hasExternalGallery = Array.isArray(p.gallery) && p.gallery.some(u => u && !u.includes('urbano.noweb.tech/api/files/'));

    if (!hasExternalImage && !hasExternalGallery && p.photos && p.photos.length > 0) {
      totalSkipped++;
      continue;
    }

    console.log(`\n${progress} Procesando [${p.code || p.id}] ${p.title.substring(0, 45)}...`);

    const allUrls = [p.image, ...(Array.isArray(p.gallery) ? p.gallery : [])].filter(Boolean);
    const uniqueUrls = [...new Set(allUrls)];

    const formData = new FormData();
    let validFilesCount = 0;

    for (let idx = 0; idx < uniqueUrls.length; idx++) {
      const u = uniqueUrls[idx];
      if (u.includes('urbano.noweb.tech/api/files/')) continue;

      const img = await downloadValidImage(u);
      if (img) {
        let ext = 'jpg';
        if (img.mime === 'image/webp') ext = 'webp';
        else if (img.mime === 'image/png') ext = 'png';
        else if (img.mime === 'image/gif') ext = 'gif';

        const filename = `photo_${validFilesCount}_${Date.now()}.${ext}`;
        const blob = new Blob([img.buffer], { type: img.mime });
        formData.append('photos', blob, filename);
        validFilesCount++;
      }
    }

    if (validFilesCount > 0) {
      try {
        const updatedRecord = await pb.collection('properties').update(p.id, formData);
        const uploadedFilenames = updatedRecord.photos || [];

        if (uploadedFilenames.length > 0) {
          const baseUrl = `https://urbano.noweb.tech/api/files/properties/${p.id}`;
          const newGalleryUrls = uploadedFilenames.map(fn => `${baseUrl}/${fn}`);
          const newMainUrl = newGalleryUrls[0] || '';

          await pb.collection('properties').update(p.id, {
            image: newMainUrl,
            gallery: newGalleryUrls
          });

          totalUpdated++;
          totalPhotosSaved += uploadedFilenames.length;
          console.log(`  -> [OK] ${uploadedFilenames.length} fotos físicas guardadas en VPS PocketBase.`);
        }
      } catch (err) {
        console.error(`  [ERROR] Falló guardado para ${p.code}:`, err.message);
      }
    } else {
      console.log(`  -> Sin imágenes externas pendientes.`);
    }
  }

  console.log('\n=============================================');
  console.log('🎉 MIGRACIÓN COMPLETA DE IMÁGENES AL VPS POCKETBASE');
  console.log(`Propiedades migradas en esta pasada: ${totalUpdated}`);
  console.log(`Propiedades que ya estaban en el VPS: ${totalSkipped}`);
  console.log(`Total fotos guardadas físicamente en el VPS: ${totalPhotosSaved}`);
  console.log('=============================================');
}

main().catch(console.error);
