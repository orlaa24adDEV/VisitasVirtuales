package com.ies.tour.visitasvirtuales_backend.repository;

import com.ies.tour.visitasvirtuales_backend.model.PuntoDeInteres;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PuntoDeInteresRepository extends JpaRepository<PuntoDeInteres, Integer> {

    // Método para filtar los PDIs por centro
    List<PuntoDeInteres> findByCentro_IdCentros(Integer idCentros);

}
