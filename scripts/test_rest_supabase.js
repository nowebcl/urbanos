const rawUrl = 'http://supabasekong-k8uxuxm98fmrtwpwpum8j0ju.2.25.98.151.sslip.io';
const supabaseAnonKey = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJzdXBhYmFzZSIsImlhdCI6MTc4NjA2NzA0MCwiZXhwIjo0OTQxNzQwNjQwLCJyb2xlIjoiYW5vbiJ9.j0axRrrcuCa4NzkFCM_XcRSHHn_nsDoNyDbEg7Nv7iQ';

import fs from 'fs';

async function fetchFromSupabaseRest() {
  try {
    const res = await fetch(`${rawUrl}/rest/v1/properties?select=*`, {
      headers: {
        'apikey': supabaseAnonKey,
        'Authorization': `Bearer ${supabaseAnonKey}`
      }
    });
    if (!res.ok) {
      console.log('Status no OK de Supabase:', res.status, res.statusText);
      return null;
    }
    const data = await res.json();
    console.log(`✅ Obtenidas ${data.length} propiedades de Supabase REST.`);
    fs.writeFileSync('scripts/supabase_dump_properties.json', JSON.stringify(data, null, 2));
    return data;
  } catch (e) {
    console.log('Error conectando a Supabase REST:', e.message);
    return null;
  }
}

fetchFromSupabaseRest();
