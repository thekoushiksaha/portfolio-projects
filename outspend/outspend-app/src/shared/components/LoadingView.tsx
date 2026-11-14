import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { spacing, typography, useStyles, useTheme, type ThemeColors } from '@/shared/theme';

import { FadeInView } from './FadeInView';
import { Logo } from './Logo';

export function LoadingView({ message = 'Loading...' }: { message?: string }) {
  const { colors } = useTheme();
  const styles = useStyles(makeStyles);

  return (
    <View style={styles.container}>
      <FadeInView style={styles.brand}>
        <Logo size={96} />
        <Text accessibilityRole="header" maxFontSizeMultiplier={1.2} style={styles.name}>
          OutSpend
        </Text>
      </FadeInView>

      <ActivityIndicator size="small" color={colors.primary} />
      <Text accessibilityLiveRegion="polite" maxFontSizeMultiplier={1.3} style={styles.text}>
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
    brand: { alignItems: 'center', gap: spacing.sm, marginBottom: spacing.md },
    name: { fontSize: 28, fontWeight: '700', color: c.text },
    text: { ...typography.small, color: c.textMuted, textAlign: 'center' },
  });
