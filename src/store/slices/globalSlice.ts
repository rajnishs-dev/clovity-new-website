import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type CookieConsent = 'unset' | 'accepted' | 'rejected';

/**
 * App-wide state that outlives a single page: cookie consent, whether the
 * client has hydrated, and runtime feature flags.
 *
 * `hydrated` matters for animation: the scroll-reveal and GSAP hooks must not
 * run against server-rendered markup, and reading one flag is cheaper and less
 * error-prone than each component tracking its own mounted state.
 */
export interface GlobalState {
  hydrated: boolean;
  cookieConsent: CookieConsent;
  /** Runtime overrides for CMS-driven flags, keyed by flag name. */
  featureFlags: Record<string, boolean>;
  /** Last route-level error message shown to the user, if any. */
  lastError: string | null;
}

const initialState: GlobalState = {
  hydrated: false,
  cookieConsent: 'unset',
  featureFlags: {},
  lastError: null,
};

const globalSlice = createSlice({
  name: 'global',
  initialState,
  reducers: {
    setHydrated(state) {
      state.hydrated = true;
    },
    setCookieConsent(state, action: PayloadAction<CookieConsent>) {
      state.cookieConsent = action.payload;
    },
    setFeatureFlags(state, action: PayloadAction<Record<string, boolean>>) {
      state.featureFlags = { ...state.featureFlags, ...action.payload };
    },
    setLastError(state, action: PayloadAction<string | null>) {
      state.lastError = action.payload;
    },
  },
});

export const { setHydrated, setCookieConsent, setFeatureFlags, setLastError } =
  globalSlice.actions;
export const globalReducer = globalSlice.reducer;
