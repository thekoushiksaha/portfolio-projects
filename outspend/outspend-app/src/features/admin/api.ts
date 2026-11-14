import { request } from '@/shared/api/client';
import type { Page } from '@/shared/api/types';

import type { ContactMessage } from './types';

export const adminApi = {
  contactMessages: (page: number, size: number) =>
    request<Page<ContactMessage>>(`/admin/contact-messages?page=${page}&size=${size}`),
};
