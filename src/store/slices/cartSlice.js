import { createSlice, createAsyncThunk  } from '@reduxjs/toolkit';
import { loadCartFromStorage, saveCartToStorage, clearCartFromStorage } from '../cartStorage';


// Define the shape of a cart item
// export const createCartItemFromTrack = (track, licenseOption) => {
//     return {
//       id: track.track_id,
//       licenseId: licenseOption.license_type_id,           // License ID
//       name: track.title,                                  // Track title
//       artists: track.artists,                              // Track artist
//       description: `${track.title} by ${track.artists} - ${licenseOption.license_type_name} License`,
//       image: track.thumbnail,
//       price: Number(licenseOption.license_fee).toFixed(2), 
//       license: licenseOption.license_type_name,
//       quantity: 1,
//       type: 'track',
//       licenseAgreementAcknowledged: false
//     };
//   };

// remember user can't buy the songs directly on the platform, they have to go to DSP platforms for that. But they can buy the beat
export const createCartItemFromTrack = (track, trackLicenseOption) => { //Selecting one option from the list of licenseOptions
    return {
      id: track.trackID,
      title: `${track.trackTitle}`,
      description: `${track.trackStorageFileDescription}`,
      image: track.trackVinylThumbnail, //Make sure the thumbnail is a blank vinyl for license purchases track being uploaded!!!
      price: Number(trackLicenseOption.licenseType.price).toFixed(2), //from the trackLicenseOption object
      currency: trackLicenseOption.licenseType.currency,
      licenseTypeId: trackLicenseOption.licenseType.licenseTypeId,
      licenseTypeName: trackLicenseOption.licenseType.licenseTypeName,
      licenseTypeTemplate: trackLicenseOption.licenseType.licenseTypeTemplate,
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
        totalPrice: Number(totals.totalPrice + (item.price * item.quantity)).toFixed(2)
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
      let existingItemIndex;
      // Check if this exact combination of track and license exists. So check if the item is a track and not a merch
      if (action.payload.type === 'track') {
        existingItemIndex = state.items.findIndex(
          i => i.id === action.payload.id && i.licenseTypeId === action.payload.licenseTypeId
        );
          }
      else {
        existingItemIndex = state.items.findIndex(
          i => i.id === action.payload.id
        );
        }

        if (existingItemIndex >= 0) {
          // Item with same ID and license exists, update quantity
          state.items[existingItemIndex].quantity += action.payload.quantity;
        } 
        else {
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
      const cartItem = action.payload;
      console.log("Equality check:", cartItem, state.items)
      console.log("items before filter:", [...state.items])
      if (cartItem.type === 'track') {
      state.items = state.items.filter(item => 
        !(item.id === cartItem.id && item.licenseTypeId === cartItem.licenseTypeId));
      }
      else {
        state.items = state.items.filter(item => 
          !(item.id === cartItem.id));
      }      
      
      // Update totals
      const totals = calculateCartTotals(state.items);
      state.totalItems = totals.totalItems;
      state.totalPrice = totals.totalPrice;
      state.error = null;
    },
    
    // Update quantity of an item in the cart
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      
      // Ensure quantity is valid (minimum 1)
      const safeQuantity = Math.max(1, quantity);
      if (action.payload.type === 'track') {
        const itemIndex = state.items.findIndex(item => item.id === id && item.licenseTypeId === action.payload.licenseTypeId);
        if (itemIndex >= 0) {
          state.items[itemIndex].quantity = safeQuantity;
        }
      }
      else {
        const itemIndex = state.items.findIndex(item => item.id === id);
        if (itemIndex >= 0) {
          state.items[itemIndex].quantity = safeQuantity;
        }
      }      
      // Update totals
      const totals = calculateCartTotals(state.items);
      state.totalItems = totals.totalItems;
      state.totalPrice = totals.totalPrice;
      state.error = null;
    },
    
    // Toggle license agreement aknowledgment for an item
    toggleLicenseAgreement: (state, action) => {
      const { id, acknowledged } = action.payload;
      if (action.payload.type === 'track') { //for track license
      const itemIndex = state.items.findIndex(item => item.id === id && item.licenseTypeId === action.payload.licenseTypeId);
      if (itemIndex >= 0) {
        state.items[itemIndex].licenseAgreementAcknowledged = acknowledged;
      }
      }
      else { //merch/asset, so there is nothing for this on the website yet
        const itemIndex = state.items.findIndex(item => item.id === id);
        if (itemIndex >= 0) {
          state.items[itemIndex].licenseAgreementAcknowledged = acknowledged;
        }
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
// check if an merch/asset is in the cart
export const selectIsInCart = (state, id) => 
  state.cart.items.some(item => item.id === id);

// check if track+license is in cart
export const selectIsTrackLicenseInCart = (state, id, licenseTypeId) => 
  state.cart.items.some(item => item.id === id && item.licenseTypeId === licenseTypeId);

// select merch/asset by id
export const selectItemById = (state, id) => 
  state.cart.items.find(item => item.id === id) || null;
  
// select track+license by id
export const selectTrackLicenseByid = (state, id) => 
  state.cart.items.filter(item => item.id === id);

// Add selector to check if a specific item has acknowledged the license agreement
export const selectLicenseAgreementAcknowledged = (state, id) => 
  state.cart.items.length > 0 && state.cart.items.some(item => item.id === id && item.licenseAgreementAcknowledged);

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
    async ({track, trackLicenseOption}, { dispatch, getState }) => {
      const cartItem = createCartItemFromTrack(track, trackLicenseOption);
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
  async (item, { dispatch, getState }) => {
    dispatch(removeFromCart(item));
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