import poiService from '../services/poiService.ts';

export const newPoiHandler = async (req, res) => {
  const centerId = req.params.centerId;
  const userId = req.user?.id;
  await poiService.createPoi(centerId, userId, req.body);
  return res.json({ message: 'POI creado exitosamente' });
};

export const poisByCenterHandler = async (req, res) => {
  const centerId = req.params.centerId;
  const pois = await poiService.getPoisByCenter(centerId);
  if (pois.length === 0) {
    return res.status(200).json({ message: 'No se encontraron POIs para el centro con ID ' + centerId, pois: [] });
  }
  return res.json({ message: 'POIs obtenidos exitosamente', pois });
};

export const poisByUserAndCenterHandler = async (req, res) => {
  const centerId = req.params.centerId;
  const userId = req.user?.id;
  const pois = await poiService.getPoisByUserAndCenter(userId, centerId);
  if (pois.length === 0) {
    return res.status(200).json({ message: 'No se encontraron POIs para el usuario con ID ' + userId + ' en el centro con ID ' + centerId, pois: [] });
  }
  return res.json({ message: 'POIs obtenidos exitosamente', pois });
}

export const poisByCenterAndFuzzyNameHandler = async (req, res) => {
  const centerId = req.params.centerId;
  const partialName = req.query.search;

  if (!partialName) {
    return res.status(400).json({ message: 'Query param "search" es requerido' });
  }

  const pois = await poiService.getPoisByCenterAndFuzzyName(centerId, partialName);
  if (pois.length === 0) {
    return res.status(200).json({ message: 'No se encontraron POIs para el centro con ID ' + centerId + ' con nombre que contenga ' + '\'' + partialName + '\'', pois: [] });
  }
  return res.json({ message: 'POIs obtenidos exitosamente', pois });
}

export const deletePoiHandler = async (req, res) => {
  const centerId = req.params.centerId;
  const poiId = req.params.poiId;
  await poiService.deletePoiByCenterAndId(centerId, poiId);
  return res.json({ message: 'POI eliminado exitosamente' });
}