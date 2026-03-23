package com.ies.tour.visitasvirtuales_backend.dto;

import lombok.Data;

@Data
public class RegisterRequest {
    private String nombre;
    private String email;
    private String password;
    // El rol es opcional
    private String rol;
}
