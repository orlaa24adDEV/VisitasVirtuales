package com.ies.tour.visitasvirtuales_backend.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ies.tour.visitasvirtuales_backend.model.VisitaVirtual;
import com.ies.tour.visitasvirtuales_backend.service.VisitaVirtualService;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;

@RestController
@RequestMapping("/api/visitas")
public class VisitasController {

    private final VisitaVirtualService visitaVirtualService;

    @Autowired
    public VisitasController(VisitaVirtualService visitaVirtualService) {
        this.visitaVirtualService = visitaVirtualService;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'ALUMNO')")
    public ResponseEntity<List<VisitaVirtual>> listarVisitas() {
        // Llama al método de tu servicio para obtener la lista
        List<VisitaVirtual> lista = visitaVirtualService.findAll();
        System.out.println("¡El controlador de Visitas ha sido alcanzado y llama al servicio!");
        return ResponseEntity.ok(lista); // Devuelve el código 200
    }
}
