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

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const { imageBase64, fileName: customName } = body || {};

    if (!imageBase64) {
      return res.status(400).json({ error: 'Falta la imagen en base64' });
    }

    // Extract raw base64 data
    const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');

    // Generate unique filename in properties bucket
    const fileName = customName || `prop_${Date.now()}_${Math.random().toString(36).substring(2, 7)}.webp`;

    // 1. Ensure bucket 'properties' exists
    try {
      await supabase.storage.createBucket('properties', { public: true });
    } catch (e) {}

    // 2. Upload file buffer to Supabase Storage bucket 'properties'
    const { data, error } = await supabase.storage
      .from('properties')
      .upload(fileName, buffer, {
        contentType: 'image/webp',
        upsert: true
      });

    if (error) {
      console.error('Supabase Storage Upload Error:', error);
      // Fallback: return dataUrl if bucket upload is restricted
      return res.status(200).json({ 
        url: imageBase64, 
        storageFileName: fileName,
        notice: 'Guardado como DataURL por política de storage' 
      });
    }

    // 3. Obtain public URL from Supabase Storage
    const { data: publicData } = supabase.storage
      .from('properties')
      .getPublicUrl(fileName);

    const publicUrl = publicData?.publicUrl || `${supabaseUrl}/storage/v1/object/public/properties/${fileName}`;

    return res.status(200).json({ 
      success: true, 
      url: publicUrl, 
      fileName 
    });

  } catch (err) {
    console.error('Vercel API Upload Error:', err);
    return res.status(500).json({ error: err.message || 'Error al subir imagen' });
  }
}
