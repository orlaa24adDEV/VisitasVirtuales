import isAdmin from '../middlewares/isAdmin.js'
import isAuthenticated from '../middlewares/isAuthenticated.js'
import { Router } from 'express'
import {
    getPoisByCenterHandler,
    createPoiHandler,
    updatePoiHandler,
    deletePoiHandler,
    getPoiHistoryHandler,
} from '../controllers/poiController.js'

const router = Router()

// =================================================================== //
// ==== Gestión de usuarios - solo accesible para administradores ==== //
// =================================================================== //

/**
 * @openapi
 * /api/v1/users/{id}/role:
 *   patch:
 *     summary: Cambiar el rol de un usuario (solo para administradores) (SIN IMPLEMENTAR)
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
router.patch('/users/:id/role', isAuthenticated, isAdmin, (req, res) => {
	res.json({
		message: `Ruta para cambiar el rol del usuario con ID ${req.params.id} - solo accesible para administradores`,
	})
})

// ============================================================ //
// ==== CRUD de POIs - solo accesible para administradores ==== //
// ============================================================ //

/**
 * @openapi
 * /api/v1/admin/pois:
 *   post:
 *     summary: Crear un nuevo POI (solo para administradores) (SIN IMPLEMENTAR)
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
router.post('/pois', isAuthenticated, isAdmin, createPoiHandler)

/**
 * @openapi
 * /api/v1/pois:
 *   get:
 *     summary: Listar todos los POIs (solo para administradores) (SIN IMPLEMENTAR)
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
router.get('/pois', isAuthenticated, isAdmin, getPoisByCenterHandler)

/**
 * @openapi
 * /api/v1/admin/pois/{id}:
 *   put:
 *     summary: Actualizar un POI existente (solo para administradores) (SIN IMPLEMENTAR)
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
router.put('/pois/:id', isAuthenticated, isAdmin, updatePoiHandler)

/**
 * @openapi
 * /api/v1/admin/pois/{id}:
 *   delete:
 *     summary: Eliminar un POI existente (solo para administradores) (SIN IMPLEMENTAR)
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
router.delete('/pois/:id', isAuthenticated, isAdmin, deletePoiHandler)

// ================================================================ //
// ==== Historial de trazabilidad - accesible para autenticados ==== //
// ================================================================ //

/**
 * @openapi
 * /api/v1/pois/{id}/history:
 *   get:
 *     summary: Obtener el historial de cambios de un POI
 *     tags: [POIs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del POI cuyo historial se quiere consultar
 *     responses:
 *       200:
 *         description: Historial obtenido con éxito
 *       401:
 *         description: No se proporcionó un token de acceso
 */
router.get('/pois/:id/history', isAuthenticated, getPoiHistoryHandler)

export default router