import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useCart from '../../hooks/useCart';
import CheckoutForm from './CheckoutForm';
import OrderSummary from './OrderSummary';
import OrderConfirmation from './OrderConfirmation';
import '../../styles/Checkout.css';

/**
 * Checkout component that handles the entire checkout process
 */
const Checkout = () => {
  // State for form data
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    paymentMethod: 'creditCard',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    nameOnCard: ''
  });
  
  // State for form validation errors
  const [errors, setErrors] = useState({});
  
  // State for order processing
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [order, setOrder] = useState(null);
  
  // Get cart data from context
  const { items, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  
  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0 && !orderComplete) {
      navigate('/');
    }
  }, [items, navigate, orderComplete]);
  
  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
    
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  // Validate form data
  const validateForm = () => {
    const newErrors = {};
    
    // Email validation
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    // Name validation
    if (!formData.firstName || formData.firstName.length < 2) {
      newErrors.firstName = 'First name is required';
    }
    
    if (!formData.lastName || formData.lastName.length < 2) {
      newErrors.lastName = 'Last name is required';
    }
    
    // Address validation
    if (!formData.address || formData.address.length < 5) {
      newErrors.address = 'Valid street address is required';
    }
    
    if (!formData.city) {
      newErrors.city = 'City is required';
    }
    
    if (!formData.state) {
      newErrors.state = 'State/Province is required';
    }
    
    if (!formData.zipCode || !/^[0-9]{5}(-[0-9]{4})?$/.test(formData.zipCode)) {
      newErrors.zipCode = 'Valid zip code is required (e.g., 12345 or 12345-6789)';
    }
    
    if (!formData.country) {
      newErrors.country = 'Country is required';
    }
    
    // Payment validation
    if (!formData.paymentMethod) {
      newErrors.paymentMethod = 'Please select a payment method';
    }
    
    if (formData.paymentMethod === 'creditCard') {
      if (!formData.cardNumber || !/^[0-9]{16}$/.test(formData.cardNumber.replace(/\s/g, ''))) {
        newErrors.cardNumber = 'Valid card number is required';
      }
      
      if (!formData.expiryDate || !/^(0[1-9]|1[0-2])\/([0-9]{2})$/.test(formData.expiryDate)) {
        newErrors.expiryDate = 'Valid expiry date is required (MM/YY)';
      }
      
      if (!formData.cvv || !/^[0-9]{3,4}$/.test(formData.cvv)) {
        newErrors.cvv = 'Valid CVV is required';
      }
      
      if (!formData.nameOnCard) {
        newErrors.nameOnCard = 'Name on card is required';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) {
      return;
    }
    
    // Start processing
    setIsProcessing(true);
    
    try {
      // Simulate API call for payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate order data
      const newOrder = {
        orderNumber: `ORD-${Date.now().toString().substr(-6)}`,
        date: new Date(),
        items: items.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          license: item.license
        })),
        customerInfo: {
          email: formData.email,
          name: `${formData.firstName} ${formData.lastName}`,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: formData.country
        },
        paymentMethod: formData.paymentMethod,
        subtotal: items.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        tax: items.reduce((sum, item) => sum + (item.price * item.quantity), 0) * 0.08,
        shipping: 0,
        totalAmount: items.reduce((sum, item) => sum + (item.price * item.quantity), 0) * 1.08
      };
      
      // Set order data and complete order
      setOrder(newOrder);
      setOrderComplete(true);
      
      // Clear cart
      clearCart();
      
    } catch (error) {
      console.error('Payment processing error:', error);
      setErrors({
        ...errors,
        payment: 'There was an error processing your payment. Please try again.'
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  // If order is complete, show confirmation
  if (orderComplete && order) {
    return <OrderConfirmation order={order} purchasedItems={order.items} />;
  }
  
  return (
    <div className="checkout-container">
      <div className="checkout-header">
        <h1>Checkout</h1>
        <p>Complete your purchase by providing your details below</p>
      </div>
      
      <div className="checkout-layout">
        <CheckoutForm 
          formData={formData}
          onChange={handleInputChange}
          errors={errors}
          onSubmit={handleSubmit}
          isProcessing={isProcessing}
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
