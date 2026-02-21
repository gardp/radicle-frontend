import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { closeDownloadModal } from '../store/slices/priceLicensing.js';
import { isTrackLicenseInCartItems } from '../store/slices/cartSlice.js';
import useCart from '../hooks/useCart.js';
import { newsletterApi } from '../api.js';
import '../styles/trackDownloadModal.css';

const DONATION_PRESETS = [1, 3, 5, 10, 15, 20];
const EMAIL_STORAGE_KEY = 'radicle_newsletter_email';

const TrackDownloadModal = () => {
  const dispatch = useDispatch();
  const { isDownloadOpen, currentDownloadTrack } = useSelector((state) => state.priceLicensing);
  const { addTrackToCart, items } = useCart();

  // --- Local state ---
  const [donationAmount, setDonationAmount] = useState('0.00');
  const [activePreset, setActivePreset] = useState(null);
  const [email, setEmail] = useState('');
  const [emailInvalid, setEmailInvalid] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null); // { type: 'loading' | 'error', text: string }

  // Load persisted email from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(EMAIL_STORAGE_KEY);
    if (saved) setEmail(saved);
  }, []);

  // Reset local state when modal opens/closes
  useEffect(() => {
    if (isDownloadOpen) {
      setDonationAmount('0.00');
      setActivePreset(null);
      setEmailInvalid(false);
      setStatusMessage(null);
      // Re-read persisted email each time the modal opens
      const saved = localStorage.getItem(EMAIL_STORAGE_KEY);
      if (saved) setEmail(saved);
    }
  }, [isDownloadOpen]);

  // Close on ESC key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && isDownloadOpen) dispatch(closeDownloadModal());
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isDownloadOpen, dispatch]);

  // Prevent body scroll while open
  useEffect(() => {
    if (isDownloadOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => { document.body.style.overflow = 'auto'; };
  }, [isDownloadOpen]);

  // --- Derived: find the "PERSONAL USE" license option for the current track ---
  const personalUseLicenseOption = currentDownloadTrack?.trackLicenseOptions?.find(
    (opt) => opt.licenseType?.licenseTypeName === 'PERSONAL USE'
  ) || null;

  // --- Check if this track + PERSONAL USE license is already in the cart ---
  const isAlreadyInCart = () => {
    if (!personalUseLicenseOption || !currentDownloadTrack) return false; // if no personal use license option or no current download track in the cart, then no need to check- return false
    return isTrackLicenseInCartItems(
      items,
      currentDownloadTrack.trackId,
      personalUseLicenseOption.trackLicenseOptionId,
      currentDownloadTrack.trackDescription
    );
  };

  // --- Handlers ---
  const handleBackdropClick = (e) => {
    if (e.target.classList.contains('download-modal-backdrop')) {
      dispatch(closeDownloadModal());
    }
  };

  const handlePresetClick = (amount) => {
    setActivePreset(amount);
    setDonationAmount(amount.toFixed(2));
  };

  const handleDonationChange = (e) => {
    const raw = e.target.value;
    // Allow digits and one decimal point only
    if (/^\d*\.?\d{0,2}$/.test(raw) || raw === '') {
      setDonationAmount(raw);
      // Clear active preset if user types a custom value
      const num = parseFloat(raw);
      setActivePreset(DONATION_PRESETS.includes(num) ? num : null);
    }
  };

  // On blur, normalise to 2-decimal format (e.g. '' -> '0.00')
  const handleDonationBlur = () => {
    const num = parseFloat(donationAmount);
    setDonationAmount(isNaN(num) ? '0.00' : num.toFixed(2));
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (emailInvalid) setEmailInvalid(false);
  };

  // Simple email format check
  const isValidEmail = (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);

  const handleAddToCart = async () => {
    // Validate email
    if (!email || !isValidEmail(email)) {
      setEmailInvalid(true);
      setStatusMessage({ type: 'error', text: 'Please enter a valid email address.' });
      return;
    }

    // Must have a PERSONAL USE license
    if (!personalUseLicenseOption || !currentDownloadTrack) {
      setStatusMessage({ type: 'error', text: 'No PERSONAL USE license found for this track.' });
      return;
    }

    // Already in cart guard
    if (isAlreadyInCart()) return;

    // --- 1. Subscribe to newsletter (block until success) ---
    setStatusMessage({ type: 'loading', text: 'Subscribing to newsletter...' });
    try {
      await newsletterApi.subscribe({ email, source: 'DOWNLOAD' });
    } catch (err) {
      console.error('Newsletter subscription failed:', err);
      const serverMsg = err?.response?.data?.message || err?.response?.data?.error || 'Newsletter subscription failed. Please try again.';
      setStatusMessage({ type: 'error', text: serverMsg });
      return; // Block — do not add to cart
    }

    // Persist email for future sessions
    localStorage.setItem(EMAIL_STORAGE_KEY, email);

    // --- 2. Build a modified license option with the donation amount as the price ---
    const donationLicenseOption = {
      ...personalUseLicenseOption,
      licenseType: {
        ...personalUseLicenseOption.licenseType,
        price: donationAmount || '0.00', // donation amount replaces the price field
      },
    };

    // --- 3. Add to cart and close modal ---
    addTrackToCart(currentDownloadTrack, donationLicenseOption);
    console.log('Free download added to cart:', currentDownloadTrack.trackTitle, 'donation:', donationAmount);
    dispatch(closeDownloadModal());
  };

  // Don't render anything when modal is closed
  if (!isDownloadOpen) return null;

  return (
    <div className="download-modal-backdrop" onClick={handleBackdropClick}>
      <div className="download-modal-content">
        {/* Close button */}
        <button className="download-modal-close" onClick={() => dispatch(closeDownloadModal())}>×</button>

        {/* Header */}
        <div className="download-modal-header">
          <h2>FREE DOWNLOAD — NON COMMERCIAL USE</h2>
          <p className="download-track-name">
            {currentDownloadTrack ? `"${currentDownloadTrack.trackTitle}"` : 'Track'}
          </p>
        </div>

        {/* Donation Amount */}
        <div className="download-donation-section">
          <label>Support the cause{':)'}✊</label>
          <div className="download-donation-input-wrapper">
            <span className="currency-symbol">$</span>
            <input
              className="download-donation-input"
              type="text"
              inputMode="decimal"
              value={donationAmount}
              onChange={handleDonationChange}
              onBlur={handleDonationBlur}
              placeholder="0.00"
            />
          </div>
          <div className="download-donation-presets">
            {DONATION_PRESETS.map((amt) => (
              <button
                key={amt}
                className={`download-donation-preset-btn ${activePreset === amt ? 'active' : ''}`}
                onClick={() => handlePresetClick(amt)}
              >
                ${amt}
              </button>
            ))}
          </div>
        </div>

        {/* Email */}
        <div className="download-email-section">
          <label>Email address (required for Download)</label>
          <input
            className={`download-email-input ${emailInvalid ? 'invalid' : ''}`}
            type="email"
            value={email}
            onChange={handleEmailChange}
            placeholder="you@example.com"
          />
        </div>

        {/* Status message */}
        {statusMessage && (
          <div className={`download-status-message ${statusMessage.type}`}>
            {statusMessage.text}
          </div>
        )}

        {/* Add to Cart */}
        <div className="download-modal-footer">
          <button
            className={`download-add-to-cart-btn ${isAlreadyInCart() ? 'in-cart' : ''}`}
            disabled={isAlreadyInCart() || statusMessage?.type === 'loading'}
            onClick={handleAddToCart}
          >
            {isAlreadyInCart() ? 'Already In Cart' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TrackDownloadModal;