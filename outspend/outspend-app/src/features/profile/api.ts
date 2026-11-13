import { request } from '@/shared/api/client';

import type { User } from '@/features/auth/types';

export const profileApi = {
  updateName: (name: string) => request<User>('/users/me', { method: 'PUT', body: { name } }),

  changePassword: (currentPassword: string, newPassword: string) =>
    request<null>('/users/me/password', {
      method: 'PUT',
      body: { currentPassword, newPassword },
    }),
};
