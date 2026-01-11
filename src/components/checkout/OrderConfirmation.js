import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/Checkout.css';
import useCart from '../../hooks/useCart';
import { orderApi } from '../../api';

/**
 * OrderConfirmation component displays the confirmation page after successful checkout
 */
const OrderConfirmation = ({ order, purchasedItems, payment, email, licenses}) => { //licenses is always an array from the backend
  console.log("OrderConfirmation", order, purchasedItems, payment, email, licenses);
  const { items, totalPrice, taxAmount, totalItems, subtotal, isLoading, error } = useCart();

  
  return (
    <div className="order-confirmation">
      <div className="confirmation-icon">✓</div>
      <h1 className="confirmation-title">Order Confirmed!</h1>
      <p className="confirmation-message">
        Thank you for your purchase. We've sent a confirmation to {email} with your order details and links to download your files. 
      </p>
      
      <div className="order-details">
        <h2 className="order-details-header">Order Information</h2>
        
        <div className="order-info-row">
          <span className="order-info-label">Order Number:</span>
          <span>{order.reference_number}</span>
        </div>
        
        <div className="order-info-row">
          <span className="order-info-label">Date:</span>
          <span>{new Date(order.created_date).toLocaleDateString()}</span>
        </div>
        
        <div className="order-info-row">
          <span className="order-info-label">Payment Method:</span>
          <span>{payment.provider === 'stripe' ? 'Stripe' : 'PayPal'}</span>
        </div>
        
        <div className="order-info-row">
          <span className="order-info-label">Total Amount:</span>
          <span>${payment.amount}</span>
        </div>
      </div>
      
        <div className="download-section">
          <h2 className="download-title">Your Downloads</h2>

          <div className="download-list">
            {licenses?.licensesReqLoading ? (
              <p>Preparing your licenses...</p>
            ) : licenses?.licensesReqError ? (
              <p>We couldn’t load your downloads yet. Please refresh in a moment.</p>
            ) : licenses?.licenseFiles?.length === 0 ? (
              <p>No downloads found for this order yet.</p>
            ) : (
              licenses?.licenseFiles?.map((lic) => (
                <div key={lic.license_id} className="download-item">
                  <div className="download-item-header">
                    <h3 className="download-item-title">{lic.track_title}</h3>
              
                    <div className="download-item-badges">
                      <span className="download-badge">{lic.license_type}</span>
                      <span className={`download-badge ${lic.status === 'Active' ? 'active' : ''}`}>
                        {lic.status}
                      </span>
                    </div>
                  </div>
              
                  <div className="download-item-meta">
                    <div className="download-meta-row">
                      <span className="download-meta-label">Created:</span>
                      <span className="download-meta-value">
                        {lic.created_date ? new Date(lic.created_date).toLocaleDateString() : '—'}
                      </span>
                    </div>
              
                    <div className="download-meta-row">
                      <span className="download-meta-label">Format:</span>
                      <span className="download-meta-value">{lic.track_file_format || '—'}</span>
                    </div>
              
                    <div className="download-meta-row">
                      <span className="download-meta-label">Description:</span>
                      <span className="download-meta-value">{lic.track_description || '—'}</span>
                    </div>
                  </div>
              
                  <div className="download-actions">
                    {lic.bundle_download_url ? (
                      <a
                        href={lic.bundle_download_url}
                        className="download-button"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Download Bundle (ZIP)
                      </a>
                    ) : null}

                    {lic.track_download_url ? (
                      <a
                        href={lic.track_download_url}
                        className="download-button"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Download Track
                      </a>
                    ) : (
                      <button className="download-button disabled" disabled>
                        Track not available
                      </button>
                    )}

                    {lic.license_download_url ? (
                      <a
                        href={lic.license_download_url}
                        className="download-button secondary"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Download License (PDF)
                      </a>
                    ) : (
                      <button className="download-button secondary disabled" disabled>
                        License not available
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
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
