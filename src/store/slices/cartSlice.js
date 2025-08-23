import { createSlice, createAsyncThunk  } from '@reduxjs/toolkit';
import { loadCartFromStorage, saveCartToStorage, clearCartFromStorage } from '../cartStorage';

// Define the shape of a cart item
export const createCartItemFromTrack = (track, licenseOption) => {
    return {
      id: track.track_id,
      licenseId: licenseOption.license_type_id,           // License ID
      name: track.title,                                  // Track title
      artists: track.artists,                              // Track artist
      description: `${track.title} by ${track.artists} - ${licenseOption.license_type_name} License`,
      image: track.thumbnail,
      price: licenseOption.license_fee,
      license: licenseOption.license_type_name,
      quantity: 1,
      type: 'track',
      licenseAgreementAcknowledged: false
    };
  };

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
      // Check if this exact combination of track and license exists
      const existingItemIndex = state.items.findIndex(
        i => i.id === action.payload.id && i.licenseId === action.payload.licenseId
      );
      
      if (existingItemIndex >= 0) {
        // Item with same ID and license exists, update quantity
        state.items[existingItemIndex].quantity += action.payload.quantity;
      } else {
        // Item with this ID and license doesn't exist, add as new
        state.items.push(action.payload);
        console.log("pushed item:", action.payload)
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
    
    // Toggle license agreement aknowledgment for an item
    toggleLicenseAgreement: (state, action) => {
      const { itemId, acknowledged } = action.payload;
      const itemIndex = state.items.findIndex(item => item.id === itemId);
      
      if (itemIndex >= 0) {
        state.items[itemIndex].licenseAgreementAcknowledged = acknowledged;
      }
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
  setCartError,
  toggleLicenseAgreement 
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

// Add this new selector for track
export const selectIsTrackLicenseInCart = (state, trackId, licenseId) => 
    state.cart.items.some(item => item.id === `${trackId}_${licenseId}`);

export const selectItemById = (state, itemId) => 
  state.cart.items.find(item => item.id === itemId) || null;
  
export const selectItemsByTrackId = (state, trackId) => 
  state.cart.items.filter(item => item.trackId === trackId);

// Add selector to check if all items have acknowledged the license agreement
export const selectLicenseAgreementAcknowledged = (state, itemId) => 
  state.cart.items.length > 0 && state.cart.items.some(item => item.id === itemId && item.licenseAgreementAcknowledged);

// Selector to check if all license agreements are acknowledged
export const selectAllLicenseAgreementsAcknowledged = (state) => {
  return state.cart.items.every(item => item.licenseAgreementAcknowledged === true);
};
// Export reducer
export default cartSlice.reducer;

// Now add createAsyncThunk for storage functionality
// Thunk to load cart from storage
export const loadCartFromStorageThunk = createAsyncThunk(
  'cart/loadFromStorage',
  async (_, { dispatch }) => {
    try {
      dispatch(setCartLoading(true));
      const savedCart = loadCartFromStorage();
      if (savedCart && Array.isArray(savedCart) && savedCart.length > 0) {
        dispatch(initCart(savedCart));
      }
    } catch (error) {
      dispatch(setCartError(error.message));
    } finally {
      dispatch(setCartLoading(false));
    }
  }
);

// Add specialized track thunk
export const addTrackToCartAndSaveThunk = createAsyncThunk(
    'cart/addTrackAndSave',
    async ({track, licenseOption}, { dispatch, getState }) => {
      const cartItem = createCartItemFromTrack(track, licenseOption);
      dispatch(addToCart(cartItem));
      const { cart } = getState();
      saveCartToStorage(cart.items);
      console.log("cart items after adding track:", cart.items);
    }
  );

// Thunk to add item and save to storage
export const addToCartAndSaveThunk = createAsyncThunk(
  'cart/addAndSave',
  async (item, { dispatch, getState }) => {
    dispatch(addToCart(item));
    const { cart } = getState();
    saveCartToStorage(cart.items);
  }
);

// Thunk to remove item and save to storage
export const removeFromCartAndSaveThunk = createAsyncThunk(
  'cart/removeAndSave',
  async (itemId, { dispatch, getState }) => {
    dispatch(removeFromCart(itemId));
    const { cart } = getState();
    saveCartToStorage(cart.items);
  }
);

// Thunk to update quantity and save to storage
export const updateQuantityAndSaveThunk = createAsyncThunk(
  'cart/updateQuantityAndSave',
  async (payload, { dispatch, getState }) => {
    dispatch(updateQuantity(payload));
    const { cart } = getState();
    saveCartToStorage(cart.items);
  }
);

// Thunk to toggle license agreement and save to storage
export const toggleLicenseAgreementAndSaveThunk = createAsyncThunk(
  'cart/toggleLicenseAgreementAndSave',
  async (payload, { dispatch, getState }) => {
    dispatch(toggleLicenseAgreement(payload));
    const { cart } = getState();
    saveCartToStorage(cart.items);
  }
);
// Thunk to clear cart and storage
export const clearCartAndStorageThunk = createAsyncThunk(
  'cart/clearAndStorage',
  async (_, { dispatch }) => {
    dispatch(clearCart());
    clearCartFromStorage();
  }
);