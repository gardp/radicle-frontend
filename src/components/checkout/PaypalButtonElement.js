import React from 'react';
import { PayPalButtons } from '@paypal/react-paypal-js';

const PayPalButtonElement = ({
  orderId,
  onCreateOrder,
  onApprove,
  onError,
  disabled,
}) => {
  return (
    <div className="paypal-button-container">
      <PayPalButtons
        style={{ layout: 'vertical', color: 'gold', shape: 'rect', label: 'pay' }}
        disabled={disabled}
        createOrder={onCreateOrder}
        onApprove={onApprove}
        onError={onError}
        onCancel={() => console.log('PayPal payment cancelled')}
      />
    </div>
  );
};

export default PayPalButtonElement;