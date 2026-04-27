import type { Request, Response } from 'express'
import centerService from '../services/centerService.ts'
import { asyncHandler } from '../middlewares/asyncHandler.ts'
import type { ValidAuthenticatedRequest } from '../middlewares/validation.ts'
import type { centerUpdateSchema } from '../db/schema.ts'

// Listar todos los centros
export const getAllCentersHandler = asyncHandler(
	async (req: Request, res: Response) => {
		const centers = await centerService.getAllCenters()
		if (centers.length === 0) {
			return res
				.status(200)
				.json({ message: 'No se encontraron centros', centers: [] })
		}
		return res.json({
			message: 'Centros obtenidos exitosamente',
			centers: centers,
		})
	},
)

// Actualizar un centro
export const updateCenterHandler = asyncHandler(
	async (req: Request, res: Response) => {
		const { validData } = req as ValidAuthenticatedRequest<
			typeof centerUpdateSchema
		>
		const { id } = validData.params
		const updatedCenter = await centerService.updateCenter(id, validData.body);

		return res.json({
			message: 'Centro actualizado exitosamente',
			center: updatedCenter,
		})
	},
)