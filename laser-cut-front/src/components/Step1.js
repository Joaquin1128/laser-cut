import React, { useRef } from 'react';
import './Step.css';
import { analizarArchivo } from '../services/api';

function Step1({ wizardState, onNext }) {
  const {
    file,
    setFile,
    fileData,
    setFileData,
    isLoading,
    setIsLoading,
    error,
    setError,
    unitConfirmed,
    setUnitConfirmed,
  } = wizardState;

  const fileInputRef = useRef(null);

  // Manejar selección de archivo
  const handleFileSelect = async (event) => {
    const selectedFile = event.target.files[0];
    if (!selectedFile) return;

    // Validar extensión
    if (!selectedFile.name.toLowerCase().endsWith('.dxf')) {
      setError('Por favor, sube un archivo DXF válido');
      return;
    }

    setFile(selectedFile);
    setError(null);
    setIsLoading(true);

    try {
      // Llamar al endpoint POST /analizar-archivo
      const data = await analizarArchivo(selectedFile);
      setFileData(data);
    } catch (err) {
      setError(err.message || 'Error al analizar el archivo');
      setFile(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Verificar si se puede continuar
  const canContinue = file && fileData && unitConfirmed && !isLoading;

  return (
    <div className="step">
      <h3 className="step-title">Confirmar unidades</h3>

      {/* Confirmar unidad primero */}
      {!fileData ? (
        <div className="unit-selection-first">
          <p className="step-description">
            Selecciona el archivo y confirma las unidades de tu diseño
          </p>
          <div className="upload-area">
            <input
              ref={fileInputRef}
              type="file"
              accept=".dxf"
              onChange={handleFileSelect}
              className="file-input"
              disabled={isLoading}
            />
            <div className="upload-dropzone">
              {file ? (
                <div className="upload-success">
                  <div className="upload-icon">✓</div>
                  <p className="upload-filename">{file.name}</p>
                  <button
                    className="btn-link"
                    onClick={() => {
                      setFile(null);
                      setFileData(null);
                      setUnitConfirmed(false);
                      if (fileInputRef.current) {
                        fileInputRef.current.value = '';
                      }
                    }}
                  >
                    Cambiar archivo
                  </button>
                </div>
              ) : (
                <>
                  <div className="upload-icon">📎</div>
                  <p className="upload-text">
                    Haz clic para seleccionar tu archivo DXF
                  </p>
                  <button
                    className="btn-secondary"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isLoading}
                  >
                    Seleccionar archivo
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      ) : (
        <>
          <p className="step-description">
            Las dimensiones detectadas son: {fileData.ancho.toFixed(0)} × {fileData.alto.toFixed(0)} mm
          </p>

          <div className="unit-confirmation">
            <h4 className="unit-title">Confirmar unidades del dibujo</h4>
            <div className="radio-group">
              <label className="radio-label">
                <input
                  type="radio"
                  name="unit"
                  value="INCH"
                  checked={!unitConfirmed}
                  onChange={() => setUnitConfirmed(false)}
                />
                <span>INCH</span>
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  name="unit"
                  value="MM"
                  checked={unitConfirmed}
                  onChange={() => setUnitConfirmed(true)}
                />
                <span>MM</span>
              </label>
            </div>
          </div>

          {error && <div className="error-message">{error}</div>}
        </>
      )}

      {/* Loading indicator */}
      {isLoading && (
        <div className="loading">
          <div className="spinner"></div>
          <p>Analizando archivo...</p>
        </div>
      )}

      {/* Botón siguiente */}
      <div className="step-actions">
        <button
          className="btn-primary"
          onClick={onNext}
          disabled={!canContinue}
        >
          CONFIRMAR
        </button>
      </div>
    </div>
  );
}

export default Step1;
