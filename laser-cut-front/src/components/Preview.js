import React from 'react';
import './Preview.css';

function Preview({ fileData, quoteData, currentStep }) {
  // Solo mostrar el SVG, no la cotización (la cotización se muestra en Step4)
  if (quoteData && currentStep === 4) {
    const decodedSvg = fileData && fileData.vistaPreviaBase64 
      ? atob(fileData.vistaPreviaBase64) 
      : null;

    return (
      <div className="preview">
        <div className="preview-content">
          {decodedSvg && (
            <div className="preview-image-container">
              <div 
                dangerouslySetInnerHTML={{ __html: decodedSvg }}
                className="preview-svg"
              />
            </div>
          )}
        </div>
      </div>
    );
  }

  if (fileData) {
    const decodedSvg = fileData.vistaPreviaBase64 
      ? atob(fileData.vistaPreviaBase64) 
      : null;

    return (
      <div className="preview">
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
              <p>Subí un archivo compatible para ver la vista previa.</p>
            </div>
          )}
        </div>
      </div>
    );
  }

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
