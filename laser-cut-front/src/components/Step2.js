import React, { useEffect, useMemo, useState, useCallback } from 'react';
import './Step.css';
import { getCatalogo } from '../services/api';

function Step3({ wizardState, onNext, onBack, setHeaderControls }) {
  const {
    material,
    setMaterial,
    thickness,
    setThickness,
    setError,
  } = wizardState;

  const [catalog, setCatalog] = useState([]);
  const [isLoadingCatalog, setIsLoadingCatalog] = useState(false);
  const [isSelectingThickness, setIsSelectingThickness] = useState(false);

  const canContinue = material && thickness;

  useEffect(() => {
    let isMounted = true;
    const fetchCatalog = async () => {
      try {
        setIsLoadingCatalog(true);
        const data = await getCatalogo();
        if (isMounted) {
          setCatalog(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        setError && setError(err.message || 'No se pudo cargar el catálogo');
      } finally {
        if (isMounted) setIsLoadingCatalog(false);
      }
    };
    fetchCatalog();
    return () => {
      isMounted = false;
    };
  }, [setError]);

  const selectedMaterial = useMemo(
    () => catalog.find((m) => m.nombre === material) || null,
    [catalog, material]
  );

  const sortedEspesores = useMemo(() => {
    if (!selectedMaterial) return [];
    return [...(selectedMaterial.espesores || [])].sort(
      (a, b) => Number(a.espesorMm) - Number(b.espesorMm)
    );
  }, [selectedMaterial]);

  const handleSelectMaterial = useCallback((nombre) => {
    setMaterial(nombre);
    setThickness('');
    setIsSelectingThickness(true);
  }, [setMaterial, setThickness]);

  useEffect(() => {
    setIsSelectingThickness(Boolean(material));
  }, []);

  const handleBackToMaterials = useCallback(() => {
    setIsSelectingThickness(false);
    setMaterial('');
    setThickness('');
  }, [setMaterial, setThickness]);

  useEffect(() => {
    setHeaderControls({
      showBack: true,
      showNext: true,
      canContinue,
      onNext,
      onBack,
    });
  }, [setHeaderControls, onNext, onBack, canContinue]);

  return (
    <div className="step">
      <h3 className="step-title">¿Con qué material querés trabajar?</h3>
      <p className="step-description">
        {isSelectingThickness && selectedMaterial
          ? 'Indicá el espesor correspondiente al material elegido.'
          : 'Indicá el material con el que querés trabajar.'}
      </p>

      {!isSelectingThickness && (
        <div className="material-categories">
          <div className="category-list">
            {isLoadingCatalog && (
              <div className="loading">
                <div className="spinner"></div>
                <p>Cargando catálogo...</p>
              </div>
            )}
            {!isLoadingCatalog && catalog.map((m) => (
              <button
                key={m.id}
                className="category-card"
                onClick={() => handleSelectMaterial(m.nombre)}
              >
                <div className="category-icon">🔩</div>
                <div className="category-info">
                  <h4 className="category-title">{m.nombre}</h4>
                  <p className="category-desc">
                    Densidad: {m.densidad} g/cm³ · Precio Kg: ${m.precioPorKg}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {isSelectingThickness && selectedMaterial && (
        <div className="material-selection">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button type="button" className="btn-link" onClick={handleBackToMaterials}>
              ← CAMBIAR MATERIAL
            </button>
          </div>
          <div className="thickness-list">
            {sortedEspesores.map((e) => (
              <label key={e.id} className="thickness-option">
                <input
                  type="radio"
                  name="thickness"
                  value={e.espesorMm}
                  checked={String(thickness) === String(e.espesorMm)}
                  onChange={(ev) => setThickness(ev.target.value)}
                />
                <span>
                  {e.espesorMm} mm {e.espesorInch ? `(${e.espesorInch} in)` : ''}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}

export default Step3;
