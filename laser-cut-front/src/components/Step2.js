import React from 'react';
import './Step.css';

function Step2({ wizardState, onNext }) {
  const { cutType, setCutType } = wizardState;

  return (
    <div className="step">
      <h3 className="step-title">2. Tipo de corte</h3>
      <p className="step-description">
        Selecciona el tipo de corte para tu proyecto
      </p>

      {/* Opciones de tipo de corte */}
      <div className="option-grid">
        <button
          className={`option-card ${cutType === 'Laser' ? 'selected' : ''}`}
          onClick={() => setCutType('Laser')}
        >
          <div className="option-icon">⚡</div>
          <h4 className="option-title">Laser</h4>
          <p className="option-description">
            Corte láser de alta precisión
          </p>
        </button>
      </div>

      {/* Botón siguiente */}
      <div className="step-actions">
        <button
          className="btn-primary"
          onClick={onNext}
          disabled={!cutType}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}

export default Step2;

