import { Ionicons } from '@expo/vector-icons';
import { Redirect, Tabs } from 'expo-router';

import { useAuth } from '@/features/auth/AuthProvider';
import { LoadingView } from '@/shared/components';
import { useLayout } from '@/shared/layout/useLayout';
import { useTheme } from '@/shared/theme';
import { Platform, Pressable } from 'react-native';

export default function TabsLayout() {
  const { status } = useAuth();
  const { colors } = useTheme();
  const { isCompact } = useLayout();

  if (status === 'loading') {
    return <LoadingView message="Loading... the server may take a minute to wake up." />;
  }
  if (status === 'signedOut') {
    return <Redirect href="/login" />;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarPosition: isCompact ? 'bottom' : 'left',
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          borderRightColor: colors.border,
          padding: 4,
        },
        sceneStyle: { backgroundColor: colors.background },
        tabBarButton: ({ ref, style, ...props }) => (
          <Pressable
            {...props}
            android_ripple={{
              color: colors.surfaceTint,
              borderless: false,
            }}
            style={({ pressed }) => [style, Platform.OS === 'ios' && pressed && { opacity: 0.7 }]}
          />
        ),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Summary',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="pie-chart" color={String(color)} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="add"
        options={{
          title: 'Update',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="add-circle" color={String(color)} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'History',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="time" color={String(color)} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="limits"
        options={{
          title: 'Limits',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="speedometer" color={String(color)} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" color={String(color)} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}

export { AppErrorBoundary as ErrorBoundary } from '@/shared/components/AppErrorBoundary';
