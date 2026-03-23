package com.ies.tour.visitasvirtuales_backend.service;

import com.ies.tour.visitasvirtuales_backend.dto.PuntoDeInteresDTO;
import com.ies.tour.visitasvirtuales_backend.model.PuntoDeInteres;
import java.util.List;
import java.util.Optional;

public interface PuntoDeInteresService {

    // Obtener todos los PDIs
    List<PuntoDeInteres> findAll();

    // Obtener un PDI por ID
    Optional<PuntoDeInteres> findById(Integer id);

    PuntoDeInteres saveFromDto(PuntoDeInteresDTO pdiDTO, Integer idCentros);

    // Método de consulta para el desplegable del frontend
    List<PuntoDeInteres> findByCentroId(Integer idCentros);

    // Eliminar un PDI por ID
    void deleteById(Integer id);

    // Mapea el DTO a la entidad
    PuntoDeInteres convertirADto(PuntoDeInteresDTO pdiDTO);

    // editar pdis
    PuntoDeInteres updatePdi(Integer id, PuntoDeInteresDTO pdiDTO, Integer idCentros);
}