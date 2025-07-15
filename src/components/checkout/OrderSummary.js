import React from 'react';
import '../../styles/Checkout.css';

/**
 * OrderSummary component displays the items in the cart and total calculations
 */
const OrderSummary = ({ items, totalPrice }) => {
  // Calculate subtotal (before tax/shipping)
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  // Calculate tax (assuming 8% tax rate)
  const taxRate = 0.08;
  const tax = subtotal * taxRate;
  
  // Shipping is free for digital products
  const shipping = 0;
  
  // Calculate final total
  const total = subtotal + tax + shipping;
  
  return (
    <div className="order-summary">
      <h2 className="order-summary-header">Order Summary</h2>
      
      <div className="order-items">
        {items.map((item) => (
          <div key={item.id} className="order-item">
            <div className="order-item-image">
              <img src={item.image} alt={item.name} />
            </div>
            <div className="order-item-details">
              <div className="order-item-name">{item.name}</div>
              <div className="order-item-license">{item.license} License</div>
              <div className="order-item-price">
                ${item.price.toFixed(2)} × {item.quantity}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="order-totals">
        <div className="order-total-row">
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="order-total-row">
          <span>Tax ({(taxRate * 100).toFixed(0)}%)</span>
          <span>${tax.toFixed(2)}</span>
        </div>
        <div className="order-total-row">
          <span>Shipping</span>
          <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
        </div>
        <div className="order-total-row final">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
