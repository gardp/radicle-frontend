import React from 'react';
import '../../styles/Checkout.css';

/**
 * CheckoutForm component handles collecting customer information and payment details
 */
const CheckoutForm = ({ formData, onChange, errors, onSubmit, isProcessing, isSubmitDisabled }) => {
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
              name="licenseeContact.email"
              className={`form-control ${errors.email ? 'error' : ''}`}
              value={formData.licenseeContact.email || 'your@email.com'}
              onChange={onChange}
              placeholder="your@email.com"
              required
            />
            { errors.email && <div className="error-message">{errors.email}</div>}
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="firstName">First Name</label>
              <input
                type="text"
                id="firstName"
                name="licenseeContact.firstName"
                className={`form-control ${errors.firstName ? 'error' : ''}`}
                value={formData.licenseeContact.firstName || 'John'}
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
                name="licenseeContact.lastName"
                className={`form-control ${errors.lastName ? 'error' : ''}`}
                value={formData.licenseeContact.lastName || 'Doe'}
                onChange={onChange}
                placeholder="Doe"
                required
              />
              {errors.lastName && <div className="error-message">{errors.lastName}</div>}
            </div>
          </div>
        </div>
        <br />
        {/* shipping Address */}
        <div className="checkout-form-section">
          <h3 className="form-section-title">Mailing-Registration Address</h3>
          
          <div className="form-group">
            <label htmlFor="address">Street Address</label>
            <input
              type="text"
              id="address"
              name="mailingRegistrationAddress.addressLine1"
              className={`form-control ${errors.addressLine1 ? 'error' : ''}`}
              value={formData.mailingRegistrationAddress.addressLine1 || '123 Main St'}
              onChange={onChange}
              placeholder="123 Main St"
              required
            />
            {errors.addressLine1 && <div className="error-message">{errors.addressLine1}</div>}
          </div>
          
          <div className="form-group">
            <label htmlFor="address">Address Line 2</label>
            <input
              type="text"
              id="address_line_2"
              name="mailingRegistrationAddress.addressLine2"
              className={`form-control`}
              value={formData.mailingRegistrationAddress.addressLine2 || '123 Main St'}
              onChange={onChange}
              placeholder="123 Main St"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="city">City</label>
              <input
                type="text"
                id="city"
                name="mailingRegistrationAddress.city"
                className={`form-control ${errors.city ? 'error' : ''}`}
                value={formData.mailingRegistrationAddress.city || 'New York'}
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
                name="mailingRegistrationAddress.state"
                className={`form-control ${errors.state ? 'error' : ''}`}
                value={formData.mailingRegistrationAddress.state || 'NY'}
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
                name="mailingRegistrationAddress.zipCode"
                className={`form-control ${errors.zipCode ? 'error' : ''}`}
                value={formData.mailingRegistrationAddress.zipCode || '10001'}
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
                name="mailingRegistrationAddress.country"
                className={`form-control ${errors.country ? 'error' : ''}`}
                value={formData.mailingRegistrationAddress.country || 'US'}
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
          <br />
          
          <div className="form-group">
            <label className="checkbox-container">
              <input
                type="checkbox"
                name="paymentProcessing.card.BillingSameAddressAsMailing"
                checked={formData.paymentProcessing.card.BillingSameAddressAsMailing}
                onChange={onChange}
              />
              <span>Same Address as mailing address</span>
            </label>
          </div>
          

        {/* billing Address */}
        {!formData.paymentProcessing.card.BillingSameAddressAsMailing && (
          <div className="checkout-form-section">
            <h3 className="form-section-title">Billing Address</h3>
            
            <div className="form-group">
              <label htmlFor="address">Street Address</label>
              <input
                type="text"
                id="address"
                name="paymentProcessing.card.billingAddress.addressLine1"
                className={`form-control ${errors.addressLine1 ? 'error' : ''}`}
                value={formData.paymentProcessing.card.billingAddress.addressLine1}
                onChange={onChange}
                placeholder="123 Main St"
                required
              />
              {errors.addressLine1 && <div className="error-message">{errors.addressLine1}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="address">Address Line 2</label>
              <input
                type="text"
                id="addressLine2"
                name="paymentProcessing.card.billingAddress.addressLine2"
                className={`form-control`}
                value={formData.paymentProcessing.card.billingAddress.addressLine2}
                onChange={onChange}
                placeholder="123 Main St"
              />
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="city">City</label>
                <input
                  type="text"
                  id="city"
                  name="paymentProcessing.card.billingAddress.city"
                  className={`form-control ${errors.city ? 'error' : ''}`}
                  value={formData.paymentProcessing.card.billingAddress.city}
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
                  name="paymentProcessing.card.billingAddress.state"
                  className={`form-control ${errors.state ? 'error' : ''}`}
                  value={formData.paymentProcessing.card.billingAddress.state}
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
                  name="paymentProcessing.card.billingAddress.zipCode"
                  className={`form-control ${errors.zipCode ? 'error' : ''}`}
                  value={formData.paymentProcessing.card.billingAddress.zipCode}
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
                  name="paymentProcessing.card.billingAddress.country"
                  className={`form-control ${errors.country ? 'error' : ''}`}
                  value={formData.paymentProcessing.card.billingAddress.country}
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
        )}
        
        {/* Payment Information */}
        <div className="checkout-form-section">
          <h3 className="form-section-title">Payment Method</h3>
          
          <div className="payment-methods">
            <div 
              className={`payment-method ${formData.paymentProcessing.card.paymentMethod === 'creditCard' ? 'selected' : ''}`}
              onClick={() => onChange({ target: { name: 'paymentProcessing.card.paymentMethod', value: 'creditCard' } })}
            >
              <img src={paymentIcons.creditCard} alt="Credit Card" />
              <span>Credit Card</span>
            </div>
            
            <div 
              className={`payment-method ${formData.paymentProcessing.card.paymentMethod === 'paypal' ? 'selected' : ''}`}
              onClick={() => onChange({ target: { name: 'paymentProcessing.card.paymentMethod', value: 'paypal' } })}
            >
              <img src={paymentIcons.paypal} alt="PayPal" />
              <span>PayPal</span>
            </div>
          </div>
          {errors.paymentMethod && <div className="error-message">{errors.paymentMethod}</div>}
          
          {formData.paymentProcessing.card.paymentMethod === 'creditCard' && (
            <>
              <div className="form-group">
                <label htmlFor="cardNumber">Card Number</label>
                <input
                  type="text"
                  id="cardNumber"
                  name="paymentProcessing.card.cardNumber"
                  className={`form-control ${errors.cardNumber ? 'error' : ''}`}
                  value={formData.paymentProcessing.card.cardNumber || '1234 5678 9012 3456'}
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
                    name="paymentProcessing.card.expiryDate"
                    className={`form-control ${errors.expiryDate ? 'error' : ''}`}
                    value={formData.paymentProcessing.card.expiryDate || '12/25'}
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
                    name="paymentProcessing.card.cvv"
                    className={`form-control ${errors.cvv ? 'error' : ''}`}
                    value={formData.paymentProcessing.card.cvv || '123'}
                    onChange={onChange}
                    placeholder="123"
                    required
                  />
                  {errors.cvv && <div className="error-message">{errors.cvv}</div>}
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="nameOnCard">First Name on Card</label>
                <input
                  type="text"
                  id="nameOnCard"
                  name="paymentProcessing.card.contact.firstNameOnCard"
                  className={`form-control ${errors.firstNameOnCard ? 'error' : ''}`}
                  value={formData.paymentProcessing.card.contact.firstNameOnCard}
                  onChange={onChange}
                  placeholder="John Doe"
                  required
                />
                {errors.firstNameOnCard && <div className="error-message">{errors.firstNameOnCard}</div>}
              </div>

              <div className="form-group">
                <label htmlFor="lastnameOnCard">Last Name on Card</label>
                <input
                  type="text"
                  id="lastnameOnCard"
                  name="paymentProcessing.card.contact.lastNameOnCard"
                  className={`form-control ${errors.lastNameOnCard ? 'error' : ''}`}
                  value={formData.paymentProcessing.card.contact.lastNameOnCard}
                  onChange={onChange}
                  placeholder="Doe"
                  required
                />
                {errors.lastNameOnCard && <div className="error-message">{errors.lastNameOnCard}</div>}
              </div>
            </>
          )}
        </div>
        
        {/* Display license agreement error message if present */}
        {errors.licenseAgreement && (
          <div className="checkout-error-message">
            {errors.licenseAgreement}
          </div>
        )}
        
        <button 
          type="submit" 
          className={`checkout-button ${isSubmitDisabled ? 'disabled' : ''}`}
          disabled={isProcessing || isSubmitDisabled}
        >
          {console.log("isSubmitDisabled", isSubmitDisabled)}
          {isProcessing ? (
            <>
              <span className="spinner"></span>
              Processing...
            </>
          ) : (
            isSubmitDisabled ? 'Acknowledge License Agreements to Continue' : 'Complete Purchase'
          )}
        </button>
      </form>
    </div>
  );
};

export default CheckoutForm;
