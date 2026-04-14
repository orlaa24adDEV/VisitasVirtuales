import { db } from '../db/db.js'
import ApiError from '../helpers/ApiError.js'
import { eq, and, ilike } from 'drizzle-orm'
import { pois, centers } from '../db/schema.ts'
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

export default {
  createPoi,
  getPoisByCenter,
  getPoisByCenterAndFuzzyName,
  deletePoiByCenterAndId
}
