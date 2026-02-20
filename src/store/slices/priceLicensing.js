import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  // --- Pricing Modal (TrackPricingTable) ---
  isOpen: false,
  currentTrack: null,

  // --- Download Modal (TrackDownloadModal) ---
  // Separate fields so both modals can coexist without conflicts.
  isDownloadOpen: false,
  currentDownloadTrack: null,
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

    // Opens the free-download modal and stores the track being downloaded.
    openDownloadModal: (state, action) => {
      state.isDownloadOpen = true;
      state.currentDownloadTrack = action.payload;
    },
    // Closes the free-download modal and clears the stored track.
    closeDownloadModal: (state) => {
      state.isDownloadOpen = false;
      state.currentDownloadTrack = null;
    },
  },
});

export const { openPricingModal, closePricingModal, openDownloadModal, closeDownloadModal } = priceLicensingSlice.actions;

export default priceLicensingSlice.reducer;