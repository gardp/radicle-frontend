import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { closeLicenseModal, selectLicenseModalState, selectLicenseModalItem } from '../store/slices/licenseAgreementSlice';
import { toggleLicenseAgreementAndSaveThunk } from '../store/slices/cartSlice';
import { selectItemById } from '../store/slices/cartSlice';
import '../styles/LicenseAgreement.css';
import { useLicenseTypes } from '../hooks/useLicense';

const LicenseAgreement = () => {
  const dispatch = useDispatch();
  const isOpen = useSelector(selectLicenseModalState); //I just need to access the state, not modify it
  const currentItem = useSelector(selectLicenseModalItem); //extract the current item from the modal
  const cartItem = useSelector(state => selectItemById(state, currentItem?.id)); //use the currentItem to extract the item from the cart (maintain synchronization)
  const { data: license_types, isLoading, error } = useLicenseTypes();
  console.log("license types", license_types);

  // Safely find the license type after ensuring license_types is available
  const license_type = license_types && currentItem ? 
    license_types.find(license => license.license_id === currentItem.license_type_id) : 
    null;
//USE CurrentItem to grab the license type id and use in in turn to get the license content
  // State to track if user has checked the agreement box
  const [agreed, setAgreed] = useState(false);
  // State to track if agreement has been submitted
  // const [submitted, setSubmitted] = useState(false);
  
  // Reset agreement state when modal opens with new item
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

    console.log("isChecked", isChecked)
    console.log("item to check", cartItem) //****this currentItem is from the licenseModalItem selector, it's note from the cartSlice!!!!
    dispatch(toggleLicenseAgreementAndSaveThunk({ //*******PUT THIS IN AGREED CHANGE AS I'M NO LONGER USING HANDLESUBMIT PER TRACK
      itemId: cartItem.id,
      acknowledged: isChecked,
    }));

  };
  
  // const handleSubmit = () => {
  //   if (currentItem) {
  //     // Update the license agreement state in Redux

  //     dispatch(toggleLicenseAgreementAndSaveThunk({ //*******PUT THIS IN AGREED CHANGE AS I'M NO LONGER USING HANDLESUBMIT PER TRACK
  //       itemId: currentItem.id,
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
  
  // Generate dynamic license agreement text based on the item
  const getLicenseAgreementText = () => {
    if (isLoading) return "Loading license agreement...";
    if (error) return "Error loading license agreement. Please try again later.";
    if (!license_type) return "License template not found for this item.";

    return `
    ## ${cartItem.name} - ${cartItem.license} 
    ${license_type.license_template}
    `;
  };
  
  return (
    <div className="license-modal-backdrop" onClick={handleBackdropClick}>
      <div className="license-modal-content">
        <button className="close-button" onClick={() => dispatch(closeLicenseModal())}>×</button>
        
        <div className="license-header">
          <h2>License Agreement</h2>
          <p>Please review and acknowledge the license terms for {cartItem.name}</p>
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
              <span className="checkmark"></span>
              <span>I acknowledge that I have read, understood, and agree to the terms of this license agreement</span>
            </label>
          </div>
        </div>
          <div className="license-footer">
          {cartItem.licenseAgreementAcknowledged && agreed ? (
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
          {console.log("cartItem licenseAgreementAcknowledged", cartItem.licenseAgreementAcknowledged)}
        </div>
        
        {/*<div className="license-footer">
          {currentItem.licenseAgreementAcknowledged ? (
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