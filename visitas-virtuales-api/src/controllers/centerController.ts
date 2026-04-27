import type { Request, Response } from 'express'
import centerService from '../services/centerService.ts'
import { asyncHandler } from '../middlewares/asyncHandler.ts'

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
