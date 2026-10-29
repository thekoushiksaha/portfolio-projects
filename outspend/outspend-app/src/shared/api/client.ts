import { env } from '@/shared/config/env';
import { tokenStorage } from '@/shared/lib/tokenStorage';

import { ApiError } from './errors';
import type { ApiEnvelope } from './types';

interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

let onSessionExpired: (() => void) | null = null;

// The auth feature registers a function here (Step F2) so the app can return to the login screen.
export function setSessionExpiredHandler(handler: (() => void) | null): void {
  onSessionExpired = handler;
}

async function rawRequest(
  path: string,
  method: string,
  body?: unknown,
  token?: string | null,
): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), env.requestTimeoutMs);

  try {
    return await fetch(`${env.apiUrl}${env.apiPrefix}${path}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body === undefined ? undefined : JSON.stringify(body),
      signal: controller.signal,
    });
  } catch (error) {
    const timedOut = (error as Error).name === 'AbortError';
    throw new ApiError(
      timedOut
        ? 'The server took too long to answer. It may be waking up, please try again.'
        : 'Cannot reach the server. Check your internet connection.',
      0,
    );
  } finally {
    clearTimeout(timer);
  }
}

async function parse<T>(response: Response): Promise<T> {
  let json: ApiEnvelope<T> | null = null;
  try {
    json = (await response.json()) as ApiEnvelope<T>;
  } catch {
    // empty or non-JSON body
  }

  if (!response.ok || !json?.success) {
    const fieldErrors =
      json && json.data && typeof json.data === 'object'
        ? (json.data as unknown as Record<string, string>)
        : undefined;
    throw new ApiError(
      json?.message ?? `Request failed (${response.status})`,
      response.status,
      fieldErrors,
    );
  }
  return json.data;
}

let refreshing: Promise<boolean> | null = null;

async function refreshTokens(): Promise<boolean> {
  if (!refreshing) {
    refreshing = (async () => {
      const refreshToken = await tokenStorage.getRefresh();
      if (!refreshToken) {
        return false;
      }
      try {
        const response = await rawRequest('/auth/refresh', 'POST', { refreshToken });
        const tokens = await parse<TokenPair>(response);
        await tokenStorage.save(tokens.accessToken, tokens.refreshToken);
        return true;
      } catch (error) {
        if (error instanceof ApiError && error.status === 0) {
          throw error; // no connection: keep the tokens, don't log the user out
        }
        await tokenStorage.clear();
        return false;
      }
    })().finally(() => {
      refreshing = null;
    });
  }
  return refreshing;
}

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: unknown;
  auth?: boolean; // false for public endpoints such as login
}

export async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, auth = true } = options;

  let token = auth ? await tokenStorage.getAccess() : null;
  let response = await rawRequest(path, method, body, token);

  if (response.status === 401 && auth) {
    if (await refreshTokens()) {
      token = await tokenStorage.getAccess();
      response = await rawRequest(path, method, body, token);
    }
    if (response.status === 401) {
      await tokenStorage.clear();
      onSessionExpired?.();
    }
  }

  return parse<T>(response);
}
