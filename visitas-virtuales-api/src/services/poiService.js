import { eq } from 'drizzle-orm'
import { db } from '../db/db.js'
import { pois, poiHistory } from '../db/schema.js'
import ApiError from '../helpers/ApiError.js'

//Obtener todos los POIs de un centro en concreto
const getPoisByCenter = async (centerId) => {
    const result = await db
    .select()
    .from(pois)
    .where(eq(pois.centerId, Number(centerId)))

    return result;
}

//Crear un nuevo POI y registrar el cambio en el historial
const createPoi = async (userId, centerId, name, details) => {
    //verificar que los cambios obligatorios esten completos
    if(!name || !details || !centerId) {
        throw new ApiError(400, 'El nombre, los detalles y el centro son obligatorios')
    }

    //insertar el POI en la BBDD
    const newPoiArr = await db
    .insert(pois)
    .values({userId, centerId, name, details})
    .returning()

    const newPoi = newPoiArr[0]

    if (!newPoi) {
        throw new ApiError(500, 'Error al cargar el POI')
    }

    //Registrar el cambio en el historial de trazabilidad
    await db.insert(poiHistory).values({
        poiId: newPoi.id,
        userId: userId,
        action: 'created',
        details: {name: newPoi.name},
    });

    return newPoi;
}

//Modificar un POI existente y registrar el cambio en el historial
const updatePoi = async (userId, poiId, name, details) => {

    //verificar que el poi exista antes de modificarlo
    const existingArr = await db
        .select()
        .from(pois)
        .where(eq(pois.id, Number(poiId)))
        .limit(1)

    const existing = existingArr[0]

    if(!existing) {
        throw new ApiError(404, 'POI no encontrado')
    }

    //Modificar o actualizar el POI con los nuevos datos
    const updatedArr = await db 
        .update(pois)
        .set({name, details})
        .where(eq(pois.id, Number(poiId)))
        .returning()

    const updated = updatedArr[0]

    //Registrar el cambio en el historial de trazabilidad
    await db.insert(poiHistory).values({
        poiId: updated.id,
        userId: userId,
        action: 'updated',
        details: {name: updated.name},
    });

    return updated;
}

// Eliminar un POI y registrar el cambio en el historial
const deletePoi = async (userId, poiId) => {

    //verificar que el POI exista antes de eliminar
    const existingArr = await db 
    .select()
    .from(pois)
    .where(eq(pois.id, Number(poiId)))
    .limit(1)

    const existing = existingArr[0]

    if(!existing) {
        throw new ApiError(404, 'POI no encontrado')
    }

    //registrar el cambio antes de borrar
    await db.insert(poiHistory).values({
        poiId: existing.id,
        userId: userId,
        action: 'deleted',
        details: { name: existing.name },
    })

    //Eliminar el poi
    await db.delete(pois).where(eq(pois.id, Number(poiId)))
}
// Obtener el historial de cambios de un POI concreto
const getPoiHistory = async (poiId) => {
    const result = await db
        .select()
        .from(poiHistory)
        .where(eq(poiHistory.poiId, Number(poiId)))

    return result
}

export default {
    getPoisByCenter,
    createPoi,
    updatePoi,
    deletePoi,
    getPoiHistory,
}