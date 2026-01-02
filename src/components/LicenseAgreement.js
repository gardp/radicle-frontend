import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { closeLicenseModal, selectLicenseModalState, selectLicenseModalItem } from '../store/slices/licenseAgreementSlice';
import { toggleLicenseAgreementAndSaveThunk } from '../store/slices/cartSlice';
import { selectTrackAndLicense } from '../store/slices/cartSlice';
import { selectItemById,  } from '../store/slices/cartSlice';
import '../styles/LicenseAgreement.css';
import { useLicenseTypes } from '../hooks/useLicense';
import { useMemo } from 'react';

const LicenseAgreement = () => {
  const dispatch = useDispatch();
  const isOpen = useSelector(selectLicenseModalState); //I just need to access the state, not modify it
  const currentItem = useSelector(selectLicenseModalItem); //extract the current item from the modal after going through checkout (as it was passed to the licenseAgreementSlice modal, it's no longer the same as cartItem in cartSlice
  //...so I have to double check if the currentItem is in the cartItem and check the licenseagreementAcknowledged in the cartItems)
  console.log("currentItem", currentItem)
  const cartItem = useSelector(state => selectTrackAndLicense(state, currentItem)); //use the currentItem to extract the item from the cart (maintain synchronization)
  console.log("cartItem in license agreement", cartItem)
  const { isLoading, error } = useSelector(state => state.cart);
  // const { data: license_types, isLoading, error } = useLicenseTypes();
  // console.log("license types", license_types);

  // Safely find the license type after ensuring license_types is available
  // const licenseType = currentItem?.trackLicenseOption?.licenseType ?
  //   currentItem.trackLicenseOption.licenseType : null;
//USE CurrentItem to grab the license type id and use in in turn to get the license content
  // State to track if user has checked the agreement box
  const [agreed, setAgreed] = useState(false);
  // State to track if agreement has been submitted
  // const [submitted, setSubmitted] = useState(false);
  
  // Reset agreement state when modal opens with new item....very important and slick approach
  useEffect(() => {
    if (cartItem) {
      setAgreed(cartItem.licenseAgreementAcknowledged || false);
    }
  }, [cartItem]);
  
  // Close modal on ESC key
  useEffect(() => {
    const handleEscapeKey = (e) => {
      if (e.key === 'Escape' && isOpen) {
        dispatch(closeLicenseModal());
      }
    };
    
    document.addEventListener('keydown', handleEscapeKey);
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isOpen, dispatch]);
  
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
  
  // Handle backdrop click to close modal
  const handleBackdropClick = (e) => {
    if (e.target.classList.contains('license-modal-backdrop')) {
      dispatch(closeLicenseModal());
    }
  };
  
  const handleAgreeChange = (e) => {
    const isChecked = e.target.checked;
    setAgreed(isChecked);
//****this currentItem is from the licenseModalItem selector, it's note from the cartSlice!!!!
    dispatch(toggleLicenseAgreementAndSaveThunk({ //*******PUT THIS IN AGREED CHANGE AS I'M NO LONGER USING HANDLESUBMIT PER TRACK
      item: cartItem,
      acknowledged: isChecked
    }));
    console.log("agreed", isChecked)
    console.log("cartItem", cartItem)
    console.log("licenseAgreementAcknowledged-", cartItem?.licenseAgreementAcknowledged || true)
  };
  
  // const handleSubmit = () => {
  //   if (currentItem) {
  //     // Update the license agreement state in Redux

  //     dispatch(toggleLicenseAgreementAndSaveThunk({ //*******PUT THIS IN AGREED CHANGE AS I'M NO LONGER USING HANDLESUBMIT PER TRACK
  //       itemId: currentItem.trackId,
  //       acknowledged: agreed
  //     }
  //   ));
  //     console.log("agreeeed", agreed)
  //     // Set submitted state to true to show the success message
  //     setSubmitted(true);
  //     dispatch(closeLicenseModal());
  //   }
  // };
  
  if (!isOpen || !currentItem) return null;
  
  // Getting the license agreement from the cart item
  const getLicenseAgreementText = () => {
    if (isLoading) return "Loading license agreement with track...";
    if (error) return "Error loading license agreement with track. Please try again later.";
    const licenseOption = cartItem?.trackLicenseOption?.licenseType;
    if (!cartItem || !licenseOption) return "License template not found for this item.";

    return `
    ## ${cartItem.title} - ${cartItem.trackLicenseOption.licenseType.licenseTypeName} 
    ${cartItem.trackLicenseOption.licenseType.licenseTemplate}
    `;
  };
  
  return (
    <div className="license-modal-backdrop" onClick={handleBackdropClick}>
      <div className="license-modal-content">
        <button className="close-button" onClick={() => dispatch(closeLicenseModal())}>×</button>
        
        <div className="license-header">
          <h2>License Agreement</h2>
          <p>Please review and acknowledge the license terms for {cartItem?.title}</p>
        </div>
        
        <div className="license-agreement-content">
          <div className="license-text">
            <pre>{getLicenseAgreementText()}</pre>
          </div>
          
          <div className="license-acknowledgment">
            <label className="checkbox-container">
              <input 
                type="checkbox" 
                checked={agreed} 
                onChange={handleAgreeChange}
              />
              <span>I acknowledge that I have read, understood, and agree to the terms of this license agreement</span>
            </label>
          </div>
        </div>
          <div className="license-footer">
          {cartItem?.licenseAgreementAcknowledged && agreed ? (
            <div className="license-submit-success">
              Agreement Acknowledged & Signed
            </div>
          ) : (
            <div  
              className="license-submit-button" 
            >      
              Review Agreement
            </div>   
          )}
          {console.log("agreed", agreed)}
          {console.log("cartItem licenseAgreementAcknowledged", cartItem?.licenseAgreementAcknowledged)}
        </div>
        
        {/*<div className="license-footer">
          {currentItem?.licenseAgreementAcknowledged ? (
            <div className="license-submit-success">
              Agreement Acknowledged & Signed
            </div>)
            </div>
          ) : (
            <button 
              className="license-submit-button" 
              onClick={handleSubmit}
              disabled={!agreed}
            >
              Submit
            </button>
          )}
        </div> */}
      </div>
    </div>
  );
};

export default LicenseAgreement;