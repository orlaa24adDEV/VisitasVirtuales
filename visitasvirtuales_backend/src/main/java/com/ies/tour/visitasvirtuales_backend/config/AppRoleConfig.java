package com.ies.tour.visitasvirtuales_backend.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;
import java.util.List;

@Component
@ConfigurationProperties(prefix = "app.seguridad") // Lee todo lo que empieza por 'app.seguridad'
public class AppRoleConfig {

    // Spring inyectará automáticamente los valores de app.seguridad.roles a esta
    // lista
    private List<String> roles;

    // Getters y Setters - Son necesarios para que @ConfigurationPropeties funcione
    public List<String> getRoles() {
        return roles;
    }

    public void setRoles(List<String> roles) {
        this.roles = roles;
    }

}
