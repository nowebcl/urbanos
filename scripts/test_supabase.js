import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const rawUrl = 'http://supabasekong-k8uxuxm98fmrtwpwpum8j0ju.2.25.98.151.sslip.io';
const supabaseAnonKey = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJzdXBhYmFzZSIsImlhdCI6MTc4NjA2NzA0MCwiZXhwIjo0OTQxNzQwNjQwLCJyb2xlIjoiYW5vbiJ9.j0axRrrcuCa4NzkFCM_XcRSHHn_nsDoNyDbEg7Nv7iQ';

const supabase = createClient(rawUrl, supabaseAnonKey);

async function checkSupabase() {
  console.log('Intentando conectar a Supabase...');
  try {
    const { data: props, error } = await supabase.from('properties').select('*');
    if (error) {
      console.log('Error al consultar Supabase:', error.message);
      return null;
    }
    console.log(`✅ Conexión con Supabase exitosa: ${props.length} propiedades encontradas.`);
    return props;
  } catch (e) {
    console.log('No se pudo conectar a Supabase:', e.message);
    return null;
  }
}

checkSupabase().then(data => {
  if (data) {
    fs.writeFileSync('scripts/supabase_dump_properties.json', JSON.stringify(data, null, 2));
    console.log('Guardado en scripts/supabase_dump_properties.json');
  }
});
