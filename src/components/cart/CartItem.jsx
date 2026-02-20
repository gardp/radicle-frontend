import React from 'react';
import useCart from '../../hooks/useCart';
import '../../styles/CartPreview.css';

/**
 * CartItem component that displays a single item in the cart preview
 */
const CartItem = ({ item }) => {
  const {
    // formatPrice, 
    removeFromCart
  } = useCart();

  const licenseTypeName = item?.trackLicenseOption?.licenseType?.name
    || item?.trackLicenseOption?.licenseType?.licenseTypeName;
  const displayDescription = licenseTypeName === 'PERSONAL USE'
    ? item.title
    : item.trackDescription;

  return (
    <div className="cart-item">
      <div className="cart-item-image">
        <img
          src={item.vinylThumbnail}
          alt={item.trackDescription}
          className="cart-thumb"
        />
      </div>

      <div className="cart-item-details">
        <h4 className="cart-item-description">{displayDescription}</h4>
        <p className="cart-item-name">{item.trackLicenseOption.licenseType.licenseTypeName}</p>
        <div className="cart-item-license">
          {item.type === 'track' && (
            <span className="license-badge">{item.trackLicenseOption.licenseType.licenseTypeFormat}</span>
          )}
        </div>
      </div>

      <div className="cart-item-price">
        ${item.trackLicenseOption.licenseType.price}
      </div>
      <button
        className="remove-item-btn skeuomorphic-btn danger with-glare"
        onClick={() => removeFromCart(item)}
        aria-label="Remove item"
      >
        ×
      </button>

      {/* The code below is for when I'm selling merch */}
      {/* <div className="cart-item-quantity">
        <button 
          className="quantity-btn decrease skeuomorphic-btn with-glare"
          onClick={() => decrementQuantity(item.id)}
          aria-label="Decrease quantity"
        >
          -
        </button>
        
        <span className="quantity-value">{item.quantity}</span>
        
        <button 
          className="quantity-btn increase skeuomorphic-btn with-glare"
          onClick={() => incrementQuantity(item.id)}
          aria-label="Increase quantity"
        >
          +
        </button>
      </div> */}

      {/* <div className="cart-item-total">
        '${item.trackLicenseOption.licenseType.price * item.quantity}'
      </div> */}
      {/* <div className="cart-item-total">
        '${item.trackLicenseOption.licenseType.price}'
      </div> */}

    </div>
  );
};

export default CartItem;
