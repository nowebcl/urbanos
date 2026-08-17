import PocketBase from 'pocketbase';

const pb = new PocketBase('https://urbano.noweb.tech');

async function addFileField() {
  await pb.collection('_superusers').authWithPassword('contacto@urbanoinmobiliaria.cl', 'Urbano2026!');
  
  const col = await pb.collections.getOne('properties');
  const hasPhotos = col.fields.some(f => f.name === 'photos');

  if (!hasPhotos) {
    console.log('Agregando campo de archivos photos a properties...');
    col.fields.push({
      name: 'photos',
      type: 'file',
      maxSelect: 30,
      maxSize: 15728640, // 15MB
      mimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']
    });

    await pb.collections.update('properties', col);
    console.log('✅ Campo photos agregado exitosamente a la colección properties.');
  } else {
    console.log('Campo photos ya existía.');
  }
}

addFileField().catch(console.error);
