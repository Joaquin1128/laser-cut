import React from 'react';
import './LandingPage.css';

function LandingPage({ onStart }) {
  return (
    <div className="landing-page">
      <div className="landing-container">
        <h1 className="landing-title">Corte Láser 2D</h1>
        <p className="landing-subtitle">
          Cotiza tu proyecto de corte láser en minutos
        </p>
        <p className="landing-description">
          Sube tu archivo DXF y obtén una cotización instantánea para tu proyecto personalizado
        </p>
        
        <button className="btn-primary btn-landing" onClick={onStart}>
          Subir Archivo
        </button>

        <div className="features">
          <div className="feature">
            <div className="feature-icon">⚡</div>
            <h3>Cotización Rápida</h3>
            <p>Resultados en segundos</p>
          </div>
          <div className="feature">
            <div className="feature-icon">🎯</div>
            <h3>Precisión</h3>
            <p>Cortes de alta calidad</p>
          </div>
          <div className="feature">
            <div className="feature-icon">💰</div>
            <h3>Precios Justos</h3>
            <p>Transparencia total</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;

