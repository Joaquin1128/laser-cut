import React, { useState } from 'react';
import './App.css';
import LandingPage from './components/LandingPage';
import Wizard from './components/Wizard';

function App() {
  const [currentView, setCurrentView] = useState('landing');

  // Manejar navegación entre landing y wizard
  const handleStartWizard = () => {
    setCurrentView('wizard');
  };

  const handleBackToLanding = () => {
    setCurrentView('landing');
  };

  return (
    <div className="App">
      {currentView === 'landing' && (
        <LandingPage onStart={handleStartWizard} />
      )}
      {currentView === 'wizard' && (
        <Wizard onBack={handleBackToLanding} />
      )}
    </div>
  );
}

export default App;
