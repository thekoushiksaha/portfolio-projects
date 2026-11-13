import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { radius, spacing, useStyles, type ThemeColors } from '@/shared/theme';

type CardProps = {
  children: ReactNode;
  tinted?: boolean; // the soft coral highlight card
  fill?: boolean; // grow to the height of the row it sits in
};

export function Card({ children, tinted = false, fill = false }: CardProps) {
  const styles = useStyles(makeStyles);
  return (
    <View style={[styles.card, tinted && styles.tinted, fill && styles.fill]}>{children}</View>
  );
}

const makeStyles = (c: ThemeColors) =>
  StyleSheet.create({
    card: {
      backgroundColor: c.surface,
      borderWidth: 1,
      borderColor: c.border,
      borderRadius: radius.lg,
      padding: spacing.md,
      gap: spacing.xs,
    },
    tinted: { backgroundColor: c.surfaceTint, borderColor: c.surfaceTint },
    fill: { flexGrow: 1 },
  });
