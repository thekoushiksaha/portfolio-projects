import { useRouter } from 'expo-router';
import { useState } from 'react';

import { useAuth } from '@/features/auth/AuthProvider';
import { Button, Card, Screen, SectionTitle, Title } from '@/shared/components';

import { MenuRow } from '../components/MenuRow';
import { ProfileHeader } from '../components/ProfileHeader';

export function ProfileScreen() {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const [signingOut, setSigningOut] = useState(false);

  async function onSignOut() {
    setSigningOut(true);
    await signOut(); // the route guard moves the user to the login screen
  }

  return (
    <Screen width="form">
      <Title>Profile</Title>
      <ProfileHeader user={user} />

      <SectionTitle>Account</SectionTitle>
      <Card>
        <MenuRow
          icon="person-outline"
          label="Edit profile"
          onPress={() => router.push('/account/edit-profile')}
        />
        <MenuRow
          icon="key-outline"
          label="Change password"
          onPress={() => router.push('/account/change-password')}
          last
        />
      </Card>

      <SectionTitle>App</SectionTitle>
      <Card>
        <MenuRow
          icon="settings-outline"
          label="Settings"
          onPress={() => router.push('/account/settings')}
        />
        <MenuRow
          icon="information-circle-outline"
          label="About"
          onPress={() => router.push('/account/about')}
        />
        <MenuRow
          icon="chatbubble-ellipses-outline"
          label="Contact us"
          onPress={() => router.push('/account/contact')}
          last
        />
      </Card>

      <Button title="Log out" variant="secondary" onPress={onSignOut} loading={signingOut} />
    </Screen>
  );
}
