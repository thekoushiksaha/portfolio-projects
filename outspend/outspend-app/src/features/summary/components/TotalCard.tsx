import { StyleSheet, Text } from 'react-native';

import { Card } from '@/shared/components';
import { monthLabel } from '@/shared/lib/dates';
import { formatMoney } from '@/shared/lib/format';
import { useStyles, type ThemeColors } from '@/shared/theme';

import type { Summary } from '../types';

function compareWithPrevious(total: number, previous: number): string {
  if (previous === 0) {
    return total === 0 ? 'No spending yet' : 'Nothing was spent the month before';
  }
  const change = ((total - previous) / previous) * 100;
  if (Math.abs(change) < 0.5) {
    return 'About the same as the month before';
  }
  return `${Math.abs(change).toFixed(0)}% ${change > 0 ? 'more' : 'less'} than the month before`;
}

export function TotalCard({ summary }: { summary: Summary }) {
  const styles = useStyles(makeStyles);

  return (
    <Card tinted fill>
      <Text maxFontSizeMultiplier={1.3} style={styles.caption}>
        Spent in {monthLabel(summary.month)}
      </Text>
      <Text accessibilityRole="header" maxFontSizeMultiplier={1.2} style={styles.total}>
        {formatMoney(summary.totalSpent)}
      </Text>
      <Text maxFontSizeMultiplier={1.3} style={styles.caption}>
        {compareWithPrevious(summary.totalSpent, summary.previousMonthTotal)}
      </Text>
    </Card>
  );
}

const makeStyles = (c: ThemeColors) =>
  StyleSheet.create({
    caption: { fontSize: 14, color: c.onTint },
    total: { fontSize: 34, fontWeight: '700', color: c.onTint },
  });
