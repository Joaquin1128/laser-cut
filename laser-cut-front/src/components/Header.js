import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaShoppingCart } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import './Header.css';

function Header({ containerClass = 'wizard-header-top', logoClass = 'wizard-logo', showLogin = true, children }) {
  const navigate = useNavigate();
  const { getCartItemCount } = useCart();
  const cartItemCount = getCartItemCount();

  const handleCartClick = () => {
    navigate('/cart');
  };

  return (
    <div className={containerClass}>
      <div className={logoClass}>Corte Láser 2D</div>
      {children}
      <div className="header-right-actions">
        <button
          className="cart-icon-button"
          type="button"
          onClick={handleCartClick}
          aria-label="Ver carrito"
        >
          <FaShoppingCart className="cart-icon" />
          {cartItemCount > 0 && (
            <span className="cart-badge">{cartItemCount}</span>
          )}
        </button>
        {showLogin && <button className="btn-login-header">LOGIN</button>}
      </div>
    </div>
  );
}

export default Header;
