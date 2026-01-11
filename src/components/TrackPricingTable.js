import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/PricingTable.css';
import { useDispatch, useSelector } from 'react-redux';
import { closePricingModal, openPricingModal } from '../store/slices/priceLicensing.js';
import useCart from '../hooks/useCart.js';
import { tracksData, licenseOptions } from './Tracks.js';
import { useLicenseTypes } from '../hooks/useLicense.js';
import { loadCartFromStorage } from '../store/cartStorage';
import { isTrackLicenseInCartItems } from '../store/slices/cartSlice.js';

// const PricingTable = ({ isOpen, onClose, track }) => {
const TrackPricingTable = () => {
  const [selectedLicenseOption, setSelectedLicenseOption] = useState(null); //save the entire license option object, not just the id
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isOpen, currentTrack } = useSelector((state) => state.priceLicensing); //destructuring the state srored in priceLicensing
  // console.log("license types", currentTrack.license_types);
  // const track_id = currentTrack.track_id; //getting the track id from the currentTrack
  const { addTrackToCart, isTrackLicenseInCart, items } = useCart(); //importing the useCart hook and destructuring the addToCartfunction
  // const { data: license_types } = useLicenseTypes();
  console.log("pricing table current track", currentTrack);
  console.log("pricing table selected license option", selectedLicenseOption);
  
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
  

// Reset license selection when modal closes- this will reset the selectedLicenseOption to null when the modal is closed 
  useEffect(() => {
    if (!isOpen) {
      setSelectedLicenseOption(null);
    }
  }, [isOpen]);

  // Handle outside click to close modal
  const handleBackdropClick = (e) => {
    if (e.target.classList.contains('pricing-modal-backdrop')) {
      dispatch(closePricingModal());
    }
  };
  
  // Handle option select from the licenses types in the pricing table
  const handleOptionSelect = (trackLicenseOption) => {
    setSelectedLicenseOption(trackLicenseOption); //this will set the selectedLicenseOption to the trackLicenseType_id
  };
  
  // // Get the selected license option details
  // const getSelectedOption = () => {
  //   const trackLicenseType = currentTrack.license_types.find(option => option.license_type_id === selectedLicenseOption);
  //   // return licenseOptions.find(option => option.id === selectedOption);
  //   return trackLicenseType; //this will return the full license type object that was selected
  // };
  
  const handleAddTrackToCart = () => { 
    console.log("selected license option to add", selectedLicenseOption);
    console.log("current track to add", currentTrack);
    if (selectedLicenseOption && currentTrack) { //so assuming that an option is selected and the state of track in priceLicensing is not null
      //await the promise returned by the thunk
      addTrackToCart(currentTrack, selectedLicenseOption); //adds the track to cart with the license option
      // const storedCart = loadCartFromStorage();
      console.log("cart content:", currentTrack);
      console.log("selected license option:", selectedLicenseOption);
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
      return isTrackLicenseInCartItems(items, currentTrack.trackId, selectedLicenseOption.trackLicenseOptionId);
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
          <h2>License Options for "{currentTrack ? currentTrack.trackTitle : 'Track'}"</h2>
          <p>Choose the perfect license for your project</p>
        </div>
        
        <div className="pricing-options-container">
          {currentTrack.trackLicenseOptions.map(trackLicenseOption => (
            console.log("track license option", currentTrack.trackLicenseOptions),
            <div 
              key={trackLicenseOption.trackLicenseOptionId}
              className={`pricing-option ${selectedLicenseOption === trackLicenseOption? 'selected' : ''}`} //${option.recommended ? 'recommended' : ''}` 
              onClick={() => handleOptionSelect(trackLicenseOption)}
            >
              {/* {option.recommended && <div className="recommended-badge">Recommended</div>} */}
              <h3>{trackLicenseOption.licenseType.licenseTypeName}</h3>
              {/* {console.log(typeof("id type", currentTrack.trackId))}; */}
              <div className="price">${trackLicenseOption.licenseType.price}</div>
              <ul className="features">
                <li>{trackLicenseOption?.licenseType?.licenseTypeName}</li>
                <li>{trackLicenseOption?.licenseType?.licenseTerm}</li>
                <li>{trackLicenseOption?.licenseType?.fileFormatName}</li>
                <li>{trackLicenseOption?.licenseType?.downloadLimit} Downloads</li>
                <li>{trackLicenseOption?.licenseType?.streamingLimit} Streams</li>
                <li>No Refunds</li>
              </ul>
              <button 
                className={`select-button ${selectedLicenseOption === trackLicenseOption ? 'selected' : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleOptionSelect(trackLicenseOption);
                }}
              >
                {selectedLicenseOption === trackLicenseOption ? 'Selected' : 'Select'}
              </button>
            </div>
          ))}
        </div>
        
        <div className="pricing-footer">
          <div className="custom-message">
            <p>Need a custom license?</p>
            <button className="contact-button" onClick={handleContactClick}>Request Custom Terms</button>
          </div>
          
          <button 
            className={`add-to-cart-button ${!selectedLicenseOption || isSelectedLicenseInCart() ? 'disabled' : ''} ${isSelectedLicenseInCart() ? 'in-cart' : ''}`}
            disabled={!selectedLicenseOption || isSelectedLicenseInCart()}
            onClick={handleAddTrackToCart}
          >
            {isSelectedLicenseInCart() 
              ? 'Already In Cart' 
              : 'Add to Cart'} {/** this is from the pricingLicensingOption that's passed from the cartLibraryslice...so format it correctly */}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TrackPricingTable;