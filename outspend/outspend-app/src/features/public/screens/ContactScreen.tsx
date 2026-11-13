import { useRef, useState } from 'react';

import { useAuth } from '@/features/auth/AuthProvider';
import { toFormErrors } from '@/shared/api/errors';
import {
  Button,
  ErrorBanner,
  Muted,
  Screen,
  SuccessBanner,
  TextField,
  TextInputHandle,
} from '@/shared/components';

import { publicApi } from '../api';

const MAX_MESSAGE = 2000;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function ContactScreen() {
  const { user } = useAuth();
  const emailRef = useRef<TextInputHandle>(null);
  const messageRef = useRef<TextInputHandle>(null);

  const [name, setName] = useState(user?.name ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [message, setMessage] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  async function onSend() {
    if (sending) {
      return;
    }

    const found: Record<string, string> = {};
    if (!name.trim()) {
      found.name = 'Enter your name';
    }
    if (!EMAIL_PATTERN.test(email.trim())) {
      found.email = 'Enter a valid email';
    }
    if (!message.trim()) {
      found.message = 'Write a message';
    }
    if (Object.keys(found).length > 0) {
      setError(null);
      setSent(false);
      setFieldErrors(found);
      return;
    }

    setError(null);
    setFieldErrors({});
    setSent(false);
    setSending(true);
    try {
      await publicApi.contact({
        name: name.trim(),
        email: email.trim(),
        message: message.trim(),
      });
      setMessage('');
      setSent(true);
    } catch (e) {
      const { message: text, fields } = toFormErrors(e);
      setError(text);
      setFieldErrors(fields);
    } finally {
      setSending(false);
    }
  }

  return (
    <Screen hasHeader width="form">
      <Muted>
        Questions, feedback or a bug to report? Send a message and it reaches the developer.
      </Muted>

      <SuccessBanner message={sent ? 'Thanks! Your message has been received.' : null} />
      <ErrorBanner message={error} />

      <TextField
        label="Name"
        value={name}
        onChangeText={setName}
        autoCapitalize="words"
        textContentType="name"
        returnKeyType="next"
        onSubmitEditing={() => emailRef.current?.focus()}
        error={fieldErrors.name}
      />
      <TextField
        inputRef={emailRef}
        label="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="email-address"
        textContentType="emailAddress"
        returnKeyType="next"
        onSubmitEditing={() => messageRef.current?.focus()}
        error={fieldErrors.email}
      />
      <TextField
        inputRef={messageRef}
        label="Message"
        value={message}
        onChangeText={(text) => {
          setMessage(text);
          setSent(false);
        }}
        placeholder="Write your message here"
        multiline
        maxLength={MAX_MESSAGE}
        style={{ minHeight: 140, textAlignVertical: 'top' }}
        error={fieldErrors.message}
      />
      <Muted>{`${message.length} / ${MAX_MESSAGE}`}</Muted>

      <Button title="Send message" onPress={onSend} loading={sending} />
    </Screen>
  );
}
