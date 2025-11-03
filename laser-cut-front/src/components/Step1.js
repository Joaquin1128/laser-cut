import React from 'react';
import './Step.css';

function Step1({ wizardState, onNext }) {
  const {
    file,
    fileData,
    unitConfirmed,
    setUnitConfirmed,
  } = wizardState;

  const canContinue = file && fileData && unitConfirmed;

  if (!fileData) {
    return null;
  }

  return (
    <div className="step">
      <h3 className="step-title">Confirmar unidades</h3>

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
