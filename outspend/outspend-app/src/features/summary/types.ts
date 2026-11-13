import type { Category } from '@/shared/domain/categories';

export interface CategoryTotal {
  category: Category;
  total: number;
  percentage: number; // share of the month, 0 to 100
}

export interface MonthTotal {
  month: string; // yyyy-MM
  total: number;
}

export interface Summary {
  month: string; // yyyy-MM
  totalSpent: number;
  previousMonthTotal: number;
  byCategory: CategoryTotal[]; // biggest first
}
