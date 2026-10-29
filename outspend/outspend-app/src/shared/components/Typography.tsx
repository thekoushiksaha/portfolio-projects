import type { ReactNode } from 'react';
import { StyleSheet, Text } from 'react-native';

import { typography, useStyles, type ThemeColors } from '@/shared/theme';

type TextProps = { children: ReactNode };

const MAX_FONT_SCALE = 1.3;

export function Title({ children }: TextProps) {
  const styles = useStyles(makeStyles);
  return (
    <Text accessibilityRole="header" maxFontSizeMultiplier={MAX_FONT_SCALE} style={styles.title}>
      {children}
    </Text>
  );
}

export function SectionTitle({ children }: TextProps) {
  const styles = useStyles(makeStyles);
  return (
    <Text accessibilityRole="header" maxFontSizeMultiplier={MAX_FONT_SCALE} style={styles.section}>
      {children}
    </Text>
  );
}

export function Body({ children }: TextProps) {
  const styles = useStyles(makeStyles);
  return (
    <Text maxFontSizeMultiplier={MAX_FONT_SCALE} style={styles.body}>
      {children}
    </Text>
  );
}

export function Muted({ children }: TextProps) {
  const styles = useStyles(makeStyles);
  return (
    <Text maxFontSizeMultiplier={MAX_FONT_SCALE} style={styles.muted}>
      {children}
    </Text>
  );
}

const makeStyles = (c: ThemeColors) =>
  StyleSheet.create({
    title: { ...typography.title, color: c.text },
    section: { ...typography.section, color: c.text, marginTop: 8 },
    body: { ...typography.body, color: c.text },
    muted: { ...typography.small, color: c.textMuted },
  });
