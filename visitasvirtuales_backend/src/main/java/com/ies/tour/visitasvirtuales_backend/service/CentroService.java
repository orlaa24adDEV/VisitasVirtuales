// Define las operaciones de negocio para la entidad 'Centro'
package com.ies.tour.visitasvirtuales_backend.service;

import com.ies.tour.visitasvirtuales_backend.model.Centros;
import java.util.List;
import java.util.Optional;

public interface CentroService {

    // Obtener todos los centros
    List<Centros> findAll();

    // Obtener un centro por ID
    Optional<Centros> findById(Integer id);

    // Guardar o actualizar un centro
    Centros save(Centros centro);

    // Eliminar un centro por ID
    void deleteById(Integer id);
}
