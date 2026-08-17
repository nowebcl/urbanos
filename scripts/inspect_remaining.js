import PocketBase from 'pocketbase';

const pb = new PocketBase('https://urbano.noweb.tech');

async function inspectRemaining() {
  const properties = await pb.collection('properties').getFullList();
  const remaining = properties.filter(p => !p.image || !p.image.includes('urbano.noweb.tech/api/files/'));
  console.log(`Propiedades restantes: ${remaining.length}`);
  remaining.forEach(p => {
    console.log(`- [${p.code}] ${p.title} | Img: ${p.image}`);
  });
}

inspectRemaining();
