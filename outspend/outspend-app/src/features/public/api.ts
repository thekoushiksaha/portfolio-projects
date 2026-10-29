import { request } from '@/shared/api/client';

import type { About } from './types';

export const publicApi = {
  about: () => request<About>('/public/about', { auth: false }),
};
