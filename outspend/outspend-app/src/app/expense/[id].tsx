import { useLocalSearchParams } from 'expo-router';

import { EditExpenseScreen } from '@/features/expenses/screens/EditExpenseScreen';

export default function EditExpenseRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <EditExpenseScreen id={Number(id)} />;
}
