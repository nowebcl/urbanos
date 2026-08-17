import PocketBase from 'pocketbase';

const pb = new PocketBase('https://urbano.noweb.tech');

async function verifyAllImages() {
  const properties = await pb.collection('properties').getFullList();
  console.log(`Total propiedades en PocketBase: ${properties.length}`);

  let onPbStorage = 0;
  let other = 0;

  properties.forEach(p => {
    if (p.image && p.image.includes('urbano.noweb.tech/api/files/')) {
      onPbStorage++;
    } else {
      other++;
    }
  });

  console.log(`✅ Propiedades con imágenes físicas en el VPS PocketBase: ${onPbStorage}/${properties.length}`);
  if (other > 0) {
    console.log(`Propiedades sin imagen en PB: ${other}`);
  }
}

verifyAllImages();
