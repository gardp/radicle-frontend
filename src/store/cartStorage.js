/**
 * cartStorage.js
 * Utility functions for cart data persistence with localStorage
 */

// Storage key for cart data
const CART_STORAGE_KEY = 'radicle_cart';

/**
 * Load cart data from localStorage
 * @returns {Array} Array of cart items or empty array if no data exists
 */
export const loadCartFromStorage = () => {
  try {
    const cartData = localStorage.getItem(CART_STORAGE_KEY);
    return cartData ? JSON.parse(cartData) : [];
  } catch (error) {
    console.error('Failed to load cart from storage:', error);
    return [];
  }
};

/**
 * Save cart items to localStorage
 * @param {Array} cartItems - Array of cart items to save
 */
export const saveCartToStorage = (cartItems) => {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
  } catch (error) {
    console.error('Failed to save cart to storage:', error);
  }
};

/**
 * Clear all cart data from localStorage
 */
export const clearCartFromStorage = () => {
  try {
    localStorage.removeItem(CART_STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear cart from storage:', error);
  }
};
