import { StyleSheet, View } from 'react-native';

import { Skeleton } from '@/shared/components';
import { radius, spacing, useStyles, type ThemeColors } from '@/shared/theme';

export function ExpenseListSkeleton({ count = 6 }: { count?: number }) {
  const styles = useStyles(makeStyles);

  return (
    <View accessible accessibilityLabel="Loading expenses" style={{ gap: spacing.sm }}>
      {Array.from({ length: count }, (_, index) => (
        <View key={index} style={styles.row}>
          <Skeleton width={40} height={40} radius={20} />
          <View style={styles.body}>
            <Skeleton width="55%" height={14} />
            <Skeleton width="35%" height={12} />
          </View>
          <Skeleton width={64} height={16} />
        </View>
      ))}
    </View>
  );
}

const makeStyles = (c: ThemeColors) =>
  StyleSheet.create({
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
      padding: spacing.md,
      borderRadius: radius.lg,
      borderWidth: 1,
      borderColor: c.border,
      backgroundColor: c.surface,
    },
    body: { flex: 1, gap: 8 },
  });
