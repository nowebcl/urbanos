import PocketBase from 'pocketbase';

const pb = new PocketBase('https://urbano.noweb.tech');

async function analyzeImages() {
  await pb.collection('_superusers').authWithPassword('contacto@urbanoinmobiliaria.cl', 'Urbano2026!');
  
  const properties = await pb.collection('properties').getFullList();
  console.log(`Total propiedades: ${properties.length}`);

  let totalImages = 0;
  let supabaseUrls = 0;
  let wpUrls = 0;
  let otherUrls = 0;

  const allUrls = [];

  for (const p of properties) {
    const urls = [];
    if (p.image) urls.push(p.image);
    if (Array.isArray(p.gallery)) {
      urls.push(...p.gallery);
    }
    const unique = [...new Set(urls.filter(Boolean))];
    totalImages += unique.length;

    for (const u of unique) {
      allUrls.push({ propId: p.id, code: p.code, url: u });
      if (u.includes('supabase') || u.includes('sslip.io')) {
        supabaseUrls++;
      } else if (u.includes('urbanosinmobiliaria.cl')) {
        wpUrls++;
      } else {
        otherUrls++;
      }
    }
  }

  console.log(`\n--- RESUMEN DE IMÁGENES ---`);
  console.log(`Total enlaces únicos a procesar: ${totalImages}`);
  console.log(`De Supabase Storage (a punto de morir): ${supabaseUrls}`);
  console.log(`De WordPress original: ${wpUrls}`);
  console.log(`Otras fuentes/locales: ${otherUrls}`);
}

analyzeImages().catch(console.error);
