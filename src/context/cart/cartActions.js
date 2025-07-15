import {
  INIT_CART,
  ADD_TO_CART,
  REMOVE_FROM_CART,
  UPDATE_QUANTITY,
  CLEAR_CART,
  SET_CART_LOADING,
  SET_CART_ERROR
} from './cartTypes';
//These are action creators that are used in the cart context

/**
 * Initialize cart with items (often from localStorage)
 * @param {Array} items - Cart items array to initialize with
 */
export const initCart = (items) => ({
  type: INIT_CART,
  payload: items
});

/**
 * Add an item to the cart
 * @param {Object} item - Item to add with all necessary details
 */
export const addToCart = (item) => ({
  type: ADD_TO_CART,
  payload: { item }
});

/**
 * Remove an item from the cart
 * @param {string} itemId - ID of the item to remove
 */
export const removeFromCart = (itemId) => ({
  type: REMOVE_FROM_CART,
  payload: { itemId }
});

/**
 * Update quantity of an item in the cart
 * @param {string} itemId - ID of the item to update
 * @param {number} quantity - New quantity value
 */
export const updateQuantity = (itemId, quantity) => ({
  type: UPDATE_QUANTITY,
  payload: { itemId, quantity }
});

/**
 * Clear all items from the cart
 */
export const clearCart = () => ({
  type: CLEAR_CART
});

/**
 * Set loading state for async operations
 * @param {boolean} isLoading - Whether cart is in loading state
 */
export const setCartLoading = (isLoading) => ({
  type: SET_CART_LOADING,
  payload: isLoading
});

/**
 * Set error state
 * @param {string|null} error - Error message or null to clear
 */
export const setCartError = (error) => ({
  type: SET_CART_ERROR,
  payload: error
});
