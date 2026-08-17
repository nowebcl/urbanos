const rawUrl = 'http://supabasekong-k8uxuxm98fmrtwpwpum8j0ju.2.25.98.151.sslip.io';
const supabaseAnonKey = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJzdXBhYmFzZSIsImlhdCI6MTc4NjA2NzA0MCwiZXhwIjo0OTQxNzQwNjQwLCJyb2xlIjoiYW5vbiJ9.j0axRrrcuCa4NzkFCM_XcRSHHn_nsDoNyDbEg7Nv7iQ';

import fs from 'fs';

async function fetchTable(table) {
  try {
    const res = await fetch(`${rawUrl}/rest/v1/${table}?select=*`, {
      headers: {
        'apikey': supabaseAnonKey,
        'Authorization': `Bearer ${supabaseAnonKey}`
      }
    });
    if (res.ok) {
      const data = await res.json();
      console.log(`Tabla '${table}': ${data.length} registros`);
      return data;
    } else {
      console.log(`Tabla '${table}': status ${res.status}`);
      return [];
    }
  } catch (e) {
    console.log(`Error tabla '${table}':`, e.message);
    return [];
  }
}

async function run() {
  const tables = ['properties', 'agents', 'leads', 'orders', 'site_content'];
  const dump = {};
  for (const t of tables) {
    dump[t] = await fetchTable(t);
  }
  fs.writeFileSync('scripts/supabase_full_dump.json', JSON.stringify(dump, null, 2));
  console.log('✅ Volcado completo guardado en scripts/supabase_full_dump.json');
}

run();
