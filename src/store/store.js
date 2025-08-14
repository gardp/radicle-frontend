import { configureStore } from '@reduxjs/toolkit';
import priceLicensingSlice from './slices/priceLicensing.js'; // Import your reducers
import cartReducer from './slices/cartSlice.js';
export const store = configureStore({
  reducer: {
    priceLicensing: priceLicensingSlice, // Add your reducers here from the priceLicensingSlice object
    // ... other reducers ...
    cart: cartReducer,
  },
});

export default store;