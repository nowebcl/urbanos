async function checkLiveDeploy() {
  try {
    const res = await fetch('https://www.urbanosinmobiliaria.cl/api/properties');
    console.log('Status en produccion:', res.status);
    if (res.ok) {
      const data = await res.json();
      console.log(`Total propiedades cargadas desde producción: ${data.length}`);
      if (data.length > 0) {
        console.log('Primera propiedad:', data[0].code, data[0].title);
        console.log('URL de imagen principal en prod:', data[0].image);
        const isPB = data[0].image && data[0].image.includes('urbano.noweb.tech');
        console.log(`¿Las imágenes en prod vienen de PocketBase?: ${isPB ? 'SÍ (100% POCKETBASE)' : 'NO'}`);
      }
    }
  } catch (e) {
    console.error('Error:', e.message);
  }
}

checkLiveDeploy();
