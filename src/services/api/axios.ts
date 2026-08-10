import axios, { type AxiosInstance } from 'axios';
import { env } from '@/config/env';
import { attachInterceptors } from './interceptors';

/**
 * The single Axios instance the app talks to the admin API through.
 *
 * Created lazily so importing this module in a Server Component that never
 * makes a request costs nothing, and so a missing `NEXT_PUBLIC_API_BASE_URL`
 * during the static-content phase does not throw at module-eval time.
 */

let instance: AxiosInstance | null = null;

function createClient(): AxiosInstance {
  const client = axios.create({
    baseURL: env.apiBaseUrl || undefined,
    timeout: env.apiTimeout,
    withCredentials: true, // httpOnly refresh cookie from the Express API.
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    // Let the response interceptor and normaliser own all non-2xx handling.
    validateStatus: (status) => status >= 200 && status < 300,
  });

  return attachInterceptors(client);
}

export function getApiClient(): AxiosInstance {
  if (!instance) {
    instance = createClient();
  }
  return instance;
}

/** Test/HMR hook - forces the next `getApiClient()` to rebuild the instance. */
export function resetApiClient(): void {
  instance = null;
}

/** True when a base URL is configured and the CMS flag is on. */
export function isApiConfigured(): boolean {
  return env.cmsEnabled;
}
