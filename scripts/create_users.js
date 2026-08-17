import PocketBase from 'pocketbase';

const PB_URL = 'https://urbano.noweb.tech';
const ADMIN_EMAIL = 'contacto@urbanoinmobiliaria.cl';
const ADMIN_PASS = 'Urbano2026!';

const pb = new PocketBase(PB_URL);

async function createAdminUser() {
  await pb.collection('_superusers').authWithPassword(ADMIN_EMAIL, ADMIN_PASS);
  console.log('Superuser autenticado.');

  const adminUsers = [
    {
      email: 'contacto@urbanoinmobiliaria.cl',
      password: 'Urbano2026!',
      passwordConfirm: 'Urbano2026!',
      name: 'Admin Urbano'
    },
    {
      email: 'admin@urbanosinmobiliaria.cl',
      password: 'Urbanos2026!*',
      passwordConfirm: 'Urbanos2026!*',
      name: 'Admin Urbanos'
    }
  ];

  for (const u of adminUsers) {
    try {
      const existing = await pb.collection('users').getFirstListItem(`email="${u.email}"`).catch(() => null);
      if (!existing) {
        await pb.collection('users').create(u);
        console.log(`[OK] Usuario '${u.email}' creado en colección 'users'.`);
      } else {
        console.log(`Usuario '${u.email}' ya existe en 'users'.`);
      }
    } catch (e) {
      console.error(`Error creando usuario ${u.email}:`, e.message);
    }
  }
}

createAdminUser();
