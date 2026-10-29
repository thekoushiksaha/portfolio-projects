import { StyleSheet, Text, View } from 'react-native';

import { radius, spacing, useStyles, type ThemeColors } from '@/shared/theme';

export function ErrorBanner({ message }: { message: string | null }) {
  const styles = useStyles(makeStyles);

  if (!message) {
    return null;
  }
  return (
    <View accessibilityRole="alert" style={styles.banner}>
      <Text maxFontSizeMultiplier={1.3} style={styles.text}>
        {message}
      </Text>
    </View>
  );
}

const makeStyles = (c: ThemeColors) =>
  StyleSheet.create({
    banner: { backgroundColor: c.surfaceTint, borderRadius: radius.md, padding: spacing.md },
    text: { color: c.onTint, fontSize: 14 },
  });
