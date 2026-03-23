package com.ies.tour.visitasvirtuales_backend.service;

import com.ies.tour.visitasvirtuales_backend.model.Usuario;
import com.ies.tour.visitasvirtuales_backend.model.PuntoDeInteres;
import com.ies.tour.visitasvirtuales_backend.model.Centros;
import com.ies.tour.visitasvirtuales_backend.repository.CentroRepository;
import com.ies.tour.visitasvirtuales_backend.repository.UsuarioRepository;
import com.ies.tour.visitasvirtuales_backend.repository.PuntoDeInteresRepository;
import com.ies.tour.visitasvirtuales_backend.dto.PuntoDeInteresDTO;
import com.ies.tour.visitasvirtuales_backend.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class PuntoDeInteresServiceImpl implements PuntoDeInteresService {

    private final PuntoDeInteresRepository puntoDeInteresRepository;
    private final UsuarioRepository usuarioRepository;
    private final CentroRepository centroRepository;

    @Autowired
    public PuntoDeInteresServiceImpl(PuntoDeInteresRepository puntoDeInteresRepository,
            UsuarioRepository usuarioRepository, CentroRepository centroRepository) {
        this.puntoDeInteresRepository = puntoDeInteresRepository;
        this.usuarioRepository = usuarioRepository;
        this.centroRepository = centroRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<PuntoDeInteres> findAll() {
        return puntoDeInteresRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<PuntoDeInteres> findById(Integer id) {
        return puntoDeInteresRepository.findById(id);
    }

    @Override
    @Transactional
    public void deleteById(Integer id) {
        puntoDeInteresRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<PuntoDeInteres> findByCentroId(Integer idCentros) {
        return puntoDeInteresRepository.findByCentro_IdCentros(idCentros);
    }

    @Override
    @Transactional
    public PuntoDeInteres saveFromDto(PuntoDeInteresDTO pdiDTO, Integer idCentro) {
        // 1. Obtener la entidad del Centro
        Centros centro = centroRepository.findById(idCentro)
                .orElseThrow(() -> new ResourceNotFoundException("Centro no encontrado con ID: " + idCentro));
        // 2. Llama al metodo (convertirADto) para crear la entidad y asignar el usuario
        PuntoDeInteres nuevoPdi = convertirADto(pdiDTO);
        // 3. Asignar la relacion Centro
        nuevoPdi.setCentro(centro);
        return puntoDeInteresRepository.save(nuevoPdi);

    }

    @Override
    @Transactional
    public PuntoDeInteres updatePdi(Integer id, PuntoDeInteresDTO pdiDTO, Integer idCentro) {

        // Obtener el PDI existente
        PuntoDeInteres pdiExistente = puntoDeInteresRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("PDI no encontrado con ID: " + id));

        // Obtener el Centro
        Centros centro = centroRepository.findById(idCentro)
                .orElseThrow(() -> new ResourceNotFoundException("Centro no encontrado con ID: " + idCentro));
        // Aplicar los cambios del DTO
        pdiExistente.setNombre(pdiDTO.getNombre());
        pdiExistente.setContenidoJson(pdiDTO.getContenidoJson());
        pdiExistente.setCentro(centro);

        // Guardar los cambios
        return puntoDeInteresRepository.save(pdiExistente);
    }

    @Override
    public PuntoDeInteres convertirADto(PuntoDeInteresDTO pdiDTO) {

        // 1. Obtener el ID del usuario autenticado desde el contexto de Spring Security
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        // Asume que el 'principal' contiene el nombre de usuario (o la clave)
        String emailUsuario = auth.getName();

        // 2. Buscar la entidad Usuario en la base de datos
        Usuario creador = usuarioRepository.findByEmail(emailUsuario);
        // Verificar si el usuario existe (findByEmail devuelve null si no existe)
        if (creador == null) {
            throw new ResourceNotFoundException("Usuario creador no encontrado: " + emailUsuario);
        }
        // 3. Mapear los datos del DTO a la nueva Entidad
        PuntoDeInteres pdi = new PuntoDeInteres();
        pdi.setNombre(pdiDTO.getNombre());
        // El JSON se guarda en descripcion
        pdi.setContenidoJson(pdiDTO.getContenidoJson());

        // 4. Asignar la relación (Clave Foránea)
        pdi.setCreador(creador);

        return pdi;
    }

}