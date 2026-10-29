import { Ionicons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import {
  radius,
  useStyles,
  useTheme,
  type ThemeColors,
  type ThemePreference,
} from '@/shared/theme';

type IconName = ComponentProps<typeof Ionicons>['name'];

const OPTIONS: { value: ThemePreference; label: string; icon: IconName }[] = [
  { value: 'system', label: 'System', icon: 'phone-portrait-outline' },
  { value: 'light', label: 'Light', icon: 'sunny-outline' },
  { value: 'dark', label: 'Dark', icon: 'moon-outline' },
];

export function ThemeSwitcher() {
  const { colors, preference, setPreference } = useTheme();
  const styles = useStyles(makeStyles);

  return (
    <View accessibilityRole="radiogroup" style={styles.row}>
      {OPTIONS.map((option) => {
        const selected = option.value === preference;
        return (
          <Pressable
            key={option.value}
            onPress={() => setPreference(option.value)}
            accessibilityRole="radio"
            accessibilityState={{ selected }}
            style={[styles.option, selected && styles.optionSelected]}
          >
            <Ionicons
              name={option.icon}
              size={20}
              color={selected ? colors.onPrimary : colors.textMuted}
            />
            <Text
              maxFontSizeMultiplier={1.3}
              style={[styles.label, selected && styles.labelSelected]}
            >
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const makeStyles = (c: ThemeColors) =>
  StyleSheet.create({
    row: {
      flexDirection: 'row',
      gap: 4,
      padding: 4,
      borderRadius: radius.md,
      borderWidth: 1,
      borderColor: c.border,
      backgroundColor: c.surface,
    },
    option: {
      flex: 1,
      minHeight: 44,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6,
      borderRadius: 8,
    },
    optionSelected: { backgroundColor: c.primary },
    label: { fontSize: 14, fontWeight: '600', color: c.textMuted },
    labelSelected: { color: c.onPrimary },
  });
