import { StyleSheet, Text, View } from 'react-native';

import { Card, SectionTitle } from '@/shared/components';
import { useLayout } from '@/shared/layout/useLayout';
import { monthLabel, monthShort } from '@/shared/lib/dates';
import { formatCompact, formatMoney } from '@/shared/lib/format';
import { radius, spacing, useStyles, type ThemeColors } from '@/shared/theme';

import type { MonthTotal } from '../types';

type TrendCardProps = {
  data: MonthTotal[];
  selected: string; // the month highlighted in the chart, yyyy-MM
};

export function TrendCard({ data, selected }: TrendCardProps) {
  const { isCompact } = useLayout();
  const styles = useStyles(makeStyles);

  const barAreaHeight = isCompact ? 100 : 140;
  const max = Math.max(...data.map((item) => item.total), 1);

  return (
    <Card fill>
      <SectionTitle>{`Last ${data.length} months`}</SectionTitle>

      <View style={styles.chart}>
        {data.map((item) => {
          const height = item.total > 0 ? Math.max((item.total / max) * barAreaHeight, 4) : 0;
          const active = item.month === selected;

          return (
            <View
              key={item.month}
              accessible
              accessibilityLabel={`${monthLabel(item.month)}: ${formatMoney(item.total)}`}
              style={styles.column}
            >
              <Text maxFontSizeMultiplier={1.2} style={styles.value}>
                {item.total > 0 ? formatCompact(item.total) : ''}
              </Text>
              <View style={[styles.barArea, { height: barAreaHeight }]}>
                <View style={[styles.bar, { height }, active && styles.barActive]} />
              </View>
              <Text
                maxFontSizeMultiplier={1.2}
                style={[styles.label, active && styles.labelActive]}
              >
                {monthShort(item.month)}
              </Text>
            </View>
          );
        })}
      </View>
    </Card>
  );
}

const makeStyles = (c: ThemeColors) =>
  StyleSheet.create({
    chart: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
      gap: spacing.sm,
      marginTop: spacing.sm,
    },
    column: { flex: 1, alignItems: 'center', gap: 4 },
    value: { fontSize: 11, color: c.textMuted, height: 14 },
    barArea: { width: '100%', justifyContent: 'flex-end', alignItems: 'center' },
    bar: { width: '70%', borderRadius: radius.md / 2, backgroundColor: c.surfaceTint },
    barActive: { backgroundColor: c.primary },
    label: { fontSize: 12, color: c.textMuted },
    labelActive: { color: c.primary, fontWeight: '700' },
  });
