import { http, HttpResponse } from 'msw';

// Simule storage de usuarios registrados
const users = {};
let nextUserId = 8;

// Mocks de los endpoints de la API para desarrollo
export const handlers = [
  // Login de usuario
  http.post('*/api/users/auth', async ({ request }) => {
    const body = await request.json();
    const { email, password } = body;

    // Buscar usuario por email
    const user = Object.values(users).find(u => u.email === email);

    if (!user) {
      return HttpResponse.json(
        { message: 'Usuario o contraseña inválidos' },
        { status: 401 }
      );
    }

    if (user.password !== password) {
      return HttpResponse.json(
        { message: 'Usuario o contraseña inválidos' },
        { status: 401 }
      );
    }

    // Generar token simulado
    const accessToken = `token_${user.id}_${Date.now()}`;

    return HttpResponse.json({
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
      },
    });
  }),

  // Registro de usuario
  http.post('*/api/users', async ({ request }) => {
    const body = await request.json();
    const { email, username, password } = body;

    // Validar que no existe el usuario
    if (Object.values(users).find(u => u.email === email || u.username === username)) {
      return HttpResponse.json(
        { message: 'El usuario o email ya existe' },
        { status: 400 }
      );
    }

    // Crear nuevo usuario
    const newUser = {
      id: String(nextUserId++),
      email,
      username,
      password, // En producción, hashear
      role: 'user',
      name: '',
      age: null,
      phone: '',
    };

    users[newUser.id] = newUser;

    // Generar token simulado
    const accessToken = `token_${newUser.id}_${Date.now()}`;

    return HttpResponse.json({
      accessToken,
      user: {
        id: newUser.id,
        email: newUser.email,
        username: newUser.username,
        role: newUser.role,
      },
    }, { status: 201 });
  }),

  // Obtener perfil del usuario actual
  http.get('*/api/me', ({ request }) => {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
      return HttpResponse.json(
        { message: 'No autorizado' },
        { status: 401 }
      );
    }

    // Extraer token y obtener usuario (simulado)
    const token = authHeader.replace('Bearer ', '');
    const userId = token.split('_')[1]; // Formato: token_{id}_{timestamp}

    const user = users[userId];
    if (!user) {
      return HttpResponse.json(
        { message: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    return HttpResponse.json({
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
      name: user.name,
      age: user.age,
      phone: user.phone,
    });
  }),

  // Listado de todos los POIs
  http.get('*/api/pois', () => {
    return HttpResponse.json(POIS);
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