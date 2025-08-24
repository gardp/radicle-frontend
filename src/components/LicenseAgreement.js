import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { closeLicenseModal, selectLicenseModalState, selectLicenseModalItem } from '../store/slices/licenseAgreementSlice';
import { toggleLicenseAgreementAndSaveThunk } from '../store/slices/cartSlice';
import '../styles/LicenseAgreement.css';

const LicenseAgreement = () => {
  const dispatch = useDispatch();
  const isOpen = useSelector(selectLicenseModalState); //I just need to access the state, not modify it
  const currentItem = useSelector(selectLicenseModalItem);
  
  // State to track if user has checked the agreement box
  const [agreed, setAgreed] = useState(false);
  // State to track if agreement has been submitted
  const [submitted, setSubmitted] = useState(false);
  
  // Reset agreement state when modal opens with new item
  useEffect(() => {
    if (currentItem) {
      setAgreed(currentItem.licenseAgreementAcknowledged || false);
    }
  }, [currentItem]);
  
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
  };
  
  const handleSubmit = () => {
    if (currentItem) {
      // Update the license agreement state in Redux

      dispatch(toggleLicenseAgreementAndSaveThunk({
        itemId: currentItem.id,
        acknowledged: agreed
      }
    ));
      console.log("agreeeed", agreed)
      // Set submitted state to true to show the success message
      setSubmitted(true);
      dispatch(closeLicenseModal());
    }
  };
  
  if (!isOpen || !currentItem) return null;
  
  // Generate dynamic license agreement text based on the item
  const getLicenseAgreementText = () => {
    return `
    ## ${currentItem.name} - ${currentItem.license} LICENSE AGREEMENT
    
    This License Agreement (the "Agreement") is made between Radicle Music ("Licensor") and you ("Licensee").
    
    1. **LICENSE GRANT**: Subject to the terms of this Agreement, Licensor grants to Licensee a ${currentItem.license.toLowerCase()} license to use the musical composition titled "${currentItem.name}" (the "Work").
    
    2. **RESTRICTIONS**: Licensee shall not sublicense, assign, transfer, or otherwise make available the Work to any third party except as specifically permitted under the ${currentItem.license} license terms.
    
    3. **ROYALTIES**: Licensee understands and agrees to adhere to all royalty obligations as outlined in the ${currentItem.license} license terms.
    
    4. **COPYRIGHT**: Licensor retains all copyrights to the Work. Licensee must include appropriate credit in all uses.
    
    5. **TERMINATION**: This license automatically terminates upon any breach by Licensee of the terms of this Agreement.
    
    6. **DISCLAIMER OF WARRANTIES**: The Work is provided "as is" without warranty of any kind.
    
    7. **LIMITATION OF LIABILITY**: In no event shall Licensor be liable for any damages arising out of the use of the Work.
    
    8. **GOVERNING LAW**: This Agreement shall be governed by the laws of the jurisdiction in which Licensor operates.
    `;
  };
  
  return (
    <div className="license-modal-backdrop" onClick={handleBackdropClick}>
      <div className="license-modal-content">
        <button className="close-button" onClick={() => dispatch(closeLicenseModal())}>×</button>
        
        <div className="license-header">
          <h2>License Agreement</h2>
          <p>Please review and acknowledge the license terms for {currentItem.name}</p>
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
          {currentItem.licenseAgreementAcknowledged ? (
            <div className="license-submit-success">
              Agreement Acknowledged & Signed
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
        </div>
      </div>
    </div>
  );
};

export default LicenseAgreement;