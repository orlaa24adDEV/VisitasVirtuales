package com.ies.tour.visitasvirtuales_backend.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDate;

@Entity
@Table(name = "visitas_virtuales")
@Data
@NoArgsConstructor
@AllArgsConstructor

public class VisitaVirtual {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_visitas")
    private Integer idVisitas;

    // Relación Muchos a Uno (N:1) -> Muchas Visitas pertenecen a un solo Centro
    @ManyToOne(fetch = FetchType.LAZY) // Lazy loading por eficiencia
    @JoinColumn(name = "id_centros", nullable = false) // Mapea la FK de "id_centros"
    private Centros centro;

    @Column(name = "titulo", nullable = false, length = 150)
    private String titulo;

    @Lob // Para campos TEXT en MySQL
    @Column(name = "descripcion")
    private String descripcion;

    @Column(name = "fecha_creacion")
    private LocalDate fechaCreacion; // Se usa LocalDate para el tipo DATE

}
