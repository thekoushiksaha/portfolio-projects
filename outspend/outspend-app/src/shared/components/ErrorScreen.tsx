import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { spacing, typography, useStyles, useTheme, type ThemeColors } from '@/shared/theme';

import { Button } from './Button';
import { SafeScreen } from './SafeScreen';

type ErrorScreenProps = {
  title?: string;
  message?: string;
  detail?: string; // technical text, shown only while developing
  onRetry: () => void;
};

export function ErrorScreen({
  title = 'Something went wrong',
  message = 'An unexpected problem stopped this screen from loading. Your data is safe.',
  detail,
  onRetry,
}: ErrorScreenProps) {
  const { colors } = useTheme();
  const styles = useStyles(makeStyles);

  return (
    <SafeScreen>
      <View style={styles.container}>
        <Ionicons name="alert-circle-outline" size={56} color={colors.primary} />
        <Text accessibilityRole="header" maxFontSizeMultiplier={1.3} style={styles.title}>
          {title}
        </Text>
        <Text maxFontSizeMultiplier={1.3} style={styles.message}>
          {message}
        </Text>
        {detail ? <Text style={styles.detail}>{detail}</Text> : null}
        <View style={styles.button}>
          <Button title="Try again" onPress={onRetry} />
        </View>
      </View>
    </SafeScreen>
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
    },
    title: { ...typography.title, color: c.text, textAlign: 'center' },
    message: { ...typography.body, color: c.textMuted, textAlign: 'center', maxWidth: 420 },
    detail: { ...typography.caption, color: c.textMuted, textAlign: 'center' },
    button: { width: '100%', maxWidth: 320, marginTop: spacing.sm },
  });
