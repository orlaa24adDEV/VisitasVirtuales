package com.ies.tour.visitasvirtuales_backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class PuntoDeInteresDTO {

    // Campo que se mapeará al 'nombre' en la base de datos
    @NotBlank(message = "El nombre del PDI es obligatorio.")
    private String nombre;

    // Campo que contendrá el JSON multimedia y texto
    // Lo guardaremos como String y lo mapearemos a 'descripcion' de la Entidad.
    @NotBlank(message = "El contenido JSON de la descripción es obligatorio.")
    private String contenidoJson;

}
