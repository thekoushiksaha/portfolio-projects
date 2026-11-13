import type { ReactNode } from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useStyles, type ThemeColors } from '@/shared/theme';

type SafeScreenProps = {
  children: ReactNode;
  hasHeader?: boolean; // true when a navigation header already covers the top of the screen
};

export function SafeScreen({ children, hasHeader = false }: SafeScreenProps) {
  const styles = useStyles(makeStyles);

  return (
    <SafeAreaView
      style={styles.safe}
      edges={hasHeader ? ['left', 'right'] : ['top', 'left', 'right']}
    >
      {children}
    </SafeAreaView>
  );
}

const makeStyles = (c: ThemeColors) =>
  StyleSheet.create({
    safe: { flex: 1, backgroundColor: c.background },
  });
