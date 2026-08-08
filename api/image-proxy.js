export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const imageUrl = req.query.url;

  if (!imageUrl) {
    return res.status(400).json({ error: 'Falta parámetro url' });
  }

  try {
    const targetUrl = decodeURIComponent(imageUrl);
    const response = await fetch(targetUrl);

    if (!response.ok) {
      return res.status(response.status).json({ error: 'Error al obtener la imagen remota' });
    }

    const contentType = response.headers.get('content-type') || 'image/webp';
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Cache images on Vercel Edge/CDN for 1 year
    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 'public, max-age=31536000, s-maxage=31536000, immutable');
    
    return res.status(200).send(buffer);
  } catch (err) {
    console.error('Error en image-proxy:', err);
    return res.status(500).json({ error: err.message || 'Error proxying image' });
  }
}
