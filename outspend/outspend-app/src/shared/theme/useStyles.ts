import { useMemo } from 'react';

import type { ThemeColors } from './palettes';
import { useTheme } from './ThemeProvider';

// Usage inside a component file:
//   const makeStyles = (c: ThemeColors) => StyleSheet.create({ box: { backgroundColor: c.surface } });
//   const styles = useStyles(makeStyles);
export function useStyles<T>(makeStyles: (colors: ThemeColors) => T): T {
  const { colors } = useTheme();
  return useMemo(() => makeStyles(colors), [makeStyles, colors]);
}
