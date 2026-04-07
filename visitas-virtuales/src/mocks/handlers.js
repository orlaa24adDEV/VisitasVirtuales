import { http, HttpResponse } from 'msw';

// Mocks de los endpoints de la API para desarrollo
export const handlers = [
	// Obtener listado de todos los puntos de interés
	http.get('/api/pois', () => {
		return HttpResponse.json(POIS);
	}),

	// Obtener detalles de un punto de interés específico
	http.get('/api/pois/:id', (req) => {
		const { id } = req.params;
		return HttpResponse.json(POIS.find((p) => p.id === id));
	}),

	http.get('/api/centers', () => {
		return HttpResponse.json(CENTERS);
	}),

	http.get('/api/centers/:id', ({params}) => {
		const center = CENTERS.find(c => c.id === params.id);
		if (!center) return new HttpResponse(null, { status: 404 });
		return HttpResponse.json(center);
	}),
];

const CENTERS = [
  {
    id: 'center-1',
    name: 'MEDAC Málaga',
    neighborhood: 'Velázquez',
    address: 'Av. Velázquez 102',
    phone: '905 00 00 12',
    imageUrl: null, // sustituir por URL real cuando esté disponible
  },
  {
    id: 'center-2',
    name: 'MEDAC Sevilla',
    neighborhood: 'Centro',
    address: 'Calle Sierpes 45',
    phone: '905 00 00 13',
    imageUrl: null,
  },
  {
    id: 'center-3',
    name: 'MEDAC Madrid',
    neighborhood: 'Salamanca',
    address: 'Calle Goya 88',
    phone: '905 00 00 14',
    imageUrl: null,
  },
  {
    id: 'center-4',
    name: 'MEDAC Valencia',
    neighborhood: 'Ruzafa',
    address: 'Calle Cuba 12',
    phone: '905 00 00 15',
    imageUrl: null,
  },
  {
    id: 'center-5',
    name: 'MEDAC Barcelona',
    neighborhood: 'Eixample',
    address: 'Carrer de Provença 200',
    phone: '905 00 00 16',
    imageUrl: null,
  },
];

const POIS = [
	{
		id: '1',
		centerId: 'MEDAC Málaga',
		name: 'Tablón de anuncios',
		description:
			'Aquí encontrarás las últimas noticias y eventos relacionados con el centro.',
	},
	{
		id: '2',
		centerId: 'MEDAC Sevilla',
		name: 'Biblioteca',
		description:
			'Un espacio tranquilo para estudiar y acceder a recursos académicos.',
	},
	{
		id: '3',
		centerId: 'MEDAC Madrid',
		name: 'Cafetería',
		description:
			'El lugar perfecto para relajarte y disfrutar de un café entre clases.',
	},
];