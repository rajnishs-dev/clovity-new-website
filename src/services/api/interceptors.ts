import type { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { env } from '@/config/env';
import { tokenStorage } from '@/services/auth/tokenStorage';

/**
 * Cross-cutting HTTP concerns, attached once per Axios instance.
 *
 * Kept out of `axios.ts` so the transport config and the behaviour that wraps
 * it can be reasoned about — and swapped — independently.
 */

/** Extra fields we thread through the request config. */
interface TracedRequestConfig extends InternalAxiosRequestConfig {
  metadata?: { startedAt: number; requestId: string };
}

let requestCounter = 0;

function nextRequestId(): string {
  requestCounter += 1;
  // Monotonic and collision-free per process; no crypto dependency needed.
  return `req_${Date.now().toString(36)}_${requestCounter.toString(36)}`;
}

export function attachRequestInterceptors(client: AxiosInstance): void {
  client.interceptors.request.use(
    (config: TracedRequestConfig) => {
      config.metadata = { startedAt: Date.now(), requestId: nextRequestId() };
      config.headers.set('X-Request-Id', config.metadata.requestId);

      // Bearer token, when one exists (phase 2 / gated content).
      const token = tokenStorage.get();
      if (token) {
        config.headers.set('Authorization', `Bearer ${token}`);
      }

      // Server-to-server calls carry the service token instead.
      if (typeof window === 'undefined' && process.env.API_SERVER_TOKEN) {
        config.headers.set('X-Service-Token', process.env.API_SERVER_TOKEN);
      }

      return config;
    },
    (error: unknown) => Promise.reject(error),
  );
}

export function attachResponseInterceptors(client: AxiosInstance): void {
  client.interceptors.response.use(
    (response) => {
      if (env.isDevelopment) {
        const config = response.config as TracedRequestConfig;
        const ms = config.metadata
          ? Date.now() - config.metadata.startedAt
          : undefined;
        console.warn(
          `[api] ${response.status} ${config.method?.toUpperCase() ?? 'GET'} ${config.url}${
            ms !== undefined ? ` (${ms}ms)` : ''
          }`,
        );
      }
      return response;
    },
    (error: unknown) => {
      // A 401 means the token we hold is dead — drop it so the next request
      // does not retry with a credential we already know is invalid.
      if (
        error &&
        typeof error === 'object' &&
        'response' in error &&
        (error as { response?: { status?: number } }).response?.status === 401
      ) {
        tokenStorage.clear();
      }
      return Promise.reject(error);
    },
  );
}

export function attachInterceptors(client: AxiosInstance): AxiosInstance {
  attachRequestInterceptors(client);
  attachResponseInterceptors(client);
  return client;
}
