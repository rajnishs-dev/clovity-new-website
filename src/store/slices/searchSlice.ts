import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { AsyncState } from '@/types/common';
import type { ContentKind } from '@/types/content';

export interface SearchHit {
  id: string;
  kind: ContentKind;
  title: string;
  excerpt: string;
  href: string;
}

/**
 * Site search. The legacy site had no search UI; the slice and the <Search />
 * component are wired now so turning it on later is a route + endpoint change,
 * not a state-architecture change.
 */
export interface SearchState {
  query: string;
  status: AsyncState;
  hits: SearchHit[];
  /** Active content-type filters; empty means "all". */
  kinds: ContentKind[];
  /** Persisted, newest first, capped at MAX_RECENT. */
  recentQueries: string[];
  isOpen: boolean;
  error: string | null;
}

const MAX_RECENT = 6;

const initialState: SearchState = {
  query: '',
  status: 'idle',
  hits: [],
  kinds: [],
  recentQueries: [],
  isOpen: false,
  error: null,
};

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setQuery(state, action: PayloadAction<string>) {
      state.query = action.payload;
      if (action.payload.trim() === '') {
        state.hits = [];
        state.status = 'idle';
        state.error = null;
      }
    },
    setSearchStatus(state, action: PayloadAction<AsyncState>) {
      state.status = action.payload;
    },
    setHits(state, action: PayloadAction<SearchHit[]>) {
      state.hits = action.payload;
      state.status = 'succeeded';
      state.error = null;
    },
    setSearchError(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.status = 'failed';
      state.hits = [];
    },
    toggleKind(state, action: PayloadAction<ContentKind>) {
      state.kinds = state.kinds.includes(action.payload)
        ? state.kinds.filter((k) => k !== action.payload)
        : [...state.kinds, action.payload];
    },
    clearKinds(state) {
      state.kinds = [];
    },
    rememberQuery(state, action: PayloadAction<string>) {
      const query = action.payload.trim();
      if (!query) return;
      state.recentQueries = [
        query,
        ...state.recentQueries.filter((q) => q !== query),
      ].slice(0, MAX_RECENT);
    },
    clearRecentQueries(state) {
      state.recentQueries = [];
    },
    openSearch(state) {
      state.isOpen = true;
    },
    closeSearch(state) {
      state.isOpen = false;
    },
  },
});

export const {
  setQuery,
  setSearchStatus,
  setHits,
  setSearchError,
  toggleKind,
  clearKinds,
  rememberQuery,
  clearRecentQueries,
  openSearch,
  closeSearch,
} = searchSlice.actions;
export const searchReducer = searchSlice.reducer;
