import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/Checkout.css';

/**
 * OrderConfirmation component displays the confirmation page after successful checkout
 */
const OrderConfirmation = ({ order, purchasedItems, payment, email}) => {
  console.log("OrderConfirmation", order, purchasedItems, payment, email);
  return (
    <div className="order-confirmation">
      <div className="confirmation-icon">✓</div>
      <h1 className="confirmation-title">Order Confirmed!</h1>
      <p className="confirmation-message">
        Thank you for your purchase. We've sent a confirmation to {email} with your order details.
      </p>
      
      <div className="order-details">
        <h2 className="order-details-header">Order Information</h2>
        
        <div className="order-info-row">
          <span className="order-info-label">Order Number:</span>
          <span>{order.reference_number}</span>
        </div>
        
        <div className="order-info-row">
          <span className="order-info-label">Date:</span>
          <span>{new Date(order.created_at).toLocaleDateString()}</span>
        </div>
        
        <div className="order-info-row">
          <span className="order-info-label">Payment Method:</span>
          <span>{payment.processor === 'creditCard' ? 'Credit Card' : 'PayPal'}</span>
        </div>
        
        <div className="order-info-row">
          <span className="order-info-label">Total Amount:</span>
          <span>${payment.amount}</span>
        </div>
      </div>
      
      <div className="download-section">
        <h2 className="download-title">Your Downloads</h2>
        <div className="download-list">
          {purchasedItems.map((item) => (
            <div key={item.track_id} className="download-item">
              <h3 className="download-item-title">{item.title}</h3>
              <p className="download-item-license">{item.license_type} License</p>
              <a 
                href={`/download/${item.title}`} 
                className="download-button"
                target="_blank"
                rel="noopener noreferrer"
              >
                Download
              </a>
            </div>
          ))}
        </div>
      </div>
      
      <div style={{ marginTop: '2rem' }}>
        <Link to="/" className="continue-shopping">
          Continue Shopping
        </Link>
      </div>
    </div>
  );
};

export default OrderConfirmation;
