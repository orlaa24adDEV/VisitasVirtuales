import { http, HttpResponse } from 'msw';

// Mocks de los endpoints de la API para desarrollo
export const handlers = [

  // Listado de POIs de un centro específico
  http.get('*/api/centers/:centerId/pois', ({ params }) => {
    const { centerId } = params;
    // Buscar POIs que pertenezcan a este centro (por id)
    const pois = POIS.filter((p) => p.centerId === centerId)
      .map(poi => ({ ...poi, description: poi.details?.description || '' }));
    return HttpResponse.json(pois);
  }),

  // Obtener detalles de un POI específico de un centro
  http.get('*/api/centers/:centerId/pois/:id', ({ params }) => {
    const { centerId, id } = params;
    const poi = POIS.find(p => p.id === id && p.centerId === centerId);
    if (!poi) return new HttpResponse(null, { status: 404 });
    return HttpResponse.json({ ...poi, description: poi.details?.description || '' });
  }),

  // Listado de centros
  http.get('*/api/centers', () => {
    return HttpResponse.json(CENTERS);
  }),

  // Detalle de centro específico
  http.get('*/api/centers/:id', ({params}) => {
    const center = CENTERS.find(c => c.id === params.id);
    if (!center) return new HttpResponse(null, { status: 404 });
    return HttpResponse.json(center);
  }),
];

const CENTERS = [
  {
    id: '1',
    name: 'Instituto Madrid',
    description: 'Centro educativo principal en Madrid',
    location: 'Madrid, España',
  },
  {
    id: '2',
    name: 'Instituto Barcelona',
    description: 'Centro educativo principal en Barcelona',
    location: 'Barcelona, España',
  },
  {
    id: '3',
    name: 'Instituto Sevilla',
    description: 'Centro educativo principal en Sevilla',
    location: 'Sevilla, España',
  },
];

const POIS = [
  // Instituto Madrid (id: '1')
  {
    id: '1',
    centerId: '1',
    name: 'Cafetería',
    details: { description: 'Cafetería principal del centro' },
    userId: '4', // prof_mad
  },
  {
    id: '2',
    centerId: '1',
    name: 'Tablón de anuncios',
    details: { description: 'Tablón de anuncios de Instituto Madrid' },
    userId: '1', // admin_mad
  },
  {
    id: '3',
    centerId: '1',
    name: 'Biblioteca',
    details: { description: 'Biblioteca del centro' },
    userId: '4', // prof_mad
  },
  // Instituto Barcelona (id: '2')
  {
    id: '4',
    centerId: '2',
    name: 'Aula 101',
    details: { description: 'Aula principal de informática' },
    userId: '5', // prof_bar
  },
  {
    id: '5',
    centerId: '2',
    name: 'Cafetería',
    details: { description: 'Cafetería de Instituto Barcelona' },
    userId: '2', // admin_bar
  },
  // Instituto Sevilla (id: '3')
  {
    id: '6',
    centerId: '3',
    name: 'Sala de profesores',
    details: { description: 'Sala de profesores de Instituto Sevilla' },
    userId: '6', // prof_sev
  },
  {
    id: '7',
    centerId: '3',
    name: 'Tablón de anuncios',
    details: { description: 'Tablón de anuncios de Instituto Sevilla' },
    userId: '3', // admin_sev
  },
];