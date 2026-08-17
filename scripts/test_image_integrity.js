import PocketBase from 'pocketbase';

const pb = new PocketBase('https://urbano.noweb.tech');

async function testImageIntegrity() {
  console.log('Validando integridad de imágenes en PocketBase...');
  const properties = await pb.collection('properties').getFullList({ sort: '-legacy_id' });
  console.log(`Total propiedades a verificar: ${properties.length}`);

  let valid = 0;
  let failed = 0;

  for (let i = 0; i < Math.min(20, properties.length); i++) {
    const p = properties[i];
    try {
      const res = await fetch(p.image, { method: 'HEAD' });
      if (res.ok) {
        valid++;
        console.log(`✅ [${p.code}] ${p.title.substring(0, 30)}... OK (${res.status})`);
      } else {
        failed++;
        console.log(`❌ [${p.code}] Status ${res.status}: ${p.image}`);
      }
    } catch (e) {
      failed++;
      console.log(`❌ [${p.code}] Error: ${e.message}`);
    }
  }

  console.log(`\nVerificación de muestra: ${valid} OK, ${failed} fallidas.`);
}

testImageIntegrity();
