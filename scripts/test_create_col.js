import PocketBase from 'pocketbase';

const PB_URL = 'https://urbano.noweb.tech';
const ADMIN_EMAIL = 'contacto@urbanoinmobiliaria.cl';
const ADMIN_PASS = 'Urbano2026!';

const pb = new PocketBase(PB_URL);

async function testCreateCollection() {
  await pb.collection('_superusers').authWithPassword(ADMIN_EMAIL, ADMIN_PASS);
  console.log('Autenticado como superusuario.');

  // Create agents collection
  try {
    const existing = await pb.collections.getOne('agents').catch(() => null);
    if (!existing) {
      console.log('Creando colección agents...');
      const created = await pb.collections.create({
        name: 'agents',
        type: 'base',
        fields: [
          { name: 'name', type: 'text', required: true },
          { name: 'role', type: 'text' },
          { name: 'phone', type: 'text' },
          { name: 'email', type: 'text' },
          { name: 'image', type: 'text' }
        ],
        listRule: '',
        viewRule: '',
        createRule: '',
        updateRule: '',
        deleteRule: ''
      });
      console.log('✅ Colección agents creada:', created.id);
    } else {
      console.log('Colección agents ya existe.');
    }
  } catch (err) {
    console.error('Error al crear colección agents:', err);
  }
}

testCreateCollection();
