import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'http://supabasekong-k8uxuxm98fmrtwpwpum8j0ju.2.25.98.151.sslip.io';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJzdXBhYmFzZSIsImlhdCI6MTc4NjA2NzA0MCwiZXhwIjo0OTQxNzQwNjQwLCJyb2xlIjoiYW5vbiJ9.j0axRrrcuCa4NzkFCM_XcRSHHn_nsDoNyDbEg7Nv7iQ';

const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // GET: Fetch all properties from Supabase DB
  if (req.method === 'GET') {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .order('id', { ascending: false });

      if (error) throw error;

      const formatted = (data || []).map(p => {
        const fix = (url) => {
          if (!url || typeof url !== 'string') return url;
          if (url.startsWith('http://')) {
            return `/api/image-proxy?url=${encodeURIComponent(url)}`;
          }
          return url;
        };

        return {
          ...p,
          image: fix(p.image),
          gallery: Array.isArray(p.gallery) ? p.gallery.map(fix) : p.gallery
        };
      });

      return res.status(200).json(formatted);
    } catch (err) {
      console.error('Vercel API GET properties error:', err);
      return res.status(500).json({ error: err.message || 'Error fetching properties' });
    }
  }

  // POST: Insert or Update property in Supabase DB
  if (req.method === 'POST') {
    try {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      if (!body || !body.title) {
        return res.status(400).json({ error: 'Falta información requerida de la propiedad.' });
      }

      const { data, error } = await supabase
        .from('properties')
        .upsert([body]);

      if (error) throw error;
      return res.status(200).json({ success: true, data });
    } catch (err) {
      console.error('Vercel API POST property error:', err);
      return res.status(500).json({ error: err.message || 'Error saving property' });
    }
  }

  // DELETE: Delete property by ID
  if (req.method === 'DELETE') {
    try {
      const id = req.query.id || (typeof req.body === 'string' ? JSON.parse(req.body).id : req.body?.id);
      if (!id) {
        return res.status(400).json({ error: 'Falta ID de propiedad para eliminar.' });
      }

      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return res.status(200).json({ success: true });
    } catch (err) {
      console.error('Vercel API DELETE property error:', err);
      return res.status(500).json({ error: err.message || 'Error deleting property' });
    }
  }

  return res.status(405).json({ error: 'Método no permitido' });
}
