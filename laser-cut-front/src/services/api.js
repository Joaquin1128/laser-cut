// API base URL - ajustar según tu configuración del backend
const API_BASE_URL = 'http://localhost:8080/api';

/**
 * Analiza un archivo DXF subido
 * @param {File} file - Archivo DXF a analizar
 * @returns {Promise<Object>} Datos del archivo analizado
 */
export async function analizarArchivo(file) {
  try {
    // Crear FormData para enviar el archivo
    const formData = new FormData();
    formData.append('archivo', file);

    // Llamar al endpoint POST /analizar-archivo
    const response = await fetch(`${API_BASE_URL}/analizar-archivo`, {
      method: 'POST',
      body: formData,
    });

    // Verificar si la respuesta es exitosa
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || `Error ${response.status}: ${response.statusText}`);
    }

    // Retornar los datos del archivo analizado
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error al analizar archivo:', error);
    throw error;
  }
}

/**
 * Calcula la cotización del corte láser
 * @param {Object} params - Parámetros de la cotización
 * @param {File} params.archivo - Archivo DXF
 * @param {string} params.material - Material seleccionado
 * @param {number} params.espesor - Espesor en mm
 * @param {number} params.cantidad - Cantidad de piezas
 * @param {string} params.unidad - Unidad (MM por ahora)
 * @returns {Promise<Object>} Datos de la cotización
 */
export async function calcularCotizacion({ archivo, material, espesor, cantidad, unidad }) {
  try {
    // Normalizar nombre de material para el backend (lowercase)
    const normalizedMaterial = material === 'Hierro' ? 'hierro' 
                               : material === 'Acero Inoxidable' ? 'inoxidable' 
                               : material.toLowerCase();
    
    // Crear FormData para enviar los datos
    const formData = new FormData();
    formData.append('archivo', archivo);
    formData.append('espesor', espesor);
    formData.append('material', normalizedMaterial);
    formData.append('cantidad', cantidad);
    formData.append('unidad', unidad);

    // Llamar al endpoint POST /cotizacion
    const response = await fetch(`${API_BASE_URL}/cotizacion`, {
      method: 'POST',
      body: formData,
    });

    // Verificar si la respuesta es exitosa
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || `Error ${response.status}: ${response.statusText}`);
    }

    // Retornar los datos de la cotización
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error al calcular cotización:', error);
    throw error;
  }
}

