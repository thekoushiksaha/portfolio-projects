import { View } from 'react-native';

import { CategoryChips, MonthSwitcher } from '@/shared/components';
import type { Category } from '@/shared/domain/categories';
import { spacing } from '@/shared/theme';

type HistoryFiltersProps = {
  month: string;
  category: Category | null;
  onMonthChange: (month: string) => void;
  onCategoryChange: (category: Category | null) => void;
};

export function HistoryFilters({
  month,
  category,
  onMonthChange,
  onCategoryChange,
}: HistoryFiltersProps) {
  return (
    <View style={{ gap: spacing.md }}>
      <MonthSwitcher month={month} onChange={onMonthChange} />
      <CategoryChips allowAll value={category} onChange={onCategoryChange} />
    </View>
  );
}
