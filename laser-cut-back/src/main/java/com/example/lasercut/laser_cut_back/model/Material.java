package com.example.lasercut.laser_cut_back.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "material")
public class Material {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String nombre;

    @Column(nullable = false)
    private double densidad;

    @Column(nullable = false)
    private double precioPorKg;

    public Material() {
    }

    public Material(Long id, String nombre, double densidad, double precioPorKg) {
        this.id = id;
        this.nombre = nombre;
        this.densidad = densidad;
        this.precioPorKg = precioPorKg;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public double getDensidad() {
        return densidad;
    }

    public void setDensidad(double densidad) {
        this.densidad = densidad;
    }

    public double getPrecioPorKg() {
        return precioPorKg;
    }

    public void setPrecioPorKg(double precioPorKg) {
        this.precioPorKg = precioPorKg;
    }

}
