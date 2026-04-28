import { db } from '../db/db.ts'
import { ApiError } from '../middlewares/errorHandler.ts'
import { eq, and, ilike, gt, asc } from 'drizzle-orm'
import { pois, centers, poiHistory } from '../db/schema.ts'
import type { CreatePoiType, Poi } from '../db/schema.ts'

const createPoi = async (
	centerId: string,
	userId: number,
	poiData: { name: string; details: any },
): Promise<Poi> => {
	const [center] = await db
		.select({
			id: centers.id,
		})
		.from(centers)
		.where(eq(centers.id, Number(centerId)))
		.limit(1)

	if (!center) {
		throw new ApiError(404, 'Centro no encontrado')
	}

	const [existingPoi] = await db
		.select()
		.from(pois)
		.where(
			and(eq(pois.name, poiData.name), eq(pois.centerId, Number(centerId))),
		)
		.limit(1)

	if (existingPoi) {
		throw new ApiError(409, 'Ya existe un POI con ese nombre en este centro')
	}

	const [newPoi] = (await db
		.insert(pois)
		.values({
			name: poiData.name,
			details: poiData.details,
			userId: userId,
			centerId: Number(centerId),
		})
		.returning()) as Poi[]

	if (!newPoi) {
		throw new ApiError(500, 'Error al crear el POI')
	}

	return newPoi
}

const getPoisByCenter = async (validData: any): Promise<Poi[]> => {
	const { centerId } = validData.params
	const { limit, lastId } = validData.query

	const [center] = await db
		.select({
			id: centers.id,
		})
		.from(centers)
		.where(eq(centers.id, Number(centerId)))
		.limit(1)

	if (!center) {
		throw new ApiError(404, 'Centro no encontrado')
	}

	const poiArr: Poi[] = await db
		.select({
			id: pois.id,
			name: pois.name,
			details: pois.details,
			userId: pois.userId,
			centerId: pois.centerId,
		})
		.from(pois)
		// Keyset pagination con cursor (lastId). Carga la siguiente página de resultados después del último ID recibido
		.where(
			and(
				eq(pois.centerId, Number(centerId)),
				lastId ? gt(pois.id, Number(lastId)) : undefined,
			),
		)
		.orderBy(asc(pois.id))
		.limit(limit ?? 10) // Si no se proporciona un límite, usar 10 por defecto

	return poiArr
}

export const getPoisByUserAndCenter = async (
	userId: number,
	centerId: string,
): Promise<Poi[]> => {
	const [center] = await db
		.select({
			id: centers.id,
		})
		.from(centers)
		.where(eq(centers.id, Number(centerId)))
		.limit(1)

	if (!center) {
		throw new ApiError(404, 'Centro no encontrado')
	}

	const poiArr: Poi[] = await db
		.select({
			id: pois.id,
			name: pois.name,
			details: pois.details,
			userId: pois.userId,
			centerId: pois.centerId,
		})
		.from(pois)
		.where(and(eq(pois.centerId, Number(centerId)), eq(pois.userId, userId)))

	return poiArr
}

const getPoisByCenterAndFuzzyName = async (
	centerId: string,
	partialName: string,
): Promise<Poi[]> => {
	const [center] = await db
		.select({
			id: centers.id,
		})
		.from(centers)
		.where(eq(centers.id, Number(centerId)))
		.limit(1)

	if (!center) {
		throw new ApiError(404, 'Centro no encontrado')
	}

	const poiArr: Poi[] = await db
		.select({
			id: pois.id,
			name: pois.name,
			details: pois.details,
			userId: pois.userId,
			centerId: pois.centerId,
		})
		.from(pois)
		.where(
			and(
				eq(pois.centerId, Number(centerId)),
				ilike(pois.name, `%${partialName}%`),
			),
		)

	return poiArr
}

const getAllPois = async (): Promise<Poi[]> => {
	const poiArr: Poi[] = await db
		.select({
			id: pois.id,
			name: pois.name,
			details: pois.details,
			userId: pois.userId,
			centerId: pois.centerId,
		})
		.from(pois)

	return poiArr
}

const deletePoiByCenterAndId = async (
	userId: number,
	centerId: string,
	poiId: string,
): Promise<Poi> => {
	const [center] = await db
		.select({
			id: centers.id,
		})
		.from(centers)
		.where(eq(centers.id, Number(centerId)))
		.limit(1)

	if (!center) {
		throw new ApiError(404, 'Centro no encontrado')
	}

	const [poi] = await db
		.select()
		.from(pois)
		.where(
			and(
				eq(pois.centerId, Number(centerId)),
				eq(pois.id, Number(poiId)),
				eq(pois.userId, userId),
			),
		)
		.limit(1)

	if (!poi) {
		throw new ApiError(404, 'POI no encontrado en este centro')
	}

	await db
		.delete(pois)
		.where(and(eq(pois.centerId, Number(centerId)), eq(pois.id, Number(poiId))))
	return poi
}

//Modificar un POI existente y registrar el cambio en el historial
const updatePoi = async (
	userId: number,
	centerId: string,
	poiId: string,
	poiData: { name?: string; details?: any },
): Promise<Poi> => {
	//verificar que el poi exista en el centro indicado
	const [existingPoi] = await db
		.select()
		.from(pois)
		.where(and(eq(pois.id, Number(poiId)), eq(pois.centerId, Number(centerId))))
		.limit(1)

	if (!existingPoi) {
		throw new ApiError(404, 'POI no encontrado en este centro')
	}

	if (poiData.name === undefined && poiData.details === undefined) {
		throw new ApiError(
			400,
			'Debes enviar al menos name o details para actualizar el POI',
		)
	}

	const updateData: Partial<CreatePoiType['body']> = {}
	if (poiData.name !== undefined) updateData.name = poiData.name
	if (poiData.details !== undefined) updateData.details = poiData.details

	let updated: Poi
	try {
		//Modificar o actualizar el POI con los nuevos datos
		const [updatedPoi] = (await db
			.update(pois)
			.set(updateData)
			.where(
				and(eq(pois.id, Number(poiId)), eq(pois.centerId, Number(centerId))),
			)
			.returning()) as Poi[]

		if (!updatedPoi) {
			throw new ApiError(500, 'Error al actualizar el POI')
		}

		updated = updatedPoi
	} catch (error: any) {
		const pgErrorCode = error?.code ?? error?.cause?.code
		if (pgErrorCode === '23505') {
			throw new ApiError(409, 'Ya existe un POI con ese nombre en este centro')
		}
		throw error
	}

	//Registrar el cambio en el historial de trazabilidad
	await db.insert(poiHistory).values({
		poiId: updated.id,
		userId: Number(userId),
		action: 'updated',
		details: {
			before: { name: existingPoi.name, details: existingPoi.details },
			after: { name: updated.name, details: updated.details },
		},
	})

	return updated
}

// Obtener el historial de cambios de un POI concreto
const getPoiHistory = async (poiId: string): Promise<any[]> => {
	const result = await db
		.select()
		.from(poiHistory)
		.where(eq(poiHistory.poiId, Number(poiId)))

	return result
}

export default {
	createPoi,
	getPoisByCenter,
	getPoisByCenterAndFuzzyName,
	deletePoiByCenterAndId,
	getPoisByUserAndCenter,
	getAllPois,
	updatePoi,
	getPoiHistory,
}
