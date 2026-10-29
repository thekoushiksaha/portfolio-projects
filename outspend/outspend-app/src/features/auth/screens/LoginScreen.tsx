import { useRef, useState } from 'react';

import type { TextInputHandle } from '@/shared/components';

import { toFormErrors } from '@/shared/api/errors';
import { Button, ErrorBanner, Screen, TextField } from '@/shared/components';

import { AuthHeader } from '../components/AuthHeader';
import { AuthSwitchLink } from '../components/AuthSwitchLink';
import { useAuth } from '../AuthProvider';

export function LoginScreen() {
  const { signIn } = useAuth();
  const passwordRef = useRef<TextInputHandle>(null);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  async function onSubmit() {
    if (loading) {
      return;
    }

    const missing: Record<string, string> = {};
    if (!email.trim()) {
      missing.email = 'Enter your email';
    }
    if (!password) {
      missing.password = 'Enter your password';
    }
    if (Object.keys(missing).length > 0) {
      setError(null);
      setFieldErrors(missing);
      return;
    }

    setError(null);
    setFieldErrors({});
    setLoading(true);
    try {
      await signIn({ email, password });
      // On success the route guard moves the user to the tabs automatically.
    } catch (e) {
      const { message, fields } = toFormErrors(e);
      setError(message);
      setFieldErrors(fields);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Screen width="form">
      <AuthHeader title="OutSpend" subtitle="Track what you spend" />

      <ErrorBanner message={error} />

      <TextField
        label="Email"
        value={email}
        onChangeText={setEmail}
        placeholder="you@example.com"
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="email-address"
        textContentType="emailAddress"
        autoComplete="email"
        returnKeyType="next"
        onSubmitEditing={() => passwordRef.current?.focus()}
        error={fieldErrors.email}
      />
      <TextField
        inputRef={passwordRef}
        label="Password"
        value={password}
        onChangeText={setPassword}
        placeholder="Your password"
        secureTextEntry
        autoCapitalize="none"
        textContentType="password"
        autoComplete="current-password"
        returnKeyType="go"
        onSubmitEditing={onSubmit}
        error={fieldErrors.password}
      />

      <Button title="Log in" onPress={onSubmit} loading={loading} />

      <AuthSwitchLink prompt="New here?" linkLabel="Create account" href="/register" />
    </Screen>
  );
}
