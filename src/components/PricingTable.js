import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/PricingTable.css';
import { useDispatch, useSelector } from 'react-redux';
import { closePricingModal } from '../features/priceLicensing/priceLicensing.js';
import useCart from '../hooks/useCart';
import { tracksData, licenseOptions } from './Tracks';

// const PricingTable = ({ isOpen, onClose, track }) => {
const PricingTable = () => {
  const [selectedOption, setSelectedOption] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isOpen, currentTrack: track } = useSelector((state) => state.priceLicensing); //destructuring the state
  const { addTrackToCart, isTrackInCart } = useCart(); //importing the useCart hook and destructuring the addToCartfunction
  
  // Close modal when ESC key is pressed
  useEffect(() => {
    const handleEscapeKey = (e) => {
      if (e.key === 'Escape' && isOpen) {
        dispatch(closePricingModal());
      }
    };
    
    document.addEventListener('keydown', handleEscapeKey);
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isOpen]);
  
  // Prevent scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);
  
  // Handle outside click to close modal
  const handleBackdropClick = (e) => {
    if (e.target.classList.contains('pricing-modal-backdrop')) {
      dispatch(closePricingModal());
    }
  };
  
  const handleOptionSelect = (optionId) => {
    setSelectedOption(optionId);
  };
  
  const handleContactClick = () => {
    dispatch(closePricingModal());
    navigate('/contact');
  };
  
  const handleAddToCart = () => { 
    if (selectedOption && track) {
      const licenseOption = licenseOptions.find(option => option.id === selectedOption); //finds the license option with the selected option id that was passed to selectedOption
      
      if (licenseOption) {
        addTrackToCart(track, licenseOption); //adds the track to cart with the license option that was selected- This is from useCart...passed from cartContext
        console.log("here is the track:", track);
        dispatch(closePricingModal());
        console.log("after close:", track)
      }
    }
  };
  
  // Get the selected license option details
  const getSelectedOption = () => {
    return licenseOptions.find(option => option.id === selectedOption);
  };
  
  // Check if the selected license is already in cart
  const isSelectedLicenseInCart = () => {
    if (!selectedOption || !track) return false;
    return isTrackInCart(track.id, selectedOption);
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="pricing-modal-backdrop" onClick={handleBackdropClick}>
      <div className="pricing-modal-content">
        <button className="close-button" onClick={() => dispatch(closePricingModal())}>×</button>
        
        <div className="pricing-header">
          <h2>License Options for "{track ? track.title : 'Track'}"</h2>
          <p>Select the license that best fits your needs</p>
        </div>
        
        <div className="pricing-options-container">
          {licenseOptions.map(option => (
            <div 
              key={option.id}
              className={`pricing-option ${selectedOption === option.id ? 'selected' : ''} ${option.recommended ? 'recommended' : ''}`} 
              onClick={() => handleOptionSelect(option.id)}
            >
              {option.recommended && <div className="recommended-badge">Recommended</div>}
              <h3>{option.name} License</h3>
              <div className="price">${option.price.toFixed(2)}</div>
              <ul className="features">
                {option.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
              <button 
                className={`select-button ${selectedOption === option.id ? 'selected' : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleOptionSelect(option.id);
                }}
              >
                {selectedOption === option.id ? 'Selected' : 'Select'}
              </button>
            </div>
          ))}
        </div>
        
        <div className="pricing-footer">
          <div className="custom-message">
            <p>Need a custom license or have questions?</p>
            <button className="contact-button" onClick={handleContactClick}>Contact Us</button>
          </div>
          
          <button 
            className={`add-to-cart-button ${!selectedOption ? 'disabled' : ''} ${isSelectedLicenseInCart() ? 'in-cart' : ''}`}
            disabled={!selectedOption || isSelectedLicenseInCart()}
            onClick={handleAddToCart}
          >
            {isSelectedLicenseInCart() 
              ? 'Already In Cart' 
              : `Add to Cart ${selectedOption ? `- $${getSelectedOption()?.price.toFixed(2)}` : ''}`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PricingTable;