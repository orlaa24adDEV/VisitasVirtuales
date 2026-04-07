import { Router } from 'express'
import {
	registerHandler,
	loginHandler,
	userUpdateHandler,
	refreshTokenHandler,
	profileHandler,
} from '../controllers/userController.js'
import isAuthenticated from '../middlewares/isAuthenticated.js'
const router = Router()

/**
 * @openapi
 * /api/v1/users:
 *   post:
 *     summary: Registrar nuevo usuario
 *     description: Registra un nuevo usuario con email, nombre de usuario y contraseña. Al primer usuario registrado se le asignará automáticamente el rol de "admin", mientras que los siguientes usuarios registrados tendrán el rol de "user". Devuelve un token de acceso para autenticación en futuras solicitudes. El token de actualización se envía al cliente en una cookie HTTP-only.
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [username, email, password]
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Usuario registrado con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *       400:
 *         description: Email, nombre de usuario o contraseña no proporcionados
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       409:
 *         description: Email o nombre de usuario ya en uso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Error del servidor al registrar el usuario
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
router.post('/users', registerHandler)

/**
 * @openapi
 * /api/v1/me:
 *   get:
 *     summary: Obtener perfil del usuario autenticado
 *     description: Devuelve el perfil del usuario autenticado. Requiere un token de acceso válido en el header Authorization.
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Perfil del usuario obtenido con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 username:
 *                   type: string
 *                 email:
 *                   type: string
 *                 role:
 *                   type: string
 *       401:
 *         description: Token de acceso no proporcionado o inválido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
router.get('/me', isAuthenticated, profileHandler)

/**
 * @openapi
 * /api/v1/users/auth:
 *   post:
 *     summary: Iniciar sesión de usuario
 *     description: Permite a un usuario iniciar sesión utilizando su email junto con su contraseña. Devuelve un token de acceso para autenticación en futuras solicitudes. El token de actualización se envía al cliente en una cookie HTTP-only.
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Usuario autenticado con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *       400:
 *         description: Formato de solicitud no válido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       401:
 *         description: Credenciales incorrectas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Error del servidor al autenticar el usuario
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
router.post('/users/auth', loginHandler)

/**
 * @openapi
 * /api/v1/users:
 *   put:
 *     summary: Editar perfil del usuario autenticado
 *     description: Permite al usuario autenticado editar su propio perfil, incluyendo su nombre de usuario y contraseña. Requiere un token de acceso válido en el header Authorization.
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             required: [currentPassword]
 *             type: object
 *             properties:
 *               currentPassword:
 *                 type: string
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Usuario actualizado con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       400:
 *         description: Formato de solicitud no válido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       401:
 *         description: Token de acceso no proporcionado o inválido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       403:
 *         description: Usuario autenticado no tiene permiso para actualizar este usuario
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Error del servidor al actualizar el usuario
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
router.put('/users/:id', isAuthenticated, userUpdateHandler)

/**
 * @openapi
 * /api/v1/users/auth/refresh:
 *   post:
 *     summary: Renovar tokens
 *     description: Permite a un usuario renovar sus tokens de acceso y actualización utilizando un token de actualización válido. El nuevo token de acceso se devuelve en la respuesta, mientras que el nuevo token de actualización se envía al cliente en una cookie HTTP-only.
 *     tags: [User]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Tokens renovados con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *       401:
 *         description: No se proporcionó un token de actualización
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       403:
 *         description: El token de actualización proporcionado es inválido o ha expirado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
router.post('/users/auth/refresh', refreshTokenHandler)

// router.get('/pois', isAuthenticated, (req, res) => {
// 	res.json({
// 		message:
// 			'Ruta para listar todos los POIs asociados a un centro',
// 	})
// })

export default router
