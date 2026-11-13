import { useEffect, useState } from 'react';
import { View } from 'react-native';

import { toFormErrors } from '@/shared/api/errors';
import { Button, CategoryChips, Dialog, ErrorBanner, Muted, TextField } from '@/shared/components';
import { categoryInfo, type Category } from '@/shared/domain/categories';
import { parseAmount } from '@/shared/lib/amount';
import { CURRENCY_SYMBOL } from '@/shared/lib/format';
import { spacing } from '@/shared/theme';

import { limitsApi } from '../api';
import type { Limit } from '../types';

export type LimitFormInitial = { category: Category | null; amount: number };

type LimitFormModalProps = {
  visible: boolean;
  initial: LimitFormInitial | null; // set when editing, null when adding
  existing: Limit[]; // the limits already set, used for the "replace" hint
  onClose: () => void;
  onSaved: () => void;
};

export function LimitFormModal({
  visible,
  initial,
  existing,
  onClose,
  onSaved,
}: LimitFormModalProps) {
  const [category, setCategory] = useState<Category | null>(null);
  const [amount, setAmount] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  // Start fresh (or prefilled) every time the pop-up opens.
  useEffect(() => {
    if (visible) {
      setCategory(initial?.category ?? null);
      setAmount(initial ? String(initial.amount) : '');
      setError(null);
      setFieldErrors({});
    }
  }, [visible, initial]);

  const editing = initial !== null;
  const replacing = !editing && existing.some((limit) => limit.category === category);

  async function handleSave() {
    if (saving) {
      return;
    }
    const parsed = parseAmount(amount);
    if (parsed.value === null) {
      setError(null);
      setFieldErrors({ monthlyLimit: parsed.error ?? 'Enter an amount' });
      return;
    }

    setError(null);
    setFieldErrors({});
    setSaving(true);
    try {
      await limitsApi.save({ category, monthlyLimit: parsed.value });
      onSaved();
    } catch (e) {
      const { message, fields } = toFormErrors(e);
      setError(message);
      setFieldErrors(fields);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog visible={visible} title={editing ? 'Edit limit' : 'Set a limit'} onClose={onClose}>
      <ErrorBanner message={error} />

      {editing ? (
        <Muted>{`Limit for ${categoryInfo(category).label}`}</Muted>
      ) : (
        <View style={{ gap: spacing.xs }}>
          <CategoryChips
            label="Applies to"
            allowAll
            allLabel="Overall"
            value={category}
            onChange={setCategory}
            error={fieldErrors.category}
          />
          {replacing ? <Muted>You already have a limit here. Saving will replace it.</Muted> : null}
        </View>
      )}

      <TextField
        label={`Monthly limit (${CURRENCY_SYMBOL})`}
        value={amount}
        onChangeText={(text) => {
          setAmount(text);
          setFieldErrors({});
        }}
        placeholder="0.00"
        keyboardType="decimal-pad"
        returnKeyType="done"
        onSubmitEditing={handleSave}
        error={fieldErrors.monthlyLimit}
      />

      <View style={{ gap: spacing.sm }}>
        <Button title="Save limit" onPress={handleSave} loading={saving} />
        <Button title="Cancel" variant="secondary" onPress={onClose} disabled={saving} />
      </View>
    </Dialog>
  );
}
