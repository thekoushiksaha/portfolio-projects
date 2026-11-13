import type { Category } from '@/shared/domain/categories';
import { parseAmount } from '@/shared/lib/amount';
import { isValidIsoDate } from '@/shared/lib/dates';

import type { ExpenseInput } from './types';

export interface ExpenseFormValues {
  amount: string;
  category: Category | null;
  expenseDate: string;
  note: string;
}

export function validateExpense(values: ExpenseFormValues): {
  input: ExpenseInput | null;
  errors: Record<string, string>;
} {
  const errors: Record<string, string> = {};

  const amount = parseAmount(values.amount);
  if (amount.error) {
    errors.amount = amount.error;
  }

  if (!values.category) {
    errors.category = 'Choose a category';
  }

  if (!isValidIsoDate(values.expenseDate)) {
    errors.expenseDate = 'Enter a valid date (yyyy-mm-dd)';
  }

  if (values.note.length > 255) {
    errors.note = 'Note can be up to 255 characters';
  }

  if (Object.keys(errors).length > 0 || !values.category || amount.value === null) {
    return { input: null, errors };
  }

  const note = values.note.trim();
  return {
    input: {
      amount: amount.value,
      category: values.category,
      expenseDate: values.expenseDate,
      note: note || undefined,
    },
    errors,
  };
}
