package com.ies.tour.visitasvirtuales_backend.service;

import java.util.List;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import com.ies.tour.visitasvirtuales_backend.model.Usuario;

public interface UsuarioService {
    // Método para que Spring Security encuentre al usuario por email
    Usuario findByEmail(String email);

    // Método para registrar nuevos usuarios (los administradores podrán crear
    // usuarios)
    Usuario save(Usuario usuarios);

    UserDetails loadUserByUsername(String email) throws UsernameNotFoundException;

    // Métodos para la administración
    List<Usuario> findAll();

    Usuario findById(Long id);

    Usuario updateRol(String email, String nuevoRol);

    // Eliminar un usuario por Email
    void delete(String email);
}
