import type { ApiResult } from '@/types/api';
import { apiPost } from '@/services/api/request';
import { tokenStorage } from './tokenStorage';

/**
 * Auth surface for phase 2 (JWT + role-based access control on the Express
 * side). The public marketing pages are anonymous, so nothing calls this yet -
 * it exists so the admin panel and any gated content plug in without
 * restructuring the services layer.
 */

export type UserRole = 'admin' | 'editor' | 'author' | 'viewer';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  roles: UserRole[];
}

export interface LoginPayload {
  email: string;
  password: string;
}

interface AuthTokens {
  accessToken: string;
  /** Seconds until the access token expires. */
  expiresIn: number;
}

type LoginResponse = AuthTokens & { user: AuthUser };

const AUTH_ENDPOINTS = {
  login: '/auth/login',
  logout: '/auth/logout',
  refresh: '/auth/refresh',
  me: '/auth/me',
} as const;

export const authApi = {
  async login(payload: LoginPayload): Promise<ApiResult<AuthUser>> {
    const result = await apiPost<LoginResponse, LoginPayload>(
      AUTH_ENDPOINTS.login,
      payload,
    );
    if (!result.success) return result;
    tokenStorage.set(result.data.accessToken);
    return { success: true, data: result.data.user };
  },

  async logout(): Promise<ApiResult<null>> {
    const result = await apiPost<null, Record<string, never>>(
      AUTH_ENDPOINTS.logout,
      {},
    );
    // Drop the local token regardless - a failed logout must not leave a
    // credential sitting in memory.
    tokenStorage.clear();
    return result.success ? { success: true, data: null } : result;
  },

  async refresh(): Promise<ApiResult<null>> {
    const result = await apiPost<AuthTokens, Record<string, never>>(
      AUTH_ENDPOINTS.refresh,
      {},
    );
    if (!result.success) {
      tokenStorage.clear();
      return result;
    }
    tokenStorage.set(result.data.accessToken);
    return { success: true, data: null };
  },

  hasRole(user: AuthUser | null, role: UserRole): boolean {
    return user?.roles.includes(role) ?? false;
  },
};
