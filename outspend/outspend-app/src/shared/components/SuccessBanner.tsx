import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { radius, spacing, useStyles, useTheme, type ThemeColors } from '@/shared/theme';

export function SuccessBanner({ message }: { message: string | null }) {
  const { colors } = useTheme();
  const styles = useStyles(makeStyles);

  if (!message) {
    return null;
  }
  return (
    <View accessibilityRole="alert" accessibilityLiveRegion="polite" style={styles.banner}>
      <Ionicons name="checkmark-circle" size={20} color={colors.success} />
      <Text maxFontSizeMultiplier={1.3} style={styles.text}>
        {message}
      </Text>
    </View>
  );
}

const makeStyles = (c: ThemeColors) =>
  StyleSheet.create({
    banner: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
      padding: spacing.md,
      borderRadius: radius.md,
      borderWidth: 1,
      borderColor: c.success,
      backgroundColor: c.surface,
    },
    text: { flex: 1, fontSize: 14, color: c.text },
  });
