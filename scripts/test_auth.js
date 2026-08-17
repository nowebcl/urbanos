import PocketBase from 'pocketbase';
import fs from 'fs';
import path from 'path';

const PB_URL = 'https://urbano.noweb.tech';
const ADMIN_EMAIL = 'contacto@urbanoinmobiliaria.cl';
const ADMIN_PASS = 'Urbano2026!';

const pb = new PocketBase(PB_URL);

async function authenticate() {
  console.log(`📡 Conectando a PocketBase en ${PB_URL}...`);
  try {
    // PocketBase v0.23+ uses _superusers collection
    console.log('Intentando autenticación con _superusers...');
    await pb.collection('_superusers').authWithPassword(ADMIN_EMAIL, ADMIN_PASS);
    console.log('✅ Autenticado exitosamente como Superuser (v0.23+)');
    return true;
  } catch (err1) {
    try {
      // Older PocketBase versions use pb.admins
      console.log('Intentando autenticación con pb.admins (v0.22 o inferior)...');
      await pb.admins.authWithPassword(ADMIN_EMAIL, ADMIN_PASS);
      console.log('✅ Autenticado exitosamente como Admin clásico');
      return true;
    } catch (err2) {
      console.error('❌ Error de autenticación en PocketBase:', err1.message, err2.message);
      return false;
    }
  }
}

async function main() {
  const authOk = await authenticate();
  if (!authOk) {
    process.exit(1);
  }

  // Check existing collections
  const collections = await pb.collections.getFullList();
  console.log('Colecciones existentes en PocketBase:', collections.map(c => c.name));
}

main().catch(console.error);
