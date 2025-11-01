package com.example.lasercut.laser_cut_back.service;

import java.io.IOException;
import java.io.InputStream;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.example.lasercut.laser_cut_back.dto.ArchivoResponse;
import com.example.lasercut.laser_cut_back.exception.BadRequestException;
import com.example.lasercut.laser_cut_back.util.DxfParser;
import com.example.lasercut.laser_cut_back.util.DxfPreviewGenerator;

@Service
public class ArchivoService {

    private static final Logger logger = LoggerFactory.getLogger(ArchivoService.class);

    public ArchivoResponse analizar(MultipartFile archivo) throws IOException {
        if (archivo == null || archivo.isEmpty()) {
            throw new BadRequestException("Archivo DXF no puede estar vacío");
        }

        String name = archivo.getOriginalFilename();
        if (name == null || !name.toLowerCase().endsWith(".dxf")) {
            throw new BadRequestException("El archivo debe ser un .dxf");
        }

        try (InputStream inputStream = archivo.getInputStream()) {
            double[] wh = DxfParser.getWidthHeightMillimeters(inputStream);
            double ancho = wh[0];
            double alto = wh[1];

            String vistaPrevia = DxfPreviewGenerator.generarVistaPreviaBase64(archivo.getInputStream());

            ArchivoResponse resp = new ArchivoResponse();
            resp.setNombre(name);
            resp.setAncho(ancho);
            resp.setAlto(alto);
            resp.setVistaPreviaBase64(vistaPrevia);

            logger.info("Archivo analizado: {} (ancho={}mm, alto={}mm)", name, ancho, alto);

            return resp;
        }
    }

}
