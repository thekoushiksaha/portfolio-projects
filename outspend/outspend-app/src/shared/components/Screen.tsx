import type { ReactNode } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { contentWidths, useLayout, type ContentWidth } from '@/shared/layout/useLayout';
import { spacing, useStyles, useTheme, type ThemeColors } from '@/shared/theme';

type ScreenProps = {
  children: ReactNode;
  onRefresh?: () => void; // adds pull-to-refresh when provided
  refreshing?: boolean;
  width?: ContentWidth; // 'form' for login-style screens, 'content' (default), 'wide' for dashboards
};

export function Screen({
  children,
  onRefresh,
  refreshing = false,
  width = 'content',
}: ScreenProps) {
  const { colors } = useTheme();
  const { horizontalPadding } = useLayout();
  const styles = useStyles(makeStyles);

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          refreshControl={
            onRefresh ? (
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor={colors.primary}
                colors={[colors.primary]}
              />
            ) : undefined
          }
        >
          <View
            style={[
              styles.content,
              { maxWidth: contentWidths[width], paddingHorizontal: horizontalPadding },
            ]}
          >
            {children}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const makeStyles = (c: ThemeColors) =>
  StyleSheet.create({
    safe: { flex: 1, backgroundColor: c.background },
    flex: { flex: 1 },
    scroll: { flexGrow: 1, alignItems: 'center' },
    content: { width: '100%', paddingVertical: spacing.lg, gap: spacing.md },
  });
