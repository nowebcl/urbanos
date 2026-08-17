async function checkProdApi() {
  try {
    const res = await fetch('https://www.urbanosinmobiliaria.cl/api/properties');
    console.log('Status /api/properties en produccion:', res.status);
    if (res.ok) {
      const data = await res.json();
      console.log(`Propiedades en /api/properties actual: ${data.length}`);
      if (data.length > 0) {
        console.log('Ejemplo prod:', data[0].code, data[0].title);
      }
    }
  } catch (e) {
    console.log('Error consultando api de prod:', e.message);
  }
}

checkProdApi();
