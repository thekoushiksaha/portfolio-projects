import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { categoryInfo } from '@/shared/domain/categories';
import { formatDate } from '@/shared/lib/dates';
import { formatMoney } from '@/shared/lib/format';
import { radius, spacing, useStyles, useTheme, type ThemeColors } from '@/shared/theme';

import type { Expense } from '../types';

type ExpenseRowProps = {
  expense: Expense;
  onPress: () => void;
  onDelete: () => void;
};

export function ExpenseRow({ expense, onPress, onDelete }: ExpenseRowProps) {
  const { colors } = useTheme();
  const styles = useStyles(makeStyles);
  const info = categoryInfo(expense.category);
  const title = expense.note?.trim() || info.label;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${title}, ${info.label}, ${formatMoney(expense.amount)}, ${formatDate(expense.expenseDate)}. Tap to edit`}
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}
    >
      <View style={styles.icon}>
        <Ionicons name={info.icon} size={20} color={colors.primary} />
      </View>

      <View style={styles.body}>
        <Text numberOfLines={1} maxFontSizeMultiplier={1.3} style={styles.title}>
          {title}
        </Text>
        <Text numberOfLines={1} maxFontSizeMultiplier={1.3} style={styles.subtitle}>
          {info.label} · {formatDate(expense.expenseDate)}
        </Text>
      </View>

      <Text maxFontSizeMultiplier={1.3} style={styles.amount}>
        {formatMoney(expense.amount)}
      </Text>

      <Pressable
        onPress={onDelete}
        accessibilityRole="button"
        accessibilityLabel="Delete expense"
        hitSlop={4}
        style={styles.delete}
      >
        <Ionicons name="trash-outline" size={20} color={colors.textMuted} />
      </Pressable>
    </Pressable>
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
    pressed: { opacity: 0.85 },
    icon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: c.surfaceTint,
      alignItems: 'center',
      justifyContent: 'center',
    },
    body: { flex: 1, gap: 2 },
    title: { fontSize: 15, fontWeight: '600', color: c.text },
    subtitle: { fontSize: 13, color: c.textMuted },
    amount: { fontSize: 15, fontWeight: '600', color: c.text },
    delete: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  });
