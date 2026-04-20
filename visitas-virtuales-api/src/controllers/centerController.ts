import type { Request, Response } from 'express'
import centerService from '../services/centerService.ts'
import { type Center } from '../db/schema.ts'

type AllCentersResponse = {
	message: string
	centers: Center[]
}

// Listar todos los centros
export const getAllCentersHandler = async (
	req: Request,
	res: Response<AllCentersResponse>,
): Promise<Response<AllCentersResponse>> => {
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
}
