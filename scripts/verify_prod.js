async function testProd() {
  try {
    const res = await fetch('https://www.urbanosinmobiliaria.cl');
    const html = await res.text();
    const match = html.match(/\/assets\/index-[^"']+\.js/);
    console.log('Bundle actual en produccion:', match ? match[0] : 'No encontrado');
    if (match) {
      const jsRes = await fetch('https://www.urbanosinmobiliaria.cl' + match[0]);
      const jsText = await jsRes.text();
      console.log('¿WhatsApp botón desplegado en producción?:', jsText.includes('wa.me'));
    }
  } catch (err) {
    console.error('Error:', err.message);
  }
}

testProd();
