import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isOpen: false,
  currentItem: null, // Current item to show agreement for
};

const licenseAgreementSlice = createSlice({
  name: 'licenseAgreement',
  initialState,
  reducers: {
    openLicenseModal: (state, action) => {
      state.isOpen = true;
      state.currentItem = action.payload; // Item object
    },
    closeLicenseModal: (state) => {
      state.isOpen = false;
      state.currentItem = null;
    },
  },
});


export const { openLicenseModal, closeLicenseModal } = licenseAgreementSlice.actions;
//Ask if I can just access the state through the actions...do I have to export???
export const selectLicenseModalState = (state) => state.licenseAgreement.isOpen;
export const selectLicenseModalItem = (state) => state.licenseAgreement.currentItem;

export default licenseAgreementSlice.reducer;