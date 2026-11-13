import { StyleSheet, View } from 'react-native';

import { Card, ResponsiveRow, Skeleton } from '@/shared/components';
import { useLayout } from '@/shared/layout/useLayout';
import { spacing } from '@/shared/theme';

export function SummarySkeleton() {
  const { isCompact } = useLayout();

  return (
    <View accessible accessibilityLabel="Loading summary" style={{ gap: spacing.md }}>
      <ResponsiveRow>
        <Card tinted fill>
          <Skeleton width="45%" height={14} />
          <Skeleton width="60%" height={38} style={styles.gap} />
          <Skeleton width="55%" height={14} style={styles.gap} />
        </Card>
        <Card fill>
          <Skeleton width="40%" height={16} />
          <Skeleton height={isCompact ? 100 : 140} style={styles.gap} />
        </Card>
      </ResponsiveRow>

      <Skeleton width="30%" height={18} />

      <Card>
        {[0, 1, 2].map((index) => (
          <View key={index} style={styles.row}>
            <Skeleton width={40} height={40} radius={20} />
            <View style={styles.rowBody}>
              <Skeleton width="50%" height={14} />
              <Skeleton height={6} radius={3} />
            </View>
          </View>
        ))}
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  gap: { marginTop: spacing.sm },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginVertical: spacing.xs },
  rowBody: { flex: 1, gap: spacing.sm },
});
