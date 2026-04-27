import { Router } from 'express'
import hasRole from '../middlewares/hasRole.ts'
import { getAllCentersHandler, updateCenterHandler } from '../controllers/centerController.ts'
import { validateRequest } from '../middlewares/validation.ts'
import { centerUpdateSchema } from '../db/schema.ts'

export const router = Router()

// ========================= //
// ==== CRUD de Centros ==== //
// ========================= //

/**
 * @openapi
 * /api/v1/centers:
 *   get:
 *     summary: Obtener listado de todos los centros disponibles
 *     description: Esta ruta permite a los usuarios obtener una lista de todos los centros disponibles en el sistema
 *     tags: [Centros]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Centros obtenidos exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Centros obtenidos exitosamente"
 *                 centers:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: 1
 *                       name:
 *                         type: string
 *                         example: "Instituto Madrid"
 *                       description:
 *                         type: string
 *                         example: "Centro educativo principal en Madrid"
 *                       location:
 *                         type: string
 *                         example: "Madrid, España"
 *       401:
 *         description: No se proporcionó un token de acceso
 *       403:
 *         description: Token de acceso inválido o expirado
 */
router.get(
	'/centers',
	hasRole(['admin', 'teacher', 'guest']),
	getAllCentersHandler,
)

/**
 * @openapi
 * /api/v1/centers/{id}:
 *   patch:
 *     summary: Actualizar un centro específico
 *     description: Esta ruta permite a los administradores actualizar la información de un centro específico utilizando su ID
 *     tags: [Centros]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *         description: ID del centro a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Instituto Madrid Actualizado"
 *               description:
 *                 type: string
 *                 example: "Centro educativo principal en Madrid, actualizado"
 *               location:
 *                 type: string
 *                 example: "Madrid, España"
 *               imageUrl:
 *                 type: string
 *                 format: url
 *                 example: "https://example.com/updated-image.jpg"
 *     responses:
 *       200:
 *         description: Centro actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Centro actualizado exitosamente"
 *                 center:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: 1
 *                     name:
 *                       type: string
 *                       example: "Instituto Madrid Actualizado"
 *                     description:
 *                       type: string
 *                       example: "Centro educativo principal en Madrid, actualizado"
 *                     location:
 *                       type: string
 *                       example: "Madrid, España"
 *                     imageUrl:
 *                       type: string
 *                       format: url
 *                       example: "https://example.com/updated-image.jpg"
 *       400:
 *         description: Datos de entrada inválidos
 *       401:
 *         description: Token de acceso no proporcionado
 *       403:
 *         description: Token de acceso inválido, expirado o el usuario no tiene permisos para actualizar el centro
 *       404:
 *         description: Centro no encontrado
 */
router.patch('/centers/:id', hasRole(['admin']), validateRequest({params: centerUpdateSchema.shape.params, body: centerUpdateSchema.shape.body}), updateCenterHandler)

export default router
