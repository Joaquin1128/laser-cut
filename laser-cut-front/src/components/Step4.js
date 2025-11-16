import React, { useEffect, useState, useCallback, useMemo } from 'react';
import './Step.css';
import { FaCheckCircle } from 'react-icons/fa';
import { calcularCotizacion } from '../services/api';

function Step4({ wizardState, onBack, setHeaderControls }) {
  const {
    file,
    fileData,
    unitConfirmed,
    material,
    thickness,
    finish,
    quantity,
    isLoading,
    setIsLoading,
    setError,
    setQuoteData,
  } = wizardState;

  const [quoteRequested, setQuoteRequested] = useState(false);

  const canGenerate = Boolean(
    file && fileData && unitConfirmed && material && thickness && quantity > 0 && !isLoading
  );

  const formatDimensionValue = useCallback((value) => {
    if (value === null || value === undefined) return '--';
    const numeric = Number(value);
    if (Number.isNaN(numeric)) return '--';
    return numeric.toFixed(3).replace(/\.?0+$/, '');
  }, []);

  const dimensionsText = useMemo(() => {
    if (!fileData || !unitConfirmed) return '--';
    const ancho = formatDimensionValue(fileData.ancho);
    const alto = formatDimensionValue(fileData.alto);
    return unitConfirmed === 'INCH'
      ? `${ancho}" × ${alto}"`
      : `${ancho} × ${alto} mm`;
  }, [fileData, unitConfirmed, formatDimensionValue]);

  const handleGenerate = useCallback(async () => {
    if (!canGenerate) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await calcularCotizacion({
        archivo: file,
        material,
        espesor: parseFloat(thickness),
        cantidad: parseInt(quantity),
        unidad: unitConfirmed === 'INCH' ? 'INCH' : 'MM',
      });
      setQuoteData(data);
      setQuoteRequested(true);
    } catch (err) {
      setError(err.message || 'Error al calcular la cotización');
    } finally {
      setIsLoading(false);
    }
  }, [canGenerate, setIsLoading, setError, file, material, thickness, quantity, unitConfirmed, setQuoteData]);

  useEffect(() => {
    const controls = {
      showBack: true,
      onBack,
    };

    if (!quoteRequested) {
      controls.showNext = true;
      controls.nextLabel = 'GENERAR COTIZACIÓN';
      controls.canContinue = canGenerate;
      controls.isLoading = isLoading;
      controls.onNext = handleGenerate;
    } else {
      controls.showNext = false;
      controls.backLabel = 'NUEVA COTIZACIÓN';
    }

    setHeaderControls(controls);
  }, [setHeaderControls, quoteRequested, canGenerate, isLoading, onBack, handleGenerate]);

  return (
    <div className="step">
      <h3 className="step-title">Confirmación</h3>

      <div className="summary-card">
        <div className="summary-row">
          <span className="summary-label">Archivo</span>
          <span className="summary-value">{file ? (file.name || 'Cargado') : '--'}</span>
        </div>
        <div className="summary-row">
          <span className="summary-label">Unidades y dimensiones</span>
          <span className="summary-value">{dimensionsText}</span>
        </div>
        <div className="summary-row">
          <span className="summary-label">Material</span>
          <span className="summary-value">
            {material ? `${material} (${thickness} mm${finish ? `, ${finish}` : ''})` : '--'}
          </span>
        </div>
        <div className="summary-row">
          <span className="summary-label">Cantidad</span>
          <span className="summary-value">{quantity || '--'}</span>
        </div>
      </div>

      {isLoading && (
        <div className="loading">
          <div className="spinner"></div>
          <p>Generando cotización...</p>
        </div>
      )}

      {quoteRequested && (
        <div className="quote-success">
          <FaCheckCircle className="success-icon" />
          <h4>¡Cotización generada exitosamente!</h4>
          <p className="success-message">La cotización se muestra en el panel de preview.</p>
        </div>
      )}
    </div>
  );
}

export default Step4;
