import type { Ionicons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';

export type Category = 'FOOD' | 'TRANSPORT' | 'BILLS' | 'SHOPPING' | 'HEALTH' | 'OTHER';

type IconName = ComponentProps<typeof Ionicons>['name'];

export const CATEGORIES: { value: Category; label: string; icon: IconName }[] = [
  { value: 'FOOD', label: 'Food', icon: 'restaurant' },
  { value: 'TRANSPORT', label: 'Transport', icon: 'bus' },
  { value: 'BILLS', label: 'Bills', icon: 'receipt' },
  { value: 'SHOPPING', label: 'Shopping', icon: 'bag' },
  { value: 'HEALTH', label: 'Health', icon: 'medkit' },
  { value: 'OTHER', label: 'Other', icon: 'ellipsis-horizontal-circle' },
];

// A null category means "overall monthly limit" (used by the Limits screen later).
export function categoryInfo(category: Category | null): { label: string; icon: IconName } {
  if (category === null) {
    return { label: 'Overall', icon: 'wallet' };
  }
  return (
    CATEGORIES.find((item) => item.value === category) ?? { label: category, icon: 'help-circle' }
  );
}
