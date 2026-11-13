import { request } from '@/shared/api/client';
import type { Page } from '@/shared/api/types';

import type { Expense, ExpenseFilters, ExpenseInput } from './types';

function toQuery(filters: ExpenseFilters): string {
  const params = Object.entries(filters)
    .filter(([, value]) => value !== undefined && value !== null && value !== '')
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`);
  return params.length > 0 ? `?${params.join('&')}` : '';
}

export const expensesApi = {
  list: (filters: ExpenseFilters = {}) => request<Page<Expense>>(`/expenses${toQuery(filters)}`),

  get: (id: number) => request<Expense>(`/expenses/${id}`),

  create: (input: ExpenseInput) => request<Expense>('/expenses', { method: 'POST', body: input }),

  update: (id: number, input: ExpenseInput) =>
    request<Expense>(`/expenses/${id}`, { method: 'PUT', body: input }),

  remove: (id: number) => request<null>(`/expenses/${id}`, { method: 'DELETE' }),
};
