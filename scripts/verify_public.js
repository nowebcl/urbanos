import PocketBase from 'pocketbase';

const pb = new PocketBase('https://urbano.noweb.tech');

async function verifyPublicRead() {
  try {
    const res = await pb.collection('properties').getList(1, 5, {
      sort: '-created'
    });
    console.log(`[VERIFICACIÓN PÚBLICA EXITOSA]`);
    console.log(`Total propiedades registradas: ${res.totalItems}`);
    console.log(`Página 1 muestra ${res.items.length} items:`);
    res.items.forEach(i => {
      console.log(` - [${i.code}] ${i.title} (${i.price_display}) en ${i.commune}`);
    });
  } catch (err) {
    console.error('Error en lectura pública:', err);
  }
}

verifyPublicRead();
