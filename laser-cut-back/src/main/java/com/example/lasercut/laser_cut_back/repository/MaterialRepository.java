package com.example.lasercut.laser_cut_back.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.lasercut.laser_cut_back.model.Material;

@Repository
public interface MaterialRepository extends JpaRepository<Material, Long> {
}
