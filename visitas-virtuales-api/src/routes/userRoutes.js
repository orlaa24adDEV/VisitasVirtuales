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
 *     summary: Registrar un nuevo usuario
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
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
 *       400:
 *         description: Email, nombre de usuario o contraseña no proporcionados
 *       409:
 *         description: Email o nombre de usuario ya en uso
 *       500:
 *         description: Error del servidor al registrar el usuario
 */
router.post('/users', registerHandler)

/**
 * @openapi
 * /api/v1/users/me:
 *   get:
 *     summary: Obtener el perfil del usuario autenticado
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Perfil del usuario obtenido con éxito
 *       401:
 *         description: No se proporcionó un token de acceso o el token es inválido
 */
router.get('/me', isAuthenticated, profileHandler)

/**
 * @openapi
 * /api/v1/users/auth:
 *   post:
 *     summary: Iniciar sesión y obtener tokens de acceso y actualización
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Inicio de sesión exitoso, se devuelve un token de acceso
 *       400:
 *         description: Formato de solicitud no válido
 *       401:
 *         description: Credenciales incorrectas
 */
router.post('/users/auth', loginHandler)

/**
 * @openapi
 * /api/v1/users/{id}:
 *   put:
 *     summary: Actualizar la información de un usuario (solo para el propio usuario)
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Usuario actualizado con éxito
 *       400:
 *         description: Formato de solicitud no válido
 *       401:
 *         description: Token de acceso no proporcionado o inválido
 *       403:
 *         description: Usuario autenticado no tiene permiso para actualizar este usuario
 */
router.put('/users/:id', isAuthenticated, userUpdateHandler)

/**
 * @openapi
 * /api/v1/users/auth/refresh:
 *   get:
 *     summary: Obtener un nuevo token de acceso utilizando un token de actualización
 *     tags: [User]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Nuevo token de acceso generado con éxito
 *       401:
 *         description: No se proporcionó un token de actualización
 *       403:
 *         description: El token de actualización proporcionado es inválido o ha expirado
 */
router.get('/users/auth/refresh', refreshTokenHandler)

export default router
