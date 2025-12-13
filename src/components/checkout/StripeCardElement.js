import React from 'react';
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';

const StripePaymentElement = ({ onPaymentSuccess, onPaymentError, isProcessing, setIsProcessing }) => {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return; // Stripe.js hasn't loaded yet
    }

    setIsProcessing(true);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/order-confirmation`,
      },
      redirect: 'if_required', // Only redirect if required (e.g., 3D Secure)
    });

    if (error) {
      console.error('Payment failed:', error);
      onPaymentError(error.message);
      setIsProcessing(false);
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      onPaymentSuccess(paymentIntent);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="stripe-payment-form">
      <PaymentElement />
      <button
        type="submit"
        disabled={!stripe || isProcessing}
        className="checkout-button"
        style={{ marginTop: '20px' }}
      >
        {isProcessing ? 'Processing...' : 'Pay Now'}
      </button>
    </form>
  );
};

export default StripePaymentElement;