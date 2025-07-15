import React from 'react';
import '../../styles/Checkout.css';

/**
 * CheckoutForm component handles collecting customer information and payment details
 */
const CheckoutForm = ({ formData, onChange, errors, onSubmit, isProcessing }) => {
  // Payment method icons
  const paymentIcons = {
    creditCard: `${process.env.PUBLIC_URL}/assets/images/credit-card-icon.png`,
    paypal: `${process.env.PUBLIC_URL}/assets/images/paypal-icon.png`,
  };
  
  return (
    <div className="checkout-form-container">
      <form onSubmit={onSubmit}>
        {/* Contact Information */}
        <div className="checkout-form-section">
          <h3 className="form-section-title">Contact Information</h3>
          
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              className={`form-control ${errors.email ? 'error' : ''}`}
              value={formData.email || ''}
              onChange={onChange}
              placeholder="your@email.com"
              required
            />
            {errors.email && <div className="error-message">{errors.email}</div>}
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="firstName">First Name</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                className={`form-control ${errors.firstName ? 'error' : ''}`}
                value={formData.firstName || ''}
                onChange={onChange}
                placeholder="John"
                required
              />
              {errors.firstName && <div className="error-message">{errors.firstName}</div>}
            </div>
            
            <div className="form-group">
              <label htmlFor="lastName">Last Name</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                className={`form-control ${errors.lastName ? 'error' : ''}`}
                value={formData.lastName || ''}
                onChange={onChange}
                placeholder="Doe"
                required
              />
              {errors.lastName && <div className="error-message">{errors.lastName}</div>}
            </div>
          </div>
        </div>
        
        {/* Billing Address */}
        <div className="checkout-form-section">
          <h3 className="form-section-title">Billing Address</h3>
          
          <div className="form-group">
            <label htmlFor="address">Street Address</label>
            <input
              type="text"
              id="address"
              name="address"
              className={`form-control ${errors.address ? 'error' : ''}`}
              value={formData.address || ''}
              onChange={onChange}
              placeholder="123 Main St"
              required
            />
            {errors.address && <div className="error-message">{errors.address}</div>}
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="city">City</label>
              <input
                type="text"
                id="city"
                name="city"
                className={`form-control ${errors.city ? 'error' : ''}`}
                value={formData.city || ''}
                onChange={onChange}
                placeholder="New York"
                required
              />
              {errors.city && <div className="error-message">{errors.city}</div>}
            </div>
            
            <div className="form-group">
              <label htmlFor="state">State/Province</label>
              <input
                type="text"
                id="state"
                name="state"
                className={`form-control ${errors.state ? 'error' : ''}`}
                value={formData.state || ''}
                onChange={onChange}
                placeholder="NY"
                required
              />
              {errors.state && <div className="error-message">{errors.state}</div>}
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="zipCode">Zip/Postal Code</label>
              <input
                type="text"
                id="zipCode"
                name="zipCode"
                className={`form-control ${errors.zipCode ? 'error' : ''}`}
                value={formData.zipCode || ''}
                onChange={onChange}
                placeholder="10001"
                required
              />
              {errors.zipCode && <div className="error-message">{errors.zipCode}</div>}
            </div>
            
            <div className="form-group">
              <label htmlFor="country">Country</label>
              <select
                id="country"
                name="country"
                className={`form-control ${errors.country ? 'error' : ''}`}
                value={formData.country || ''}
                onChange={onChange}
                required
              >
                <option value="">Select a country</option>
                <option value="US">United States</option>
                <option value="CA">Canada</option>
                <option value="GB">United Kingdom</option>
                <option value="AU">Australia</option>
                <option value="FR">France</option>
                <option value="DE">Germany</option>
                <option value="JP">Japan</option>
                {/* Add more countries as needed */}
              </select>
              {errors.country && <div className="error-message">{errors.country}</div>}
            </div>
          </div>
        </div>
        
        {/* Payment Information */}
        <div className="checkout-form-section">
          <h3 className="form-section-title">Payment Method</h3>
          
          <div className="payment-methods">
            <div 
              className={`payment-method ${formData.paymentMethod === 'creditCard' ? 'selected' : ''}`}
              onClick={() => onChange({ target: { name: 'paymentMethod', value: 'creditCard' } })}
            >
              <img src={paymentIcons.creditCard} alt="Credit Card" />
              <span>Credit Card</span>
            </div>
            
            <div 
              className={`payment-method ${formData.paymentMethod === 'paypal' ? 'selected' : ''}`}
              onClick={() => onChange({ target: { name: 'paymentMethod', value: 'paypal' } })}
            >
              <img src={paymentIcons.paypal} alt="PayPal" />
              <span>PayPal</span>
            </div>
          </div>
          {errors.paymentMethod && <div className="error-message">{errors.paymentMethod}</div>}
          
          {formData.paymentMethod === 'creditCard' && (
            <>
              <div className="form-group">
                <label htmlFor="cardNumber">Card Number</label>
                <input
                  type="text"
                  id="cardNumber"
                  name="cardNumber"
                  className={`form-control ${errors.cardNumber ? 'error' : ''}`}
                  value={formData.cardNumber || ''}
                  onChange={onChange}
                  placeholder="1234 5678 9012 3456"
                  required
                />
                {errors.cardNumber && <div className="error-message">{errors.cardNumber}</div>}
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="expiryDate">Expiry Date</label>
                  <input
                    type="text"
                    id="expiryDate"
                    name="expiryDate"
                    className={`form-control ${errors.expiryDate ? 'error' : ''}`}
                    value={formData.expiryDate || ''}
                    onChange={onChange}
                    placeholder="MM/YY"
                    required
                  />
                  {errors.expiryDate && <div className="error-message">{errors.expiryDate}</div>}
                </div>
                
                <div className="form-group">
                  <label htmlFor="cvv">CVV</label>
                  <input
                    type="text"
                    id="cvv"
                    name="cvv"
                    className={`form-control ${errors.cvv ? 'error' : ''}`}
                    value={formData.cvv || ''}
                    onChange={onChange}
                    placeholder="123"
                    required
                  />
                  {errors.cvv && <div className="error-message">{errors.cvv}</div>}
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="nameOnCard">Name on Card</label>
                <input
                  type="text"
                  id="nameOnCard"
                  name="nameOnCard"
                  className={`form-control ${errors.nameOnCard ? 'error' : ''}`}
                  value={formData.nameOnCard || ''}
                  onChange={onChange}
                  placeholder="John Doe"
                  required
                />
                {errors.nameOnCard && <div className="error-message">{errors.nameOnCard}</div>}
              </div>
            </>
          )}
        </div>
        
        <button 
          type="submit" 
          className="checkout-button"
          disabled={isProcessing}
        >
          {isProcessing ? (
            <>
              <span className="spinner"></span>
              Processing...
            </>
          ) : (
            'Complete Purchase'
          )}
        </button>
      </form>
    </div>
  );
};

export default CheckoutForm;
