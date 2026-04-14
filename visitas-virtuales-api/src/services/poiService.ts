import { db } from '../db/db.js'
import ApiError from '../helpers/ApiError.js'
import { eq, and, ilike } from 'drizzle-orm'
import { pois, centers, poiHistory } from '../db/schema.ts'
import type { Poi, PoiCreateType } from '../db/schema.ts'

export const createPoi: (centerId: string, userId: string, poiData: PoiCreateType) => Promise<void> = async (centerId, userId, poiData) => {
  const centerArr = await db.select({
    id: centers.id,
  }).from(centers).where(eq(centers.id, Number(centerId))).limit(1)
  
  const center = centerArr[0]

  if (!center) {
    throw new ApiError(404, 'Centro no encontrado')
  }

  await db.insert(pois).values({
    name: poiData.name,
    details: poiData.details,
    userId: Number(userId),
    centerId: Number(centerId)
  })
}

const getPoisByCenter: (centerId: string) => Promise<Poi[]> = async (centerId) => {
  const centerArr = await db.select({
    id: centers.id,
  }).from(centers).where(eq(centers.id, Number(centerId))).limit(1)

  const center = centerArr[0]

  if (!center) {
    throw new ApiError(404, 'Centro no encontrado')
  }

  const poiArr: Poi[] = await db.select({
    id: pois.id,
    name: pois.name,
    details: pois.details,
    userId: pois.userId,
    centerId: pois.centerId
  }).from(pois).where(eq(pois.centerId, Number(centerId)))

  return poiArr
}

export const getPoisByUserAndCenter: (userId: string, centerId: string) => Promise<Poi[]> = async (userId, centerId) => {
  const centerArr = await db.select({
    id: centers.id,
  }).from(centers).where(eq(centers.id, Number(centerId))).limit(1)

  const center = centerArr[0]

  if (!center) {
    throw new ApiError(404, 'Centro no encontrado')
  }

  const poiArr: Poi[] = await db.select({
    id: pois.id,
    name: pois.name,
    details: pois.details,
    userId: pois.userId,
    centerId: pois.centerId
  }).from(pois).where(and(eq(pois.centerId, Number(centerId)), eq(pois.userId, Number(userId))))

  return poiArr
}

const getPoisByCenterAndFuzzyName: (centerId: string, partialName: string) => Promise<Poi[]> = async (centerId, partialName) => {
  const centerArr = await db.select({
    id: centers.id,
  }).from(centers).where(eq(centers.id, Number(centerId))).limit(1)

  const center = centerArr[0]

  if (!center) {
    throw new ApiError(404, 'Centro no encontrado')
  }

  const poiArr: Poi[] = await db.select({
    id: pois.id,
    name: pois.name,
    details: pois.details,
    userId: pois.userId,
    centerId: pois.centerId
  }).from(pois).where(and(eq(pois.centerId, Number(centerId)), ilike(pois.name, `%${partialName}%`)))

  return poiArr
}

const deletePoiByCenterAndId: (centerId: string, poiId: string) => Promise<void> = async (centerId, poiId) => {
  const centerArr = await db.select({
    id: centers.id,
  }).from(centers).where(eq(centers.id, Number(centerId))).limit(1)

  const center = centerArr[0]

  if (!center) {
    throw new ApiError(404, 'Centro no encontrado')
  }

  const poiArr = await db.select().from(pois).where(and(eq(pois.centerId, Number(centerId)), eq(pois.id, Number(poiId)))).limit(1)

  const poi = poiArr[0]

  if (!poi) {
    throw new ApiError(404, 'POI no encontrado en este centro')
  }

  await db.delete(pois).where(and(eq(pois.centerId, Number(centerId)), eq(pois.id, Number(poiId))))
}

//Modificar un POI existente y registrar el cambio en el historial
const updatePoi: (userId: string, centerId: string, poiId: string, name?: string, details?: unknown) => Promise<Poi> = async (userId, centerId, poiId, name, details) => {
    //verificar que el poi exista en el centro indicado
    const existingArr = await db
        .select()
        .from(pois)
        .where(and(eq(pois.id, Number(poiId)), eq(pois.centerId, Number(centerId))))
        .limit(1)

    const existing = existingArr[0]

    if(!existing) {
        throw new ApiError(404, 'POI no encontrado en este centro')
    }

    if (name === undefined && details === undefined) {
      throw new ApiError(400, 'Debes enviar al menos name o details para actualizar el POI')
    }

    const updateData: { name?: string; details?: unknown } = {}
    if (name !== undefined) updateData.name = name
    if (details !== undefined) updateData.details = details

    let updatedArr: Poi[]
    try {
      //Modificar o actualizar el POI con los nuevos datos
      updatedArr = await db
          .update(pois)
          .set(updateData)
          .where(and(eq(pois.id, Number(poiId)), eq(pois.centerId, Number(centerId))))
          .returning()
    } catch (error: any) {
      const pgErrorCode = error?.code ?? error?.cause?.code
      if (pgErrorCode === '23505') {
        throw new ApiError(409, 'Ya existe un POI con ese nombre en este centro')
      }
      throw error
    }

    const updated = updatedArr[0]

    //Registrar el cambio en el historial de trazabilidad
    await db.insert(poiHistory).values({
        poiId: updated.id,
        userId: Number(userId),
        action: 'updated',
        details: {
          before: { name: existing.name, details: existing.details },
          after: { name: updated.name, details: updated.details },
        },
    })

    return updated
}


// Obtener el historial de cambios de un POI concreto
const getPoiHistory: (poiId: string) => Promise<any[]> = async (poiId) => {
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
  updatePoi,
  getPoiHistory
}
