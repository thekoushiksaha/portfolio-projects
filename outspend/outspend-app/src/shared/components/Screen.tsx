import type { ReactNode } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

import { useContentStyle } from '@/shared/layout/useContentStyle';
import type { ContentWidth } from '@/shared/layout/useLayout';
import { useTheme } from '@/shared/theme';

import { SafeScreen } from './SafeScreen';

type ScreenProps = {
  children: ReactNode;
  onRefresh?: () => void; // adds pull-to-refresh when provided
  refreshing?: boolean;
  width?: ContentWidth; // 'form' for forms, 'content' (default), 'wide' for dashboards and lists
  hasHeader?: boolean; // true on screens that show a navigation header
};

export function Screen({
  children,
  onRefresh,
  refreshing = false,
  width = 'content',
  hasHeader = false,
}: ScreenProps) {
  const { colors } = useTheme();
  const contentStyle = useContentStyle(width);

  return (
    <SafeScreen hasHeader={hasHeader}>
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
          <View style={contentStyle}>{children}</View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  scroll: { flexGrow: 1 },
});
