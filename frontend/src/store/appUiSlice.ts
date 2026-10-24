import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { AppUiState, BookingPrefills } from '../types';

const initialState: AppUiState = {
  activeTreatmentTab: 'skin',
  mobileMenuOpen: false,
  showBookingModal: false,
  showApplyModal: false,
  bookingPrefills: {}
};

const appUiSlice = createSlice({
  name: 'appUi',
  initialState,
  reducers: {
    setActiveTreatmentTab: (state, action: PayloadAction<string>) => {
      state.activeTreatmentTab = action.payload;
    },
    setMobileMenuOpen: (state, action: PayloadAction<boolean>) => {
      state.mobileMenuOpen = action.payload;
    },
    toggleMobileMenu: (state) => {
      state.mobileMenuOpen = !state.mobileMenuOpen;
    },
    openBookingModal: (state, action: PayloadAction<BookingPrefills | undefined>) => {
      state.bookingPrefills = action.payload ?? {};
      state.showBookingModal = true;
    },
    closeBookingModal: (state) => {
      state.bookingPrefills = {};
      state.showBookingModal = false;
    },
    setApplyModalOpen: (state, action: PayloadAction<boolean>) => {
      state.showApplyModal = action.payload;
    }
  }
});

export const {
  setActiveTreatmentTab,
  setMobileMenuOpen,
  toggleMobileMenu,
  openBookingModal,
  closeBookingModal,
  setApplyModalOpen
} = appUiSlice.actions;

export default appUiSlice.reducer;
