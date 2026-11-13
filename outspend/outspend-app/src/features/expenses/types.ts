import type { Category } from '@/shared/domain/categories';

export interface Expense {
  id: number;
  amount: number;
  category: Category;
  expenseDate: string; // yyyy-MM-dd
  note: string | null;
  createdAt: string;
}

export interface ExpenseInput {
  amount: number;
  category: Category;
  expenseDate: string;
  note?: string;
}

export type ExpenseFilters = {
  category?: Category;
  from?: string; // yyyy-MM-dd
  to?: string; // yyyy-MM-dd
  page?: number; // starts at 0
  size?: number;
};
