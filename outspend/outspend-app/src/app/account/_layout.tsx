import { Redirect, Stack } from 'expo-router';

import { useAuth } from '@/features/auth/AuthProvider';
import { LoadingView } from '@/shared/components';
import { useTheme } from '@/shared/theme';

export default function AccountLayout() {
  const { status } = useAuth();
  const { colors } = useTheme();

  if (status === 'loading') {
    return <LoadingView />;
  }
  if (status === 'signedOut') {
    return <Redirect href="/login" />;
  }

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.primary,
        headerTitleStyle: { color: colors.text },
        headerShadowVisible: false,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="edit-profile" options={{ title: 'Edit profile' }} />
      <Stack.Screen name="change-password" options={{ title: 'Change password' }} />
      <Stack.Screen name="settings" options={{ title: 'Settings' }} />
      <Stack.Screen name="about" options={{ title: 'About' }} />
      <Stack.Screen name="contact" options={{ title: 'Contact us' }} />
      <Stack.Screen name="messages" options={{ title: 'Contact messages' }} />
    </Stack>
  );
}

export { AppErrorBoundary as ErrorBoundary } from '@/shared/components/AppErrorBoundary';
