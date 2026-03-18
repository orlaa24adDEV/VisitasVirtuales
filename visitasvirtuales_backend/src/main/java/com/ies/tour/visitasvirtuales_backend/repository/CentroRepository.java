package com.ies.tour.visitasvirtuales_backend.repository;

import com.ies.tour.visitasvirtuales_backend.model.Centros;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CentroRepository extends JpaRepository<Centros, Integer> {
    // Busca un centro por nombre
    Centros findByNombre(String nombre);
}
