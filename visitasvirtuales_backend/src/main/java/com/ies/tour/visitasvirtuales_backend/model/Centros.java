package com.ies.tour.visitasvirtuales_backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.util.Set;

@Entity
@Table(name = "Centros")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Centros {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_centros")
    private Integer idCentros;

    @Column(name = "nombre", nullable = false, length = 150)
    private String nombre;

    @Column(name = "email_centro", nullable = false, unique = true, length = 150)
    private String emailCentro;

    @Column(name = "telefono", nullable = false, unique = true)
    private Integer telefono;

    @Column(name = "direccion", nullable = false, unique = true, length = 150)
    private String direccion;

    /*
     * @OneToMany(mappedBy = "centro", cascade = CascadeType.ALL, orphanRemoval =
     * true)
     * private Set<VisitaVirtual> visitas;
     */

    @OneToMany(mappedBy = "centro", fetch = FetchType.LAZY)
    @JsonIgnore
    private Set<PuntoDeInteres> puntoDeInteres;
}
