package com.ies.tour.visitasvirtuales_backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class SecurityBeansConfig {
    @Bean // Este Bean estará disponible en todo Spring para la inyección de dependencias
    // PasswordEncoder para el cifrado de contraseñas (BCrypt)
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
