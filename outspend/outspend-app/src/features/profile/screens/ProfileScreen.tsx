import { useState } from 'react';

import { useAuth } from '@/features/auth/AuthProvider';
import {
  Button,
  Card,
  Muted,
  Screen,
  SectionTitle,
  ThemeSwitcher,
  Title,
} from '@/shared/components';

export function ProfileScreen() {
  const { user, signOut } = useAuth();
  const [signingOut, setSigningOut] = useState(false);

  async function onSignOut() {
    setSigningOut(true);
    await signOut(); // the route guard moves the user to the login screen
  }

  return (
    <Screen width="form">
      <Title>Profile</Title>

      <Card tinted>
        <Title>{user?.name}</Title>
        <Muted>{user?.email}</Muted>
        <Muted>Account type: {user?.role === 'ROLE_ADMIN' ? 'Admin' : 'User'}</Muted>
      </Card>

      <SectionTitle>Appearance</SectionTitle>
      <ThemeSwitcher />

      <Button title="Log out" variant="secondary" onPress={onSignOut} loading={signingOut} />
    </Screen>
  );
}
