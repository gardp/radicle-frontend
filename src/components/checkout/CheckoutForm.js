import React from 'react';
import '../../styles/Checkout.css';
import stripeIcon from '../../assets/images/icons8-stripe-96.png';
import paypalIcon from '../../assets/images/icons8-paypal-96.png';

/**
 * CheckoutForm component handles collecting customer information and payment details
 */
const CheckoutForm = ({ formData, onChange, errors, onSubmit, isProcessing, isSubmitDisabled }) => {
  // Payment method icons
  const paymentIcons = {
    stripe: stripeIcon,
    paypal: paypalIcon,
  };

  return (
    <div className="checkout-form-container">
      <form onSubmit={onSubmit}>
        {/* Contact Information */}
        <div className="checkout-form-section">
          <h3 className="form-section-title">Licensee Contact Information</h3>

          <div className="form-group">
            <label htmlFor="email">Email Address *</label>
            <input
              type="email"
              id="email"
              name="licenseeContact.email"
              className={`form-control ${errors.email ? 'error' : ''}`}
              value={formData.licenseeContact.email}
              onChange={onChange}
              placeholder="your@email.com"
              required
            />
            {errors.email && <div className="error-message">{errors.email}</div>}
          </div>

          <div className="form-group">
            <label className="email-list-checkbox-container">
              <input
                type="checkbox"
                name="emailListSubscription"
                checked={formData.emailListSubscription}
                onChange={onChange}
              />
              <span className="checkbox-text">Add me to the email list for updates on new track releases, licenses, and features</span>
            </label>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="firstName">First Name *</label>
              <input
                type="text"
                id="firstName"
                name="licenseeContact.firstName"
                className={`form-control ${errors.firstName ? 'error' : ''}`}
                value={formData.licenseeContact.firstName}
                onChange={onChange}
                placeholder="John"
                required
              />
              {errors.firstName && <div className="error-message">{errors.firstName}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="lastName">Last Name *</label>
              <input
                type="text"
                id="lastName"
                name="licenseeContact.lastName"
                className={`form-control ${errors.lastName ? 'error' : ''}`}
                value={formData.licenseeContact.lastName}
                onChange={onChange}
                placeholder="Doe"
                required
              />
              {errors.lastName && <div className="error-message">{errors.lastName}</div>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="sudoName">Stage Name / Artist Alias</label>
              <input
                type="text"
                id="sudoName"
                name="licenseeContact.sudoName"
                className="form-control"
                value={formData.licenseeContact.sudoName}
                onChange={onChange}
                placeholder="Your artist name"
              />
            </div>

            <div className="form-group">
              <label htmlFor="companyName">Company / Label Name</label>
              <input
                type="text"
                id="companyName"
                name="licenseeContact.companyName"
                className="form-control"
                value={formData.licenseeContact.companyName}
                onChange={onChange}
                placeholder="Your company or label"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="phoneNumber">Phone Number</label>
            <input
              type="tel"
              id="phoneNumber"
              name="licenseeContact.phoneNumber"
              className="form-control"
              value={formData.licenseeContact.phoneNumber}
              onChange={onChange}
              placeholder="+1 (555) 123-4567"
            />
          </div>

          {/* Music Professional Details */}
          <div className="form-subsection">
            <h4 className="form-subsection-title">Music Professional Details</h4>
            <p className="form-subsection-description">Optional information for registered music professionals</p>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="proAffiliation">PRO Affiliation</label>
                <input
                  type="text"
                  id="proAffiliation"
                  name="musicProfessional.proAffiliation"
                  className="form-control"
                  value={formData.musicProfessional?.proAffiliation}
                  onChange={onChange}
                  placeholder="e.g., ASCAP, BMI, SESAC"
                />
              </div>

              <div className="form-group">
                <label htmlFor="ipiNumber">IPI/CAE Number</label>
                <input
                  type="text"
                  id="ipiNumber"
                  name="musicProfessional.ipiNumber"
                  className="form-control"
                  value={formData.musicProfessional?.ipiNumber}
                  onChange={onChange}
                  placeholder="Your IPI/CAE number"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="refCode">Reference Code (ex: ISNI)</label>
              <input
                type="text"
                id="refCode"
                name="musicProfessional.refCode"
                className="form-control"
                value={formData.musicProfessional?.refCode}
                onChange={onChange}
                placeholder="Enter reference code if you have one"
              />
            </div>

            <div className="form-group">
              <label htmlFor="snsLink1">Social Media Link 1</label>
              <input
                type="url"
                id="snsLink1"
                name="musicProfessional.snsLink1"
                className="form-control"
                value={formData.musicProfessional?.snsLink1}
                onChange={onChange}
                placeholder="https://instagram.com/yourprofile"
              />
            </div>

            <div className="form-group">
              <label htmlFor="snsLink2">Social Media Link 2</label>
              <input
                type="url"
                id="snsLink2"
                name="musicProfessional.snsLink2"
                className="form-control"
                value={formData.musicProfessional?.snsLink2}
                onChange={onChange}
                placeholder="https://soundcloud.com/yourprofile"
              />
            </div>
          </div>
        </div>
        <br />
        {/* shipping Address */}
        <div className="checkout-form-section">
          <h3 className="form-section-title">Mailing-Registration Address</h3>

          <div className="form-group">
            <label htmlFor="address">Street Address *</label>
            <input
              type="text"
              id="address"
              name="mailingRegistrationAddress.addressLine1"
              className={`form-control ${errors.addressLine1 ? 'error' : ''}`}
              value={formData.mailingRegistrationAddress.addressLine1}
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
              value={formData.mailingRegistrationAddress.addressLine2}
              onChange={onChange}
              placeholder="123 Main St"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="city">City *</label>
              <input
                type="text"
                id="city"
                name="mailingRegistrationAddress.city"
                className={`form-control ${errors.city ? 'error' : ''}`}
                value={formData.mailingRegistrationAddress.city}
                onChange={onChange}
                placeholder="New York"
                required
              />
              {errors.city && <div className="error-message">{errors.city}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="state">State/Province *</label>
              <input
                type="text"
                id="state"
                name="mailingRegistrationAddress.state"
                className={`form-control ${errors.state ? 'error' : ''}`}
                value={formData.mailingRegistrationAddress.state}
                onChange={onChange}
                placeholder="NY"
                required
              />
              {errors.state && <div className="error-message">{errors.state}</div>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="zipCode">Zip/Postal Code *</label>
              <input
                type="text"
                id="zipCode"
                name="mailingRegistrationAddress.zipCode"
                className={`form-control ${errors.zipCode ? 'error' : ''}`}
                value={formData.mailingRegistrationAddress.zipCode}
                onChange={onChange}
                placeholder="10001"
                required
              />
              {errors.zipCode && <div className="error-message">{errors.zipCode}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="country">Country *</label>
              <select
                id="country"
                name="mailingRegistrationAddress.country"
                className={`form-control ${errors.country ? 'error' : ''}`}
                value={formData.mailingRegistrationAddress.country}
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
                <option value="ES">Spain</option>
                <option value="JP">Japan</option>
                <option value="IN">India</option>
                <option value="BR">Brazil</option>
                <option value="MX">Mexico</option>
                <option value="IT">Italy</option>
                <option value="PT">Portugal</option>
                <option value="CH">Switzerland</option>
                <option value="TR">Turkey</option>
                <option value="ZA">South Africa</option>
                <option value="NG">Nigeria</option>
                <option value="EG">Egypt</option>
                <option value="KE">Kenya</option>
                <option value="GH">Ghana</option>
                {/* Add more countries as needed */}
              </select>
              {errors.country && <div className="error-message">{errors.country}</div>}
            </div>
          </div>
        </div>
        <br />

        {/* <div className="form-group">
            <label className="checkbox-container">
              <input
                type="checkbox"
                name="paymentProcessing.card.BillingSameAddressAsMailing"
                checked={formData.paymentProcessing.card.BillingSameAddressAsMailing}
                onChange={onChange}
              />
              <span>Same Address as mailing address</span>
            </label>
          </div> */}


        {/* billing Address */}
        {/* {!formData.paymentProcessing.card.BillingSameAddressAsMailing && (
          <div className="checkout-form-section">
            <h3 className="form-section-title">Billing Address</h3>
            
            <div className="form-group">
              <label htmlFor="address">Street Address *</label>
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
                <label htmlFor="city">City *</label>
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
                <label htmlFor="state">State/Province *</label>
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
                <label htmlFor="zipCode">Zip/Postal Code *</label>
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
                <label htmlFor="country">Country *</label>
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
                  <option value="IN">India</option>
                  <option value="BR">Brazil</option>
                  <option value="MX">Mexico</option>
                  <option value="ZA">South Africa</option>
                  <option value="NG">Nigeria</option>
                  <option value="EG">Egypt</option>
                  <option value="KE">Kenya</option>
                  <option value="GH">Ghana</option>
                    
                  {/* Add more countries as needed */}
        {/* </select>
                {errors.country && <div className="error-message">{errors.country}</div>}
              </div>
            </div>
          </div>
        )} */}

        {/* Payment Information - stripe or Paypal*/}
        <div className="payment-methods">
          <div
            className={`payment-method ${formData.paymentProcessing.card.paymentMethod === 'stripe' ? 'selected' : ''}`}
            onClick={() => onChange({ target: { name: 'paymentProcessing.card.paymentMethod', value: 'stripe' } })}
          >
            <img src={paymentIcons.stripe} alt="stripe" />
            <span>Stripe</span>
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


