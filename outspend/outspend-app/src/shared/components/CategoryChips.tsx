import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { CATEGORIES, type Category } from '@/shared/domain/categories';
import { radius, spacing, useStyles, useTheme, type ThemeColors } from '@/shared/theme';

type CategoryChipsProps = {
  value: Category | null;
  onChange: (value: Category | null) => void;
  label?: string;
  allowAll?: boolean; // adds a first chip that means "no category"
  allLabel?: string;
  error?: string;
};

export function CategoryChips({
  value,
  onChange,
  label,
  allowAll = false,
  allLabel = 'All',
  error,
}: CategoryChipsProps) {
  const { colors } = useTheme();
  const styles = useStyles(makeStyles);

  const options = [
    ...(allowAll ? [{ value: null, label: allLabel, icon: 'apps' as const }] : []),
    ...CATEGORIES,
  ];

  return (
    <View style={styles.field}>
      {label ? (
        <Text maxFontSizeMultiplier={1.3} style={styles.label}>
          {label}
        </Text>
      ) : null}

      <View accessibilityRole="radiogroup" style={styles.wrap}>
        {options.map((option) => {
          const selected = option.value === value;
          return (
            <Pressable
              key={option.label}
              onPress={() => onChange(option.value)}
              accessibilityRole="radio"
              accessibilityState={{ selected }}
              style={[styles.chip, selected && styles.chipSelected]}
            >
              <Ionicons
                name={option.icon}
                size={16}
                color={selected ? colors.onPrimary : colors.textMuted}
              />
              <Text
                maxFontSizeMultiplier={1.3}
                style={[styles.chipText, selected && styles.chipTextSelected]}
              >
                {option.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const makeStyles = (c: ThemeColors) =>
  StyleSheet.create({
    field: { gap: spacing.xs },
    label: { fontSize: 14, fontWeight: '600', color: c.text },
    wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
    chip: {
      minHeight: 40,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      paddingHorizontal: 14,
      borderRadius: radius.pill,
      borderWidth: 1,
      borderColor: c.border,
      backgroundColor: c.surface,
    },
    chipSelected: { backgroundColor: c.primary, borderColor: c.primary },
    chipText: { fontSize: 14, fontWeight: '600', color: c.text },
    chipTextSelected: { color: c.onPrimary },
    error: { fontSize: 12, color: c.danger },
  });
