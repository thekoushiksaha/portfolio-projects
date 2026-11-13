import { Stack, useRouter } from 'expo-router';
import { useCallback } from 'react';

import { Button, ErrorBanner, LoadingView, Screen } from '@/shared/components';
import { useLoad } from '@/shared/hooks/useLoad';

import { expensesApi } from '../api';
import { ExpenseForm } from '../components/ExpenseForm';
import type { ExpenseInput } from '../types';

export function EditExpenseScreen({ id }: { id: number }) {
  const router = useRouter();
  const load = useCallback(() => expensesApi.get(id), [id]);
  const { data: expense, error, loading, reload } = useLoad(load);

  async function handleSubmit(input: ExpenseInput) {
    await expensesApi.update(id, input);
    router.back();
  }

  async function handleDelete() {
    await expensesApi.remove(id);
    router.back();
  }

  if (loading && !expense) {
    return (
      <>
        <Stack.Screen options={{ title: 'Edit expense' }} />
        <LoadingView />
      </>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: 'Edit expense' }} />
      <Screen hasHeader width="form">
        <ErrorBanner message={error} />
        {error && !expense ? (
          <Button title="Try again" variant="secondary" onPress={reload} />
        ) : null}

        {expense ? (
          <ExpenseForm
            initial={expense}
            submitLabel="Save changes"
            onSubmit={handleSubmit}
            onDelete={handleDelete}
          />
        ) : null}
      </Screen>
    </>
  );
}
