import React, { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useCart from '../../hooks/useCart';
import CartItem from './CartItem';
import '../../styles/CartPreview.css';

/**
 * CartPreview component that displays the current items in the cart
 * This appears as a popover from the cart button in the navbar
 */
const CartPreview = ({ isOpen, onClose, position }) => {
  const { items, totalItems, formattedTotalPrice, clearCart } = useCart(); //item note items!!!!!
  console.log("item from cartItem", items)
  const navigate = useNavigate();
  const cartRef = useRef(null);
  
  // Close cart when clicking outside
  useEffect(() => {
    
    const handleClickOutside = (event) => {
      if (cartRef.current && !cartRef.current.contains(event.target)) {
        onClose();
      }
    };
    
    // Close cart when pressing Escape
    const handleEscapeKey = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscapeKey);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isOpen, onClose]);
  
  // Handle checkout button click
  const handleCheckout = () => {
    onClose();
    navigate('/checkout');
  };
  
  // Handle continue shopping click
  const handleContinueShopping = () => {
    onClose();
  };
  
  // Position class for the preview
  const positionClass = position === 'right' ? 'cart-preview-right' : 'cart-preview-center';
  
  // If cart is not open, don't render
  if (!isOpen) return null;
  
  return (
    <div className={`cart-preview-backdrop ${isOpen ? 'open' : ''}`}>
      <div 
        ref={cartRef}
        className={`cart-preview ${positionClass} ${isOpen ? 'open' : ''}`}
        aria-modal="true"
        role="dialog"
      >
        <div className="cart-preview-header">
          <h3>Your Cart ({totalItems} items)</h3>
          <button 
            className="close-btn skeuomorphic-btn with-glare"
            onClick={onClose}
            aria-label="Close cart"
          >
            ×
          </button>
        </div>
        
        {items.length === 0 ? (
          <div className="empty-cart">
            <p>Your cart is empty</p>
            <button 
              className="continue-shopping-btn skeuomorphic-btn primary with-glare"
              onClick={handleContinueShopping}
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <>
            <div className="cart-items-container">
              <div className="cart-item-header">
                <div className="header-item header-image">Item</div>
                <div className="header-item header-details">Details</div>
                <div className="header-item header-price">Price</div>
                <div className="header-item header-quantity">Qty</div>
                <div className="header-item header-total">Total</div>
                <div className="header-item header-actions"></div>
              </div>
              
              <div className="cart-items-list">
                {items.map(item => (
                  <CartItem key={item.id} item={item} />
                ))}
              </div>
            </div>
            
            <div className="cart-summary">
              <div className="cart-totals">
                <span>Total:</span>
                <span className="cart-total-price">{formattedTotalPrice}</span>
              </div>
              
              <div className="cart-actions">
                <button 
                  className="clear-cart-btn skeuomorphic-btn danger with-glare"
                  onClick={clearCart}
                >
                  Clear Cart
                </button>
                
                <div className="cart-main-actions">
                  <button 
                    className="continue-shopping-btn skeuomorphic-btn secondary with-glare"
                    onClick={handleContinueShopping}
                  >
                    Continue Shopping
                  </button>
                  
                  <button 
                    className="checkout-btn skeuomorphic-btn primary with-glare"
                    onClick={handleCheckout}
                  >
                    Checkout
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CartPreview;
