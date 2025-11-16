import React from 'react';

function Header({ containerClass = 'wizard-header-top', logoClass = 'wizard-logo', showLogin = true, children }) {
  return (
    <div className={containerClass}>
      <div className={logoClass}>Corte Láser 2D</div>
      {children}
      {showLogin && <button className="btn-login-header">LOGIN</button>}
    </div>
  );
}

export default Header;
