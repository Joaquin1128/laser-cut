import React, { useEffect } from 'react';
import { FaExclamationTriangle } from 'react-icons/fa';
import './ErrorModal.css';

function ErrorModal({ title = 'Ocurrió un error', message, onClose }) {
  useEffect(() => {
    if (!message) {
      return;
    }

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose?.();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [message, onClose]);

  if (!message) {
    return null;
  }

  const handleOverlayClick = (event) => {
    if (event.target === event.currentTarget) {
      onClose?.();
    }
  };

  return (
    <div
      className="error-modal-overlay"
      role="alertdialog"
      aria-modal="true"
      onMouseDown={handleOverlayClick}
    >
      <div
        className="error-modal"
        role="document"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button
          className="error-modal-close"
          type="button"
          onClick={() => onClose?.()}
          aria-label="Cerrar"
        >
          ×
        </button>
        <div className="error-modal-icon">
          <FaExclamationTriangle />
        </div>
        <h2 className="error-modal-title">{title}</h2>
        <p className="error-modal-message">{message}</p>
        <button
          className="error-modal-action"
          type="button"
          onClick={() => onClose?.()}
        >
          ENTENDIDO
        </button>
      </div>
    </div>
  );
}

export default ErrorModal;
