import { useState } from 'react';

import { useAuth } from '@/features/auth/AuthProvider';
import { toFormErrors } from '@/shared/api/errors';
import { Button, ErrorBanner, Muted, Screen, SuccessBanner, TextField } from '@/shared/components';

import { profileApi } from '../api';

export function EditProfileScreen() {
  const { user, updateUser } = useAuth();
  const [name, setName] = useState(user?.name ?? '');
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const unchanged = name.trim() === (user?.name ?? '');

  async function onSave() {
    if (saving) {
      return;
    }
    if (!name.trim()) {
      setError(null);
      setFieldErrors({ name: 'Enter your name' });
      return;
    }

    setError(null);
    setFieldErrors({});
    setSaved(false);
    setSaving(true);
    try {
      const updated = await profileApi.updateName(name.trim());
      updateUser(updated);
      setName(updated.name);
      setSaved(true);
    } catch (e) {
      const { message, fields } = toFormErrors(e);
      setError(message);
      setFieldErrors(fields);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Screen hasHeader width="form">
      <SuccessBanner message={saved ? 'Profile updated' : null} />
      <ErrorBanner message={error} />

      <TextField
        label="Name"
        value={name}
        onChangeText={(text) => {
          setName(text);
          setSaved(false);
        }}
        autoCapitalize="words"
        textContentType="name"
        returnKeyType="done"
        onSubmitEditing={onSave}
        error={fieldErrors.name}
      />

      <TextField
        label="Email"
        value={user?.email ?? ''}
        editable={false}
        style={{ opacity: 0.6 }}
      />
      <Muted>Your email is your login, so it cannot be changed here.</Muted>

      <Button title="Save changes" onPress={onSave} loading={saving} disabled={unchanged} />
    </Screen>
  );
}
