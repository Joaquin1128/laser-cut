package com.example.lasercut.laser_cut_back.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.Arrays;

@Configuration
public class CorsConfig {

    @Bean
    public CorsFilter corsFilter() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();

        // Permitir credenciales
        config.setAllowCredentials(true);
        
        // Origen permitido (React app en desarrollo)
        config.addAllowedOrigin("http://localhost:3000");
        
        // Métodos HTTP permitidos
        config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        
        // Headers permitidos
        config.setAllowedHeaders(Arrays.asList("*"));
        
        // Headers expuestos
        config.setExposedHeaders(Arrays.asList("*"));
        
        // Aplicar configuración a todas las rutas
        source.registerCorsConfiguration("/**", config);
        
        return new CorsFilter(source);
    }
}

