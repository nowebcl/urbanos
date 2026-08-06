export const CITIES = [
  {
    id: 'puerto-montt',
    name: 'Puerto Montt',
    subtitle: 'Región de Los Lagos',
    image: '/images/puerto_montt.jpg',
    count: 114
  },
  {
    id: 'puerto-varas',
    name: 'Puerto Varas',
    subtitle: 'Ciudad de las Rosas',
    image: '/images/puerto_varas.jpg',
    count: 78
  },
  {
    id: 'frutillar',
    name: 'Frutillar',
    subtitle: 'Tradición Alemana',
    image: '/images/frutillar.jpg',
    count: 32
  },
  {
    id: 'osorno',
    name: 'Osorno',
    subtitle: 'Región de Los Lagos',
    image: '/images/osorno.jpg',
    count: 45
  }
];

export const STATS = [
  {
    number: '240+',
    label: 'Propiedades activas',
    icon: 'Bookmark'
  },
  {
    number: '12 años',
    label: 'Experiencia',
    icon: 'Award'
  },
  {
    number: '98%',
    label: 'Clientes satisfechos',
    icon: 'Smile'
  },
  {
    number: '32 comunas',
    label: 'Cobertura',
    icon: 'MapPin'
  }
];

export const AGENTS = [
  {
    id: 1,
    name: 'Cristián Muñoz',
    role: 'Agente Inmobiliario Senior',
    phone: '+56 9 6192 4570',
    email: 'urbanos@urbanosinmobiliaria.cl',
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 2,
    name: 'Felipe Loyola',
    role: 'Director Comercial & Broker',
    phone: '+56 9 9593 0321',
    email: 'contacto@urbanosgestion.cl',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80'
  }
];

