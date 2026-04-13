import poiService from '../services/poiService.js'

//Obtener todos los POIs de un centro
export const getPoisByCenterHandler = async (req, res) => {
    const {centerId} = req.query
    const pois = await poiService.getPoisByCenter(centerId)
    res.json(pois)
}

//crear un nuevo POI
export const createPoiHandler = async (req, res) => {
    const {centerId, name, details} = req.body
    // req.user.sub viene del middleware isAuthenticated: es el ID del usuario logueado
    const userId = req.user.sub
    const newPoi = await poiService.createPoi(userId, centerId, name, details)
    res.status(201).json(newPoi)
}

// Actualizar un POI existente
export const updatePoiHandler = async (req,res) => {
    const poiId = req.params.id 
    const {name, details} = req.body
    const userId = req.user.sub
    const updated = await poiService.updatePoi(userId, poiId, name, details)
    res.json(updated)
}

// Eliminar un POI
export const deletePoiHandler = async (req, res) => {
    const poiId = req.params.id
    const userId = req.user.sub
    await poiService.deletePoi(userId, poiId)
    res.status(204).send()
}

// Obtener el historial de cambios de un POI
export const getPoiHistoryHandler = async (req, res) => {
    const poiId = req.params.id
    const history = await poiService.getPoiHistory(poiId)
    res.json(history)
}