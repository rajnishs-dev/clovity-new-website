import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type ThemeMode = 'light' | 'dark' | 'system';

/**
 * Theme + motion preferences.
 *
 * The current design is light-only, and `mode` stays `'light'` so the migration
 * changes nothing visually. The slice exists because `reducedMotion` is read by
 * every animation hook (GSAP, Framer Motion, the canvas sphere, the carousels)
 * — one resolved value instead of a dozen `matchMedia` calls.
 */
export interface ThemeState {
  mode: ThemeMode;
  /** Resolved from `prefers-reduced-motion`, or forced by the user. */
  reducedMotion: boolean;
  /** True when the OS preference has been read on the client. */
  motionResolved: boolean;
}

const initialState: ThemeState = {
  mode: 'light',
  // Assume motion is allowed until the client resolves the media query, so the
  // server-rendered HTML matches what a default visitor sees.
  reducedMotion: false,
  motionResolved: false,
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setThemeMode(state, action: PayloadAction<ThemeMode>) {
      state.mode = action.payload;
    },
    setReducedMotion(state, action: PayloadAction<boolean>) {
      state.reducedMotion = action.payload;
      state.motionResolved = true;
    },
  },
});

export const { setThemeMode, setReducedMotion } = themeSlice.actions;
export const themeReducer = themeSlice.reducer;
