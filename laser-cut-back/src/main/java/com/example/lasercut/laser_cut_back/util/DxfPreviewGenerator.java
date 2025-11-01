package com.example.lasercut.laser_cut_back.util;

import javax.xml.transform.OutputKeys;
import javax.xml.transform.stream.StreamResult;
import javax.xml.transform.sax.SAXTransformerFactory;
import javax.xml.transform.sax.TransformerHandler;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.HashMap;

import org.kabeja.dxf.DXFDocument;
import org.kabeja.parser.Parser;
import org.kabeja.parser.ParserBuilder;
import org.kabeja.svg.SVGGenerator;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.example.lasercut.laser_cut_back.exception.PreviewGenerationException;

public class DxfPreviewGenerator {

    private static final Logger logger = LoggerFactory.getLogger(DxfPreviewGenerator.class);

    public static String generarVistaPreviaBase64(InputStream dxfInputStream) {
        try {
            Parser parser = ParserBuilder.createDefaultParser();
            parser.parse(dxfInputStream, "");
            DXFDocument doc = parser.getDocument();

            if (doc == null) {
                logger.warn("DXFDocument es nulo, no se puede generar preview");
                throw new PreviewGenerationException("El documento DXF es nulo o no se pudo parsear.", null);
            }

            ByteArrayOutputStream svgOutput = new ByteArrayOutputStream();
            SVGGenerator generator = new SVGGenerator();

            SAXTransformerFactory tf = (SAXTransformerFactory) SAXTransformerFactory.newInstance();
            TransformerHandler handler = tf.newTransformerHandler();
            handler.getTransformer().setOutputProperty(OutputKeys.ENCODING, "UTF-8");
            handler.getTransformer().setOutputProperty(OutputKeys.OMIT_XML_DECLARATION, "no");
            handler.setResult(new StreamResult(svgOutput));

            generator.generate(doc, handler, new HashMap<>());

            String svg = svgOutput.toString(StandardCharsets.UTF_8);
            if (svg.contains("NaN") || svg.trim().isEmpty()) {
                logger.warn("SVG generado inválido o vacío");
                throw new PreviewGenerationException("SVG generado vacío o inválido (contiene NaN)", null);
            }

            return Base64.getEncoder().encodeToString(svg.getBytes(StandardCharsets.UTF_8));

        } catch (Exception e) {
            logger.error("Error generando vista previa DXF", e);
            throw new PreviewGenerationException("Error generando vista previa DXF", e);
        }
    }

}
