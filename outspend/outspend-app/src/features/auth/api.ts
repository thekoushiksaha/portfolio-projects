import { request } from '@/shared/api/client';

import type { AuthResponse, LoginInput, RegisterInput, User } from './types';

export const authApi = {
  login: (input: LoginInput) =>
    request<AuthResponse>('/auth/login', { method: 'POST', body: input, auth: false }),

  register: (input: RegisterInput) =>
    request<AuthResponse>('/auth/register', { method: 'POST', body: input, auth: false }),

  logout: (refreshToken: string) =>
    request<null>('/auth/logout', { method: 'POST', body: { refreshToken }, auth: false }),

  // Who is signed in right now. Also used at startup to check that the saved session still works.
  me: () => request<User>('/users/me'),
};
