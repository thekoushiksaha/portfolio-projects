import { Redirect, Stack } from 'expo-router';

import { useAuth } from '@/features/auth/AuthProvider';
import { LoadingView } from '@/shared/components';
import { useTheme } from '@/shared/theme';

export default function AuthLayout() {
  const { status } = useAuth();
  const { colors } = useTheme();

  if (status === 'loading') {
    return <LoadingView message="Loading... the server may take a minute to wake up." />;
  }
  if (status === 'signedIn') {
    return <Redirect href="/" />;
  }

  return (
    <Stack
      screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.background } }}
    />
  );
}
