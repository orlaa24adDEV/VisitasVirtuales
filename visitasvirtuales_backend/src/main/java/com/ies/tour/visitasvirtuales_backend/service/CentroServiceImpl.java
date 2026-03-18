// Implementa la lógca de negocio usando el 'CentroRepository'
package com.ies.tour.visitasvirtuales_backend.service;

import com.ies.tour.visitasvirtuales_backend.model.Centros;
import com.ies.tour.visitasvirtuales_backend.repository.CentroRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class CentroServiceImpl implements CentroService {

    private final CentroRepository centroRepository;

    @Autowired
    public CentroServiceImpl(CentroRepository centroRepository) {
        this.centroRepository = centroRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Centros> findAll() {
        return centroRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Centros> findById(Integer id) {
        return centroRepository.findById(id);
    }

    @Override
    @Transactional
    public Centros save(Centros centro) {
        return centroRepository.save(centro);
    }

    @Override
    @Transactional
    public void deleteById(Integer id) {
        centroRepository.deleteById(id);
    }
}
