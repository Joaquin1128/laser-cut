import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { FaLock, FaFileUpload, FaIndustry, FaShippingFast } from 'react-icons/fa';
import './UploadPage.css';
import dxfIcon from '../assets/icons/dxf.png';
import { analizarArchivo } from '../services/api';

function UploadPage() {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isProcessing) {
      setProgress(0);
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(interval);
            return prev;
          }
          const progressFactor = 1 - (prev / 90);
          const minIncrement = 0.5;
          const maxIncrement = 3 * progressFactor;
          const increment = minIncrement + Math.random() * (maxIncrement - minIncrement);
          return Math.min(prev + increment, 90);
        });
      }, 100);

      return () => clearInterval(interval);
    } else {
      setProgress(0);
    }
  }, [isProcessing]);

  const onDrop = async (acceptedFiles) => {
    if (!acceptedFiles || acceptedFiles.length === 0) return;
    const selectedFile = acceptedFiles[0];
    if (!selectedFile.name.toLowerCase().endsWith('.dxf')) {
      setError('Por favor, sube un archivo DXF válido');
      return;
    }
    setIsProcessing(true);
    setError(null);
    setProgress(0);
    
    try {
      const minProcessingTime = 3000;
      const analysisPromise = analizarArchivo(selectedFile);
      
      const [data] = await Promise.all([
        analysisPromise,
        new Promise(resolve => setTimeout(resolve, minProcessingTime))
      ]);
      
      const steps = 20;
      const stepDuration = 30;
      const startProgress = 90;
      
      for (let i = 1; i <= steps; i++) {
        await new Promise(resolve => setTimeout(resolve, stepDuration));
        const newProgress = startProgress + ((100 - startProgress) * (i / steps));
        setProgress(newProgress);
      }
      
      await new Promise(resolve => setTimeout(resolve, 300));
      
      navigate('/wizard', {
        state: {
          file: selectedFile,
          fileData: data
        }
      });
    } catch (err) {
      setError(err.message || 'Error al analizar el archivo');
      setIsProcessing(false);
      setProgress(0);
    }
  };

  const handleFileBrowse = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.dxf';
    input.onchange = (e) => {
      if (e.target.files && e.target.files.length > 0) {
        onDrop(e.target.files);
      }
    };
    input.click();
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/dxf': ['.dxf']
    },
    multiple: false,
    noClick: true,
    noKeyboard: true
  });

  return (
    <div className="upload-page">
      <div className="landing-header">
        <div className="landing-logo">Corte Láser 2D</div>
        <button className="btn-login-header" onClick={() => {}}>
          LOGIN
        </button>
      </div>

      <div className="landing-content-wrapper">
        <div {...getRootProps()} className={`dropzone-container ${isDragActive ? 'drag-active' : ''} ${isProcessing ? 'disabled' : ''}`}>
          <input {...getInputProps()} />

          <div className="file-type-icons">
            <img src={dxfIcon} alt="DXF" className="file-type-icon" />
          </div>

          <div className="dropzone-main-text">
            Arrastra un archivo aquí para comenzar
          </div>

          <div className="dropzone-divider">o</div>

          <button
            className="btn-browse-files"
            onClick={(e) => {
              e.stopPropagation();
              if (!isProcessing) handleFileBrowse();
            }}
            disabled={isProcessing}
          >
            BUSCAR ARCHIVO
          </button>

          <div className="security-message">
            <FaLock className="security-icon" />
            <span>
              <strong>¡Tu diseño está en buenas manos!</strong> Tus archivos se tratarán con confidencialidad, y conservarás todos tus derechos de propiedad intelectual.
            </span>
          </div>
        </div>

        {error && (
          <div className="error-message-upload">
            {error}
          </div>
        )}

        <div className="process-steps">
          <div className="process-step">
            <FaFileUpload className="process-step-icon" />
            <h3 className="process-step-title">Subí tu diseño</h3>
            <p className="process-step-description">
              Cargá tu archivo 2D o 3D, elegí material y proceso. Recibí la cotización al instante.
            </p>
          </div>

          <div className="process-step">
            <FaIndustry className="process-step-icon" />
            <h3 className="process-step-title">Confirmá tu pedido</h3>
            <p className="process-step-description">
              Revisá los detalles y confirmá tu orden. Comenzamos la producción de inmediato.
            </p>
          </div>

          <div className="process-step">
            <FaShippingFast className="process-step-icon" />
            <h3 className="process-step-title">Recibí tus piezas</h3>
            <p className="process-step-description">
              Enviamos tus piezas con control de calidad y seguimiento de envío en tiempo real.
            </p>
          </div>
        </div>
      </div>

      {isProcessing && (
        <div className="processing-modal-overlay">
          <div className="processing-modal">
            <div className="circular-progress-container">
              <svg className="circular-progress" viewBox="0 0 120 120">
                <circle
                  className="circular-progress-background"
                  cx="60"
                  cy="60"
                  r="54"
                  fill="none"
                  stroke="#e5e5e5"
                  strokeWidth="8"
                />
                <circle
                  className="circular-progress-foreground"
                  cx="60"
                  cy="60"
                  r="54"
                  fill="none"
                  stroke="#d32f2f"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 54}`}
                  strokeDashoffset={`${2 * Math.PI * 54 * (1 - progress / 100)}`}
                  transform="rotate(-90 60 60)"
                  style={{ transition: 'stroke-dashoffset 0.3s ease' }}
                />
              </svg>
              <div className="circular-progress-text">
                <span className="progress-percentage">{Math.round(progress)}%</span>
              </div>
            </div>
            <h2 className="processing-modal-title">Procesando archivo...</h2>
            <p className="processing-modal-message">
              Estamos analizando tu archivo DXF. Esto puede tomar unos segundos.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default UploadPage;
