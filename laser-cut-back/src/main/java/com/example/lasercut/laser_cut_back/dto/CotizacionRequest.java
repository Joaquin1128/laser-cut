package com.example.lasercut.laser_cut_back.dto;

import org.springframework.web.multipart.MultipartFile;

/**
 * DTO de entrada para la cotización.
 */
public class CotizacionRequest {
    private MultipartFile archivo;
    private double espesor;
    private String material;
    private int cantidad;

    public CotizacionRequest() {
    }

    public CotizacionRequest(MultipartFile archivo, double espesor, String material, int cantidad) {
        this.archivo = archivo;
        this.espesor = espesor;
        this.material = material;
        this.cantidad = cantidad;
    }

    public MultipartFile getArchivo() {
        return archivo;
    }

    public void setArchivo(MultipartFile archivo) {
        this.archivo = archivo;
    }

    public double getEspesor() {
        return espesor;
    }

    public void setEspesor(double espesor) {
        this.espesor = espesor;
    }

    public String getMaterial() {
        return material;
    }

    public void setMaterial(String material) {
        this.material = material;
    }

    public int getCantidad() {
        return cantidad;
    }

    public void setCantidad(int cantidad) {
        this.cantidad = cantidad;
    }
}
