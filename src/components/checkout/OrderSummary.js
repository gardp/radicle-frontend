import React from 'react';
import { useDispatch } from 'react-redux';
import { openLicenseModal } from '../../store/slices/licenseAgreementSlice';
import '../../styles/Checkout.css';
import useCart from '../../hooks/useCart';
/**
 * OrderSummary component displays the items in the cart and total calculations
 */
const OrderSummary = () => {
  const dispatch = useDispatch();
  const { items, subtotal, taxRate, taxAmount, totalPrice } = useCart();

  
  // Handle opening the license agreement modal
  const handleOpenLicenseAgreement = (item) => {
    console.log("ITEM PASSED TO LICENSE AGREEMENT MODAL", item)
    dispatch(openLicenseModal(item));
  };

  const shipping = 0; // Placeholder for shipping cost
  
  return (
    <div className="order-summary">
      <h2 className="order-summary-header">Order Summary</h2>
      
      <div className="order-items">
        {items.map((item, index) => (
          <div key={index} className="order-item">
            <div className="order-item-image">
              <img src={item.vinylThumbnail} alt={item.title} />
            </div>
            <div className="order-item-details">
              <div className="order-item-name">{item.title}</div>
              <div className="order-item-license">{item.trackLicenseOption?.licenseType?.licenseTypeName} License</div>
              <div className="order-item-price">
                ${item.trackLicenseOption?.licenseType?.price} × {item.quantity}  = ${item.trackLicenseOption?.licenseType?.price * item.quantity}
              </div>
              <div
                className={`license-agreement-link ${item.licenseAgreementAcknowledged ? 'acknowledged' : 'pending alert-pulse'}`}
                onClick={() => handleOpenLicenseAgreement(item)}
              >
                {item.licenseAgreementAcknowledged 
                  ? 'Agreement Acknowledged' 
                  : '⚠️ REVIEW LICENSE AGREEMENT'}
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
          <span>${taxAmount.toFixed(2)}</span>
        </div>
        <div className="order-total-row">
          <span>Shipping</span>
          <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
        </div>
        <div className="order-total-row final">
          <span>Total</span>
          <span>${totalPrice.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
