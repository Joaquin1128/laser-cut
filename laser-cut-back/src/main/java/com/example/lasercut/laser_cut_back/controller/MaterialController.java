package com.example.lasercut.laser_cut_back.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.lasercut.laser_cut_back.model.Material;
import com.example.lasercut.laser_cut_back.repository.MaterialRepository;

@RestController
@RequestMapping("/api/materials")
public class MaterialController {

    private final MaterialRepository materialRepository;

    public MaterialController(MaterialRepository materialRepository) {
        this.materialRepository = materialRepository;
    }

    @GetMapping
    public List<Material> getMaterials() {
        return materialRepository.findAll();
    }

}
