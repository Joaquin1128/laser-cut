import React, { useState, useEffect } from 'react';
import './Step.css';

function Step4({ wizardState, onNext, onBack, setHeaderControls }) {
  const {
    quantity,
    setQuantity,
  } = wizardState;

  const [tempQuantity, setTempQuantity] = useState(1);
  const canContinue = tempQuantity && tempQuantity > 0;

  useEffect(() => {
    setQuantity(tempQuantity);
  }, [tempQuantity, setQuantity]);

  useEffect(() => {
    setHeaderControls({
      showBack: true,
      showNext: true,
      nextLabel: 'CONFIRMAR',
      canContinue,
      onNext,
      onBack,
    });
  }, [
    setHeaderControls,
    onNext,
    onBack,
    canContinue,
  ]);

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
    </div>
  );
}

export default Step4;
