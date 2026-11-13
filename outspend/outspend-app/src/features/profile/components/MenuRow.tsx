import { Ionicons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { spacing, useStyles, useTheme, type ThemeColors } from '@/shared/theme';

type IconName = ComponentProps<typeof Ionicons>['name'];

type MenuRowProps = {
  icon: IconName;
  label: string;
  onPress: () => void;
  last?: boolean; // no divider under the last row of a group
};

export function MenuRow({ icon, label, onPress, last = false }: MenuRowProps) {
  const { colors } = useTheme();
  const styles = useStyles(makeStyles);

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={({ pressed }) => [styles.row, !last && styles.divider, pressed && styles.pressed]}
    >
      <View style={styles.icon}>
        <Ionicons name={icon} size={20} color={colors.primary} />
      </View>
      <Text maxFontSizeMultiplier={1.3} style={styles.label}>
        {label}
      </Text>
      <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
    </Pressable>
  );
}

const makeStyles = (c: ThemeColors) =>
  StyleSheet.create({
    row: {
      minHeight: 56,
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
    },
    divider: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: c.border },
    pressed: { opacity: 0.7 },
    icon: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: c.surfaceTint,
      alignItems: 'center',
      justifyContent: 'center',
    },
    label: { flex: 1, fontSize: 16, color: c.text },
  });
