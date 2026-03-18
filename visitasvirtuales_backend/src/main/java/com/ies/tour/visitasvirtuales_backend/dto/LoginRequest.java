package com.ies.tour.visitasvirtuales_backend.dto;

import lombok.Data;

@Data // Genera getters y setters
public class LoginRequest {
    // Se usa el email como username
    private String email;
    private String password;
}
