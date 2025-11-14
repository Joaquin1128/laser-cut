import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaCheck } from 'react-icons/fa';
import './Wizard.css';
import Preview from './Preview';
import Step1 from './Step1';
import Step3 from './Step3';
import Step4 from './Step4';
import ErrorModal from './ErrorModal';
import WizardHeaderButtons from './WizardHeaderButtons';

function Wizard() {
  const navigate = useNavigate();
  const location = useLocation();
  const hasInitialized = useRef(false);
  const [currentStep, setCurrentStep] = useState(1);
  
  const [file, setFile] = useState(null);
  const [fileData, setFileData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [unitConfirmed, setUnitConfirmed] = useState('MM');
  const [material, setMaterial] = useState('');
  const [thickness, setThickness] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [quoteData, setQuoteData] = useState(null);
  const [headerControls, setHeaderControls] = useState({
    showBack: false,
    showNext: false,
    canContinue: true,
    isLoading: false,
    onBack: null,
    onNext: null
  });

  useEffect(() => {
    if (!hasInitialized.current) {
      hasInitialized.current = true;
      if (location.state) {
        if (location.state.file) {
          setFile(location.state.file);
        }
        if (location.state.fileData) {
          setFileData(location.state.fileData);
          setUnitConfirmed('MM');
        }
      } else {
        navigate('/upload', { replace: true });
      }
    }
  }, [location.state, navigate]);

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
    material,
    setMaterial,
    thickness,
    setThickness,
    quantity,
    setQuantity,
    quoteData,
    setQuoteData,
  };

  const formatDimension = (value, unit) => {
    if (!value) return '--';
    if (unit === 'INCH') {
      return (value / 25.4).toFixed(2);
    }
    return value.toFixed(0);
  };

  const dimensionLabel = fileData
    ? `${formatDimension(fileData.ancho, unitConfirmed)} × ${formatDimension(fileData.alto, unitConfirmed)} ${unitConfirmed === 'INCH' ? 'in' : 'mm'}`
    : null;

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Step1
            wizardState={wizardState}
            onNext={handleNext}
            onBack={handleBack}
            setHeaderControls={setHeaderControls}
          />
        );
      case 2:
        return (
          <Step3
            wizardState={wizardState}
            onNext={handleNext}
            onBack={handleBack}
            setHeaderControls={setHeaderControls}
          />
        );
      case 3:
        return (
          <Step4
            wizardState={wizardState}
            onBack={handleBack}
            setHeaderControls={setHeaderControls}
          />
        );
      default:
        return <Step1 wizardState={wizardState} onNext={handleNext} />;
    }
  };

  const headerButtonProps = useMemo(
    () => ({
      showBack: headerControls.showBack,
      backLabel: headerControls.backLabel,
      showNext: headerControls.showNext,
      nextLabel: headerControls.nextLabel,
      canContinue:
        headerControls.canContinue !== undefined
          ? headerControls.canContinue
          : true,
      isLoading: headerControls.isLoading || false,
      onBack: headerControls.onBack || handleBack,
      onNext: headerControls.onNext || handleNext,
    }),
    [headerControls, handleBack, handleNext]
  );

  return (
    <div className="wizard">
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
        </div>
        <button className="btn-login-header">LOGIN</button>
        {dimensionLabel && (
          <div className="wizard-dimensions">{dimensionLabel}</div>
        )}
      </div>

      <div className="wizard-container">
        <div className="wizard-content">
          <div className="wizard-step-wrapper">
            <WizardHeaderButtons {...headerButtonProps} />
            <div className={`wizard-step ${currentStep === 1 ? 'wizard-step-unit' : ''}`}>
              {renderStep()}
            </div>
          </div>

          <div className="wizard-preview">
            <Preview fileData={fileData} quoteData={quoteData} />
          </div>
        </div>
      </div>

      {error && (
        <ErrorModal
          message={error}
          onClose={() => setError(null)}
        />
      )}
    </div>
  );
}

export default Wizard;
