import { request } from '@/shared/api/client';

import type { MonthTotal, Summary } from './types';

export const summaryApi = {
  monthly: (month: string) =>
    request<Summary>(`/summary/monthly?month=${encodeURIComponent(month)}`),

  // Always ends at the current month, whatever month is selected on screen.
  trend: (months: number) => request<MonthTotal[]>(`/summary/trend?months=${months}`),
};
