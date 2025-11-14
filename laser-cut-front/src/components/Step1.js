import React, { useEffect } from 'react';
import './Step.css';

function Step1({ wizardState, onNext, onBack, setHeaderControls }) {
  const {
    file,
    fileData,
    unitConfirmed,
    setUnitConfirmed,
  } = wizardState;

  const canContinue = Boolean(file && fileData && unitConfirmed);

  const selectedUnit = unitConfirmed || 'MM';

  const formatDimensionValue = (value) => {
    if (value === null || value === undefined) {
      return '--';
    }
    const numericValue = Number(value);
    if (Number.isNaN(numericValue)) {
      return '--';
    }

    return numericValue.toFixed(3).replace(/\.?0+$/, '');
  };

  const anchoFormatted = formatDimensionValue(fileData?.ancho);
  const altoFormatted = formatDimensionValue(fileData?.alto);

  const dimensionLabel = selectedUnit === 'INCH'
    ? `${anchoFormatted}" × ${altoFormatted}"`
    : `${anchoFormatted} × ${altoFormatted} mm`;

  const handleUnitChange = (unit) => {
    setUnitConfirmed(unit);
  };

  useEffect(() => {
    setHeaderControls({
      showBack: false,
      showNext: true,
      nextLabel: 'CONFIRMAR',
      canContinue,
      onNext,
      onBack,
    });
  }, [setHeaderControls, onNext, onBack, canContinue]);

  if (!fileData) {
    return null;
  }

  return (
    <div className="step">
      <h3 className="step-title">¿En qué unidades está tu archivo?</h3>

      <div className="unit-step-layout">
        <div className="unit-selection-side">
          <div className="unit-description">
            Esto asegura que las dimensiones se interpreten correctamente.
          </div>

          <div className="unit-dimensions-label">{dimensionLabel}</div>

          <div className="unit-choice-group">
            <label className="unit-choice">
              <input
                type="radio"
                name="unit"
                value="MM"
                checked={selectedUnit === 'MM'}
                onChange={() => handleUnitChange('MM')}
              />
              <span>MM</span>
            </label>
            <label className="unit-choice">
              <input
                type="radio"
                name="unit"
                value="INCH"
                checked={selectedUnit === 'INCH'}
                onChange={() => handleUnitChange('INCH')}
              />
              <span>INCH</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Step1;
