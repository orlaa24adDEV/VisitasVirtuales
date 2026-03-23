package com.ies.tour.visitasvirtuales_backend.repository;

import com.ies.tour.visitasvirtuales_backend.model.Usuario;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    // Método necesario para el Login/Spring Security
    Usuario findByEmail(String email);

    List<Usuario> findAll();

    // Método para busca ID para el cambio de rol
    Optional<Usuario> findById(Long id);

}
