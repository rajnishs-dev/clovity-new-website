import { combineReducers, configureStore } from '@reduxjs/toolkit';
import {
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
  persistReducer,
  persistStore,
} from 'redux-persist';
import { env } from '@/config/env';
import { persistStorage } from './storage';
import {
  contactReducer,
  globalReducer,
  navigationReducer,
  searchReducer,
  themeReducer,
  uiReducer,
} from './slices';

/**
 * Store factory. One store *per request* on the server and one per browser
 * session — never a module-level singleton, which in the App Router would leak
 * one visitor's state into another's SSR pass.
 */

const rootReducer = combineReducers({
  ui: uiReducer,
  theme: themeReducer,
  navigation: navigationReducer,
  contact: contactReducer,
  search: searchReducer,
  global: globalReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

/**
 * Persistence is opt-in and narrow: only the two slices where surviving a
 * reload is a genuine improvement. UI/navigation/contact state must reset, and
 * persisting them would cause hydration mismatches and stale form banners.
 */
const persistConfig = {
  key: 'clovity-root',
  version: 1,
  storage: persistStorage,
  whitelist: ['theme', 'global'] satisfies Array<keyof RootState>,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export function makeStore() {
  const store = configureStore({
    reducer: persistedReducer,
    devTools: !env.isProduction,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          // redux-persist dispatches non-serialisable internal actions.
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }),
  });

  return store;
}

export type AppStore = ReturnType<typeof makeStore>;
export type AppDispatch = AppStore['dispatch'];

/** Only meaningful in the browser; on the server this is never called. */
export function makePersistor(store: AppStore) {
  return persistStore(store);
}
