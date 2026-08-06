import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { NavGroupId } from '@/types/navigation';

/**
 * Transient interface state: the mobile drawer, which mega panel is open, the
 * sticky-header scroll flag, and a modal/drawer stack.
 *
 * Not persisted — none of it should survive a reload.
 */
export interface UiState {
  mobileMenuOpen: boolean;
  /** Which mobile accordion section is expanded; only one at a time. */
  mobileAccordion: NavGroupId | null;
  /** Which desktop mega panel is open. */
  openMegaMenu: NavGroupId | null;
  /** True once the page has scrolled past the header threshold (24px). */
  headerScrolled: boolean;
  /** Ids of open overlays, newest last — enables correct Escape handling. */
  overlayStack: string[];
  /** Set while an overlay owns the scroll position. */
  scrollLocked: boolean;
}

const initialState: UiState = {
  mobileMenuOpen: false,
  mobileAccordion: null,
  openMegaMenu: null,
  headerScrolled: false,
  overlayStack: [],
  scrollLocked: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    openMobileMenu(state) {
      state.mobileMenuOpen = true;
      state.scrollLocked = true;
    },
    closeMobileMenu(state) {
      state.mobileMenuOpen = false;
      state.mobileAccordion = null;
      state.scrollLocked = state.overlayStack.length > 0;
    },
    toggleMobileAccordion(state, action: PayloadAction<NavGroupId>) {
      state.mobileAccordion =
        state.mobileAccordion === action.payload ? null : action.payload;
    },
    setOpenMegaMenu(state, action: PayloadAction<NavGroupId | null>) {
      state.openMegaMenu = action.payload;
    },
    setHeaderScrolled(state, action: PayloadAction<boolean>) {
      state.headerScrolled = action.payload;
    },
    pushOverlay(state, action: PayloadAction<string>) {
      if (!state.overlayStack.includes(action.payload)) {
        state.overlayStack.push(action.payload);
      }
      state.scrollLocked = true;
    },
    popOverlay(state, action: PayloadAction<string>) {
      state.overlayStack = state.overlayStack.filter(
        (id) => id !== action.payload,
      );
      state.scrollLocked =
        state.overlayStack.length > 0 || state.mobileMenuOpen;
    },
    closeAllOverlays(state) {
      state.overlayStack = [];
      state.mobileMenuOpen = false;
      state.mobileAccordion = null;
      state.openMegaMenu = null;
      state.scrollLocked = false;
    },
  },
});

export const {
  openMobileMenu,
  closeMobileMenu,
  toggleMobileAccordion,
  setOpenMegaMenu,
  setHeaderScrolled,
  pushOverlay,
  popOverlay,
  closeAllOverlays,
} = uiSlice.actions;

export const uiReducer = uiSlice.reducer;
