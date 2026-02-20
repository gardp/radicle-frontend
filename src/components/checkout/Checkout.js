import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import useCart from '../../hooks/useCart';
import { selectAllLicenseAgreementsAcknowledged, selectIsPersonalUseOnly, toggleLicenseAgreementAndSaveThunk } from '../../store/slices/cartSlice';
import { 
  selectReferenceNumber, 
  generateReferenceNumber, 
  clearReferenceNumber 
} from '../../store/slices/orderSlice';
import CheckoutForm from './CheckoutForm';
import OrderSummary from './OrderSummary';
import OrderConfirmation from './OrderConfirmation';
import PaymentWrapper from './PaymentWrapper';
import { contactApi, newsletterApi } from '../../api';
import { orderApi } from '../../api';
import { licenseApi } from '../../api';
import {paymentApi} from '../../api';
import '../../styles/Checkout.css';

/**
 * Checkout component that handles the entire checkout process
 */
const Checkout = () => {
  const dispatch = useDispatch();
  // State for form data
  const [formData, setFormData] = useState({
    licenseeContact:{
      contactType: 'INDIVIDUAL',
      email: '',
      firstName: '',
      lastName: '',
      companyName: '',
      phoneNumber: '',
    },
    emailListSubscription: true,
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
      sudoName: '',
      refCode: '',
      proAffiliation: '',
      ipiNumber: '',
      snsLink1: '',
      snsLink2: '',
    },
    paymentProcessing:{
      card:{
        paymentMethod: 'stripe',
        cardNumber: '',
        expiryDate: '',
        cvv: '',
      },
      paypal: {
        paymentMethod: 'paypal',
        // PayPal specific fields
      },
    // buyerContact:{
    //   contactType: 'INDIVIDUAL',
    //   email: '',
    //   firstName: '',
    //   lastName: '',
    //   sudoName: '',
    //   companyName: '',
    //   phoneNumber: '',
    // },
    //     contact:{
    //       firstNameOnCard: '',
    //       lastNameOnCard: '',
    //       email: '',
    //     },
    //     BillingSameAddressAsMailing: true,
    //     billingAddress:{
    //       addressType: 'BILLING',
    //       addressLine1: '',
    //       addressLine2: '',
    //       city: '',
    //       stateProvince: '',
    //       postalCode: '',
    //       country: '',
    //     },  
    },
  });
  
  // State for form validation errors
  const [errors, setErrors] = useState({});
  
  // State for order processing
  const [isProcessing, setIsProcessing] = useState(false); // for loading spinner
  const [orderComplete, setOrderComplete] = useState(false); // for order confirmation check
  const [order, setOrder] = useState(null); // for saving order to use outside of handleSubmit
  const [paymentIntent, setPaymentIntent] = useState(null); // paymentintent received from stripe or paypal to use for payment processing
  const [paymentProcessed, setPaymentProcessed] = useState(false); // for payment processing check
  const [checkoutPhase, setCheckoutPhase] = useState('info'); // for determining the phase of the checkout process to use for conditional rendering for payment process
  const [clientSecret, setClientSecret] = useState(null); // client secret received from stripe's payment intent to use for payment processing
  const [orderedItems, setOrderedItems] = useState(null); // for saving ordered each other items
  const [licensesReqLoading, setLicensesReqLoading] = useState(false); // for loading spinner
  const [licensesReqError, setLicensesReqError] = useState(null); // for error message
  const [licenseFiles, setLicenseFiles] = useState(null); // for saving licenses to use outside of handleSubmit

  // --- Express checkout state (for carts with only PERSONAL USE items) ---
  // When every cart item has licenseTypeName === "PERSONAL USE", we skip the
  // CheckoutForm UI, auto-fill dummy licensee data (real email from localStorage),
  // auto-acknowledge license agreements, and submit the order automatically.
  const [isExpressCheckout, setIsExpressCheckout] = useState(false);
  const expressSubmittedRef = useRef(false); // guard to prevent double-submission
  const isPersonalUseOnly = useSelector(selectIsPersonalUseOnly);

  // Get reference number from Redux store
  // so that reference number doesn't change at every submission....So that if I go back to the order page by mistake, it doesn't generate another reference number, hence another order
  const referenceNumber = useSelector(selectReferenceNumber);

  // Generate reference number on mount if it doesn't exist
  // so that reference number doesn't change at every submission....So that if I go back to the order page by mistake, it doesn't generate another reference number, hence another order
  useEffect(() => {
    if (!referenceNumber) {
      dispatch(generateReferenceNumber());
    }
  }, [referenceNumber, dispatch]);
  // Get cart data from context to format orders and send to APi
  const { items, subtotal, taxRate, taxAmount, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  
  // Check if all license agreements are acknowledged
  const allLicenseAgreementsAcknowledged = useSelector(selectAllLicenseAgreementsAcknowledged);
  
  // Use effect that automatically passes all initial form values to formData upon rendering

  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0 && !orderComplete && !isProcessing && !isExpressCheckout) {
      navigate('/');
    }
  }, [items, navigate, orderComplete, isProcessing, isExpressCheckout]);

  // --- Express checkout: detect PERSONAL USE only cart and auto-prepare ---
  useEffect(() => {
    if (!isPersonalUseOnly || isExpressCheckout || isProcessing || orderComplete) return;
    console.log('Express checkout: PERSONAL USE only cart detected');

    // 1. Read the newsletter email persisted by TrackDownloadModal
    const savedEmail = localStorage.getItem('radicle_newsletter_email') || '';

    // 2. Auto-fill form with realistic dummy data; only email is real
    setFormData({
      licenseeContact: {
        contactType: 'INDIVIDUAL',
        email: savedEmail,
        firstName: 'Free',
        lastName: 'Download',
        companyName: '',
        phoneNumber: '0000000000',
      },
      emailListSubscription: false, // already subscribed via TrackDownloadModal
      mailingRegistrationAddress: {
        addressType: 'Registration',
        addressLine1: '0000 Free Download',
        addressLine2: '',
        city: 'Internet',
        state: 'NA',
        zipCode: '00000',
        country: 'US',
      },
      musicProfessional: {
        sudoName: '',
        refCode: '',
        proAffiliation: '',
        ipiNumber: '',
        snsLink1: '',
        snsLink2: '',
      },
      paymentProcessing: {
        card: {
          paymentMethod: 'stripe',
          cardNumber: '',
          expiryDate: '',
          cvv: '',
        },
        paypal: {
          paymentMethod: 'paypal',
        },
      },
    });

    // 3. Auto-acknowledge license agreements for every cart item
    items.forEach(item => {
      dispatch(toggleLicenseAgreementAndSaveThunk({ item, acknowledged: true }));
    });

    setIsExpressCheckout(true);
  }, [isPersonalUseOnly]); // eslint-disable-line react-hooks/exhaustive-deps

  // --- Express checkout: auto-submit once formData + acknowledgments are ready ---
  useEffect(() => {
    if (
      isExpressCheckout &&
      allLicenseAgreementsAcknowledged &&
      referenceNumber &&
      !isProcessing &&
      !orderComplete &&
      !expressSubmittedRef.current
    ) {
      expressSubmittedRef.current = true; // prevent re-entry on subsequent renders
      console.log('Express checkout: auto-submitting order');
      // Call handleSubmit with a synthetic event (preventDefault is a no-op)
      handleSubmit({ preventDefault: () => {} });
    }
  }, [isExpressCheckout, allLicenseAgreementsAcknowledged, referenceNumber, isProcessing, orderComplete]); // eslint-disable-line react-hooks/exhaustive-deps

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const inputValue = type === 'checkbox' ? checked : value;
    
    // If trying to update billing address while sameAddressAsShipping is true, ignore the change:
    // Check if the "Same Address as shipping" checkbox is checked
    // Check if the field being changed is part of the billing address
    // Completely ignore the change attempt if both conditions are true
    // if (formData.paymentProcessing.card.BillingSameAddressAsMailing && name.startsWith('paymentProcessing.card.billingAddress')) {
    //   return;
    // }
    
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
  // useEffect(() => {
  //   if (formData.paymentProcessing.card.BillingSameAddressAsMailing) {
  //     setFormData(currentFormData => ({
  //       ...currentFormData,
  //       paymentProcessing: {
  //         ...currentFormData.paymentProcessing,
  //         card: {
  //           ...currentFormData.paymentProcessing.card,
  //           billingAddress: currentFormData.mailingRegistrationAddress,
  //         },
  //       },
  //     }));
  //   }
  //   console.log("addressLine1", formData.paymentProcessing.card.billingAddress.addressLine1);
  // }, [formData.paymentProcessing.card.BillingSameAddressAsMailing, formData.mailingRegistrationAddress]); 
  
  // USE EFFECT TO FETCH LICENSES WHEN PAYMENT IS SUCCESSFUL
  useEffect(() => {
  console.log("USE EFFECT referenceNumber", referenceNumber);
  console.log("USE EFFECT orderstatus", order?.status);

  const fetchLicensesWithRetry = async (retries = 0, maxRetries = 5) => {
      setLicensesReqLoading(true);
    if (retries >= maxRetries) {
      setLicensesReqError(new Error('License not ready after multiple attempts'));
      setLicensesReqLoading(false);
      return;
    }

    if (!orderComplete || !order || !paymentProcessed) return;
    if (!order.reference_number) return;

    try {
      const purchasedLicenses = await orderApi.getLicenseByReferenceNumber(order.reference_number); //you don't get the license until order is complete in the backend
      // this returns the following object to deconstruct for OrderConfirmation:
      // {
      //   "order_reference_number": str(order.reference_number),
      //   "status": order.status,
      //   "licenses": licenses
      // }
      setLicenseFiles(purchasedLicenses);
      setLicensesReqLoading(false);
      setLicensesReqError(null);
      console.log("YESS ALL WORKED OUT", purchasedLicenses);
    } catch (error) {
      
      // If backend says "not ready", retry with exponential backoff
      if (error.response?.status === 403 || error.response?.status === 404 || error.response?.data?.status === 'pending') {
        const delay = Math.min(1000 * Math.pow(2, retries), 10000); // 1s, 2s, 4s, 8s, max 10s
        setTimeout(() => fetchLicensesWithRetry(retries + 1, maxRetries), delay);
      } else {
        setLicensesReqError(error);
        setLicensesReqLoading(false);
      }
    }
  };

  // Start the retry process
  fetchLicensesWithRetry();
}, [paymentProcessed, referenceNumber, orderComplete, order?.reference_number]);
  
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
    setErrors({});
    console.log('Processing order...', isProcessing);
    
    // 1) Create a per-submission idempotency base
    // Using the reference number in state as the idempotency key 
    console.log('Reference Number:', referenceNumber);
    try {
      // Build payload once, reuse for API call and UI state
      const orderPayload = {
        //***REFERENCE NUMBER for the order***//
        referenceNumber: referenceNumber,
        
        //***CONTRIBUTOR INFO***//
        licenseeContact: {
          contact_type: 'INDIVIDUAL',
          first_name: formData.licenseeContact.firstName,
          last_name: formData.licenseeContact.lastName,
          email: formData.licenseeContact.email,
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
          sudo_name: formData.musicProfessional.sudoName,
          ref_code: formData.musicProfessional.refCode,
          pro_affiliation: formData.musicProfessional.proAffiliation,
          ipi_number: formData.musicProfessional.ipiNumber,
        },
        socialMediaLinks: {
          url: [formData.musicProfessional.snsLink1, formData.musicProfessional.snsLink2],
        },
          
        //***BUYER INFO*** as placeholder for payment in case I have to lose something other than stripe//
        buyerContact: {
          contact_type: 'INDIVIDUAL',
          first_name: formData.licenseeContact.firstName,
          last_name: formData.licenseeContact.lastName,
          email: formData.licenseeContact.email,
          company_name: formData.licenseeContact.companyName,
          phone_number: formData.licenseeContact.phoneNumber,
        },
        billingAddress: {
          address_line_1: formData.mailingRegistrationAddress.addressLine1,
          address_line_2: formData.mailingRegistrationAddress.addressLine2,
          city: formData.mailingRegistrationAddress.city,
          state_province: formData.mailingRegistrationAddress.state,
          postal_code: formData.mailingRegistrationAddress.zipCode,
          country: formData.mailingRegistrationAddress.country,
        },
        //***ITEMS-TRACKS***//
        items: items.filter(item => item.type === 'track').map(item => ({
          track_id: item.id, //from the cartslice
          track_license_option_id: item.trackLicenseOption.trackLicenseOptionId,
          price: item.price,
          quantity: item.quantity,
        })),
        //***PAYMENT***// Besides method and currency, everything else is being calculated on the server
        payment: {
          payment_method: formData.paymentProcessing.card.paymentMethod,
          currency: "usd",
        }
      }
      console.log("ALL THE ITEMS", items);
      // Subscribe licensee to newsletter if subscription button is check
      if (formData.emailListSubscription) {
        try {
          const licenseeEmailSubscription = await newsletterApi.subscribe({ email: formData.licenseeContact.email, source: 'CHECKOUT' });
          console.log('Licensee subscribed to newsletter:', licenseeEmailSubscription);
        } catch (error) {
          console.error('Failed to subscribe licensee to newsletter:', error);
          // Don't fail the entire order if newsletter subscription fails
          // Continue with order processing
          // Optionally show a message to the user about the subscription failure
        }
      }

      // ONE API CALL instead of many to send the order to the server
      const orderData = await orderApi.checkoutOrder(
        orderPayload,
        {
          headers: {
            'Idempotency-Key': orderPayload.referenceNumber,
          },
        }
      );
      console.log('Order created:', orderData); //returned from the server endpoint

      // Order and licensed will be used in orderConfirmation
      setOrder(orderData);
      setOrderedItems(orderData.license_holdings.licenses || []);
      // Prevent null payment in OrderConfirmation: use backend's payment or fallback to our payload
      // Set completion last so confirmation renders with non-null payment

      // ***BEGINNING OF PAYMENT INTENT RESPONSE*** //
      const paymentMethod = formData.paymentProcessing.card.paymentMethod;
      console.log('Order status:', orderData?.status, 'Payment method:', paymentMethod);
      
      if (orderData && orderData.status === "PENDING") {
        console.log('Entering payment intent block...');
        try {
        const paymentIntentResponse = await paymentApi.paymentIntent({
        order_id: orderData.order_id,
        currency: "usd",
        provider: paymentMethod==='stripe' ? 'stripe' : 'paypal',
      }, {
        headers: {
          'Idempotency-Key': `PAY-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
        },
        });
        console.log('Payment Intent created:', paymentIntentResponse);
      // ***END OF PAYMENT INTENT RESPONSE***

      // ***NOW EXTRACTING SERVER CLIENT SECRET 
      if (paymentMethod === 'stripe') {
        // For Stripe: store client_secret and move to payment phase
        setClientSecret(paymentIntentResponse.client_secret);
        setCheckoutPhase('payment');
      } else {
        // For PayPal: store order info for PayPal buttons
        setPaymentIntent(paymentIntentResponse);
        setCheckoutPhase('payment');
        console.log('Payment intent created:', paymentIntentResponse);
      }
        // *******If the payment doens't go through
    }   catch (paymentError) {
        console.error('Payment processing failed:', paymentError);
        setErrors({
        paymentSubmission: paymentError.response?.data?.message || 'Failed to process payment. Please try again.'
      });
    } finally {
        setIsProcessing(false);
      }
      }
    } // The try-catch block closing bracketfor the whole order if it doesn't go through
     
    catch (orderError) {
      console.error('Order error:', orderError)
      setErrors({
        orderSubmission: orderError.response?.data?.message || 'Failed to process Order'
      })
    } 
    finally {
        setIsProcessing(false);
      }
      
  }; // CLOSING BRACKET FOR handleSubmit

  //NOW HANDLE SUCCESSFUL STRIPE PAYMENT
    const handleStripePaymentSuccess = (paymentIntent) => {
    console.log('Stripe payment succeeded:', paymentIntent);
    setPaymentIntent(paymentIntent);
    setPaymentProcessed(true);
    setOrderComplete(true);
    setCheckoutPhase('complete');
    clearCart();
    dispatch(clearReferenceNumber()); // Clear reference number after successful payment
    console.log('Reference number cleared:', referenceNumber);
  };

  // NOW HANDLE STRIPE PAYMENT ERROR
    const handlePaymentError = (errorMessage) => {
    setErrors({ paymentSubmission: errorMessage });
    setIsProcessing(false);
  };

  // NEW: PayPal create order callback
    const handlePayPalCreateOrder = async (data, actions) => {
    // Your backend should have already created the PayPal order
    // Return the PayPal order ID from your payment response
    if (paymentIntent?.paypal_order_id) {
      return paymentIntent.paypal_order_id;
    }
      // If no paypal_order_id, something went wrong - don't create client-side
    throw new Error('PayPal order not initialized. Please refresh and try again.');
  };

    // NEW: PayPal approve callback
  const handlePayPalApprove = async (data, actions) => {
    try {
    // DON'T capture on frontend - let backend do it
    // data.orderID is the PayPal order ID that was approved
      const result = await paymentApi.capturePayPalOrder({ 
      paypal_order_id: data.orderID,
    });
    
    console.log('PayPal payment captured via backend:', result);
    
    // Backend returns: { status, order_id, reference_number }
      if (result.status === 'success') {
      setPaymentProcessed(true);
      console.log('Payment processed:', paymentProcessed);
      setOrderComplete(true);
      setCheckoutPhase('complete');
      clearCart();
      dispatch(clearReferenceNumber()); // Clear reference number after successful payment
    } else {
      throw new Error('Capture failed');
    }
    } catch (error) {
    console.error('PayPal capture error:', error);
    handlePaymentError(error.response?.data?.error || 'PayPal payment failed. Please try again.');
    }
};



      // If order is complete, show confirmation ***ADD MORE DATA TO IT INCLUDING DOWNLOAD LINKS***!!!!
  if (orderComplete && order && paymentProcessed) {
    // retrieve the license by reference number (safer) for the user after payment
    const paymentData = {
      amount: order.total_amount,
      provider: formData.paymentProcessing.card.paymentMethod,
    }

    // retrieve the license by reference number (safer) for the order confirmationafter payment
 
    return <OrderConfirmation 
    order={order} 
    purchasedItems={orderedItems} 
    payment={paymentData} 
    licenses={{licenseFiles:licenseFiles?.licenses, licensesReqError:licensesReqError, licensesReqLoading:licensesReqLoading}} 
    email={formData.licenseeContact.email} 
    />;
  };
  
  // ******Test data for quick form filling during development
  
  const testData = {
    licenseeContact:{
      contactType: 'INDIVIDUAL',
      email: 'gardly.philoctete@gmail.com',
      firstName: 'John',
      lastName: 'Doe',
      companyName: 'Test Company',
      phoneNumber: '123-456-7890',
    },
    emailListSubscription: true,
    mailingRegistrationAddress:{
      addressType: 'mailing',
      addressLine1: '123 Test Street',
      addressLine2: 'Apt 456',
      city: 'Testville',
      state: 'TS',
      zipCode: '12345',
      country: 'US',
    },
    musicProfessional:{
      refCode: '123456',
      proAffiliation: 'ASCAP',
      ipiNumber: '123456789',
      snsLink1: 'https://www.facebook.com/test',
      snsLink2: 'https://www.instagram.com/test',
    },

    paymentProcessing:{
      card:{
        paymentMethod: 'stripe',
        cardNumber: '4111 1111 1111 1111',
        expiryDate: '12/25',
        cvv: '123',
      },
      paypal: {
        paymentMethod: 'paypal',
        // PayPal specific fields
      },
    // buyerContact:{
    //   buyerType: 'INDIVIDUAL',
    //   email: 'gardly.philoctete@gmail.com',
    //   firstName: 'John',
    //   lastName: 'Doe',
    //   sudoName: 'Johnyyy Doe',
    //   companyName: 'Test Company',
    //   phoneNumber: '123-456-7890',
    // },
        // contact:{
        //   firstNameOnCard: 'John',
        //   lastNameOnCard: 'Doe',
        //   email: 'gardly.philoctete@gmail.com',
        // },
        // BillingSameAddressAsMailing: true,
        // billingAddress:{
        //   addressType: 'billing',
        //   addressLine1: '123 Test Street',
        //   addressLine2: 'Apt 456',
        //   city: 'Testville',
        //   state: 'TS',
        //   zipCode: '12345',
        //   country: 'US',
        // },
    },
  };

  // Build billingDetails object for Stripe (add this before the return statement in the payment phase)
// const billingDetails = {
//   name: `${formData.paymentProcessing.card.contact.firstNameOnCard} ${formData.paymentProcessing.card.contact.lastNameOnCard}`,
//   email: formData.paymentProcessing.card.contact.email || formData.licenseeContact.email,
//   address: {
//     line1: formData.paymentProcessing.card.billingAddress.addressLine1,
//     line2: formData.paymentProcessing.card.billingAddress.addressLine2 || undefined,
//     city: formData.paymentProcessing.card.billingAddress.city,
//     state: formData.paymentProcessing.card.billingAddress.state,
//     postal_code: formData.paymentProcessing.card.billingAddress.zipCode,
//     country: formData.paymentProcessing.card.billingAddress.country,
//   },
// };

  // Function to fill form with test data
  const fillTestData = () => {
    setFormData(testData);
  };
// ******Test data for quick form filling during development
// Returning for checkout phase only
  return (
    <div className="checkout-container">
      <div className="checkout-header">
        <h1>Checkout</h1>
        <p>
          {checkoutPhase === 'info' 
            ? 'Complete your purchase by providing your details below'
            : 'Complete your payment'}
        </p>
      </div>
      
      {/**********Development only - Test data button */}
      {process.env.NODE_ENV === 'development' && checkoutPhase === 'info' && (
        <button 
          type="button" 
          onClick={fillTestData} 
          style={{ marginBottom: '20px', background: '#f0ad4e', color: 'white', padding: '8px 16px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          Fill Test Data
        </button>
      )}
       {/**********Development only - Test data button */}
      
      {!allLicenseAgreementsAcknowledged && checkoutPhase === 'info' && (
        <div className="license-agreement-warning">
          <p>⚠️ You must acknowledge all license agreements before completing checkout.</p>
        </div>
      )}

            {/* Error display */}
      {(errors.orderSubmission || errors.payment) && (
        <div className="checkout-error-banner" style={{ background: '#fee', padding: '12px', borderRadius: '4px', marginBottom: '20px', color: '#c00' }}>
          {errors.orderSubmission || errors.payment}
        </div>
      )}
      
      <div className="checkout-layout">
        {checkoutPhase === 'info' ? (
          isExpressCheckout ? (
            /* Express checkout: skip form, show loading while order is auto-submitted */
            <div className="express-checkout-processing" style={{ textAlign: 'center', padding: '60px 20px', color: 'white', width: '100%' }}>
              <h2>Processing Free Download...</h2>
              <p>Setting up your order automatically. Please wait...</p>
              {(errors.orderSubmission || errors.paymentSubmission) && (
                <p style={{ color: '#ff6666', marginTop: '16px' }}>{errors.orderSubmission || errors.paymentSubmission}</p>
              )}
            </div>
          ) : (
            <>
              <CheckoutForm 
                formData={formData}
                onChange={handleInputChange}
                errors={errors}
                onSubmit={handleSubmit}
                isProcessing={isProcessing}
                isSubmitDisabled={!allLicenseAgreementsAcknowledged}
              />
              <OrderSummary />
            </>
          )
        ) : (
          <>
            <div className="payment-section">
              <h2>Payment Details</h2>
              <p>Order Reference: {order?.reference_number}</p>
              
              <PaymentWrapper
                paymentMethod={formData.paymentProcessing.card.paymentMethod}
                clientSecret={clientSecret}
                orderId={order?.order_id}
                onPaymentSuccess={handleStripePaymentSuccess}
                onPaymentError={handlePaymentError}
                isProcessing={isProcessing}
                setIsProcessing={setIsProcessing}
                onPayPalCreateOrder={handlePayPalCreateOrder}
                onPayPalApprove={handlePayPalApprove}
                disabled={isProcessing}
              />
              
              <button
                type="button"
                onClick={() => setCheckoutPhase('info')}
                style={{ marginTop: '20px', background: 'transparent', border: '1px solid #ccc', padding: '8px 16px', cursor: 'pointer', color: 'white' }}
              >
                ← Back to Details
              </button>
            </div>
            <OrderSummary />
          </>
        )}
      </div>
    </div>
  );
};

export default Checkout;




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
