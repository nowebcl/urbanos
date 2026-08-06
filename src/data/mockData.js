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
    name: 'Felipe Loyola',
    role: 'Director Comercial & Broker Senior',
    phone: '+56 9 9593 0321',
    email: 'floyola@urbanosgestion.cl',
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 2,
    name: 'Camila Valenzuela',
    role: 'Asesora Inmobiliaria Senior',
    phone: '+56 9 8412 9044',
    email: 'cvalenzuela@urbanosgestion.cl',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80'
  }
];

export const PROPERTIES = [
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
    agent: AGENTS[0],
    description: 'Espectacular casa mediterránea de arquitectura contemporánea en parcela de 5.000m². Entorno natural privilegiado a minutos del centro de Puerto Montt. Construcción en termopanel, excelente aislación térmica, piso flotante de alto tráfico y terminaciones en madera nativa de alerce y roble. Cuenta con amplio living comedor con estufa a pellet, cocina integrada y quincho cerrado.',
    features: [
      'Bosque nativo en terreno',
      'Calefacción central a pellet',
      'Agua de vertiente y APR',
      'Quincho cerrado equipado',
      'Conexión Fibra Óptica',
      'Portón eléctrico de acceso',
      'Ventanas Termopanel PVC',
      'Bodega exterior 20m²'
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
    description: 'Amplio departamento con vista panorámica inmejorable al Lago Llanquihue y Volcán Osorno en exclusivo condominio de Puerto Varas. Edificio de primera categoría con conserjería 24/7, piscina climatizada, gimnasio equipado y salón gourmet con terraza panorámica.',
    features: [
      'Vista en primera línea al Lago y Volcán',
      'Piscina Climatizada en condominio',
      'Bodega amplia en subterráneo',
      'Ventanas Termopanel Pella',
      'Calefacción por losa radiante',
      'Estacionamiento doble en línea',
      'Accesibilidad Universal',
      'Salón de eventos equipado'
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
    description: 'Excelente oportunidad en uno de los sectores residenciales de mayor plusvalía y demanda de Puerto Montt. Casa ampliada y 100% regularizada. Cercanía inmediata a colegios San Javier y Pumahue, supermercados Lider y Jumbo, farmacias y centros médicos.',
    features: [
      'Amplia cocina amoblada y equipada',
      'Estufa a pellet de alta eficiencia',
      'Loggia techada y lavadero',
      'Patio trasero consolidado con césped',
      'Sistema de cámaras de seguridad',
      'Dormitorio principal en suite walk-in closet'
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
    description: 'Acogedora casa de estilo sureño tradicional con revestimiento duradero y excelente iluminación natural durante todo el día. Ubicada en un barrio residencial consolidado, seguro y muy tranquilo en Puerto Varas.',
    features: [
      'Combustión lenta Bosca instalada',
      'Antejardín formado',
      'Estacionamiento techado para 2 autos',
      'Portón eléctrico de acceso vehicular',
      'Bodega de jardín'
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
    description: 'Exclusivo lote plano con lomaje suave y acceso directo a la playa del Lago Llanquihue en Frutillar Bajo. Proyecto listo para construir residencia de lujo. Cableado eléctrico subterráneo y agua potable conectada.',
    features: [
      'Acceso directo a playa del lago',
      'Factibilidad eléctrica subterránea',
      'Rol propio e inscripción en CBR',
      'Lomaje suave panorámico',
      'Entorno natural protegido'
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
    description: 'Estratégica propiedad comercial de alto flujo peatonal y vehicular en pleno centro cívico de Osorno. Ideal para sede corporativa, clínica médica, instituto o restaurante gastronómico.',
    features: [
      'Zonificación Comercial C1',
      'Red Eléctrica Trifásica',
      'Accesibilidad Universal homologada',
      'Gran vitrina a la calle',
      'Amplia zona de bodega posterior'
    ],
    mapCoords: { lat: -40.5741, lng: -73.1362 }
  },
  {
    id: 7,
    code: 'URB-107',
    slug: 'arriendo-departamento-estudio-puerto-montt',
    title: 'Arriendo Departamento Amoblado Centro Puerto Montt',
    commune: 'Puerto Montt',
    location: 'Puerto Montt, Región de Los Lagos',
    address: 'Calle Urmeneta 520',
    priceDisplay: '$580.000',
    priceUF: 15.5,
    priceCLP: 580000,
    bedrooms: 1,
    bathrooms: 1,
    parking: 1,
    area: '48m²',
    landArea: '48m²',
    isFeatured: false,
    operation: 'Arriendo',
    type: 'Departamento',
    createdAt: '2026-02-03',
    image: '/images/dept_puerto_varas.jpg',
    gallery: [
      '/images/dept_puerto_varas.jpg',
      '/images/puerto_montt.jpg'
    ],
    agent: AGENTS[0],
    description: 'Excelente departamento 1 dormitorio completamente amoblado y equipado. Incluye estacionamiento subterráneo y bodega. Gastos comunes incluidos en el valor. Disponible para arriendo anual.',
    features: [
      'Totalmente Amoblado',
      'Calefacción eléctrica mural',
      'Conexión a lavadora',
      'Conserjería 24 hrs',
      'Cerca de mall y terminal'
    ],
    mapCoords: { lat: -41.4721, lng: -72.9398 }
  },
  {
    id: 8,
    code: 'URB-108',
    slug: 'arriendo-casa-en-condominio-puerto-varas',
    title: 'Arriendo Casa en Condominio Ensenada',
    commune: 'Puerto Varas',
    location: 'Puerto Varas, Región de Los Lagos',
    address: 'Ruta 225 Km 12, Ensenada',
    priceDisplay: 'UF 45',
    priceUF: 45,
    priceCLP: 1687500,
    bedrooms: 4,
    bathrooms: 3,
    parking: 3,
    area: '180m²',
    landArea: '5.000m²',
    isFeatured: false,
    operation: 'Arriendo',
    type: 'Casa',
    createdAt: '2026-02-05',
    image: '/images/house_monte_verde.jpg',
    gallery: [
      '/images/house_monte_verde.jpg',
      '/images/puerto_varas.jpg'
    ],
    agent: AGENTS[1],
    description: 'Hermosa casa estilo sureño en condominio cerrado con acceso controlado. Terreno de 5.000m² con árboles nativos y vista despejada al Volcán Calbuco. Arriendo por periodo mínimo de 12 meses.',
    features: [
      'Acceso controlado 24/7',
      'Calefacción central radiante',
      'Bosque nativo en parcela',
      'Fibra óptica disponible'
    ],
    mapCoords: { lat: -41.3412, lng: -72.8941 }
  }
];
