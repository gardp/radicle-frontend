import React from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import StripePaymentElement from './StripeCardElement';
import PayPalButtonElement from './PaypalButtonElement';

// Load Stripe outside component to avoid recreating on every render
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const PaymentWrapper = ({
  paymentMethod,
  clientSecret,
  orderId,
  onPaymentSuccess,
  onPaymentError,
  isProcessing,
  setIsProcessing,
  onPayPalCreateOrder,
  onPayPalApprove,
  disabled,
}) => {
  // Stripe Elements options
  const stripeOptions = {
    clientSecret,
    appearance: {
      theme: 'stripe',
      variables: {
        colorPrimary: '#0570de',
      },
    },
  };

  // PayPal options
  const paypalOptions = {
    'client-id': import.meta.env.VITE_PAYPAL_CLIENT_ID,
    currency: 'USD',
    intent: 'capture',
  };

  // StripeCardElement.js: When Stripe confirms the payment, it calls onPaymentSuccess(paymentIntent) (Line 33).
  // PaymentWrapper.js: Receives this prop and passes it down to 
  // StripePaymentElement (Lines 44-45). Checkout.js: Defines handleStripePaymentSuccess, 
  // which accepts paymentIntent as an argument.
  if (paymentMethod === 'stripe' && clientSecret) {
    return (
      <Elements stripe={stripePromise} options={stripeOptions}>
        <StripePaymentElement
          onPaymentSuccess={onPaymentSuccess}
          onPaymentError={onPaymentError}
          isProcessing={isProcessing}
          setIsProcessing={setIsProcessing}
        />
      </Elements>
    );
  }

  if (paymentMethod === 'paypal') {
    return (
      <PayPalScriptProvider options={paypalOptions}>
        <PayPalButtonElement
          orderId={orderId}
          onCreateOrder={onPayPalCreateOrder}
          onApprove={onPayPalApprove}
          onError={onPaymentError}
          disabled={disabled}
        />
      </PayPalScriptProvider>
    );
  }

  return null;
};

export default PaymentWrapper;