import hasRole from '../middlewares/hasRole.ts'
import { UserRoleEditSchema } from '../db/schema.ts'
import { Router } from 'express'
import { validateBody } from '../middlewares/validation.ts'

const router = Router()

// =================================================================== //
// ==== Gestión de usuarios - solo accesible para administradores ==== //
// =================================================================== //

/**
 * @openapi
 * /api/v1/users/{id}/role:
 *   patch:
 *     summary: Cambiar el rol de un usuario (solo para administradores) - SIN IMPLEMENTAR
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
router.patch('/users/:id/role', hasRole('admin'), validateBody(UserRoleEditSchema), (req, res) => {
	res.json({
		message: `Ruta para cambiar el rol del usuario con ID ${req.params.id} - solo accesible para administradores`,
	})
})


export default router
