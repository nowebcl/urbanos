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

  const pb = new PocketBase(pbUrl);
  pb.autoCancellation(false);

  // GET: Fetch all properties from PocketBase collection 'properties'
  if (req.method === 'GET') {
    try {
      const records = await pb.collection('properties').getFullList({
        sort: '-legacy_id'
      });

      const formatted = (records || []).map(p => ({
        id: p.legacy_id || p.id,
        pb_id: p.id,
        code: p.code,
        slug: p.slug,
        title: p.title,
        commune: p.commune,
        location: p.location,
        address: p.address,
        price_display: p.price_display,
        price_uf: p.price_uf,
        price_clp: p.price_clp,
        bedrooms: p.bedrooms,
        bathrooms: p.bathrooms,
        parking: p.parking,
        area: p.area,
        land_area: p.land_area,
        is_featured: p.is_featured,
        operation: p.operation,
        type: p.type,
        image: p.image,
        gallery: p.gallery,
        description: p.description,
        features: p.features,
        map_coords: p.map_coords
      }));

      return res.status(200).json(formatted);
    } catch (err) {
      console.error('Vercel API GET properties error:', err);
      return res.status(500).json({ error: err.message || 'Error fetching properties' });
    }
  }

  // POST: Insert or Update property in PocketBase
  if (req.method === 'POST') {
    try {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      if (!body || !body.title) {
        return res.status(400).json({ error: 'Falta información requerida de la propiedad.' });
      }

      let existing = null;
      if (body.code) {
        existing = await pb.collection('properties').getFirstListItem(`code="${body.code}"`).catch(() => null);
      }
      if (!existing && body.slug) {
        existing = await pb.collection('properties').getFirstListItem(`slug="${body.slug}"`).catch(() => null);
      }

      let record;
      if (existing) {
        record = await pb.collection('properties').update(existing.id, body);
      } else {
        record = await pb.collection('properties').create(body);
      }

      return res.status(200).json({ success: true, data: record });
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

      let target = await pb.collection('properties').getOne(id).catch(() => null);
      if (!target && parseInt(id, 10)) {
        target = await pb.collection('properties').getFirstListItem(`legacy_id=${parseInt(id, 10)}`).catch(() => null);
      }

      if (target) {
        await pb.collection('properties').delete(target.id);
      }

      return res.status(200).json({ success: true });
    } catch (err) {
      console.error('Vercel API DELETE property error:', err);
      return res.status(500).json({ error: err.message || 'Error deleting property' });
    }
  }

  return res.status(405).json({ error: 'Método no permitido' });
}
