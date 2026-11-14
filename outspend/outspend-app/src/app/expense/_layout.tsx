import { Redirect, Stack } from 'expo-router';

import { useAuth } from '@/features/auth/AuthProvider';
import { LoadingView } from '@/shared/components';
import { useTheme } from '@/shared/theme';

export default function ExpenseLayout() {
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
    />
  );
}

export { AppErrorBoundary as ErrorBoundary } from '@/shared/components/AppErrorBoundary';
