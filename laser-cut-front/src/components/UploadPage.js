import React, { useState } from 'react';
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

  const onDrop = async (acceptedFiles) => {
    if (!acceptedFiles || acceptedFiles.length === 0) return;

    const selectedFile = acceptedFiles[0];

    if (!selectedFile.name.toLowerCase().endsWith('.dxf')) {
      setError('Por favor, sube un archivo DXF válido');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const data = await analizarArchivo(selectedFile);
      
      navigate('/wizard', { 
        state: { 
          file: selectedFile, 
          fileData: data 
        } 
      });
    } catch (err) {
      setError(err.message || 'Error al analizar el archivo');
      setIsProcessing(false);
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
        {isProcessing ? (
          <div className="processing-container">
            <div className="processing-spinner">
              <div className="spinner"></div>
            </div>
            <h2 className="processing-title">Procesando archivo...</h2>
            <p className="processing-message">Estamos analizando tu archivo DXF. Esto puede tomar unos segundos.</p>
          </div>
        ) : (
          <div {...getRootProps()} className={`dropzone-container ${isDragActive ? 'drag-active' : ''}`}>
            <input {...getInputProps()} />
            
            <div className="file-type-icons">
              <img src={dxfIcon} alt="DXF" className="file-type-icon" />
            </div>
            
            <div className="dropzone-main-text">
              Arrastra hasta 10 archivos aquí para comenzar
            </div>
            
            <div className="dropzone-divider">o</div>
            
            <button className="btn-browse-files" onClick={(e) => { e.stopPropagation(); handleFileBrowse(); }}>
              BUSCAR ARCHIVOS
            </button>
            
            <div className="security-message">
              <FaLock className="security-icon" />
              <span><strong>¡Tu diseño está en buenas manos!</strong> Tus archivos se tratarán con confidencialidad, y conservarás todos tus derechos de propiedad intelectual.</span>
            </div>
          </div>
        )}

         {error && (
           <div className="error-message-upload">
             {error}
           </div>
         )}

        {!isProcessing && (
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
        )}
      </div>
    </div>
  );
}

export default UploadPage;
