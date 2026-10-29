import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { spacing, typography, useStyles, useTheme, type ThemeColors } from '@/shared/theme';

export function LoadingView({ message = 'Loading...' }: { message?: string }) {
  const { colors } = useTheme();
  const styles = useStyles(makeStyles);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={colors.primary} />
      <Text maxFontSizeMultiplier={1.3} style={styles.text}>
        {message}
      </Text>
    </View>
  );
}

const makeStyles = (c: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing.md,
      padding: spacing.lg,
      backgroundColor: c.background,
    },
    text: { ...typography.small, color: c.textMuted, textAlign: 'center' },
  });
