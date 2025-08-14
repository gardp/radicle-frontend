import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isOpen: false,
  currentTrack: null,
};

export const priceLicensingSlice = createSlice({
  name: 'priceLicensing',
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

export const { openPricingModal, closePricingModal } = priceLicensingSlice.actions;

export default priceLicensingSlice.reducer;