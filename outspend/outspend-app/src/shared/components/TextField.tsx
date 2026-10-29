import { StyleSheet, Text, TextInput, View, type TextInputProps } from 'react-native';

import { radius, spacing, useStyles, useTheme, type ThemeColors } from '@/shared/theme';

type TextFieldProps = TextInputProps & {
  label: string;
  error?: string; // shown under the field, for example a server validation message
};

export function TextField({ label, error, style, ...inputProps }: TextFieldProps) {
  const { colors, scheme } = useTheme();
  const styles = useStyles(makeStyles);

  return (
    <View style={styles.field}>
      <Text maxFontSizeMultiplier={1.3} style={styles.label}>
        {label}
      </Text>
      <TextInput
        placeholderTextColor={colors.textMuted}
        keyboardAppearance={scheme === 'dark' ? 'dark' : 'light'}
        maxFontSizeMultiplier={1.3}
        style={[styles.input, error ? styles.inputError : null, style]}
        {...inputProps}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const makeStyles = (c: ThemeColors) =>
  StyleSheet.create({
    field: { gap: spacing.xs },
    label: { fontSize: 14, fontWeight: '600', color: c.text },
    input: {
      minHeight: 48,
      borderWidth: 1,
      borderColor: c.border,
      borderRadius: radius.md,
      paddingHorizontal: spacing.md,
      paddingVertical: 12,
      fontSize: 16,
      color: c.text,
      backgroundColor: c.surface,
    },
    inputError: { borderColor: c.danger },
    error: { fontSize: 12, color: c.danger },
  });
