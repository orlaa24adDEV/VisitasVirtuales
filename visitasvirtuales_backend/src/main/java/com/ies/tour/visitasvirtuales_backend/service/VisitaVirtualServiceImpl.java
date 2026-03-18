package com.ies.tour.visitasvirtuales_backend.service;

import com.ies.tour.visitasvirtuales_backend.model.VisitaVirtual;
import com.ies.tour.visitasvirtuales_backend.repository.VisitaVirtualRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class VisitaVirtualServiceImpl implements VisitaVirtualService {

    private final VisitaVirtualRepository visitaVirtualRepository;

    // Inyección de dependencia por constructor
    @Autowired
    public VisitaVirtualServiceImpl(VisitaVirtualRepository visitaVirtualRepository) {
        this.visitaVirtualRepository = visitaVirtualRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<VisitaVirtual> findAll() {
        // Usa el método estándar de JpaRepository
        return visitaVirtualRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public List<VisitaVirtual> findByCentroId(Integer idCentros) {
        // Usa el método que ya definiste en tu repositorio
        return visitaVirtualRepository.findByCentro_IdCentros(idCentros);
    }
}