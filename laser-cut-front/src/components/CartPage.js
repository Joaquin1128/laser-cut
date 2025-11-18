import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import Header from './Header';
import { FaTrash } from 'react-icons/fa';
import './CartPage.css';
import './QuotePage.css';
import './Wizard.css';
import './Step.css';

function CartPage() {
  const navigate = useNavigate();
  const { cartItems, removeFromCart, clearCart, getCartTotal } = useCart();
  const total = getCartTotal();

  const handleContinueShopping = () => {
    navigate('/upload');
  };

  const handleProceedToPayment = () => {
    // ACÁ VA LÓGICA DE PAGO
    console.log('Proceder al pago - no implementado aún');
  };

  if (cartItems.length === 0) {
    return (
      <div className="cart-page">
        <Header />
        <div className="cart-page-container">
          <div className="cart-empty">
            <h2 className="cart-empty-title">Tu carrito está vacío</h2>
            <p className="cart-empty-message">Agregá piezas desde la página de cotización.</p>
            <button
              className="btn-primary"
              type="button"
              onClick={handleContinueShopping}
            >
              SEGUIR COTIZANDO
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <Header />
      <div className="cart-page-container">
        <div className="cart-content wizard-step-material">
          <div className="step">
            <h3 className="step-title">Mi carrito</h3>
            <p className="step-description">Revisá los items agregados a tu carrito.</p>
          
          <div className="cart-items">
            {cartItems.map((item) => (
              <div key={item.id} className="cart-item">
                <div className="cart-item-preview">
                  {item.archivo?.urlPreview && (
                    <img
                      src={item.archivo.urlPreview}
                      alt={item.archivo.nombre || 'Pieza'}
                      className="cart-item-image"
                    />
                  )}
                </div>
                
                <div className="cart-item-details">
                  <h3 className="cart-item-name">{item.archivo?.nombre || 'Sin nombre'}</h3>
                  <div className="cart-item-info">
                    <div className="cart-item-info-row">
                      <span className="cart-item-label">Material:</span>
                      <span className="cart-item-value">{item.material?.nombre || '--'}</span>
                    </div>
                    <div className="cart-item-info-row">
                      <span className="cart-item-label">Espesor:</span>
                      <span className="cart-item-value">{item.material?.espesor || '--'} mm</span>
                    </div>
                    {item.terminacion && (
                      <div className="cart-item-info-row">
                        <span className="cart-item-label">Terminación:</span>
                        <span className="cart-item-value">{item.terminacion}</span>
                      </div>
                    )}
                    {item.archivo?.dimensiones && (
                      <div className="cart-item-info-row">
                        <span className="cart-item-label">Dimensiones:</span>
                        <span className="cart-item-value">{item.archivo.dimensiones}</span>
                      </div>
                    )}
                    <div className="cart-item-info-row">
                      <span className="cart-item-label">Cantidad:</span>
                      <span className="cart-item-value">{item.cantidad} unidades</span>
                    </div>
                  </div>
                </div>

                <div className="cart-item-pricing">
                  <div className="cart-item-price-row">
                    <span className="cart-item-label">Precio unitario:</span>
                    <span className="cart-item-price">${item.precioUnitario.toFixed(2)}</span>
                  </div>
                  <div className="cart-item-price-row cart-item-total-row">
                    <span className="cart-item-label">Total:</span>
                    <span className="cart-item-price highlight">${item.precioTotal.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  className="cart-item-remove"
                  type="button"
                  onClick={() => removeFromCart(item.id)}
                  aria-label="Eliminar item"
                >
                  <FaTrash />
                </button>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <div className="cart-summary-row">
              <span className="cart-summary-label">Total general:</span>
              <span className="cart-summary-total">${total.toFixed(2)}</span>
            </div>
          </div>

          <div className="quote-actions">
            <button
              className="btn-secondary"
              type="button"
              onClick={handleContinueShopping}
            >
              SEGUIR COTIZANDO
            </button>
            <button
              className="btn-primary"
              type="button"
              onClick={handleProceedToPayment}
            >
              PROCEDER AL PAGO
            </button>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CartPage;
