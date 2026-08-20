import PocketBase from 'pocketbase';

const pbUrl = process.env.VITE_POCKETBASE_URL || 'https://urbano.noweb.tech';

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
    const pb = new PocketBase(pbUrl);
    pb.autoCancellation(false);

    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const { imageBase64, fileName: customName } = body || {};

    if (!imageBase64) {
      return res.status(400).json({ error: 'Falta la imagen en base64' });
    }

    // Extract raw base64 data
    const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');
    const fileName = customName || `upload_${Date.now()}_${Math.random().toString(36).substring(2, 7)}.webp`;

    const blob = new Blob([buffer], { type: 'image/webp' });
    const formData = new FormData();
    formData.append('title', `Upload ${Date.now()}`);
    formData.append('photos', blob, fileName);

    const record = await pb.collection('properties').create(formData);
    if (record && record.photos && record.photos.length > 0) {
      const publicUrl = pb.files.getURL(record, record.photos[0]);
      return res.status(200).json({
        success: true,
        url: publicUrl,
        fileName,
        recordId: record.id
      });
    }

    return res.status(200).json({
      success: true,
      url: imageBase64,
      fileName
    });
  } catch (err) {
    console.error('API Upload Error:', err);
    return res.status(500).json({ error: err.message || 'Error al subir imagen' });
  }
}

