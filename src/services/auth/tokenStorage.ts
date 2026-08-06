/**
 * Access-token storage.
 *
 * The public marketing site is anonymous, so this exists for phase 2: the
 * admin panel and any gated resource (gated whitepaper, customer portal) will
 * need a bearer token, and the API interceptor already asks for one here.
 *
 * Deliberately in-memory by default. A JWT in localStorage is readable by any
 * XSS payload; the intended production shape is an httpOnly refresh cookie set
 * by the Express API plus a short-lived access token held only in memory. Set
 * `persist: true` only if you consciously accept that trade-off.
 */

let accessToken: string | null = null;
let persist = false;

const STORAGE_KEY = 'clovity.accessToken';

function canUseStorage(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return typeof window.sessionStorage !== 'undefined';
  } catch {
    return false;
  }
}

export const tokenStorage = {
  /** Opt into sessionStorage persistence (survives reload, not tab close). */
  configure(options: { persist: boolean }): void {
    persist = options.persist;
  },

  get(): string | null {
    if (accessToken) return accessToken;
    if (persist && canUseStorage()) {
      accessToken = window.sessionStorage.getItem(STORAGE_KEY);
    }
    return accessToken;
  },

  set(token: string): void {
    accessToken = token;
    if (persist && canUseStorage()) {
      window.sessionStorage.setItem(STORAGE_KEY, token);
    }
  },

  clear(): void {
    accessToken = null;
    if (canUseStorage()) {
      window.sessionStorage.removeItem(STORAGE_KEY);
    }
  },

  has(): boolean {
    return tokenStorage.get() !== null;
  },
};
