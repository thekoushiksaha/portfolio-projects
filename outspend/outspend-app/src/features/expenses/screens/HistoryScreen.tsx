import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, View } from 'react-native';

import { toFormErrors } from '@/shared/api/errors';
import {
  Button,
  Card,
  ConfirmDialog,
  ErrorBanner,
  Muted,
  SafeScreen,
  Title,
} from '@/shared/components';
import type { Category } from '@/shared/domain/categories';
import { useContentStyle } from '@/shared/layout/useContentStyle';
import { useLayout } from '@/shared/layout/useLayout';
import { currentMonth } from '@/shared/lib/dates';
import { formatMoney } from '@/shared/lib/format';
import { spacing, useTheme } from '@/shared/theme';

import { expensesApi } from '../api';
import { ExpenseRow } from '../components/ExpenseRow';
import { HistoryFilters } from '../components/HistoryFilters';
import { useExpenseList } from '../hooks/useExpenseList';
import type { Expense } from '../types';

export function HistoryScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { isCompact } = useLayout();
  const contentStyle = useContentStyle('wide');

  const [month, setMonth] = useState(currentMonth());
  const [category, setCategory] = useState<Category | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Expense | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const list = useExpenseList(month, category);
  const columns = isCompact ? 1 : 2;

  async function confirmDelete() {
    if (!pendingDelete) {
      return;
    }
    setDeleting(true);
    try {
      await expensesApi.remove(pendingDelete.id);
      list.removeLocal(pendingDelete.id);
      setPendingDelete(null);
    } catch (e) {
      setPendingDelete(null);
      setActionError(toFormErrors(e).message);
    } finally {
      setDeleting(false);
    }
  }

  const header = (
    <View style={styles.header}>
      <Title>History</Title>
      <HistoryFilters
        month={month}
        category={category}
        onMonthChange={setMonth}
        onCategoryChange={setCategory}
      />
      <ErrorBanner message={actionError ?? list.error} />
      {!list.loading || list.items.length > 0 ? (
        <Muted>{`${list.total} ${list.total === 1 ? 'expense' : 'expenses'}`}</Muted>
      ) : null}
    </View>
  );

  const empty = list.loading ? undefined : (
    <Card>
      <Muted>No expenses match these filters.</Muted>
      <Button title="Add an expense" variant="secondary" onPress={() => router.push('/add')} />
    </Card>
  );

  return (
    <SafeScreen>
      <FlatList
        key={columns} // a new key rebuilds the list when the column count changes
        data={list.items}
        keyExtractor={(item) => String(item.id)}
        numColumns={columns}
        columnWrapperStyle={columns > 1 ? { gap: spacing.md } : undefined}
        ItemSeparatorComponent={() => <View style={{ height: spacing.sm }} />}
        contentContainerStyle={contentStyle}
        style={{ opacity: list.loading && list.items.length > 0 ? 0.5 : 1 }}
        keyboardShouldPersistTaps="handled"
        ListHeaderComponent={header}
        ListEmptyComponent={empty}
        ListFooterComponent={
          list.loadingMore ? <ActivityIndicator color={colors.primary} /> : undefined
        }
        onEndReached={list.loadMore}
        onEndReachedThreshold={0.4}
        refreshControl={
          <RefreshControl
            refreshing={list.refreshing}
            onRefresh={list.refresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
        renderItem={({ item }) => (
          <View style={columns > 1 ? styles.cell : undefined}>
            <ExpenseRow
              expense={item}
              onPress={() =>
                router.push({ pathname: '/expense/[id]', params: { id: String(item.id) } })
              }
              onDelete={() => setPendingDelete(item)}
            />
          </View>
        )}
      />

      <ConfirmDialog
        visible={pendingDelete !== null}
        title="Delete this expense?"
        message={
          pendingDelete
            ? `${formatMoney(pendingDelete.amount)} will be removed. This cannot be undone.`
            : ''
        }
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  header: { gap: spacing.md, marginBottom: spacing.sm },
  cell: { flexBasis: 0, flexGrow: 1, maxWidth: '50%' },
});
