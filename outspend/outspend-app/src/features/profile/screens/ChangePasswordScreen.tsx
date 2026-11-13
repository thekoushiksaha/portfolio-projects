import { ComponentRef, useRef, useState } from 'react';
import { Text, type TextInput } from 'react-native';

import { useAuth } from '@/features/auth/AuthProvider';
import { toFormErrors } from '@/shared/api/errors';
import { Button, Dialog, ErrorBanner, Screen, SwitchRow, TextField } from '@/shared/components';
import { useStyles, type ThemeColors } from '@/shared/theme';
import { StyleSheet } from 'react-native';

import { profileApi } from '../api';

export function ChangePasswordScreen() {
  const { signOut } = useAuth();
  const styles = useStyles(makeStyles);
  const newRef = useRef<ComponentRef<typeof TextInput>>(null);
  const confirmRef = useRef<ComponentRef<typeof TextInput>>(null);

  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [show, setShow] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);

  async function onSave() {
    if (saving) {
      return;
    }

    const found: Record<string, string> = {};
    if (!current) {
      found.currentPassword = 'Enter your current password';
    }
    if (!next) {
      found.newPassword = 'Enter a new password';
    } else if (next === current) {
      found.newPassword = 'Choose a password different from the current one';
    }
    if (confirm !== next) {
      found.confirmPassword = 'The passwords do not match';
    }
    if (Object.keys(found).length > 0) {
      setError(null);
      setFieldErrors(found);
      return;
    }

    setError(null);
    setFieldErrors({});
    setSaving(true);
    try {
      await profileApi.changePassword(current, next);
      setDone(true);
    } catch (e) {
      const { message, fields } = toFormErrors(e);
      setError(message);
      setFieldErrors(fields);
    } finally {
      setSaving(false);
    }
  }

  // After a password change every session ends, so go back to the login screen.
  async function finish() {
    await signOut();
  }

  return (
    <>
      <Screen hasHeader width="form">
        <ErrorBanner message={error} />

        <TextField
          label="Current password"
          value={current}
          onChangeText={setCurrent}
          secureTextEntry={!show}
          autoCapitalize="none"
          textContentType="password"
          autoComplete="current-password"
          returnKeyType="next"
          onSubmitEditing={() => newRef.current?.focus()}
          error={fieldErrors.currentPassword}
        />
        <TextField
          inputRef={newRef}
          label="New password"
          value={next}
          onChangeText={setNext}
          secureTextEntry={!show}
          autoCapitalize="none"
          textContentType="newPassword"
          autoComplete="new-password"
          returnKeyType="next"
          onSubmitEditing={() => confirmRef.current?.focus()}
          error={fieldErrors.newPassword}
        />
        <TextField
          inputRef={confirmRef}
          label="Confirm new password"
          value={confirm}
          onChangeText={setConfirm}
          secureTextEntry={!show}
          autoCapitalize="none"
          textContentType="newPassword"
          autoComplete="new-password"
          returnKeyType="go"
          onSubmitEditing={onSave}
          error={fieldErrors.confirmPassword}
        />

        <SwitchRow label="Show passwords" value={show} onValueChange={setShow} />

        <Button title="Change password" onPress={onSave} loading={saving} />
      </Screen>

      <Dialog visible={done} title="Password changed" onClose={finish}>
        <Text maxFontSizeMultiplier={1.3} style={styles.message}>
          For your security you have been signed out everywhere. Log in again with your new
          password.
        </Text>
        <Button title="Log in again" onPress={finish} />
      </Dialog>
    </>
  );
}

const makeStyles = (c: ThemeColors) =>
  StyleSheet.create({
    message: { fontSize: 15, color: c.textMuted },
  });
