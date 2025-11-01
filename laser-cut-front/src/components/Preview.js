import React from 'react';
import './Preview.css';

function Preview({ fileData, quoteData }) {
  // Si hay quote data, mostrar información de la cotización
  if (quoteData) {
    // Decodificar SVG desde base64
    const decodedSvg = fileData && fileData.vistaPreviaBase64 
      ? atob(fileData.vistaPreviaBase64) 
      : null;

    return (
      <div className="preview">
        <h3 className="preview-title">Cotización</h3>
        <div className="preview-content">
          {decodedSvg && (
            <div className="preview-image-container">
              <div 
                dangerouslySetInnerHTML={{ __html: decodedSvg }}
                className="preview-svg"
              />
            </div>
          )}
          <div className="quote-details">
            <div className="quote-item">
              <span className="quote-label">Material:</span>
              <span className="quote-value">{quoteData.material}</span>
            </div>
            <div className="quote-item">
              <span className="quote-label">Dimensiones:</span>
              <span className="quote-value">{quoteData.ancho} × {quoteData.alto} mm</span>
            </div>
            <div className="quote-item">
              <span className="quote-label">Espesor:</span>
              <span className="quote-value">{quoteData.espesor} mm</span>
            </div>
            <div className="quote-item">
              <span className="quote-label">Cantidad:</span>
              <span className="quote-value">{quoteData.cantidad} unidades</span>
            </div>
            <div className="quote-divider"></div>
            <div className="quote-item quote-total">
              <span className="quote-label">Total:</span>
              <span className="quote-value highlight">${quoteData.precioTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Si solo hay file data, mostrar preview del archivo
  if (fileData) {
    // Decodificar SVG desde base64
    const decodedSvg = fileData.vistaPreviaBase64 
      ? atob(fileData.vistaPreviaBase64) 
      : null;

    return (
      <div className="preview">
        <h3 className="preview-title">Preview</h3>
        <div className="preview-content">
          {decodedSvg ? (
            <div className="preview-image-container">
              <div 
                dangerouslySetInnerHTML={{ __html: decodedSvg }}
                className="preview-svg"
              />
            </div>
          ) : (
            <div className="preview-placeholder">
              <div className="preview-icon">📄</div>
              <p>{fileData.nombre}</p>
            </div>
          )}
          <div className="preview-info">
            <div className="info-item">
              <span className="info-label">Archivo:</span>
              <span className="info-value">{fileData.nombre}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Ancho:</span>
              <span className="info-value">{fileData.ancho.toFixed(0)} mm</span>
            </div>
            <div className="info-item">
              <span className="info-label">Alto:</span>
              <span className="info-value">{fileData.alto.toFixed(0)} mm</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Estado vacío
  return (
    <div className="preview">
      <h3 className="preview-title">Preview</h3>
      <div className="preview-content preview-empty">
        <div className="preview-placeholder">
          <div className="preview-icon">📊</div>
          <p>Sube un archivo para ver el preview</p>
        </div>
      </div>
    </div>
  );
}

export default Preview;

