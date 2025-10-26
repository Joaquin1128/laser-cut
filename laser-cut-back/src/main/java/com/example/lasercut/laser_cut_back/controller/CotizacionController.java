package com.example.lasercut.laser_cut_back.controller;

import com.example.lasercut.laser_cut_back.dto.CotizacionResponse;
import com.example.lasercut.laser_cut_back.service.CotizacionService;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api")
public class CotizacionController {

    private final CotizacionService cotizacionService;

    public CotizacionController(CotizacionService cotizacionService) {
        this.cotizacionService = cotizacionService;
    }

    @PostMapping(path = "/cotizacion", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<CotizacionResponse> cotizar(
            @RequestParam("archivo") MultipartFile archivo,
            @RequestParam("espesor") double espesor,
            @RequestParam("material") String material,
            @RequestParam("cantidad") int cantidad
    ) throws IOException {
        CotizacionResponse resp = cotizacionService.calcular(archivo, espesor, material, cantidad);
        return ResponseEntity.ok(resp);
    }
}
