import type { Category } from '@/shared/domain/categories';
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

  // Accept "12,50" as well as "12.50".
  const amountText = values.amount.trim().replace(',', '.');
  if (!amountText) {
    errors.amount = 'Enter an amount';
  } else if (!/^\d{1,10}(\.\d{1,2})?$/.test(amountText)) {
    errors.amount = 'Use a number with up to 2 decimals';
  } else if (Number(amountText) < 0.01) {
    errors.amount = 'Amount must be at least 0.01';
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

  if (Object.keys(errors).length > 0 || !values.category) {
    return { input: null, errors };
  }

  const note = values.note.trim();
  return {
    input: {
      amount: Number(amountText),
      category: values.category,
      expenseDate: values.expenseDate,
      note: note || undefined,
    },
    errors,
  };
}
