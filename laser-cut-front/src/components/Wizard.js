import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaCheck } from 'react-icons/fa';
import './Wizard.css';
import Preview from './Preview';
import Step1 from './Step1';
import Step2 from './Step2';
import Step3 from './Step3';
import Step4 from './Step4';

function Wizard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentStep, setCurrentStep] = useState(1);
  
  // Estado compartido entre steps
  const [file, setFile] = useState(null);
  const [fileData, setFileData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [unitConfirmed, setUnitConfirmed] = useState(false);
  const [cutType, setCutType] = useState('Laser');
  const [material, setMaterial] = useState('');
  const [thickness, setThickness] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [quoteData, setQuoteData] = useState(null);

  // Recibir archivo desde la navegación
  useEffect(() => {
    if (location.state) {
      if (location.state.file) {
        setFile(location.state.file);
      }
      if (location.state.fileData) {
        setFileData(location.state.fileData);
        // Si ya tenemos los datos del archivo, confirmamos MM como unidad por defecto
        setUnitConfirmed(true);
      }
    }
  }, [location.state]);

  // Funciones de navegación
  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
      setError(null);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setError(null);
    } else {
      navigate('/');
    }
  };

  // Estado para compartir entre componentes
  const wizardState = {
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
    cutType,
    setCutType,
    material,
    setMaterial,
    thickness,
    setThickness,
    quantity,
    setQuantity,
    quoteData,
    setQuoteData,
  };

  // Renderizar step actual
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1 wizardState={wizardState} onNext={handleNext} />;
      case 2:
        return <Step2 wizardState={wizardState} onNext={handleNext} />;
      case 3:
        return <Step3 wizardState={wizardState} onNext={handleNext} />;
      case 4:
        return <Step4 wizardState={wizardState} onBack={handleBack} />;
      default:
        return <Step1 wizardState={wizardState} onNext={handleNext} />;
    }
  };

  return (
    <div className="wizard">
      {/* Header fijo con progress bar centrado y login */}
      <div className="wizard-header-top">
        <div className="wizard-logo">Corte Láser 2D</div>
        <div className="progress-bar">
          <div className={`progress-step ${currentStep >= 1 ? 'completed' : ''} ${currentStep === 1 ? 'active' : ''}`}>
            {currentStep > 1 ? <FaCheck /> : '1'}
          </div>
          <div className={`progress-step ${currentStep >= 2 ? 'completed' : ''} ${currentStep === 2 ? 'active' : ''}`}>
            {currentStep > 2 ? <FaCheck /> : '2'}
          </div>
          <div className={`progress-step ${currentStep >= 3 ? 'completed' : ''} ${currentStep === 3 ? 'active' : ''}`}>
            {currentStep > 3 ? <FaCheck /> : '3'}
          </div>
          <div className={`progress-step ${currentStep >= 4 ? 'completed' : ''} ${currentStep === 4 ? 'active' : ''}`}>
            {currentStep > 4 ? <FaCheck /> : '4'}
          </div>
        </div>
        <button className="btn-login-header">LOGIN</button>
      </div>

      <div className="wizard-container">
        {/* Botón volver */}
        <button className="btn-back-wizard" onClick={handleBack}>
          ← Volver
        </button>

        {/* Contenedor principal: preview + step */}
        <div className="wizard-content">
          {/* Preview a la izquierda */}
          <div className="wizard-preview">
            <Preview fileData={fileData} quoteData={quoteData} />
          </div>

          {/* Step actual a la derecha */}
          <div className="wizard-step">
            {renderStep()}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Wizard;

