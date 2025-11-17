import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './QuotePage.css';
import './Step.css';
import './Wizard.css';
import Header from './Header';
import Preview from './Preview';

function QuotePage() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const { quoteData, fileData, file, material, thickness, finish, quantity } = location.state || {};

  useEffect(() => {
    if (!quoteData) {
      navigate('/upload', { replace: true });
    }
  }, [quoteData, navigate]);

  if (!quoteData) {
    return null;
  }

  const handleNewQuote = () => {
    navigate('/upload');
  };

  const handleAddToCart = () => {
    // LÓGICA DE AÑADIR AL CARRITO
    console.log('Añadir al carrito', quoteData);
  };

  return (
    <div className="quote-page">
      <Header />

      <div className="quote-page-container">
        <div className="quote-content wizard-step-material">
          <div className="step">
            <h3 className="step-title">Detalle de tu cotización</h3>
            <p className="step-description">Revisá los detalles de tu cotización.</p>

            <div className="summary-card">
              <div className="summary-row">
                <span className="summary-label">Archivo</span>
                <span className="summary-value">{file ? (file.name || 'Cargado') : '--'}</span>
              </div>
              <div className="summary-row">
                <span className="summary-label">Material</span>
                <span className="summary-value">{quoteData.material}</span>
              </div>
              <div className="summary-row">
                <span className="summary-label">Dimensiones</span>
                <span className="summary-value">{quoteData.ancho} × {quoteData.alto} mm</span>
              </div>
              <div className="summary-row">
                <span className="summary-label">Espesor</span>
                <span className="summary-value">{quoteData.espesor} mm</span>
              </div>
              {finish && (
                <div className="summary-row">
                  <span className="summary-label">Terminación</span>
                  <span className="summary-value">{finish}</span>
                </div>
              )}
              <div className="summary-row summary-row-before-total">
                <span className="summary-label">Cantidad</span>
                <span className="summary-value">{quoteData.cantidad} unidades</span>
              </div>
              <div className="summary-row summary-total">
                <span className="summary-label">Total</span>
                <span className="summary-value highlight">${quoteData.precioTotal.toFixed(2)}</span>
              </div>
            </div>

            <div className="quote-actions">
              <button
                type="button"
                className="btn-secondary"
                onClick={handleNewQuote}
              >
                NUEVA COTIZACIÓN
              </button>
              <button
                type="button"
                className="btn-primary"
                onClick={handleAddToCart}
              >
                AÑADIR AL CARRITO
              </button>
            </div>
          </div>
        </div>

        <div className="quote-preview">
          <Preview fileData={fileData} quoteData={quoteData} currentStep={5} />
        </div>
      </div>
    </div>
  );
}

export default QuotePage;
