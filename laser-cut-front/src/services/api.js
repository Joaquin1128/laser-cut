const API_BASE_URL = 'http://localhost:8080/api';

export async function getCatalogo() {
  try {
    const response = await fetch(`${API_BASE_URL}/catalogo`, {
      method: 'GET',
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || `Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error al cargar catálogo:', error);
    throw error;
  }
}

export async function analizarArchivo(file) {
  try {
    const formData = new FormData();
    formData.append('archivo', file);

    const response = await fetch(`${API_BASE_URL}/analizar-archivo`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || `Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error al analizar archivo:', error);
    throw error;
  }
}

export async function calcularCotizacion({ archivo, material, espesor, cantidad, unidad }) {
  try {
    const normalizedMaterial = material === 'Hierro' ? 'hierro' 
                               : material === 'Acero Inoxidable' ? 'inoxidable' 
                               : material.toLowerCase();
    
    const formData = new FormData();
    formData.append('archivo', archivo);
    formData.append('espesor', espesor);
    formData.append('material', normalizedMaterial);
    formData.append('cantidad', cantidad);
    formData.append('unidad', unidad);

    const response = await fetch(`${API_BASE_URL}/cotizacion`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || `Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error al calcular cotización:', error);
    throw error;
  }
}
