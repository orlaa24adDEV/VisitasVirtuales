import isAdmin from '../middlewares/isAdmin.js'
import isAuthenticated from '../middlewares/isAuthenticated.js'
import { Router } from 'express'

const router = Router()

// No es necesario que los admin tengan acceso a un CRUD completo de usuarios, solo a la gestión de roles

/**
 * @openapi
 * /admin/users/{id}/role:
 *   put:
 *     summary: Cambiar el rol de un usuario (solo para administradores)
 *     tags: [Admin]
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
 *                 enum: [user, admin]
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
router.put('/admin/users/:id/role', isAuthenticated, isAdmin, (req, res) => {
	res.json({
		message: `Ruta para cambiar el rol del usuario con ID ${req.params.id} - solo accesible para administradores`,
	})
})

router.get('/admin', isAuthenticated, isAdmin, (req, res) => {
	res.json({
		message: 'Ruta de administración - solo accesible para administradores',
	})
})

// CRUD de POIs - solo accesible para administradores
/**
 * @openapi
 * /admin/pois:
 *   post:
 *     summary: Crear un nuevo POI (solo para administradores)
 *     tags: [POIs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: POI creado con éxito
 *       401:
 *         description: No se proporcionó un token de acceso
 *       403:
 *         description: El token proporcionado no es válido o el usuario no tiene permisos de administrador
 */
router.post('/admin/pois', isAuthenticated, isAdmin, (req, res) => {
	res.json({
		message:
			'Ruta para crear un nuevo POI - solo accesible para administradores',
	})
})

/**
 * @openapi
 * /admin/pois:
 *   get:
 *     summary: Listar todos los POIs (solo para administradores)
 *     tags: [POIs]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de POIs obtenida con éxito
 *       401:
 *         description: No se proporcionó un token de acceso
 *       403:
 *         description: El token proporcionado no es válido o el usuario no tiene permisos de administrador
 */
router.get('/admin/pois', isAuthenticated, isAdmin, (req, res) => {
	res.json({
		message:
			'Ruta para listar todos los POIs - solo accesible para administradores',
	})
})

/**
 * @openapi
 * /admin/pois/{id}:
 *   put:
 *     summary: Actualizar un POI existente (solo para administradores)
 *     tags: [POIs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del POI a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: POI actualizado con éxito
 *       401:
 *         description: No se proporcionó un token de acceso
 *       403:
 *         description: El token proporcionado no es válido o el usuario no tiene permisos de administrador
 */
router.put('/admin/pois/:id', isAuthenticated, isAdmin, (req, res) => {
	res.json({
		message: `Ruta para actualizar el POI con ID ${req.params.id} - solo accesible para administradores`,
	})
})

/**
 * @openapi
 * /admin/pois/{id}:
 *   delete:
 *     summary: Eliminar un POI existente (solo para administradores)
 *     tags: [POIs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del POI a eliminar
 *     responses:
 *       200:
 *         description: POI eliminado con éxito
 *       401:
 *         description: No se proporcionó un token de acceso
 *       403:
 *         description: El token proporcionado no es válido o el usuario no tiene permisos de administrador
 */
router.delete('/admin/pois/:id', isAuthenticated, isAdmin, (req, res) => {
	res.json({
		message: `Ruta para eliminar el POI con ID ${req.params.id} - solo accesible para administradores`,
	})
})

export default router
