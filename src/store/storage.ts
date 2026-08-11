import type { WebStorage } from 'redux-persist';

/**
 * SSR-safe storage for redux-persist.
 *
 * The store is created on the server too (once per request), where `window`
 * does not exist. redux-persist's default `localStorage` engine would throw
 * there, so this returns a no-op engine on the server and the real one in the
 * browser. Rehydration then happens on the client only, which is correct - the
 * server must render the same neutral HTML for every visitor.
 */

function createNoopStorage(): WebStorage {
  return {
    getItem() {
      return Promise.resolve(null);
    },
    setItem() {
      return Promise.resolve();
    },
    removeItem() {
      return Promise.resolve();
    },
  };
}

function createBrowserStorage(): WebStorage {
  return {
    getItem(key) {
      try {
        return Promise.resolve(window.localStorage.getItem(key));
      } catch {
        // Private-browsing / disabled storage must not break the app.
        return Promise.resolve(null);
      }
    },
    setItem(key, item) {
      try {
        window.localStorage.setItem(key, item);
      } catch {
        /* quota exceeded or storage disabled - persistence is best-effort */
      }
      return Promise.resolve();
    },
    removeItem(key) {
      try {
        window.localStorage.removeItem(key);
      } catch {
        /* nothing to do */
      }
      return Promise.resolve();
    },
  };
}

export const persistStorage: WebStorage =
  typeof window !== 'undefined' ? createBrowserStorage() : createNoopStorage();
