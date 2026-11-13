import { useEffect, useState } from 'react';

import { Screen, SuccessBanner, Title } from '@/shared/components';
import { categoryInfo } from '@/shared/domain/categories';
import { formatMoney } from '@/shared/lib/format';

import { expensesApi } from '../api';
import { ExpenseForm } from '../components/ExpenseForm';
import type { ExpenseInput } from '../types';

export function AddExpenseScreen() {
  const [formKey, setFormKey] = useState(0);
  const [saved, setSaved] = useState<string | null>(null);

  // Hide the confirmation after a few seconds.
  useEffect(() => {
    if (!saved) {
      return;
    }
    const timer = setTimeout(() => setSaved(null), 4000);
    return () => clearTimeout(timer);
  }, [saved]);

  async function handleSubmit(input: ExpenseInput) {
    const created = await expensesApi.create(input);
    setSaved(`Added ${formatMoney(created.amount)} to ${categoryInfo(created.category).label}`);
    setFormKey((key) => key + 1); // a new key gives a fresh, empty form
  }

  return (
    <Screen width="form">
      <Title>Add expense</Title>
      <SuccessBanner message={saved} />
      <ExpenseForm key={formKey} submitLabel="Add expense" onSubmit={handleSubmit} />
    </Screen>
  );
}
