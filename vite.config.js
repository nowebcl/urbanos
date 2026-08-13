import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'image-proxy-middleware',
      configureServer(server) {
        server.middlewares.use('/api/image-proxy', async (req, res) => {
          try {
            const urlParam = new URL(req.url, `http://${req.headers.host}`).searchParams.get('url');
            if (!urlParam) {
              res.statusCode = 400;
              return res.end(JSON.stringify({ error: 'Falta el parámetro url' }));
            }
            const targetUrl = decodeURIComponent(urlParam);
            const response = await fetch(targetUrl);
            if (!response.ok) {
              res.statusCode = response.status;
              return res.end(JSON.stringify({ error: 'Error al obtener la imagen remota' }));
            }
            const contentType = response.headers.get('content-type') || 'image/webp';
            const arrayBuffer = await response.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            res.setHeader('Content-Type', contentType);
            res.setHeader('Cache-Control', 'public, max-age=31536000');
            return res.end(buffer);
          } catch (err) {
            res.statusCode = 500;
            return res.end(JSON.stringify({ error: err.message }));
          }
        });
      }
    }
  ],
})

