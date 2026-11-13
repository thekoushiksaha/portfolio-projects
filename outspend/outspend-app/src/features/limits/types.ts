import type { Category } from '@/shared/domain/categories';

export type LimitStatus = 'OK' | 'WARNING' | 'EXCEEDED';

export interface Limit {
  id: number;
  category: Category | null; // null means the overall monthly limit
  monthlyLimit: number;
  spent: number; // spent in the month shown
  remaining: number;
  percentUsed: number; // can go above 100
  status: LimitStatus;
}

export interface LimitInput {
  category: Category | null;
  monthlyLimit: number;
}