export const PROPERTIES = [
  {
    id: 1047,
    code: 'URB-1047',
    slug: 'se-arrienda-casa-parcela-amobalda-puerto-varas-1-900-000',
    title: 'Se Arrienda Casa Amoblada en Puerto Varas $1.500.000',
    commune: 'Puerto Varas',
    location: 'Puerto Varas, Región de Los Lagos',
    address: 'Sector Residencial Puerto Varas (Cerca Colegio Alemán)',
    priceDisplay: '$1.500.000',
    priceUF: 40,
    priceCLP: 1500000,
    bedrooms: 7,
    bathrooms: 3,
    parking: 3,
    area: '150m²',
    landArea: '1.300m²',
    isFeatured: true,
    operation: 'Arriendo',
    type: 'Casa',
    createdAt: '2025-07-14',
    image: 'https://urbanosinmobiliaria.cl/wp-content/uploads/2025/07/WhatsApp-Image-2025-07-11-at-11.26.40-1-150x150.jpeg',
    gallery: [
      'https://urbanosinmobiliaria.cl/wp-content/uploads/2025/07/WhatsApp-Image-2025-07-11-at-11.26.40-1-150x150.jpeg',
      'https://urbanosinmobiliaria.cl/wp-content/uploads/2025/07/WhatsApp-Image-2025-07-11-at-11.26.41-1-150x150.jpeg',
      'https://urbanosinmobiliaria.cl/wp-content/uploads/2025/07/WhatsApp-Image-2025-07-11-at-11.26.42-1-150x150.jpeg',
      '/images/puerto_varas.jpg'
    ],
    agent: AGENTS[0],
    description: '¡Espectacular Casa totalmente Amoblada! Dos construcciones independientes ideales para hasta 7 personas con 5 dormitorios principales + 2 adicionales. Ideal para familias numerosas, ejecutivos o profesionales de empresas. Disfruta de una propiedad amplia, totalmente equipada y lista para habitar en uno de los sectores más cotizados de Puerto Varas.',
    features: [
      'Totalmente Amoblada y Equipada',
      '1.300m² Terreno / 150m² Construcción',
      'WiFi e Internet Cable Incluido',
      'Conectividad a Colegio Alemán (9 min)',
      'Estacionamiento techado para 3 vehículos',
      'Zona segura y de alto estándar'
    ],
    mapCoords: { lat: -41.3195, lng: -72.9854 }
  },
  {
    id: 4421,
    code: 'URB-4421',
    slug: 'arrienda-propiedad-habilitada-para-taller-mecanico-500-000',
    title: 'Arrienda Propiedad Habilitada para Taller Mecánico! $500.000',
    commune: 'Puerto Montt',
    location: 'Puerto Montt, Región de Los Lagos',
    address: 'A pasos del Regimiento, Puerto Montt',
    priceDisplay: '$500.000',
    priceUF: 13.5,
    priceCLP: 500000,
    bedrooms: 0,
    bathrooms: 1,
    parking: 4,
    area: '120m²',
    landArea: '200m²',
    isFeatured: true,
    operation: 'Arriendo',
    type: 'Casa Comercial',
    createdAt: '2026-06-26',
    image: 'https://urbanosinmobiliaria.cl/wp-content/uploads/2026/06/WhatsApp-Image-2026-06-26-at-16.08.48.jpeg',
    gallery: [
      'https://urbanosinmobiliaria.cl/wp-content/uploads/2026/06/WhatsApp-Image-2026-06-26-at-16.08.48.jpeg',
      '/images/puerto_montt.jpg'
    ],
    agent: AGENTS[0],
    description: '¡Se Arrienda Propiedad Habilitada para Taller Mecánico! Excelente oportunidad para establecer o potenciar tu negocio en un sector estratégico de Puerto Montt, a pasos del Regimiento en zona de alto flujo vehicular automotriz. Incluye elevador vehicular profesional instalado.',
    features: [
      'Espacio habilitado para taller mecánico',
      'Elevador vehicular profesional incluido',
      'Excelente visibilidad comercial',
      'Fácil acceso para clientes y camiones',
      'Sector consolidado automotriz'
    ],
    mapCoords: { lat: -41.4693, lng: -72.9424 }
  },
  {
    id: 2805,
    code: 'URB-2805',
    slug: 'se-arrienda-casa-en-parcelacion-playa-chamiza-550-000-ggcc-30-000',
    title: 'Se arrienda casa en Parcelación Playa Chamiza $580.000',
    commune: 'Puerto Montt',
    location: 'Puerto Montt, Región de Los Lagos',
    address: 'Parcelación Playa Chamiza, Puerto Montt',
    priceDisplay: '$580.000',
    priceUF: 15.5,
    priceCLP: 580000,
    bedrooms: 2,
    bathrooms: 2,
    parking: 2,
    area: '80m²',
    landArea: '500m²',
    isFeatured: true,
    operation: 'Arriendo',
    type: 'Casa',
    createdAt: '2025-11-29',
    image: 'https://urbanosinmobiliaria.cl/wp-content/uploads/2025/11/WhatsApp-Image-2025-11-27-at-18.43.20-1-150x150.jpeg',
    gallery: [
      'https://urbanosinmobiliaria.cl/wp-content/uploads/2025/11/WhatsApp-Image-2025-11-27-at-18.43.20-1-150x150.jpeg',
      'https://urbanosinmobiliaria.cl/wp-content/uploads/2025/11/WhatsApp-Image-2025-11-27-at-18.43.20-2-150x150.jpeg',
      'https://urbanosinmobiliaria.cl/wp-content/uploads/2025/11/WhatsApp-Image-2025-11-27-at-18.43.19-1-150x150.jpeg'
    ],
    agent: AGENTS[0],
    description: 'Hermosa y amplia casa en Parcelación Playa Chamiza a solo 15 minutos del centro de Puerto Montt. El valor incluye agua, gastos comunes e Internet Fibra Óptica. Casa muy luminosa con excelente distribución y entorno de naturaleza.',
    features: [
      'Incluye Agua e Internet Fibra Óptica',
      'A 15 minutos del centro de Puerto Montt',
      '2 Dormitorios y 2 Baños',
      'Entorno tranquilo rodeado de naturaleza',
      'Acceso controlado a parcelación'
    ],
    mapCoords: { lat: -41.4812, lng: -72.8512 }
  },
  {
    id: 3396,
    code: 'URB-3396',
    slug: 'arriendo-mensual-cabana-tipo-loft-en-isla-puluqui-calbuco-900-000',
    title: 'Arriendo Mensual Loft en Isla Puluqui- Calbuco $700.000',
    commune: 'Osorno',
    location: 'Calbuco / Chiloé, Región de Los Lagos',
    address: 'Isla Puluqui, Calbuco',
    priceDisplay: '$700.000',
    priceUF: 18.5,
    priceCLP: 700000,
    bedrooms: 2,
    bathrooms: 1,
    parking: 2,
    area: '70m²',
    landArea: '1.000m²',
    isFeatured: true,
    operation: 'Arriendo',
    type: 'Casa',
    createdAt: '2026-03-12',
    image: 'https://urbanosinmobiliaria.cl/wp-content/uploads/2026/03/WhatsApp-Image-2026-03-11-at-21.15.53-1-150x150.jpeg',
    gallery: [
      'https://urbanosinmobiliaria.cl/wp-content/uploads/2026/03/WhatsApp-Image-2026-03-11-at-21.15.53-1-150x150.jpeg',
      'https://urbanosinmobiliaria.cl/wp-content/uploads/2026/03/WhatsApp-Image-2026-03-11-at-21.17.36-1-150x150.jpeg'
    ],
    agent: AGENTS[0],
    description: 'Se arrienda acogedora cabaña tipo Loft en Isla Puluqui, Calbuco. Ideal para profesionales o personas trasladadas a la zona. Conectividad diaria con transbordador y acceso directo a la playa a solo 5 minutos del embarcadero.',
    features: [
      'Acceso directo a la playa',
      'A 5 min en auto del embarcadero',
      'Totalmente equipada para 4 personas',
      'Entorno natural de paz y tranquilidad'
    ],
    mapCoords: { lat: -41.7912, lng: -73.0112 }
  },
  {
    id: 1,
    code: 'URB-101',
    slug: 'se-vende-casa-en-parcela-en-monte-verde',
    title: 'Se Vende Casa en Parcela en Monte Verde',
    commune: 'Puerto Montt',
    location: 'Puerto Montt, Región de Los Lagos',
    address: 'Camino a Monte Verde Km 4.2',
    priceDisplay: 'UF 5.150',
    priceUF: 5150,
    priceCLP: 193125000,
    bedrooms: 3,
    bathrooms: 3,
    parking: 2,
    area: '135m²',
    landArea: '5.000m²',
    isFeatured: true,
    operation: 'Venta',
    type: 'Casa',
    createdAt: '2026-02-01',
    image: '/images/house_monte_verde.jpg',
    gallery: [
      '/images/house_monte_verde.jpg',
      '/images/puerto_montt.jpg',
      '/images/house_valle_volcanes.jpg'
    ],
    agent: AGENTS[1],
    description: 'Espectacular casa mediterránea de arquitectura contemporánea en parcela de 5.000m². Entorno natural privilegiado a minutos del centro de Puerto Montt. Construcción en termopanel y terminaciones en madera nativa.',
    features: [
      'Bosque nativo en terreno',
      'Calefacción central a pellet',
      'Agua de vertiente y APR',
      'Quincho cerrado equipado',
      'Conexión Fibra Óptica'
    ],
    mapCoords: { lat: -41.4693, lng: -72.9424 }
  },
  {
    id: 2,
    code: 'URB-102',
    slug: 'venta-departamento-en-puerto-varas',
    title: 'Venta Departamento en Puerto Varas',
    commune: 'Puerto Varas',
    location: 'Puerto Varas, Región de Los Lagos',
    address: 'Av. Vicente Pérez Rosales 850',
    priceDisplay: 'UF 7.900',
    priceUF: 7900,
    priceCLP: 296250000,
    bedrooms: 4,
    bathrooms: 3,
    parking: 2,
    area: '140m²',
    landArea: '140m²',
    isFeatured: true,
    operation: 'Venta',
    type: 'Departamento',
    createdAt: '2026-01-28',
    image: '/images/dept_puerto_varas.jpg',
    gallery: [
      '/images/dept_puerto_varas.jpg',
      '/images/puerto_varas.jpg',
      '/images/frutillar.jpg'
    ],
    agent: AGENTS[1],
    description: 'Amplio departamento con vista panorámica inmejorable al Lago Llanquihue y Volcán Osorno. Edificio de primera categoría con conserjería 24/7, piscina climatizada, gimnasio y quincho.',
    features: [
      'Vista al Lago y Volcán',
      'Piscina Climatizada',
      'Bodega amplia en subterráneo',
      'Termopanel Pella',
      'Calefacción radiante'
    ],
    mapCoords: { lat: -41.3195, lng: -72.9854 }
  },
  {
    id: 3,
    code: 'URB-103',
    slug: 'casa-en-valle-volcanes-rebajada',
    title: 'Casa en Valle Volcanes REBAJADA',
    commune: 'Puerto Montt',
    location: 'Puerto Montt, Región de Los Lagos',
    address: 'Pasaje Cuenca del Rin 1420, Valle Volcanes',
    priceDisplay: '$235.000.000',
    priceUF: 6266,
    priceCLP: 235000000,
    bedrooms: 4,
    bathrooms: 4,
    parking: 2,
    area: '150m²',
    landArea: '280m²',
    isFeatured: true,
    operation: 'Venta',
    type: 'Casa',
    createdAt: '2026-01-20',
    image: '/images/house_valle_volcanes.jpg',
    gallery: [
      '/images/house_valle_volcanes.jpg',
      '/images/house_monte_verde.jpg',
      '/images/puerto_montt.jpg'
    ],
    agent: AGENTS[0],
    description: 'Excelente oportunidad en uno de los sectores residenciales de mayor plusvalía de Puerto Montt. Casa ampliada regularizada, cercana a colegios San Javier y Pumahue, supermercados y clínicas.',
    features: [
      'Amplia cocina equipada',
      'Estufa a pellet',
      'Loggia techada',
      'Patio consolidado',
      'Cámara de seguridad'
    ],
    mapCoords: { lat: -41.4552, lng: -72.9214 }
  },
  {
    id: 4,
    code: 'URB-104',
    slug: 'casa-en-pto-varas-villa-quilen',
    title: 'Casa en Pto Varas, Villa Quilen',
    commune: 'Puerto Varas',
    location: 'Puerto Varas, Región de Los Lagos',
    address: 'Calle Los Alerces 340, Villa Quilen',
    priceDisplay: '$190.000.000',
    priceUF: 5066,
    priceCLP: 190000000,
    bedrooms: 3,
    bathrooms: 3,
    parking: 3,
    area: '120m²',
    landArea: '320m²',
    isFeatured: true,
    operation: 'Venta',
    type: 'Casa',
    createdAt: '2026-01-15',
    image: '/images/house_villa_quilen.jpg',
    gallery: [
      '/images/house_villa_quilen.jpg',
      '/images/puerto_varas.jpg',
      '/images/dept_puerto_varas.jpg'
    ],
    agent: AGENTS[1],
    description: 'Acogedora casa de estilo sureño tradicional con revestimiento duradero y excelente iluminación natural. Barrio residencial tranquilo y consolidado en Puerto Varas.',
    features: [
      'Combustión lenta Bosca',
      'Antejardín',
      'Estacionamiento techado',
      'Portón eléctrico'
    ],
    mapCoords: { lat: -41.3255, lng: -72.9789 }
  },
  {
    id: 5,
    code: 'URB-105',
    slug: 'terreno-orilla-de-lago-en-frutillar',
    title: 'Terreno Orilla de Lago en Frutillar',
    commune: 'Frutillar',
    location: 'Frutillar, Región de Los Lagos',
    address: 'Camino a Frutillar Bajo Km 2.5',
    priceDisplay: 'UF 9.500',
    priceUF: 9500,
    priceCLP: 356250000,
    bedrooms: 0,
    bathrooms: 0,
    parking: 0,
    area: '5.000m²',
    landArea: '5.000m²',
    isFeatured: true,
    operation: 'Venta',
    type: 'Terreno',
    createdAt: '2026-02-04',
    image: '/images/frutillar.jpg',
    gallery: [
      '/images/frutillar.jpg',
      '/images/puerto_varas.jpg'
    ],
    agent: AGENTS[0],
    description: 'Exclusivo lote plano con lomaje suave y frente directo al Lago Llanquihue en Frutillar Bajo. Luz subterránea y red de agua conectada.',
    features: [
      'Acceso directo al lago',
      'Factibilidad eléctrica',
      'Rol propio',
      'Lomaje suave'
    ],
    mapCoords: { lat: -41.1321, lng: -73.0234 }
  },
  {
    id: 6,
    code: 'URB-106',
    slug: 'casa-comercial-sector-centro-osorno',
    title: 'Casa Comercial Sector Centro Osorno',
    commune: 'Osorno',
    location: 'Osorno, Región de Los Lagos',
    address: 'Calle Eleuterio Ramírez 940',
    priceDisplay: 'UF 11.200',
    priceUF: 11200,
    priceCLP: 420000000,
    bedrooms: 6,
    bathrooms: 4,
    parking: 4,
    area: '280m²',
    landArea: '400m²',
    isFeatured: false,
    operation: 'Venta',
    type: 'Casa Comercial',
    createdAt: '2026-01-10',
    image: '/images/osorno.jpg',
    gallery: [
      '/images/osorno.jpg'
    ],
    agent: AGENTS[1],
    description: 'Propiedad comercial de alto flujo peatonal y vehicular en pleno centro de Osorno. Ideal para clínicas, oficinas corporativas, instituciones o restaurant.',
    features: [
      'Zonificación comercial',
      'Red trifásica',
      'Accesibilidad universal',
      'Gran vitrina'
    ],
    mapCoords: { lat: -40.5741, lng: -73.1362 }
  }
];
