import PocketBase from 'pocketbase';

const pb = new PocketBase('https://urbano.noweb.tech');

async function testSort() {
  const res = await pb.collection('properties').getList(1, 5, {
    sort: '-legacy_id'
  });
  console.log('✅ Consulta pública con sort -legacy_id exitosa:', res.items.length, 'items');
  res.items.forEach(i => console.log(` - ${i.code}: ${i.title}`));
}

testSort();
