import { createSlice } from '@reduxjs/toolkit';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { loadCartFromStorage, saveCartToStorage, clearCartFromStorage } from '../../context/cart/cartStorage';

// Define the shape of a cart item
// 

// Initial state - same as your current context
const initialState = {
  items: [],
  totalItems: 0,
  totalPrice: 0,
  isLoading: false,
  error: null,
};

// Helper function to calculate cart totals - reused from your existing code
const calculateCartTotals = (items) => {
  return items.reduce(
    (totals, item) => {
      return {
        totalItems: totals.totalItems + item.quantity,
        totalPrice: totals.totalPrice + (item.price * item.quantity)
      };
    },
    { totalItems: 0, totalPrice: 0 }
  );
};

// Create the slice
export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // Initialize cart with items (often from localStorage)
    initCart: (state, action) => {
      state.items = action.payload;
      const totals = calculateCartTotals(action.payload);
      state.totalItems = totals.totalItems;
      state.totalPrice = totals.totalPrice;
      state.isLoading = false;
      state.error = null;
    },
    
    // Add an item to the cart
    addToCart: (state, action) => {
      const item = action.payload;
      
      // Check if this exact combination of track and license exists
      const existingItemIndex = state.items.findIndex(
        i => i.id === item.id && i.license === item.license
      );
      
      if (existingItemIndex >= 0) {
        // Item with same ID and license exists, update quantity
        state.items[existingItemIndex].quantity += item.quantity;
      } else {
        // Item with this ID and license doesn't exist, add as new
        state.items.push(item);
      }
      
      // Update totals
      const totals = calculateCartTotals(state.items);
      state.totalItems = totals.totalItems;
      state.totalPrice = totals.totalPrice;
      state.error = null;
    },
    
    // Remove an item from the cart
    removeFromCart: (state, action) => {
      const itemId = action.payload;
      state.items = state.items.filter(item => item.id !== itemId);
      
      // Update totals
      const totals = calculateCartTotals(state.items);
      state.totalItems = totals.totalItems;
      state.totalPrice = totals.totalPrice;
      state.error = null;
    },
    
    // Update quantity of an item in the cart
    updateQuantity: (state, action) => {
      const { itemId, quantity } = action.payload;
      
      // Ensure quantity is valid (minimum 1)
      const safeQuantity = Math.max(1, quantity);
      
      const itemIndex = state.items.findIndex(item => item.id === itemId);
      if (itemIndex >= 0) {
        state.items[itemIndex].quantity = safeQuantity;
      }
      
      // Update totals
      const totals = calculateCartTotals(state.items);
      state.totalItems = totals.totalItems;
      state.totalPrice = totals.totalPrice;
      state.error = null;
    },
    
    // Clear all items from the cart
    clearCart: (state) => {
      state.items = [];
      state.totalItems = 0;
      state.totalPrice = 0;
      state.error = null;
    },
    
    // Set loading state for async operations
    setCartLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    
    // Set error state
    setCartError: (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
    },
  },
});

// Export actions
export const { 
  initCart,
  addToCart, 
  removeFromCart, 
  updateQuantity, 
  clearCart, 
  setCartLoading, 
  setCartError 
} = cartSlice.actions;

// Export selectors
export const selectCartItems = (state) => state.cart.items;
export const selectCartTotalItems = (state) => state.cart.totalItems;
export const selectCartTotalPrice = (state) => state.cart.totalPrice;
export const selectCartIsLoading = (state) => state.cart.isLoading;
export const selectCartError = (state) => state.cart.error;

// Create more advanced selectors
export const selectIsInCart = (state, itemId) => 
  state.cart.items.some(item => item.id === itemId);

export const selectItemById = (state, itemId) => 
  state.cart.items.find(item => item.id === itemId) || null;
  
export const selectItemsByTrackId = (state, trackId) => 
  state.cart.items.filter(item => item.trackId === trackId);

// Export reducer
export default cartSlice.reducer;