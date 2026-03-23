package com.ies.tour.visitasvirtuales_backend.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/*
  Excepción debe lanzarse cuando un recurso (entidad) solicitado 
  por ID no se encuentra en la base de datos. Se mapea a HTTP 404.
 */
@ResponseStatus(HttpStatus.NOT_FOUND)
public class ResourceNotFoundException extends RuntimeException {

    // Constructor que acepta un mensaje, esencial para la lógica del servicio
    public ResourceNotFoundException(String message) {
        super(message);
    }
}