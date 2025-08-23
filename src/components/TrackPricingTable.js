import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/PricingTable.css';
import { useDispatch, useSelector } from 'react-redux';
import { closePricingModal, openPricingModal } from '../store/slices/priceLicensing.js';
import useCart from '../hooks/useCart.js';
import { tracksData, licenseOptions } from './Tracks.js';
import { useLicenseTypes } from '../hooks/useLicense.js';
import { loadCartFromStorage } from '../store/cartStorage';

// const PricingTable = ({ isOpen, onClose, track }) => {
const TrackPricingTable = () => {
  const [selectedLicenseOption, setSelectedLicenseOption] = useState(null); //save the entire license option object, not just the id
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isOpen, currentTrack } = useSelector((state) => state.priceLicensing); //destructuring the state
  // console.log("license types", currentTrack.license_types);
  // const track_id = currentTrack.track_id; //getting the track id from the currentTrack
  const { addTrackToCart, isTrackLicenseInCart, items } = useCart(); //importing the useCart hook and destructuring the addToCartfunction
  const { data: license_types } = useLicenseTypes();
  console.log("pricing table current track", currentTrack);

  
  // // printing the cart state
  // const { items = [] } = useSelector((state) => state.cart.items || []);
  // console.log("Cart items:", items || "No items in cart");
  
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
  const handleOptionSelect = (trackLicenseType) => {
    setSelectedLicenseOption(trackLicenseType); //this will set the selectedLicenseOption to the trackLicenseType_id
  };
  
  // Get the selected license option details
  const getSelectedOption = () => {
    const trackLicenseType = license_types.find(option => option.license_type_id === selectedLicenseOption);
    // return licenseOptions.find(option => option.id === selectedOption);
    return trackLicenseType; //this will return the full license type object that was selected
  };
  
  const handleAddTrackToCart = () => { 
    if (selectedLicenseOption && currentTrack) { //so assuming that an option is selected and the state of track in priceLicensing is not null
      //await the promise returned by the thunk
      addTrackToCart(currentTrack, selectedLicenseOption); //adds the track to cart with the license option id that was selected- This is from useCart...passed from cartContext
      const storedCart = loadCartFromStorage();
      console.log("cart content:", storedCart);
      // console.log("Verification: Cart from storage:", storedCart);
      dispatch(closePricingModal());
    }
  };

  // const handleAddTrackToCart = async () => { // 1. Make the function async
  //   if (selectedLicenseOption && currentTrack) {
  //     try {
  //       // 2. Await the promise returned by the thunk
  //       await addTrackToCart(currentTrack, selectedLicenseOption); 
  //       const storedCart = loadCartFromStorage();
  //       console.log("cart content:", storedCart.items);
  //       // console.log("Track added successfully:", currentTrack);
  //       // 3. This now runs only after the await is complete
  //       // dispatch(closePricingModal()); 
  //     } catch (error) {
  //       console.error("Failed to add track to cart:", error);
  //       // Optionally, show an error message to the user here
  //     }
  //     dispatch(closePricingModal()); 
  //   }
  // };

    // Check if the selected license is already in cart. And remember the cart is using the cartSlice format and is already stored in thunk cartStorage
    // So the isTrackLicenseInCart will check the "track_id" against the "id" in the cart.items array
    const isSelectedLicenseInCart = () => {
      if (!selectedLicenseOption || !currentTrack) return false;
      return isTrackLicenseInCart(currentTrack.track_id, selectedLicenseOption.license_type_id);
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
          {currentTrack.license_types.map(licenseOption => (
            <div 
              key={licenseOption.license_type_id}
              className={`pricing-option ${selectedLicenseOption === licenseOption? 'selected' : ''}`} //${option.recommended ? 'recommended' : ''}` 
              onClick={() => handleOptionSelect(licenseOption)}
            >
              {/* {option.recommended && <div className="recommended-badge">Recommended</div>} */}
              <h3>{licenseOption.license_type_name} License</h3>
              {console.log(typeof("license type fee", licenseOption.license_fee))};
              {console.log(typeof("id type", currentTrack.track_id))};
              <div className="price">${licenseOption.license_fee}</div>
              <ul className="features">
                <li>{licenseOption.license_type_name}</li>
                <li>{licenseOption.license_term}</li>
                <li>{licenseOption.file_format}</li>
                <li>{licenseOption.download_limit}</li>
                <li>{licenseOption.streaming_limit}</li>
                <li>No Refunds</li>
                  {/* <li key={index}>{option.license_type_name}</li>
                  <li key={index}>{option.license_term}</li>
                  <li key={index}>{option.file_format}</li>
                  <li key={index}>{option.download_limit}</li>
                  <li key={index}>{option.streaming_limit}</li>
                  <li key={index}>No Refunds</li> */}
              </ul>
              <button 
                className={`select-button ${selectedLicenseOption === licenseOption.license_type_id ? 'selected' : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleOptionSelect(licenseOption.license_type_id);
                }}
              >
                {selectedLicenseOption === licenseOption.license_type_id ? 'Selected' : 'Select'}
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
            onClick={handleAddTrackToCart}
          >
            {isSelectedLicenseInCart() 
              ? 'Already In Cart' 
              : `Add to Cart ${selectedLicenseOption && currentTrack.license_types.some(license => license === selectedLicenseOption) ? `- $${selectedLicenseOption.license_fee} selected` : ''}`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TrackPricingTable;