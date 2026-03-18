package com.ies.tour.visitasvirtuales_backend.service;

import com.ies.tour.visitasvirtuales_backend.model.VisitaVirtual;
import java.util.List;

public interface VisitaVirtualService {

    // Método para obtener todas las visitas
    List<VisitaVirtual> findAll();

    // Se puede añadir un método para buscar por centro
    List<VisitaVirtual> findByCentroId(Integer idCentros);
}
