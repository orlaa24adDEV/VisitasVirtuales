package com.ies.tour.visitasvirtuales_backend.repository;

import com.ies.tour.visitasvirtuales_backend.model.VisitaVirtual;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface VisitaVirtualRepository extends JpaRepository<VisitaVirtual, Long> {
    // Método para obtener todas las visitas virtuales de un Centro
    List<VisitaVirtual> findByCentro_IdCentros(Integer idCentros);

}
