package com.ies.tour.visitasvirtuales_backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "puntos_de_interes")
public class PuntoDeInteres {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_pdi")
    private Long idPdi;

    @ManyToOne
    @JoinColumn(name = "id_centros", nullable = false)
    @JsonIgnore
    private Centros centro;

    // Usuario creador
    @ManyToOne
    @JoinColumn(name = "id_usuario_creador", nullable = false)
    private Usuario creador;

    @Column(name = "nombre", nullable = false, length = 150)
    private String nombre;

    // Campo donde se almacenará el JSON
    @Lob // Para campos TEXT en MySQL
    @Column(name = "descripcion")
    private String contenidoJson;

}
