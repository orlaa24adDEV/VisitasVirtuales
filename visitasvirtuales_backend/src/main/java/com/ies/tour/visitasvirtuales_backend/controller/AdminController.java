package com.ies.tour.visitasvirtuales_backend.controller;

import com.ies.tour.visitasvirtuales_backend.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import com.ies.tour.visitasvirtuales_backend.model.Usuario;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final UsuarioService usuarioService;

    @Autowired
    public AdminController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    // 1. ENDPOINT: OBTENER TODOS LOS USUARIOS
    // Accesible si el usuario tiene el rol 'ADMINISTRADOR'
    @GetMapping("/usuarios")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<List<Usuario>> getAllUsuarios() {
        List<Usuario> usuarios = usuarioService.findAll();
        return ResponseEntity.ok(usuarios);
    }

    // 2. ENDPOINT: CAMBIAR EL ROL DE UN USUARIO
    // Endpoint para actualizar el rol de un usuario
    @PutMapping("/usuarios/{id}/rol")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<?> updateRol(@PathVariable String email, @RequestBody String nuevoRol) {
        // Lógica para buscar el usuario por ID y actualizar su rol
        try {
            usuarioService.updateRol(email, nuevoRol);
            return ResponseEntity.ok("Rol del usuario " + email + " actualizado a: " + nuevoRol);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error al actualizar el rol: " + e.getMessage());
        }
    }

    // 3. ENDPOINT: ELIMINAR USUARIO POR EMAIL
    @DeleteMapping("/usuarios/{email}")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<?> deleteUsuario(@PathVariable String email) {
        try {
            usuarioService.delete(email);
            return ResponseEntity.ok().body("Usuario con email " + email + " eliminado correctamente.");

        } catch (UsernameNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body("Error al intentar eliminar el usuario: " + e.getMessage());
        }
    }
}