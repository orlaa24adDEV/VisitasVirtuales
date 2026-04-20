import { Router } from 'express'
import hasRole from '../middlewares/hasRole.ts'
import { getAllCentersHandler } from '../controllers/centerController.ts'

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

export default router
