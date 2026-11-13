import { request } from '@/shared/api/client';

import type { About, ContactInput } from './types';

export const publicApi = {
  about: () => request<About>('/public/about', { auth: false }),

  contact: (input: ContactInput) =>
    request<null>('/public/contact', { method: 'POST', body: input, auth: false }),
};
