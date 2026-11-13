import { StyleSheet, View } from 'react-native';

import { Card, Skeleton } from '@/shared/components';
import { useLayout } from '@/shared/layout/useLayout';
import { spacing } from '@/shared/theme';

export function LimitsSkeleton() {
  const { isCompact } = useLayout();

  return (
    <View accessible accessibilityLabel="Loading limits" style={styles.grid}>
      {[0, 1, 2].map((index) => (
        <View key={index} style={{ width: isCompact ? '100%' : '48%' }}>
          <Card>
            <View style={styles.header}>
              <Skeleton width={40} height={40} radius={20} />
              <Skeleton width="40%" height={16} />
            </View>
            <Skeleton width="50%" height={22} style={styles.gap} />
            <Skeleton height={8} radius={4} style={styles.gap} />
            <Skeleton width="35%" height={14} style={styles.gap} />
          </Card>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: spacing.md,
  },
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  gap: { marginTop: spacing.sm },
});
