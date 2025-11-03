import React from 'react';
import './Step.css';

function Step3({ wizardState, onNext }) {
  const {
    material,
    setMaterial,
    thickness,
    setThickness,
  } = wizardState;

  const materials = {
    'Hierro': [
      { value: '0.5', label: '0.5 mm' },
      { value: '1.0', label: '1.0 mm' },
      { value: '2.0', label: '2.0 mm' },
      { value: '3.0', label: '3.0 mm' },
    ],
    'Acero Inoxidable': [
      { value: '0.5', label: '0.5 mm' },
      { value: '1.0', label: '1.0 mm' },
      { value: '2.0', label: '2.0 mm' },
      { value: '3.0', label: '3.0 mm' },
    ]
  };

  const canContinue = material && thickness;

  return (
    <div className="step">
      <h3 className="step-title">Seleccionar material</h3>

      <div className="material-categories">
        <label className="form-label">Categoría</label>
        <div className="category-list">
          <button
            className={`category-card ${material ? 'selected' : ''}`}
            onClick={() => {
              setMaterial('Hierro');
              setThickness('');
            }}
          >
            <div className="category-icon">🔩</div>
            <div className="category-info">
              <h4 className="category-title">Metales</h4>
              <p className="category-desc">Hierro, Acero Inoxidable...</p>
            </div>
          </button>
        </div>
      </div>

      {material && (
        <div className="material-selection">
          <label className="form-label">Espesor</label>
          <div className="thickness-list">
            {materials[material]?.map((thick) => (
              <label key={thick.value} className="thickness-option">
                <input
                  type="radio"
                  name="thickness"
                  value={thick.value}
                  checked={thickness === thick.value}
                  onChange={(e) => setThickness(e.target.value)}
                />
                <span>{thick.label}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      <div className="step-actions">
        <button
          className="btn-primary"
          onClick={onNext}
          disabled={!canContinue}
        >
          NEXT
        </button>
      </div>
    </div>
  );
}

export default Step3;
