/**
 * Cart action type constants
 * These constants represent all possible actions that can modify the cart state
 */

// Initialize cart with data (often from localStorage)
export const INIT_CART = 'INIT_CART';

// Add a new item to the cart
export const ADD_TO_CART = 'ADD_TO_CART';

// Remove an item from the cart
export const REMOVE_FROM_CART = 'REMOVE_FROM_CART';

// Update the quantity of an existing item
export const UPDATE_QUANTITY = 'UPDATE_QUANTITY';

// Clear all items from the cart
export const CLEAR_CART = 'CLEAR_CART';

// Set loading state (for async operations)
export const SET_CART_LOADING = 'SET_CART_LOADING';

// Set error state
export const SET_CART_ERROR = 'SET_CART_ERROR';
