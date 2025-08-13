import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isOpen: false,
  currentTrack: null,
};

export const LicensingOptions = createSlice({
  name: 'LicensingOptions',
  initialState,
  reducers: {
    openPricingModal: (state, action) => {
      state.isOpen = true;
      state.currentTrack = action.payload;
    },
    closePricingModal: (state) => {
      state.isOpen = false;
      state.currentTrack = null;
    },
  },
});

export const { openPricingModal, closePricingModal } = LicensingOptions.actions;

export default LicensingOptions.reducer;