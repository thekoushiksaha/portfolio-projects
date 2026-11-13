import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { Button, Card, Muted } from '@/shared/components';
import { useLayout } from '@/shared/layout/useLayout';
import { spacing } from '@/shared/theme';

import type { CategoryTotal } from '../types';
import { CategoryRow } from './CategoryRow';

export function CategoryBreakdown({ items }: { items: CategoryTotal[] }) {
  const router = useRouter();
  const { isCompact } = useLayout();

  if (items.length === 0) {
    return (
      <Card>
        <Muted>No expenses recorded this month.</Muted>
        <Button title="Add an expense" variant="secondary" onPress={() => router.push('/add')} />
      </Card>
    );
  }

  return (
    <Card>
      <View style={styles.grid}>
        {items.map((item) => (
          <View key={item.category} style={{ width: isCompact ? '100%' : '48%' }}>
            <CategoryRow item={item} />
          </View>
        ))}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: spacing.md,
  },
});
