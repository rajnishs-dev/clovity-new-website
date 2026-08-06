import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { ActiveNav, NavGroupId } from '@/types/navigation';

/**
 * Which nav entry is "current".
 *
 * The legacy site did this by reading `<body data-nav>` and adding `.active` in
 * a DOM sweep. Here the active pair is state, set once per route, and the
 * header/footer/mobile-drawer all derive their `.active` class from it — the
 * same highlight, without imperative DOM mutation.
 */
export interface NavigationState extends ActiveNav {
  /** Previous pathname, for "back to results" style affordances. */
  previousPath: string | null;
  currentPath: string;
}

const initialState: NavigationState = {
  group: 'none',
  currentPath: '/',
  previousPath: null,
};

const navigationSlice = createSlice({
  name: 'navigation',
  initialState,
  reducers: {
    setActiveNav(state, action: PayloadAction<ActiveNav>) {
      state.group = action.payload.group;
      if (action.payload.item === undefined) {
        delete state.item;
      } else {
        state.item = action.payload.item;
      }
    },
    setCurrentPath(state, action: PayloadAction<string>) {
      if (action.payload !== state.currentPath) {
        state.previousPath = state.currentPath;
        state.currentPath = action.payload;
      }
    },
    clearActiveNav(state) {
      state.group = 'none';
      delete state.item;
    },
  },
});

export const { setActiveNav, setCurrentPath, clearActiveNav } =
  navigationSlice.actions;
export const navigationReducer = navigationSlice.reducer;

/** True when `group`/`item` identify this exact link. */
export function isNavLinkActive(
  state: NavigationState,
  group: NavGroupId,
  itemId?: string,
): boolean {
  if (state.group !== group) return false;
  if (itemId === undefined) return true;
  return state.item === itemId;
}
