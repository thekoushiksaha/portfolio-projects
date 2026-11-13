import { useState } from 'react';
import { View } from 'react-native';

import { toFormErrors } from '@/shared/api/errors';
import {
  Button,
  CategoryChips,
  ConfirmDialog,
  DateField,
  ErrorBanner,
  ResponsiveRow,
  TextField,
} from '@/shared/components';
import { todayIso } from '@/shared/lib/dates';
import { CURRENCY_SYMBOL } from '@/shared/lib/format';
import { spacing } from '@/shared/theme';

import type { Expense, ExpenseInput } from '../types';
import { validateExpense, type ExpenseFormValues } from '../validation';

type ExpenseFormProps = {
  initial?: Expense; // present when editing
  submitLabel: string;
  onSubmit: (input: ExpenseInput) => Promise<void>;
  onDelete?: () => Promise<void>; // shows a delete button when provided
};

export function ExpenseForm({ initial, submitLabel, onSubmit, onDelete }: ExpenseFormProps) {
  const [values, setValues] = useState<ExpenseFormValues>({
    amount: initial ? initial.amount.toFixed(2) : '',
    category: initial?.category ?? null,
    expenseDate: initial?.expenseDate ?? todayIso(),
    note: initial?.note ?? '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  function setField<K extends keyof ExpenseFormValues>(key: K, value: ExpenseFormValues[K]) {
    setValues((previous) => ({ ...previous, [key]: value }));
    setErrors((previous) => {
      const next = { ...previous };
      delete next[key];
      return next;
    });
  }

  async function handleSubmit() {
    if (submitting) {
      return;
    }
    const { input, errors: found } = validateExpense(values);
    if (!input) {
      setError(null);
      setErrors(found);
      return;
    }

    setError(null);
    setErrors({});
    setSubmitting(true);
    try {
      await onSubmit(input);
    } catch (e) {
      const { message, fields } = toFormErrors(e);
      setError(message);
      setErrors(fields);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete() {
    if (!onDelete) {
      return;
    }
    setDeleting(true);
    try {
      await onDelete();
    } catch (e) {
      setConfirmOpen(false);
      setError(toFormErrors(e).message);
    } finally {
      setDeleting(false);
    }
  }

  return (
    <View style={{ gap: spacing.md }}>
      <ErrorBanner message={error} />

      <ResponsiveRow>
        <TextField
          label={`Amount (${CURRENCY_SYMBOL})`}
          value={values.amount}
          onChangeText={(text) => setField('amount', text)}
          placeholder="0.00"
          keyboardType="decimal-pad"
          error={errors.amount}
        />
        <DateField
          label="Date"
          value={values.expenseDate}
          onChange={(date) => setField('expenseDate', date)}
          error={errors.expenseDate}
        />
      </ResponsiveRow>

      <CategoryChips
        label="Category"
        value={values.category}
        onChange={(category) => setField('category', category)}
        error={errors.category}
      />

      <TextField
        label="Note (optional)"
        value={values.note}
        onChangeText={(text) => setField('note', text)}
        placeholder="For example: groceries"
        multiline
        maxLength={255}
        style={{ minHeight: 72, textAlignVertical: 'top' }}
        error={errors.note}
      />

      <Button title={submitLabel} onPress={handleSubmit} loading={submitting} />

      {onDelete ? (
        <>
          <Button title="Delete expense" variant="danger" onPress={() => setConfirmOpen(true)} />
          <ConfirmDialog
            visible={confirmOpen}
            title="Delete this expense?"
            message="This cannot be undone."
            loading={deleting}
            onConfirm={handleDelete}
            onCancel={() => setConfirmOpen(false)}
          />
        </>
      ) : null}
    </View>
  );
}
