import React, { useReducer, useEffect, useCallback } from 'react';
import { CartContext, initialCartState } from './CartContext';
import { cartReducer } from './cartReducer';
import { loadCartFromStorage, saveCartToStorage, clearCartFromStorage } from './cartStorage';
import {
  initCart,
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  setCartLoading,
  setCartError
} from './cartActions';

/**
 * CartProvider component that provides cart state and functions to its children
 */
export const CartProvider = ({ children }) => {
  // Initialize reducer with initial state
  const [state, dispatch] = useReducer(cartReducer, initialCartState);
  
  // Load cart from storage on initial mount
  useEffect(() => {
    const savedCart = loadCartFromStorage();
    if (savedCart && Array.isArray(savedCart) && savedCart.length > 0) {
      dispatch(initCart(savedCart));
    }
  }, []);
  
  // Save cart to storage when items change
  useEffect(() => {
    saveCartToStorage(state.items);
  }, [state.items]);
  
  /**
   * Add item to cart with proper normalization
   */
  const handleAddToCart = useCallback((item) => {
    // Create a unique ID for cart items combining track ID and license
    const uniqueId = `${item.id}-${item.license}`;
    
    // Ensure item has all required fields and normalize the structure
    const normalizedItem = {
      id: uniqueId,
      trackId: item.id, // Original track ID
      name: item.name || item.title || '',
      description: item.description || '',
      image: item.image || '',
      price: typeof item.price === 'number' ? item.price : 0,
      license: item.license || 'standard', //POSSIBLE ERROR THERE!!!!!!
      quantity: item.quantity || 1,
      type: item.type || 'track'
    };
    
    dispatch(addToCart(normalizedItem)); 
  }, []);
  
  /**
   * Remove item from cart
   */
  const handleRemoveFromCart = useCallback((itemId) => {
    dispatch(removeFromCart(itemId));
  }, []);
  
  /**
   * Update item quantity
   */
  const handleUpdateQuantity = useCallback((itemId, quantity) => {
    dispatch(updateQuantity(itemId, quantity));
  }, []);
  
  /**
   * Clear entire cart
   */
  const handleClearCart = useCallback(() => {
    clearCartFromStorage();
    dispatch(clearCart());
  }, []);
  
  /**
   * Check if an item with specific trackId and license is in cart
   */
  const isInCart = useCallback((trackId, license_id) => {
    // const uniqueId = `${trackId}-${license_id}`;
    return state.items.some(item => item.track_id === trackId && item.license_types.license_type_id === license_id);
  }, [state.items]);
  
  /**
   * Get specific item by its ID
   */
  const getItemById = useCallback((itemId) => {
    return state.items.find(item => item.id === itemId) || null;
  }, [state.items]);
  
  /**
   * Get all items with a specific trackId
   * This is useful to find all license versions of a track in cart
   */
  const getItemsByTrackId = useCallback((trackId) => {
    return state.items.filter(item => item.trackId === trackId);
  }, [state.items]);
  
  // Create value object with state and methods
  const contextValue = {
    ...state,
    addToCart: handleAddToCart,
    removeFromCart: handleRemoveFromCart,
    updateQuantity: handleUpdateQuantity,
    clearCart: handleClearCart,
    isInCart,
    getItemById,
    getItemsByTrackId
  };
  
  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
};
