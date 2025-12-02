import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import useCart from '../../hooks/useCart';
import { selectAllLicenseAgreementsAcknowledged } from '../../store/slices/cartSlice';
import CheckoutForm from './CheckoutForm';
import OrderSummary from './OrderSummary';
import OrderConfirmation from './OrderConfirmation';
import { contactApi } from '../../api';
import { buyerApi } from '../../api';
import { orderApi } from '../../api';
import { addressApi } from '../../api';
import { orderItemApi } from '../../api';
import { contentTypeApi } from '../../api';
import { contributorApi } from '../../api';
import { licenseApi } from '../../api';
import {paymentApi} from '../../api';
import '../../styles/Checkout.css';

/**
 * Checkout component that handles the entire checkout process
 */
const Checkout = () => {
  // State for form data
  const [formData, setFormData] = useState({
    licenseeContact:{
      contactType: 'INDIVIDUAL',
      email: '',
      firstName: '',
      lastName: '',
      sudoName: '',
      companyName: '',
      phoneNumber: '',
    },
    mailingRegistrationAddress:{
      addressType: 'Registration',
      addressLine1: '',
      addressLine2: '',
      city: '',
      stateProvince: '',
      postalCode: '',
      country: '',
    },
    musicProfessional:{
      refCode: '',
      proAffiliation: '',
      ipiNumber: '',
      snsLink1: '',
      snsLink2: '',
    },
    buyerContact:{
      contactType: 'INDIVIDUAL',
      email: '',
      firstName: '',
      lastName: '',
      sudoName: '',
      companyName: '',
      phoneNumber: '',
    },
    paymentProcessing:{
      card:{
        contact:{
          firstNameOnCard: '',
          lastNameOnCard: '',
          email: '',
        },
        BillingSameAddressAsMailing: true,
        billingAddress:{
          addressType: 'BILLING',
          addressLine1: '',
          addressLine2: '',
          city: '',
          stateProvince: '',
          postalCode: '',
          country: '',
        },
        paymentMethod: 'creditCard',
        cardNumber: '',
        expiryDate: '',
        cvv: '',
      },
      paypal: {
        paymentMethod: 'paypal',
        // PayPal specific fields
      },
    },
  });
  
  // State for form validation errors
  const [errors, setErrors] = useState({});
  
  // State for order processing
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [order, setOrder] = useState(null);
  const [payment, setPayment] = useState(null);
  const [orderedItems, setOrderedItems] = useState(null);
  
  // Get cart data from context to format orders and send to APi
  const { items, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  
  // Check if all license agreements are acknowledged
  const allLicenseAgreementsAcknowledged = useSelector(selectAllLicenseAgreementsAcknowledged);
  
  // Use effect that automatically passes all initial form values to formData upon rendering

  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0 && !orderComplete && !isProcessing) {
      navigate('/');
    }
  }, [items, navigate, orderComplete, isProcessing]);

  // useEffect(() => {
  //   if (orderComplete && order) {
  //     navigate('/order-confirmation', {
  //       state: {
  //         order,
  //         payment,           // e.g. the response you got back or the payload you built
  //         email: formData.contact.email,
  //         purchasedItems: items, // or the orderItems you built
  //       },
  //       replace: true, // optional: avoids user going back to checkout with browser back
  //     });
  //   }
  // }, [orderComplete, order, payment, formData?.contact?.email, items, navigate]);
  
  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const inputValue = type === 'checkbox' ? checked : value;
    
    // If trying to update billing address while sameAddressAsShipping is true, ignore the change:
    // Check if the "Same Address as shipping" checkbox is checked
    // Check if the field being changed is part of the billing address
    // Completely ignore the change attempt if both conditions are true
    if (formData.paymentProcessing.card.BillingSameAddressAsMailing && name.startsWith('paymentProcessing.card.billingAddress')) {
      return;
    }
    
    // spread error to extract name and Clear error when field is edited. 
    // Clear any validation error for this field
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }

    if (name.includes('.')) {
      const parts = name.split('.');
      
      // Handle multi-level nesting using a recursive function
      const setNestedValue = (obj, path, value) => {
        const [head, ...rest] = path;
        
        if (rest.length === 0) {
          // We've reached the final property to set
          return { ...obj, [head]: value };
        }
        
        // We need to go deeper in the object with the recursive function setNestedValue
        return {
          ...obj,
          [head]: setNestedValue(obj[head] || {}, rest, value)
        };
      };
      
      setFormData(currentFormData => setNestedValue(currentFormData, parts, inputValue));
    } else {
      setFormData({
        ...formData,
        [name]: inputValue
      });
    }
  };
  
  // make building address the same as shipping or on its own depending on user choice on sameAddressAsShipping checkbox
  useEffect(() => {
    if (formData.paymentProcessing.card.BillingSameAddressAsMailing) {
      setFormData({
        ...formData,
        paymentProcessing: {
          ...formData.paymentProcessing,
          card: {
            ...formData.paymentProcessing.card,
            billingAddress: formData.mailingRegistrationAddress,
          },
        },
      });
    }
    console.log("addressLine1", formData.paymentProcessing.card.billingAddress.addressLine1);
  }, [formData.paymentProcessing.card.BillingSameAddressAsMailing, formData.mailingRegistrationAddress]); 
  
  // Validate form data
  const validateForm = () => {
    const newErrors = {};
    
    // Check if all license agreements are acknowledged
    if (!allLicenseAgreementsAcknowledged) {
      newErrors.licenseAgreement = 'You must acknowledge all license agreements before checkout';
      return false;
    }
    
    // Email validation
    if (!formData.licenseeContact.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.licenseeContact.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    // Name validation
    if (!formData.licenseeContact.firstName || formData.licenseeContact.firstName.length < 2) {
      newErrors.firstName = 'First name is required'; 
    }
    
    if (!formData.licenseeContact.lastName || formData.licenseeContact.lastName.length < 2) {
      newErrors.lastName = 'Last name is required';
    }
    
    // Shipping Address validation
    if (!formData.mailingRegistrationAddress.addressLine1 || formData.mailingRegistrationAddress.addressLine1.length < 4) {
      newErrors.addressLine1 = 'Valid street address is required';
    }
    
    if (!formData.mailingRegistrationAddress.city) {
      newErrors.city = 'City is required';
    }
    
    if (!formData.mailingRegistrationAddress.state) {
      newErrors.state = 'State/Province is required';
    }
    
    if (!formData.mailingRegistrationAddress.zipCode || !/^[0-9]{5}(-[0-9]{4})?$/.test(formData.mailingRegistrationAddress.zipCode)) {
      newErrors.zipCode = 'Valid zip code is required (e.g., 12345 or 12345-6789)';
    }
    
    if (!formData.mailingRegistrationAddress.country) {
      newErrors.country = 'Country is required';
    }

    // Billing Address validation
    if (!formData.paymentProcessing.card.billingAddress.addressLine1 || formData.paymentProcessing.card.billingAddress.addressLine1.length < 5) {
      newErrors.addressLine1 = 'Valid street address is required';
    }
    
    if (!formData.paymentProcessing.card.billingAddress.city) {
      newErrors.city = 'City is required';
    }
    
    if (!formData.paymentProcessing.card.billingAddress.state) {
      newErrors.state = 'State/Province is required';
    }
    
    if (!formData.paymentProcessing.card.billingAddress.zipCode || !/^[0-9]{5}(-[0-9]{4})?$/.test(formData.paymentProcessing.card.billingAddress.zipCode)) {
      newErrors.zipCode = 'Valid zip code is required (e.g., 12345 or 12345-6789)';
    }
    
    if (!formData.paymentProcessing.card.billingAddress.country) {
      newErrors.country = 'Country is required';
    }
    
    // Payment validation- to uncomment
    if (!formData.paymentProcessing.card.paymentMethod) {
      newErrors.paymentMethod = 'Please select a payment method';
    }
    
    if (formData.paymentProcessing.card.paymentMethod === 'creditCard') {
      if (!formData.paymentProcessing.card.cardNumber || !/^[0-9]{16}$/.test(formData.paymentProcessing.card.cardNumber.replace(/\s/g, ''))) {
        newErrors.cardNumber = 'Valid card number is required';
      }
      
      if (!formData.paymentProcessing.card.expiryDate || !/^(0[1-9]|1[0-2])\/([0-9]{2})$/.test(formData.paymentProcessing.card.expiryDate)) {
        newErrors.expiryDate = 'Valid expiry date is required (MM/YY)';
      }
      
      if (!formData.paymentProcessing.card.cvv || !/^[0-9]{3,4}$/.test(formData.paymentProcessing.card.cvv)) {
        newErrors.cvv = 'Valid CVV is required';
      }

      if (!formData.paymentProcessing.card.contact.firstNameOnCard) {
        newErrors.firstNameOnCard = 'First name on card is required';
      } 
      
      if (!formData.paymentProcessing.card.contact.lastNameOnCard) {
        newErrors.lastNameOnCard = 'Last name on card is required';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {

    e.preventDefault();
    console.log("handleSubmit");
    // Validate form
    if (!validateForm()) {
      console.log("form is not valid", errors);
      return;
    }
    
    if (isProcessing) return; // extra safety Add a guard at the very top of handleSubmit to catch extra clicks or fast key submits
    // Start processing
    setIsProcessing(true);
    console.log('Processing order...', isProcessing);
    
    // 1) Create a per-submission idempotency base
    // const checkoutId = (crypto?.randomUUID && crypto.randomUUID()) 
    // || `CHK-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
    const referenceNumber = `${new Date().toISOString().slice(0,10).replace(/-/g,'')}-${String(Math.floor(Math.random()*100000)).padStart(5,'0')}`;
    console.log('Reference Number:', referenceNumber);
    // console.log('Checkout ID:', checkoutId);
    try {
      // Build payload once, reuse for API call and UI state
      const payload = {
        //***REFERENCE NUMBER for the order***//
        referenceNumber: referenceNumber,
        //***CONTRIBUTOR INFO***//
        licenseeContact: {
          contact_type: 'INDIVIDUAL',
          first_name: formData.licenseeContact.firstName,
          last_name: formData.licenseeContact.lastName,
          email: formData.licenseeContact.email,
          sudo_name: formData.licenseeContact.sudoName,
          company_name: formData.licenseeContact.companyName,
          phone_number: formData.licenseeContact.phoneNumber,
        },
        mailingRegistrationAddress: {
          address_line_1: formData.mailingRegistrationAddress.addressLine1,
          address_line_2: formData.mailingRegistrationAddress.addressLine2,
          city: formData.mailingRegistrationAddress.city,
          state_province: formData.mailingRegistrationAddress.state,
          postal_code: formData.mailingRegistrationAddress.zipCode,
          country: formData.mailingRegistrationAddress.country,
        },
        musicProfessional: {
          ref_code: formData.musicProfessional.refCode,
          pro_affiliation: formData.musicProfessional.proAffiliation,
          ipi_number: formData.musicProfessional.ipiNumber,
        },
        socialMediaLinks: {
          url: [formData.musicProfessional.snsLink1, formData.musicProfessional.snsLink2],
        },
          
        //***BUYER INFO***//
        buyerContact: {
          first_name: formData.paymentProcessing.card.contact.firstNameOnCard,
          last_name: formData.paymentProcessing.card.contact.lastNameOnCard,
          email: formData.paymentProcessing.card.contact.email,
          company_name: formData.paymentProcessing.card.contact.companyName,
          phone_number: formData.paymentProcessing.card.contact.phoneNumber,
        },
        billingAddress: {
          address_line_1: formData.paymentProcessing.card.billingAddress.addressLine1,
          address_line_2: formData.paymentProcessing.card.billingAddress.addressLine2,
          city: formData.paymentProcessing.card.billingAddress.city,
          state_province: formData.paymentProcessing.card.billingAddress.state,
          postal_code: formData.paymentProcessing.card.billingAddress.zipCode,
          country: formData.paymentProcessing.card.billingAddress.country,
        },
        //***ITEMS-TRACKS***//
        items: items.filter(item => item.type === 'track').map(item => ({
          track_id: item.id, //from the cartslice
          track_license_option_id: item.trackLicenseOption.trackLicenseOptionId,
          price: item.price,
          quantity: item.quantity,
        })),
        //***PAYMENT***/
        payment: {
          amount: Number.parseFloat(totalPrice),
          processor: formData.paymentProcessing.card.paymentMethod,
          transaction_id: `TXN-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
        },
      };

      // ONE API CALL instead of many
      const result = await orderApi.checkoutOrder(
        payload,
        {
          headers: {
            'Idempotency-Key': payload.referenceNumber,
          },
        }
      );
      console.log('Order created:', result);

      setOrder(result);
      setOrderedItems(result.license_holdings.licenses || []);
      // Prevent null payment in OrderConfirmation: use backend's payment or fallback to our payload
      setPayment(result?.payment || payload.payment);
      // Set completion last so confirmation renders with non-null payment
      setOrderComplete(true);
      clearCart();

  } catch (error) {
    console.error('Error submitting order:', error);
    setErrors({
      ...errors,
      payment: 'Failed to submit order to our system. Please try again.'
    });
  } finally {
    setIsProcessing(false);
  }
  console.log('My Order created:', order);
  console.log('My Order complete:', orderComplete);
};
      // If order is complete, show confirmation
  if (orderComplete && order) {
    return <OrderConfirmation order={order} purchasedItems={orderedItems} payment={payment} email={formData.licenseeContact.email}/>
  };
    //   // Save order items to thunk for caching
    //   dispatch(submitOrderThunk(orderItems));
    //   // Now save the completed order to thunk for caching
    //   const completedOrder = {
    //     reference_number: order.reference_number,
    //     buyer: buyerId,
    //     status: 'completed',
    //     order_items: items.map(item => ({
    //       id: item.id,
    //       name: item.name,
    //       price: item.price,
    //       quantity: item.quantity,
    //       license: item.license
    //     })),
    //     paymentMethod: formData.paymentMethod,
    //     subtotal: items.reduce((sum, item) => sum + (item.price * item.quantity), 0),
    //     tax: items.reduce((sum, item) => sum + (item.price * item.quantity), 0) * 0.08,
    //     shipping: 0,
    //     totalAmount: items.reduce((sum, item) => sum + (item.price * item.quantity), 0) * 1.08
    //   };
      
    //   // Set order data and complete order
     
    //   // Dispatch returns a promise we can await
    //   const resultAction = await dispatch(submitOrderThunk(order));
    //   // Check if the action was fulfilled (successful API call)
    //   if (submitOrderThunk.fulfilled.match(resultAction)) {
    //     setOrder(resultAction.payload);
    //     setOrderComplete(true);
    //     clearCart();
    //   }
    //   else {
    //     // Handle failed API call
    //     console.error('Order submission failed:', resultAction.error);
    //     setErrors({
    //       ...errors,
    //       payment: 'Failed to submit order to our system. Please try again.'
    //     });
    //   }
      
      
    // } catch (error) {
    //   console.error('Payment processing error:', error);
    //   setErrors({
    //     ...errors,
    //     payment: 'There was an error processing your payment. Please try again.'
    //   });
    // } finally {
    //   setIsProcessing(false);
    // }

  
  // ******Test data for quick form filling during development
  
  const testData = {
    licenseeContact:{
      contactType: 'INDIVIDUAL',
      email: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe',
      sudoName: 'Johnyyy Doe',
      companyName: 'Test Company',
      phoneNumber: '123-456-7890',
    },
    mailingRegistrationAddress:{
      addressType: 'mailing',
      addressLine1: '123 Test Street',
      addressLine2: 'Apt 456',
      city: 'Testville',
      state: 'TS',
      zipCode: '12345',
      country: 'United States',
    },
    musicProfessional:{
      refCode: '123456',
      proAffiliation: 'ASCAP',
      ipiNumber: '123456789',
      snsLink1: 'https://www.facebook.com/test',
      snsLink2: 'https://www.instagram.com/test',
    },
    buyerContact:{
      buyerType: 'INDIVIDUAL',
      email: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe',
      sudoName: 'Johnyyy Doe',
      companyName: 'Test Company',
      phoneNumber: '123-456-7890',
    },
    paymentProcessing:{
      card:{
        contact:{
          firstNameOnCard: 'John',
          lastNameOnCard: 'Doe',
          email: 'test@example.com',
        },
        BillingSameAddressAsMailing: true,
        billingAddress:{
          addressType: 'billing',
          addressLine1: '123 Test Street',
          addressLine2: 'Apt 456',
          city: 'Testville',
          state: 'TS',
          zipCode: '12345',
          country: 'United States',
        },
        paymentMethod: 'creditCard',
        cardNumber: '4111 1111 1111 1111',
        expiryDate: '12/25',
        cvv: '123',
      },
      paypal: {
        paymentMethod: 'paypal',
        // PayPal specific fields
      },
    },
  };

  // Function to fill form with test data
  const fillTestData = () => {
    setFormData(testData);
  };
// ******Test data for quick form filling during development
  return (
    <div className="checkout-container">
      <div className="checkout-header">
        <h1>Checkout</h1>
        <p>Complete your purchase by providing your details below</p>
      </div>
      
      {/**********Development only - Test data button */}
      {process.env.NODE_ENV === 'development' && (
        <button 
          type="button" 
          onClick={fillTestData} 
          style={{ marginBottom: '20px', background: '#f0ad4e', color: 'white', padding: '8px 16px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          Fill Test Data
        </button>
      )}
       {/**********Development only - Test data button */}
      
      {!allLicenseAgreementsAcknowledged && (
        <div className="license-agreement-warning">
          <p>⚠️ You must acknowledge all license agreements before completing checkout.</p>
          <p>Please click "Review License Agreement" for each item in your order.</p>
        </div>
      )}
      
      <div className="checkout-layout">
        <CheckoutForm 
          formData={formData}
          onChange={handleInputChange}
          errors={errors}
          onSubmit={handleSubmit}
          isProcessing={isProcessing}
          isSubmitDisabled={!allLicenseAgreementsAcknowledged}
        />
        <OrderSummary 
          items={items}
          totalPrice={totalPrice}
        />
      </div>
    </div>
  );
};

export default Checkout;