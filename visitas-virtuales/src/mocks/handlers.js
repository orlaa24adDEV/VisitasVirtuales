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
		centerId: 'MEDAC Málaga',
		name: 'Biblioteca',
		description:
			'Un espacio tranquilo para estudiar y acceder a recursos académicos.',
	},
	{
		id: '3',
		centerId: 'MEDAC Málaga',
		name: 'Cafetería',
		description:
			'El lugar perfecto para relajarte y disfrutar de un café entre clases.',
	},
];
