import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Wizard.css';
import Preview from './Preview';
import Step1 from './Step1';
import Step2 from './Step2';
import Step3 from './Step3';
import Step4 from './Step4';
import ErrorModal from './ErrorModal';
import WizardButtons from './WizardButtons';
import Header from './Header';

function Wizard() {
  const navigate = useNavigate();
  const location = useLocation();
  const hasInitialized = useRef(false);
  const [currentStep, setCurrentStep] = useState(1);
  
  const [file, setFile] = useState(null);
  const [fileData, setFileData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [unitConfirmed, setUnitConfirmed] = useState(null);
  const [material, setMaterial] = useState('');
  const [thickness, setThickness] = useState('');
  const [finish, setFinish] = useState(null);
  const [quantity, setQuantity] = useState(null);
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
        }
      } else {
        navigate('/upload', { replace: true });
      }
    }
  }, [location.state, navigate]);

  const handleNext = useCallback(() => {
    setCurrentStep((prev) => {
      if (prev < 4) {
        setError(null);
        return prev + 1;
      }
      return prev;
    });
  }, []);

  const handleBack = useCallback(() => {
    setCurrentStep((prev) => {
      if (prev > 1) {
        setError(null);
        if (prev === 4) {
          setQuoteData(null);
          setIsLoading(false);
        } else if (prev === 3) {
          setQuantity(null);
          setQuoteData(null);
        } else if (prev === 2) {
          setMaterial('');
          setThickness('');
          setFinish(null);
          setQuantity(null);
          setQuoteData(null);
        }
        return prev - 1;
      }
      navigate('/');
      return prev;
    });
  }, [navigate]);

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
    finish,
    setFinish,
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
          <Step2
            wizardState={wizardState}
            onNext={handleNext}
            onBack={handleBack}
            setHeaderControls={setHeaderControls}
          />
        );
      case 3:
        return (
          <Step3
            wizardState={wizardState}
            onNext={handleNext}
            onBack={handleBack}
            setHeaderControls={setHeaderControls}
          />
        );
      case 4:
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

  const stepSummaries = useMemo(() => {
    const formatDimensionValue = (value) => {
      if (value === null || value === undefined) {
        return null;
      }
      const numeric = Number(value);
      if (Number.isNaN(numeric)) {
        return null;
      }

      return numeric.toFixed(3).replace(/\.?0+$/, '');
    };

    const unitText = (() => {
      if (!unitConfirmed || !fileData) return null;
      const ancho = formatDimensionValue(fileData.ancho);
      const alto = formatDimensionValue(fileData.alto);
      if (!ancho || !alto) return null;
      return unitConfirmed === 'INCH'
        ? `${ancho}" × ${alto}"`
        : `${ancho} × ${alto} mm`;
    })();

    const materialText = (() => {
      if (!material || !thickness) return null;
      return `${material} (${thickness} mm${finish ? `, ${finish}` : ''})`;
    })();

    const quantityText = (() => {
      if (!quantity) return null;
      return `Cantidad: ${quantity}`;
    })();

    return [unitText, materialText, quantityText, null];
  }, [unitConfirmed, fileData, material, thickness, finish, quantity]);

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
      <Header>
        <div className="progress-bar progress-bar-desktop">
          {['Unidades', 'Material', 'Cantidad', 'Confirmación'].map((label, index) => {
            const stepNumber = index + 1;
            const isActive = currentStep === stepNumber;
            const isCompleted = currentStep > stepNumber;
            const summary = stepSummaries[index];
            const wrapperClass = [
              'progress-step-wrapper',
              isActive ? 'active' : '',
              isCompleted ? 'completed' : '',
            ]
              .filter(Boolean)
              .join(' ');

            return (
              <div key={label} className={wrapperClass}>
                <div className={`progress-step-circle ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}>
                  <span>{stepNumber}</span>
                </div>
                <div className="progress-step-label">
                  <span
                    className={`progress-step-text ${summary ? 'filled' : ''}`}
                    title={summary || label}
                  >
                    {summary || label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
        {dimensionLabel && (
          <div className="wizard-dimensions">{dimensionLabel}</div>
        )}
      </Header>

      <div className="wizard-container">
        <div className="progress-bar progress-bar-mobile">
          {['Unidades', 'Material', 'Cantidad', 'Confirmación'].map((label, index) => {
            const stepNumber = index + 1;
            const isActive = currentStep === stepNumber;
            const isCompleted = currentStep > stepNumber;
            const summary = stepSummaries[index];
            const wrapperClass = [
              'progress-step-wrapper',
              'progress-step-wrapper-mobile',
              isActive ? 'active' : '',
              isCompleted ? 'completed' : '',
            ]
              .filter(Boolean)
              .join(' ');

            return (
              <div key={`mobile-${label}`} className={wrapperClass}>
                <div className={`progress-step-circle ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}>
                  <span>{stepNumber}</span>
                </div>
                <div className="progress-step-label">
                  <span
                    className={`progress-step-text ${summary ? 'filled' : ''}`}
                    title={summary || label}
                  >
                    {summary || label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="wizard-content">
          <div className="wizard-step-wrapper">
            <WizardButtons {...headerButtonProps} />
            <div className={`wizard-step ${currentStep === 1 ? 'wizard-step-unit' : ''} ${currentStep === 2 ? 'wizard-step-material' : ''} ${currentStep === 3 ? 'wizard-step-material' : ''}`}>
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
