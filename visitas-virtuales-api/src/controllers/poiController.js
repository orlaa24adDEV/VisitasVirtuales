import poiService from '../services/poiService.ts'
import { env } from '../../env.ts'

// Actualizar un POI existente
export const updatePoiHandler = async (req, res) => {
	const centerId = req.params.centerId
	const poiId = req.params.id
	const { name, details } = req.body
	const userId = req.user.sub
	const updatedPoi = await poiService.updatePoi(
		userId,
		centerId,
		poiId,
		name,
		details,
	)
	return res.json({
		message: 'POI actualizado exitosamente',
		updatedPoi: updatedPoi,
	})
}

// Obtener el historial de cambios de un POI
export const getPoiHistoryHandler = async (req, res) => {
	const poiId = req.params.id
	const history = await poiService.getPoiHistory(poiId)
	res.json(history)
}

export const newPoiHandler = async (req, res) => {
	const centerId = req.params.centerId
	const userId = req.user?.sub
	env.APP_STAGE === 'dev' &&
		console.log(
			'Creando POI para el centro con ID ' +
				centerId +
				' por el usuario con ID ' +
				userId,
		)
	const newPoi = await poiService.createPoi(centerId, userId, req.body)
	return res.json({ message: 'POI creado exitosamente', newPoi: newPoi })
}

export const poisByCenterHandler = async (req, res) => {
	const centerId = req.params.centerId
	const pois = await poiService.getPoisByCenter(centerId)
	if (pois.length === 0) {
		return res
			.status(200)
			.json({
				message: 'No se encontraron POIs para el centro con ID ' + centerId,
				pois: [],
			})
	}
	return res.json({ message: 'POIs obtenidos exitosamente', pois: pois })
}

export const poisByUserAndCenterHandler = async (req, res) => {
	const centerId = req.params.centerId
	const userId = req.user?.sub
	const pois = await poiService.getPoisByUserAndCenter(userId, centerId)
	if (pois.length === 0) {
		return res
			.status(200)
			.json({
				message:
					'No se encontraron POIs para el usuario con ID ' +
					userId +
					' en el centro con ID ' +
					centerId,
				pois: [],
			})
	}
	return res.json({ message: 'POIs obtenidos exitosamente', pois: pois })
}

export const poisByCenterAndFuzzyNameHandler = async (req, res) => {
	const centerId = req.params.centerId
	const partialName = req.query.search

	if (!partialName) {
		return res
			.status(400)
			.json({ message: 'Query param "search" es requerido' })
	}

	const pois = await poiService.getPoisByCenterAndFuzzyName(
		centerId,
		partialName,
	)
	if (pois.length === 0) {
		return res
			.status(200)
			.json({
				message:
					'No se encontraron POIs para el centro con ID ' +
					centerId +
					' con nombre que contenga ' +
					"'" +
					partialName +
					"'",
				pois: [],
			})
	}
	return res.json({ message: 'POIs obtenidos exitosamente', pois: pois })
}

export const deletePoiHandler = async (req, res) => {
	const centerId = req.params.centerId
	const poiId = req.params.poiId
	const deletedPoi = await poiService.deletePoiByCenterAndId(centerId, poiId)
	return res.json({
		message: 'POI eliminado exitosamente',
		deletedPoi: deletedPoi,
	})
}
