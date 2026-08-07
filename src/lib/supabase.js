import { createClient } from '@supabase/supabase-js';

let rawUrl = import.meta.env.VITE_SUPABASE_URL || 'https://supabasekong-k8uxuxm98fmrtwpwpum8j0ju.2.25.98.151.sslip.io';

// Avoid Mixed Content blocking when running over HTTPS (Vercel)
if (typeof window !== 'undefined' && window.location.protocol === 'https:' && rawUrl.startsWith('http:')) {
  rawUrl = rawUrl.replace('http:', 'https:');
}

const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJzdXBhYmFzZSIsImlhdCI6MTc4NjA2NzA0MCwiZXhwIjo0OTQxNzQwNjQwLCJyb2xlIjoiYW5vbiJ9.j0axRrrcuCa4NzkFCM_XcRSHHn_nsDoNyDbEg7Nv7iQ';

export const supabase = createClient(rawUrl, supabaseAnonKey);
