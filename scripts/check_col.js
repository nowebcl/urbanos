import PocketBase from 'pocketbase';

const pb = new PocketBase('https://urbano.noweb.tech');

async function checkCol() {
  await pb.collection('_superusers').authWithPassword('contacto@urbanoinmobiliaria.cl', 'Urbano2026!');
  const col = await pb.collections.getOne('properties');
  console.log('Collection properties fields & rules:');
  console.log('listRule:', col.listRule);
  console.log('viewRule:', col.viewRule);
  console.log('fields:', col.fields.map(f => f.name));

  const records = await pb.collection('properties').getList(1, 3);
  console.log('Records sin sort:', records.totalItems);
  console.log('Primer record:', records.items[0]);
}

checkCol().catch(console.error);
