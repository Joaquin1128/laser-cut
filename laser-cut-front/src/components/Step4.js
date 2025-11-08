import React, { useState, useEffect } from 'react';
import { FaCheckCircle } from 'react-icons/fa';
import './Step.css';
import { calcularCotizacion } from '../services/api';

function Step4({ wizardState, onBack }) {
  const {
    file,
    material,
    thickness,
    quantity,
    setQuantity,
    fileData,
    setQuoteData,
    isLoading,
    setIsLoading,
    setError,
  } = wizardState;

  const [quoteRequested, setQuoteRequested] = useState(false);
  const [tempQuantity, setTempQuantity] = useState(1);

  useEffect(() => {
    setQuantity(tempQuantity);
  }, [tempQuantity, setQuantity]);

  const handleGetQuote = async () => {
    if (!file || !material || !thickness || !tempQuantity) {
      setError('Por favor, completa todos los campos');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await calcularCotizacion({
        archivo: file,
        material,
        espesor: parseFloat(thickness),
        cantidad: parseInt(tempQuantity),
        unidad: 'MM',
      });

      setQuoteData(data);
      setQuoteRequested(true);
    } catch (err) {
      setError(err.message || 'Error al calcular la cotización');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="step">
      <h3 className="step-title">Cantidad</h3>

      <div className="quantity-selector">
        <label className="form-label">Cantidad</label>
        <div className="quantity-controls">
          <button
            className="quantity-btn"
            onClick={() => setTempQuantity(Math.max(1, tempQuantity - 1))}
            disabled={tempQuantity <= 1}
          >
            −
          </button>
          <input
            type="number"
            min="1"
            value={tempQuantity}
            onChange={(e) => {
              const val = parseInt(e.target.value) || 1;
              setTempQuantity(Math.max(1, val));
            }}
            className="quantity-input"
          />
          <button
            className="quantity-btn"
            onClick={() => setTempQuantity(tempQuantity + 1)}
          >
            +
          </button>
        </div>
      </div>

      {isLoading && (
        <div className="loading">
          <div className="spinner"></div>
          <p>Calculando cotización...</p>
        </div>
      )}

      <div className="step-actions">
        {!quoteRequested ? (
          <>
            <button
              className="btn-secondary"
              onClick={onBack}
              disabled={isLoading}
            >
              &lt; BACK
            </button>
            <button
              className="btn-primary"
              onClick={handleGetQuote}
              disabled={isLoading}
            >
              NEXT
            </button>
          </>
        ) : (
          <div className="quote-success">
            <FaCheckCircle className="success-icon" />
            <h4>¡Cotización generada exitosamente!</h4>
            <p className="success-message">
              Tu cotización se muestra en el panel de preview.
            </p>
            <button
              className="btn-secondary"
              onClick={onBack}
            >
              Nueva Cotización
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Step4;
