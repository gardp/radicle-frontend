import { configureStore } from '@reduxjs/toolkit';
import priceLicensingSlice from './components/priceLicensing/priceLicensing.js'; // Import your reducers

export const store = configureStore({
  reducer: {
    priceLicensing: priceLicensingSlice, // Add your reducers here from the priceLicensingSlice object
    // ... other reducers ...
  },
});

export default store;