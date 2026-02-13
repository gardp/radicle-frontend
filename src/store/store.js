import { configureStore } from '@reduxjs/toolkit';
import priceLicensingSlice from './slices/priceLicensing.js'; // Import your reducers
import cartReducer from './slices/cartSlice.js';
import licenseAgreementSlice from './slices/licenseAgreementSlice.js';
import trackLibrarySlice from './slices/trackLibrarySlice.js';
import orderReducer from './slices/orderSlice.js';
export const store = configureStore({
  reducer: {
    priceLicensing: priceLicensingSlice, // Add your reducers here from the priceLicensingSlice object
    // ... other reducers ...
    cart: cartReducer,
    licenseAgreement: licenseAgreementSlice,
    trackLibrary: trackLibrarySlice,
    order: orderReducer,
  },
});

export default store;