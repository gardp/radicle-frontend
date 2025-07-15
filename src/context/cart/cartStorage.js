/**
 * Storage key for cart data in localStorage
 */
const CART_STORAGE_KEY = 'radicle_cart';

/**
 * Load cart items from localStorage
 * @returns {Array|null} Cart items array or null if not found/error
 */
export const loadCartFromStorage = () => {
  try {
    const serializedCart = localStorage.getItem(CART_STORAGE_KEY);
    if (serializedCart === null) {
      return null;
    }
    return JSON.parse(serializedCart);
  } catch (error) {
    console.error('Failed to load cart from localStorage:', error);
    return null;
  }
};

/**
 * Save cart items to localStorage
 * @param {Array} cartItems - Cart items to save
 */
export const saveCartToStorage = (cartItems) => {
  try {
    const serializedCart = JSON.stringify(cartItems);
    localStorage.setItem(CART_STORAGE_KEY, serializedCart);
  } catch (error) {
    console.error('Failed to save cart to localStorage:', error);
  }
};

/**
 * Clear cart data from localStorage
 */
export const clearCartFromStorage = () => {
  try {
    localStorage.removeItem(CART_STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear cart from localStorage:', error);
  }
};
