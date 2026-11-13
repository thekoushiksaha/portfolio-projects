import { request } from '@/shared/api/client';

import type { Limit, LimitInput } from './types';

export const limitsApi = {
  list: (month: string) => request<Limit[]>(`/limits?month=${encodeURIComponent(month)}`),

  save: (input: LimitInput) => request<Limit>('/limits', { method: 'PUT', body: input }),

  remove: (id: number) => request<null>(`/limits/${id}`, { method: 'DELETE' }),
};
