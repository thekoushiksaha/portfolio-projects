import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';

import { radius, useStyles, useTheme, type ThemeColors } from '@/shared/theme';

type ButtonProps = {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'secondary';
};

export function Button({
  title,
  onPress,
  loading = false,
  disabled = false,
  variant = 'primary',
}: ButtonProps) {
  const { colors } = useTheme();
  const styles = useStyles(makeStyles);
  const primary = variant === 'primary';
  const inactive = loading || disabled;

  return (
    <Pressable
      onPress={onPress}
      disabled={inactive}
      accessibilityRole="button"
      accessibilityState={{ disabled: inactive, busy: loading }}
      style={({ pressed }) => [
        styles.button,
        primary ? styles.primary : styles.secondary,
        pressed && styles.pressed,
        inactive && styles.inactive,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={primary ? colors.onPrimary : colors.primary} />
      ) : (
        <Text
          maxFontSizeMultiplier={1.3}
          style={[styles.text, primary ? styles.textPrimary : styles.textSecondary]}
        >
          {title}
        </Text>
      )}
    </Pressable>
  );
}

const makeStyles = (c: ThemeColors) =>
  StyleSheet.create({
    button: {
      minHeight: 48,
      borderRadius: radius.md,
      paddingVertical: 14,
      paddingHorizontal: 16,
      alignItems: 'center',
      justifyContent: 'center',
    },
    primary: { backgroundColor: c.primary },
    secondary: { borderWidth: 1, borderColor: c.primary, backgroundColor: 'transparent' },
    pressed: { opacity: 0.85 },
    inactive: { opacity: 0.7 },
    text: { fontSize: 16, fontWeight: '600' },
    textPrimary: { color: c.onPrimary },
    textSecondary: { color: c.primary },
  });
