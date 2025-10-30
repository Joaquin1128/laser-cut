package com.example.lasercut.laser_cut_back.util;

import java.io.IOException;
import java.io.InputStream;

import org.kabeja.dxf.DXFDocument;
import org.kabeja.dxf.Bounds;
import org.kabeja.parser.Parser;
import org.kabeja.parser.ParserBuilder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.example.lasercut.laser_cut_back.exception.BadRequestException;

public class DxfParser {
    private static final Logger logger = LoggerFactory.getLogger(DxfParser.class);

    public static double[] getWidthHeightMillimeters(InputStream is) throws IOException {
        try {
            Parser parser = ParserBuilder.createDefaultParser();
            parser.parse(is, "UTF-8");

            DXFDocument doc = parser.getDocument();
            if (doc == null) {
                throw new BadRequestException("Kabeja no pudo leer el archivo DXF (documento nulo). Verifique que sea DXF R12 ASCII o R2000.");
            }

            Bounds bounds = doc.getBounds();
            if (bounds == null) {
                throw new BadRequestException("No se pudo calcular el bounding box del DXF.");
            }

            double width = Math.abs(bounds.getMaximumX() - bounds.getMinimumX());
            double height = Math.abs(bounds.getMaximumY() - bounds.getMinimumY());

            if (width == 0 || height == 0) {
                throw new BadRequestException("Bounding box inválida (dimensión cero detectada).");
            }

            logger.info("Bounding box DXF -> ancho={} mm, alto={} mm", width, height);
            return new double[]{width, height};

        } catch (BadRequestException e) {
            throw e;
        } catch (Exception e) {
            logger.error("Error al parsear DXF con Kabeja", e);
            throw new BadRequestException("Error al procesar el archivo DXF: " + e.getMessage());
        }
    }
}
