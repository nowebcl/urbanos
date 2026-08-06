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

export const PROPERTIES = [
  {
    id: 1,
    title: 'Se Vende Casa en Parcela en Monte Verde',
    commune: 'Puerto Montt',
    location: 'Puerto Montt, Puerto Montt',
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
    image: '/images/house_monte_verde.jpg',
    gallery: [
      '/images/house_monte_verde.jpg',
      '/images/puerto_montt.jpg',
      '/images/house_valle_volcanes.jpg'
    ],
    description: 'Espectacular casa mediterránea de arquitectura contemporánea en parcela de 5.000m². Entorno natural privilegiado a minutos del centro de Puerto Montt. Construcción en termopanel, excelente aislación térmica, piso flotante de alto tráfico y terminaciones en madera nativa.',
    features: ['Bosque nativo', 'Calefacción central', 'Agua de vertiente', 'Quincho equipado', 'Fibra óptica']
  },
  {
    id: 2,
    title: 'Venta Departamento en Puerto Varas',
    commune: 'Puerto Varas',
    location: 'Puerto Varas, Puerto Varas',
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
    image: '/images/dept_puerto_varas.jpg',
    gallery: [
      '/images/dept_puerto_varas.jpg',
      '/images/puerto_varas.jpg',
      '/images/frutillar.jpg'
    ],
    description: 'Amplio departamento con vista panorámica inmejorable al Lago Llanquihue y Volcán Osorno. Edificio de primera categoría con conserjería 24/7, piscina climatizada, gimnasio y quincho panoramico.',
    features: ['Vista al Lago y Volcán', 'Piscina Climatizada', 'Bodega amplia', 'Termopanel Pella', 'Calefacción radiante']
  },
  {
    id: 3,
    title: 'Casa en Valle Volcanes REBAJADA',
    commune: 'Puerto Montt',
    location: 'Puerto Montt, Puerto Montt',
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
    image: '/images/house_valle_volcanes.jpg',
    gallery: [
      '/images/house_valle_volcanes.jpg',
      '/images/house_monte_verde.jpg',
      '/images/puerto_montt.jpg'
    ],
    description: 'Excelente oportunidad en uno de los sectores residenciales de mayor plusvalía de Puerto Montt. Casa ampliada regularizada, cercanía a colegios San Javier y Pumahue, supermercados y clínicas.',
    features: ['Amplia cocina equipada', 'Estufa a pellet', 'Loggia techada', 'Patio consolidado', 'Cámara de seguridad']
  },
  {
    id: 4,
    title: 'Casa en Pto Varas, Villa Quilen',
    commune: 'Puerto Varas',
    location: 'Puerto Varas, Puerto Varas',
    address: 'Calle Los Alerces 340, Villa Quilen',
    priceDisplay: '$190.000.000',
    priceUF: 5066,
    priceCLP: 190000000,
    bedrooms: 3,
    bathrooms: 3,
    parking: 3,
    area: '',
    landArea: '320m²',
    isFeatured: true,
    operation: 'Venta',
    type: 'Casa',
    image: '/images/house_villa_quilen.jpg',
    gallery: [
      '/images/house_villa_quilen.jpg',
      '/images/puerto_varas.jpg',
      '/images/dept_puerto_varas.jpg'
    ],
    description: 'Acogedora casa de estilo sureño tradicional con revestimiento duradero y excelente iluminación natural. Barrio residencial tranquilo y consolidado en Puerto Varas.',
    features: ['Estanque de combustión lenta', 'Antejardín', 'Estacionamiento techado', 'Portón eléctrico']
  }
];
