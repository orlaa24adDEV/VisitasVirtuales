// Esta clase permite las peticiones desde el origen donde se ejecuta el frontend
package com.ies.tour.visitasvirtuales_backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfiguration implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**") // Aplica esta configuración a todas las rutas bajo /api/
                .allowedOrigins("http://localhost:8080", "null") // Permite peticiones desde localhost:8080
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPIONS") // Métodos permitidos
                .allowedHeaders("*") // Permite todos los encabezados (incluyendo Authorization)
                .allowCredentials(true); // Permite credenciales (cookies, headers de auth)
    }
}