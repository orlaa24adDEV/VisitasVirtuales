import { Router } from 'express'
import {
	loginHandler,
	userUpdateHandler,
	refreshTokenHandler,
	profileHandler,
	logoutHandler,
} from '../controllers/userController.js'
import { userLoginSchema, userRegisterSchema, UserRoleEditSchema } from '../db/schema.ts'
import { validateBody } from '../middlewares/validation.ts'
import hasRole from '../middlewares/hasRole.ts'
const router = Router()

/**
 * @openapi
 * /api/v1/me:
 *   get:
 *     summary: Obtener perfil del usuario autenticado (solo para administradores y profesores)
 *     description: Devuelve el perfil del usuario autenticado. Requiere un token de acceso válido en el header Authorization. Los usuarios invitados no tienen un perfil, por lo que no podrán acceder a esta ruta.
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
 *                 message:
 *                   type: string
 *                 profile:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     email:
 *                       type: string
 *                     username:
 *                       type: string
 *                     role:
 *                       type: string
 *       401:
 *         description: Token de acceso no proporcionado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       403:
 *         description: Token de acceso inválido o expirado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: Usuario no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Error del servidor al obtener el perfil del usuario
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
router.get('/me', hasRole(['admin', 'teacher']), profileHandler)

/**
 * @openapi
 * /api/v1/users/auth:
 *   post:
 *     summary: Iniciar sesión de usuario
 *     description: Permite a un usuario iniciar sesión utilizando su email o su nombre de usuario junto con su contraseña. Devuelve un token de acceso para autenticación en futuras solicitudes. El token de actualización se envía al cliente en una cookie HTTP-only. El administrador se encargará de registrar a los usuarios y darles los credenciales que deben utilizar en esta ruta para iniciar sesión.
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             oneOf:
 *               - type: object
 *                 required: [email, password]
 *                 properties:
 *                   email:
 *                     type: string
 *                     maxLength: 120
 *                     format: email
 *                     example: 'admin_mad@instituto.es'
 *                   password:
 *                     type: string
 *                     minLength: 8
 *                     maxLength: 32
 *                     example: 'Admin123!'
 *               - type: object
 *                 required: [username, password]
 *                 properties:
 *                   username:
 *                     type: string
 *                     minLength: 6
 *                     maxLength: 24
 *                     example: 'admin_mad'
 *                   password:
 *                     type: string
 *                     minLength: 8
 *                     maxLength: 32
 *                     example: 'Admin123!'
 *     responses:
 *       200:
 *         description: Usuario autenticado con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 accessToken:
 *                   type: string
 *       400:
 *         description: Formato de solicitud no válido o campos requeridos no proporcionados
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
router.post('/users/auth', validateBody(userLoginSchema), loginHandler)

/**
 * @openapi
 * /api/v1/users/auth/logout:
 *   post:
 *     summary: Cerrar sesión de usuario
 *     description: Permite a un usuario cerrar su sesión actual. Requiere un token de acceso válido en el header Authorization. El token de actualización asociado al usuario se invalidará y eliminará del cliente. Los usuarios invitados no pueden iniciar sesión, por lo que no necesitan cerrar sesión.
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Sesión cerrada con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       401:
 *         description: Token de acceso no proporcionado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       403:
 *         description: Token de acceso inválido o expirado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Error del servidor al cerrar la sesión del usuario
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
router.post('/users/auth/logout', hasRole(['admin', 'teacher']), logoutHandler)

/**
 * @openapi
 * /api/v1/me:
 *   patch:
 *     summary: Editar perfil del usuario autenticado (solo para administradores y profesores) - SIN IMPLEMENTAR
 *     description: Permite al usuario autenticado editar su propio perfil, incluyendo su email, nombre de usuario y contraseña. Requiere un token de acceso válido en el header Authorization.
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
 *               email:
 *                 type: string
 *               username:
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
 *         description: Token de acceso no proporcionado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       403:
 *         description: Token de acceso inválido o expirado
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
router.patch('/me', hasRole(['admin', 'teacher']), userUpdateHandler)

/**
 * @openapi
 * /api/v1/users/auth/refresh:
 *   post:
 *     summary: Renovar tokens de autenticación utilizando token de actualización (solo para administradores y profesores)
 *     description: Permite a un usuario renovar sus tokens utilizando un token de actualización válido. Devuelve un nuevo token de acceso en la respuesta y asigna un nuevo token de actualización en una cookie HTTP-only. Los invitados no necesitan renovar tokens, se les permite el acceso a las rutas públicas sin autenticación.
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
 *                 message:
 *                   type: string
 *                 accessToken:
 *                   type: string
 *       401:
 *         description: Token de actualización no proporcionado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       403:
 *         description: Token de actualización inválido o expirado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
router.post('/users/auth/refresh', hasRole(['admin', 'teacher']), refreshTokenHandler)

/**
 * @openapi
 * /api/v1/users/{id}/role:
 *   patch:
 *     summary: Cambiar el rol de un usuario (solo para administradores) - SIN IMPLEMENTAR
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario al que se le cambiará el rol
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               role:
 *                 type: string
 *                 enum: [admin, teacher, student]
 *                 description: Nuevo rol para el usuario
 *     responses:
 *       200:
 *         description: Rol del usuario actualizado con éxito
 *       400:
 *         description: Rol proporcionado no es válido
 *       401:
 *         description: No se proporcionó un token de acceso
 *       403:
 *         description: El token proporcionado no es válido o el usuario no tiene permisos de administrador
 */
router.patch(
	'/users/:id/role',
	hasRole('admin'),
	validateBody(UserRoleEditSchema),
	(req, res) => {
		res.json({
			message: `Ruta para cambiar el rol del usuario con ID ${req.params.id} - solo accesible para administradores`,
		})
	},
)

export default router
