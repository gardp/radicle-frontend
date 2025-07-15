import { createContext, useContext } from 'react';

/**
 * Initial state for the cart
 * This defines the structure and default values for the cart state
 */
export const initialCartState = {
  items: [],        // Array of cart items with detailed product info
  totalItems: 0,    // Total quantity across all items
  totalPrice: 0,    // Total price across all items
  isLoading: false, // Loading state for async operations
  error: null       // Error state
};

/**
 * Create the cart context with initial state and empty function placeholders
 * The provider will inject the actual implementations of these functions
 */
export const CartContext = createContext({
  ...initialCartState, // Destructure the initial state
  // Function placeholders that will be implemented in the provider
  addToCart: () => {}, //passed to useCart and placeholder for the cartTypes
  removeFromCart: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  isInCart: () => false,
  getItemById: () => null,
  getItemsByTrackId: () => [],
});

/**
 * Custom hook to use the cart context
 * This simplifies accessing the cart context in components
 */
export const useCartContext = () => useContext(CartContext);
