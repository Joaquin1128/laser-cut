package com.example.lasercut.laser_cut_back.service;

import com.example.lasercut.laser_cut_back.dto.CotizacionResponse;
import com.example.lasercut.laser_cut_back.exception.BadRequestException;
import com.example.lasercut.laser_cut_back.util.DxfParser;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal;
import java.math.RoundingMode;

@Service
public class CotizacionService {
    private static final Logger logger = LoggerFactory.getLogger(CotizacionService.class);

    private static final double FACTOR_DENSIDAD = 8.0; // dado en la especificación
    private static final double PRECIO_POR_KG = 5000.0;

    public CotizacionResponse calcular(MultipartFile archivo, double espesorMm, String material, int cantidad) throws IOException {
        validateInputs(archivo, espesorMm, material, cantidad);

        double[] wh = DxfParser.getWidthHeightMillimeters(archivo.getInputStream());
        double ancho = wh[0];
        double alto = wh[1];

        // peso (kg) = (ancho_mm * alto_mm * espesor_mm * factor_densidad) / 1_000_000
        double peso = (ancho * alto * espesorMm * FACTOR_DENSIDAD) / 1_000_000.0;
        double precioUnitario = peso * PRECIO_POR_KG;
        double precioTotal = precioUnitario * cantidad;

        // redondeos a 2 decimales
        peso = round(peso, 4); // más precisión en peso
        precioUnitario = round(precioUnitario, 2);
        precioTotal = round(precioTotal, 2);

        CotizacionResponse resp = new CotizacionResponse();
        resp.setMaterial(material);
        resp.setAncho(round(ancho, 2));
        resp.setAlto(round(alto, 2));
        resp.setEspesor(round(espesorMm, 2));
        resp.setPeso(peso);
        resp.setPrecioUnitario(precioUnitario);
        resp.setCantidad(cantidad);
        resp.setPrecioTotal(precioTotal);

        logger.info("Cotización calculada: material={}, ancho={}mm, alto={}mm, espesor={}mm, peso={}kg, precioUnitario={}, cantidad={}, precioTotal={}",
                material, ancho, alto, espesorMm, peso, precioUnitario, cantidad, precioTotal);

        return resp;
    }

    private void validateInputs(MultipartFile archivo, double espesorMm, String material, int cantidad) {
        if (archivo == null || archivo.isEmpty()) {
            throw new BadRequestException("Archivo DXF no puede estar vacío");
        }
        String name = archivo.getOriginalFilename();
        if (name == null || !name.toLowerCase().endsWith(".dxf")) {
            throw new BadRequestException("El archivo debe ser un .dxf");
        }
        if (espesorMm <= 0) {
            throw new BadRequestException("Espesor debe ser mayor que cero");
        }
        if (cantidad <= 0) {
            throw new BadRequestException("Cantidad debe ser mayor que cero");
        }
        if (material == null) {
            throw new BadRequestException("Material es requerido");
        }
        String m = material.trim().toLowerCase();
        if (!"hierro".equals(m) && !"inoxidable".equals(m)) {
            throw new BadRequestException("Material no soportado. Opciones: 'hierro' o 'inoxidable'");
        }
    }

    private double round(double v, int decimals) {
        BigDecimal bd = new BigDecimal(Double.toString(v));
        bd = bd.setScale(decimals, RoundingMode.HALF_UP);
        return bd.doubleValue();
    }
}
