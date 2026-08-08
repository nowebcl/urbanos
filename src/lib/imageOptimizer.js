/**
 * Módulo de Optimización y Compresión de Imágenes a formato WebP
 * Convierte imágenes (JPG, PNG, GIF, TIFF, etc.) a formato .webp ultraligero
 * y las redimensiona antes de guardar/subir a la base de datos o Supabase Storage.
 */

/**
 * Comprime y convierte cualquier archivo de imagen subido a formato WebP.
 * 
 * @param {File|Blob} file - Archivo de imagen seleccionado por el usuario.
 * @param {Object} [options] - Configuración de compresión.
 * @param {number} [options.maxWidth=1600] - Ancho máximo en píxeles.
 * @param {number} [options.maxHeight=1200] - Alto máximo en píxeles.
 * @param {number} [options.quality=0.80] - Calidad WebP de 0.0 a 1.0 (80% por defecto).
 * @returns {Promise<{
 *   dataUrl: string,
 *   file: File,
 *   blob: Blob,
 *   originalSizeKB: string,
 *   compressedSizeKB: string,
 *   savedPercent: number,
 *   width: number,
 *   height: number
 * }>}
 */
export function compressAndConvertToWebP(file, options = {}) {
  const {
    maxWidth = 1600,
    maxHeight = 1200,
    quality = 0.80
  } = options;

  return new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith('image/')) {
      return reject(new Error('El archivo seleccionado no es una imagen válida.'));
    }

    const originalSize = file.size;
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();

      img.onload = () => {
        // Calcular dimensiones proporcionalmente
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }

        // Crear elemento canvas para renderizado y compresión WebP
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        // Dibujar la imagen sobre el canvas
        ctx.drawImage(img, 0, 0, width, height);

        // Generar Data URL en formato WebP
        const webpDataUrl = canvas.toDataURL('image/webp', quality);

        // Generar Blob en formato WebP
        canvas.toBlob(
          (blob) => {
            const finalBlob = blob || new Blob([], { type: 'image/webp' });
            const compressedSize = finalBlob.size || webpDataUrl.length;
            const savedPercent = Math.max(0, Math.round(((originalSize - compressedSize) / originalSize) * 100));

            // Generar nombre de archivo con extensión .webp
            const originalName = file.name || 'propiedad';
            const baseName = originalName.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9_-]/g, '_');
            const webpFileName = `${baseName}_${Date.now()}.webp`;

            const webpFile = new File([finalBlob], webpFileName, {
              type: 'image/webp',
              lastModified: Date.now()
            });

            resolve({
              dataUrl: webpDataUrl,
              file: webpFile,
              blob: finalBlob,
              originalSizeKB: (originalSize / 1024).toFixed(1),
              compressedSizeKB: (compressedSize / 1024).toFixed(1),
              savedPercent,
              width,
              height
            });
          },
          'image/webp',
          quality
        );
      };

      img.onerror = (err) => reject(new Error('No se pudo decodificar la estructura de la imagen.'));
      img.src = e.target.result;
    };

    reader.onerror = (err) => reject(new Error('Error al leer el archivo de imagen.'));
    reader.readAsDataURL(file);
  });
}

/**
 * Procesa la imagen subida, la comprime a WebP e intenta subirla a Supabase Storage (bucket 'properties').
 * Si Supabase Storage falla o no está configurado, retorna la imagen WebP optimizada en formato Data URL.
 * 
 * @param {File} file Archivo seleccionado
 * @param {Object} supabase Instancia del cliente de Supabase
 * @returns {Promise<{ url: string, savedPercent: number, originalSizeKB: string, compressedSizeKB: string }>}
 */
export async function processAndUploadPropertyImage(file, supabase) {
  // 1. Comprimir y convertir a WebP localmente
  const compressed = await compressAndConvertToWebP(file, {
    maxWidth: 1600,
    maxHeight: 1200,
    quality: 0.80
  });

  let finalUrl = compressed.dataUrl;

  // 2. Subir el archivo .webp directamente a Supabase Storage mediante /api/upload
  try {
    const res = await fetch('/api/upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        imageBase64: compressed.dataUrl,
        fileName: compressed.file?.name
      })
    });

    if (res.ok) {
      const data = await res.json();
      if (data && data.url) {
        finalUrl = data.url;
      }
    }
  } catch (e) {
    console.warn('Vercel API upload fallback to Storage client:', e);
    if (supabase && supabase.storage) {
      try {
        const fileName = `prop_${Date.now()}_${Math.random().toString(36).substring(2, 7)}.webp`;
        const { data, error } = await supabase.storage
          .from('properties')
          .upload(fileName, compressed.blob, {
            contentType: 'image/webp',
            upsert: true
          });

        if (!error && data) {
          const { data: publicData } = supabase.storage
            .from('properties')
            .getPublicUrl(fileName);

          if (publicData && publicData.publicUrl) {
            finalUrl = publicData.publicUrl;
          }
        }
      } catch (err) {}
    }
  }

  return {
    url: finalUrl,
    savedPercent: compressed.savedPercent,
    originalSizeKB: compressed.originalSizeKB,
    compressedSizeKB: compressed.compressedSizeKB
  };
}
