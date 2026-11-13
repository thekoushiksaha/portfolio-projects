import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';

import { radius, useStyles, useTheme, type ThemeColors } from '@/shared/theme';

type ButtonProps = {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'danger';
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
  const inactive = loading || disabled;
  const outlined = variant === 'secondary';
  const spinnerColor =
    variant === 'secondary'
      ? colors.primary
      : variant === 'danger'
        ? colors.onDanger
        : colors.onPrimary;

  return (
    <Pressable
      onPress={onPress}
      disabled={inactive}
      accessibilityRole="button"
      accessibilityState={{ disabled: inactive, busy: loading }}
      style={({ pressed }) => [
        styles.button,
        styles[variant],
        pressed && styles.pressed,
        inactive && styles.inactive,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={spinnerColor} />
      ) : (
        <Text
          maxFontSizeMultiplier={1.3}
          style={[styles.text, outlined ? styles.textOutlined : styles[`${variant}Text`]]}
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
    danger: { backgroundColor: c.danger },
    pressed: { opacity: 0.85 },
    inactive: { opacity: 0.7 },
    text: { fontSize: 16, fontWeight: '600' },
    primaryText: { color: c.onPrimary },
    secondaryText: { color: c.primary },
    dangerText: { color: c.onDanger },
    textOutlined: { color: c.primary },
  });
