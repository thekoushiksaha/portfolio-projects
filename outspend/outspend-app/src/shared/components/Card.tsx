import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { radius, spacing, useStyles, type ThemeColors } from '@/shared/theme';

type CardProps = {
  children: ReactNode;
  tinted?: boolean; // the soft coral highlight card
};

export function Card({ children, tinted = false }: CardProps) {
  const styles = useStyles(makeStyles);
  return <View style={[styles.card, tinted && styles.tinted]}>{children}</View>;
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
  });
