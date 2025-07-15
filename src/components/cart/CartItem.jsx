import React from 'react';
import useCart from '../../hooks/useCart';
import '../../styles/CartPreview.css';

/**
 * CartItem component that displays a single item in the cart preview
 */
const CartItem = ({ item }) => {
  const { 
    formatPrice, 
    incrementQuantity, 
    decrementQuantity, 
    removeFromCart 
  } = useCart();
  
  return (
    <div className="cart-item">
      <div className="cart-item-image">
        <img 
          src={item.image} 
          alt={item.name} 
          className="cart-thumb"
        />
      </div>
      
      <div className="cart-item-details">
        <h4 className="cart-item-name">{item.name}</h4>
        <p className="cart-item-description">{item.description}</p>
        <div className="cart-item-license">
          {item.type === 'track' && (
            <span className="license-badge">{item.license}</span>
          )}
        </div>
      </div>
      
      <div className="cart-item-price">
        {formatPrice(item.price)}
      </div>
      
      <div className="cart-item-quantity">
        <button 
          className="quantity-btn decrease skeuomorphic-btn with-glare"
          onClick={() => decrementQuantity(item.id)}
          aria-label="Decrease quantity"
        >
          -
        </button>
        
        <span className="quantity-value">{item.quantity}</span>
        
        <button 
          className="quantity-btn increase skeuomorphic-btn with-glare"
          onClick={() => incrementQuantity(item.id)}
          aria-label="Increase quantity"
        >
          +
        </button>
      </div>
      
      <div className="cart-item-total">
        {formatPrice(item.price * item.quantity)}
      </div>
      
      <button 
        className="remove-item-btn skeuomorphic-btn danger with-glare"
        onClick={() => removeFromCart(item.id)}
        aria-label="Remove item"
      >
        ×
      </button>
    </div>
  );
};

export default CartItem;
