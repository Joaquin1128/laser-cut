package com.example.lasercut.laser_cut_back.util;

import com.example.lasercut.laser_cut_back.exception.BadRequestException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.io.InputStream;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;

/**
 * Parser que usa Kabeja para extraer bounding box (ancho/alto) de un archivo DXF.
 * Esta implementación usa reflexión para invocar a Kabeja; si la librería no
 * está presente o no expone las APIs esperadas, se lanzará una excepción clara.
 *
 * Nota: requerimos que la dependencia `org.kabeja:kabeja:0.4` esté en el classpath.
 */
public class DxfParser {
    private static final Logger logger = LoggerFactory.getLogger(DxfParser.class);

    /**
     * Devuelve un array {ancho_mm, alto_mm} calculado a partir del DXF usando Kabeja.
     * Lanza BadRequestException si no puede parsear con Kabeja.
     */
    public static double[] getWidthHeightMillimeters(InputStream is) throws IOException {
        try {
            // Intentar cargar ParserBuilder (nombres posibles en Kabeja)
            Class<?> parserBuilderClass = null;
            try {
                parserBuilderClass = Class.forName("org.kabeja.parser.ParserBuilder");
            } catch (ClassNotFoundException e) {
                // try older name
                parserBuilderClass = Class.forName("org.kabeja.parser.DXFParserBuilder");
            }

            // createDefaultParser()
            Method createDefault = null;
            try {
                createDefault = parserBuilderClass.getMethod("createDefaultParser");
            } catch (NoSuchMethodException ignored) {
                // try getParser()
                try {
                    createDefault = parserBuilderClass.getMethod("getParser");
                } catch (NoSuchMethodException ex) {
                    throw new BadRequestException("Kabeja: no se encontró método para crear el parser");
                }
            }

            Object parser = createDefault.invoke(null);

            // Buscar método parse(InputStream) o parse(InputStream, String)
            Method parseMethod = null;
            for (Method m : parser.getClass().getMethods()) {
                if (m.getName().equals("parse")) {
                    Class<?>[] params = m.getParameterTypes();
                    if (params.length == 1 && params[0].equals(InputStream.class)) {
                        parseMethod = m;
                        break;
                    } else if (params.length == 2 && params[0].equals(InputStream.class) && params[1].equals(String.class)) {
                        parseMethod = m;
                        break;
                    }
                }
            }
            if (parseMethod == null) {
                throw new BadRequestException("Kabeja: no se encontró método parse(InputStream) en el parser");
            }

            Object dxfDoc;
            if (parseMethod.getParameterCount() == 1) {
                dxfDoc = parseMethod.invoke(parser, is);
            } else {
                dxfDoc = parseMethod.invoke(parser, is, "");
            }

            if (dxfDoc == null) {
                throw new BadRequestException("Kabeja no pudo parsear el DXF (documento nulo)");
            }

            // Intentar obtener bounding box desde el documento
            // Buscamos métodos comunes: getBoundingBox, getBounds, getMinX/getMaxX
            try {
                Method getBoundingBox = null;
                try {
                    getBoundingBox = dxfDoc.getClass().getMethod("getBoundingBox");
                } catch (NoSuchMethodException ignored) {
                    try {
                        getBoundingBox = dxfDoc.getClass().getMethod("getBounds");
                    } catch (NoSuchMethodException ex) {
                        // no bounding box method
                    }
                }

                if (getBoundingBox != null) {
                    Object bbox = getBoundingBox.invoke(dxfDoc);
                    // bbox could have getMinX/getMaxX/getMinY/getMaxY
                    Method getMinX = bbox.getClass().getMethod("getMinX");
                    Method getMaxX = bbox.getClass().getMethod("getMaxX");
                    Method getMinY = bbox.getClass().getMethod("getMinY");
                    Method getMaxY = bbox.getClass().getMethod("getMaxY");

                    double minX = ((Number) getMinX.invoke(bbox)).doubleValue();
                    double maxX = ((Number) getMaxX.invoke(bbox)).doubleValue();
                    double minY = ((Number) getMinY.invoke(bbox)).doubleValue();
                    double maxY = ((Number) getMaxY.invoke(bbox)).doubleValue();

                    double width = Math.abs(maxX - minX);
                    double height = Math.abs(maxY - minY);
                    if (width == 0 || height == 0) {
                        throw new BadRequestException("Kabeja: bounding box inválida (cero en alguna dimensión)");
                    }
                    // Suponemos que las coordenadas están en las mismas unidades que el DXF; Kabeja puede devolver unidades ya en mm o en unidades de dibujo.
                    // Aquí asumimos mm; si fuera necesario se debe leer $INSUNITS y convertir.
                    return new double[]{width, height};
                }
            } catch (NoSuchMethodException | IllegalAccessException | InvocationTargetException ex) {
                // no bounding box disponible vía esos métodos
            }

            // Si llegamos aquí no pudimos obtener bounding box mediante métodos comunes
            throw new BadRequestException("Kabeja: no se pudo extraer bounding box del documento DXF con la versión de la librería disponible");

        } catch (ClassNotFoundException e) {
            logger.error("Kabeja no encontrada en classpath", e);
            throw new BadRequestException("Kabeja no encontrada en classpath. Asegure la dependencia 'org.kabeja:kabeja:0.4' en el pom.xml");
        } catch (InvocationTargetException e) {
            Throwable t = e.getTargetException();
            throw new BadRequestException("Error al parsear DXF con Kabeja: " + (t != null ? t.getMessage() : e.getMessage()));
        } catch (Exception e) {
            throw new BadRequestException("Error al parsear DXF con Kabeja: " + e.getMessage());
        }
    }
}
