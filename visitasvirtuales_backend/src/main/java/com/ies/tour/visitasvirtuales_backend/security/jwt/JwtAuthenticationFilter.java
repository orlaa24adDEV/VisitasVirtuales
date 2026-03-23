package com.ies.tour.visitasvirtuales_backend.security.jwt;

import com.ies.tour.visitasvirtuales_backend.service.UsuarioServiceImpl;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collection;
import java.util.Collections;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtils jwtUtils;

    // UserDetailsService es necesario para cargar los detalles del usuario
    @Autowired
    private UsuarioServiceImpl usuarioService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        try {
            String jwt = parseJwt(request);

            if (jwt != null && jwtUtils.validateJwtToken(jwt)) {
                String username = jwtUtils.getUserNameFromJwtToken(jwt);
                System.out.println("DEBUG: Username obtenido del token: " + username);

                // Cargar los detalles del usuario
                UserDetails userDetails = usuarioService.loadUserByUsername(username);

                // MODIFICACIONES CLAVE: Manejo de Nulos y roles
                if (userDetails != null) {
                    // 1. Obtener autoridades y asegurar que no sea NULL
                    Collection<? extends GrantedAuthority> authorities = userDetails.getAuthorities();

                    if (authorities == null) {
                        System.err.println("ADVERTENCIA: userDetails.getAuthorities() es NULL. Usando lista vacía.");
                        authorities = Collections.emptyList();
                    }

                    // 2. Crear el objeto de autenticación
                    UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                            userDetails,
                            null, // No se usa la contraseña
                            authorities); // Usar la colección de autoridades comprobada

                    // 3. Establecer detalles y contexto
                    authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                    System.out
                            .println("DEBUG PASO 5: CONTEXTO DE SEGURIDAD ESTABLECIDO correctamente para " + username);
                } else {
                    System.err.println(
                            "ADVERTENCIA: UserDetails es NULL. Usuario no encontrado después de validar el token.");
                }
            }
        } catch (Exception e) {
            // Maneja errores de logueo
            System.err.println(
                    "CRÍTICO: Fallo al establecer autenticación en Security Context. Mensaje: " + e.getMessage());
            e.printStackTrace();
        }

        filterChain.doFilter(request, response);
    }

    private String parseJwt(HttpServletRequest request) {
        // Extrae el JWT del encabezado "Authorization: Bearer <token>"
        String headerAuth = request.getHeader("Authorization");

        if (StringUtils.hasText(headerAuth) && headerAuth.startsWith("Bearer ")) {
            return headerAuth.substring(7); // "Bearer " tiene 7 caracteres
        }

        return null;
    }
}