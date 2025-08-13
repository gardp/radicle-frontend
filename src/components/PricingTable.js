import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/PricingTable.css';
import { useDispatch, useSelector } from 'react-redux';
import { closePricingModal } from './priceLicensing/priceLicensing.js';
import useCart from '../hooks/useCart';
import { tracksData, licenseOptions } from './Tracks';
import { useLicenseTypes } from '../hooks/useLicense';

// const PricingTable = ({ isOpen, onClose, track }) => {
const PricingTable = () => {
  const [selectedLicenseOption, setSelectedLicenseOption] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isOpen, track: currentTrack } = useSelector((state) => state.priceLicensing); //destructuring the state
  const track_id = currentTrack.track_id; //getting the track id from the currentTrack
  const { addTrackToCart, isTrackInCart } = useCart(); //importing the useCart hook and destructuring the addToCartfunction
  const { data: license_types } = useLicenseTypes();
  
  
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


// useEffect(() => {
//   // getting the license types from the currentTrack
//   // const license_type_ids = currentTrack?.license_types; //getting the license types id from the currentTrack
//   console.log("curren track for license type", currentTrack);
//   console.log("license_types", license_types);
//   // checking all license types to match the currentTrack license types
//   const trackLicenseTypes = license_types?.filter(licenseType => currentTrack.license_types.includes(licenseType.id));
// }, [isOpen]);


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
  
  // Handle option select from the licenses types in the pricing table
  const handleOptionSelect = (trackLicenseType_id) => {
    setSelectedLicenseOption(trackLicenseType_id); //this will set the selectedLicenseOption to the trackLicenseType_id
  };
  
  // Get the selected license option details
  const getSelectedOption = () => {
    trackLicenseType = license_types.find(option => option.license_type_id === selectedLicenseOption);
    // return licenseOptions.find(option => option.id === selectedOption);
    return trackLicenseType; //this will return the full license type object that was selected
  };
  
  const handleAddToCart = () => { 
    if (selectedLicenseOption && currentTrack) { //so assuming that an option is selected and the state of track in priceLicensing is not null
      addTrackToCart(currentTrack, selectedLicenseOption); //adds the track to cart with the license option id that was selected- This is from useCart...passed from cartContext
      console.log("here is the track:", currentTrack);
      dispatch(closePricingModal());
      console.log("currentTrack after close:", currentTrack)
    }
  };

    // Check if the selected license is already in cart
    const isSelectedLicenseInCart = () => {
      if (!selectedLicenseOption || !currentTrack) return false;
      return isTrackInCart(currentTrack.track_id, selectedLicenseOption);
    };
    
  const handleContactClick = () => {
    dispatch(closePricingModal());
    navigate('/contact');
  };

  if (!isOpen) return null;
  
  return (
    <div className="pricing-modal-backdrop" onClick={handleBackdropClick}>
      <div className="pricing-modal-content">
        <button className="close-button" onClick={() => dispatch(closePricingModal())}>×</button>
        
        <div className="pricing-header">
          <h2>License Options for "{currentTrack ? currentTrack.title : 'Track'}"</h2>
          <p>Select the license that best fits your needs</p>
        </div>
        
        <div className="pricing-options-container">
          {currentTrack.license_types.map(option => (
            <div 
              key={option.license_type_id}
              className={`pricing-option ${selectedLicenseOption === option.license_type_id ? 'selected' : ''}`} //${option.recommended ? 'recommended' : ''}` 
              onClick={() => handleOptionSelect(option.license_type_id)}
            >
              {/* {option.recommended && <div className="recommended-badge">Recommended</div>} */}
              <h3>{option.license_type_name} License</h3>
              <div className="price">${option.license_fee.toFixed(2)}</div>
              <ul className="features">
                <li>{option.license_type_name}</li>
                <li>{option.license_term}</li>
                <li>{option.file_format}</li>
                <li>{option.download_limit}</li>
                <li>{option.streaming_limit}</li>
                <li>No Refunds</li>
                  {/* <li key={index}>{option.license_type_name}</li>
                  <li key={index}>{option.license_term}</li>
                  <li key={index}>{option.file_format}</li>
                  <li key={index}>{option.download_limit}</li>
                  <li key={index}>{option.streaming_limit}</li>
                  <li key={index}>No Refunds</li> */}
              </ul>
              <button 
                className={`select-button ${selectedLicenseOption === option.license_type_id ? 'selected' : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleOptionSelect(option.license_type_id);
                }}
              >
                {selectedLicenseOption === option.license_type_id ? 'Selected' : 'Select'}
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
            className={`add-to-cart-button ${!selectedLicenseOption ? 'disabled' : ''} ${isSelectedLicenseInCart() ? 'in-cart' : ''}`}
            disabled={!selectedLicenseOption || isSelectedLicenseInCart()}
            onClick={handleAddToCart}
          >
            {isSelectedLicenseInCart() 
              ? 'Already In Cart' 
              : `Add to Cart ${selectedLicenseOption ? `- $${getSelectedOption()?.price.toFixed(2)}` : ''}`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PricingTable;