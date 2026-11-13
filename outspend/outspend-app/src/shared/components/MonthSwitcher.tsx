import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { currentMonth, monthLabel, shiftMonth } from '@/shared/lib/dates';
import { radius, useStyles, useTheme, type ThemeColors } from '@/shared/theme';

type MonthSwitcherProps = {
  month: string; // yyyy-MM
  onChange: (month: string) => void;
};

export function MonthSwitcher({ month, onChange }: MonthSwitcherProps) {
  const { colors } = useTheme();
  const styles = useStyles(makeStyles);
  const atCurrentMonth = month === currentMonth();

  return (
    <View style={styles.row}>
      <Pressable
        onPress={() => onChange(shiftMonth(month, -1))}
        accessibilityRole="button"
        accessibilityLabel="Previous month"
        hitSlop={8}
        style={styles.arrow}
      >
        <Ionicons name="chevron-back" size={24} color={colors.primary} />
      </Pressable>

      <Text accessibilityRole="header" maxFontSizeMultiplier={1.3} style={styles.label}>
        {monthLabel(month)}
      </Text>

      <Pressable
        onPress={() => onChange(shiftMonth(month, 1))}
        disabled={atCurrentMonth}
        accessibilityRole="button"
        accessibilityLabel="Next month"
        accessibilityState={{ disabled: atCurrentMonth }}
        hitSlop={8}
        style={styles.arrow}
      >
        <Ionicons
          name="chevron-forward"
          size={24}
          color={atCurrentMonth ? colors.border : colors.primary}
        />
      </Pressable>
    </View>
  );
}

const makeStyles = (c: ThemeColors) =>
  StyleSheet.create({
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderWidth: 1,
      borderColor: c.border,
      borderRadius: radius.md,
      backgroundColor: c.surface,
    },
    arrow: { width: 48, height: 48, alignItems: 'center', justifyContent: 'center' },
    label: { fontSize: 17, fontWeight: '600', color: c.text },
  });
