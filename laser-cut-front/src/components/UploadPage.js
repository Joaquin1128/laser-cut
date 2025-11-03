import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { FaLock } from 'react-icons/fa';
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

    // Validar extensión
    if (!selectedFile.name.toLowerCase().endsWith('.dxf')) {
      setError('Por favor, sube un archivo DXF válido');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      // Llamar al endpoint POST /analizar-archivo
      const data = await analizarArchivo(selectedFile);
      
      // Navegar al wizard con el archivo y los datos
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
      {/* Toolbar superior */}
      <div className="landing-header">
        <div className="landing-logo">Corte Láser 2D</div>
        <button className="btn-login-header" onClick={() => {}}>
          LOGIN
        </button>
      </div>

      {/* Contenido principal */}
      <div className="landing-content-wrapper">
        {/* Zona de drop */}
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
              <span>¡Tu diseño está seguro! Cualquier archivo subido es seguro y conservas el 100% de los derechos de propiedad intelectual.</span>
            </div>
          </div>
        )}

         {/* Error message */}
         {error && (
           <div className="error-message-upload">
             {error}
           </div>
         )}
      </div>
    </div>
  );
}

export default UploadPage;

