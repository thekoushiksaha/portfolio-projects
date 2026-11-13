import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { categoryInfo } from '@/shared/domain/categories';
import { formatMoney, formatPercent } from '@/shared/lib/format';
import { spacing, useStyles, useTheme, type ThemeColors } from '@/shared/theme';

import type { CategoryTotal } from '../types';

export function CategoryRow({ item }: { item: CategoryTotal }) {
  const { colors } = useTheme();
  const styles = useStyles(makeStyles);
  const info = categoryInfo(item.category);

  return (
    <View
      accessible
      accessibilityLabel={`${info.label}: ${formatMoney(item.total)}, ${formatPercent(item.percentage)} of the month`}
      style={styles.row}
    >
      <View style={styles.icon}>
        <Ionicons name={info.icon} size={20} color={colors.primary} />
      </View>

      <View style={styles.body}>
        <View style={styles.top}>
          <Text maxFontSizeMultiplier={1.3} style={styles.label}>
            {info.label}
          </Text>
          <Text maxFontSizeMultiplier={1.3} style={styles.amount}>
            {formatMoney(item.total)}
          </Text>
        </View>

        <View style={styles.track}>
          <View style={[styles.fill, { width: `${Math.min(item.percentage, 100)}%` }]} />
        </View>

        <Text maxFontSizeMultiplier={1.3} style={styles.percent}>
          {formatPercent(item.percentage)} of the month
        </Text>
      </View>
    </View>
  );
}

const makeStyles = (c: ThemeColors) =>
  StyleSheet.create({
    row: { flexDirection: 'row', gap: spacing.md, alignItems: 'center' },
    icon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: c.surfaceTint,
      alignItems: 'center',
      justifyContent: 'center',
    },
    body: { flex: 1, gap: 4 },
    top: { flexDirection: 'row', justifyContent: 'space-between', gap: spacing.sm },
    label: { fontSize: 15, fontWeight: '600', color: c.text },
    amount: { fontSize: 15, color: c.text },
    track: { height: 6, borderRadius: 3, backgroundColor: c.surfaceTint, overflow: 'hidden' },
    fill: { height: 6, borderRadius: 3, backgroundColor: c.primary },
    percent: { fontSize: 12, color: c.textMuted },
  });
