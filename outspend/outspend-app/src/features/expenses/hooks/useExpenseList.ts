import { useFocusEffect } from 'expo-router';
import { useCallback, useMemo, useRef, useState } from 'react';

import { toFormErrors } from '@/shared/api/errors';
import type { Category } from '@/shared/domain/categories';
import { monthRange } from '@/shared/lib/dates';

import { expensesApi } from '../api';
import type { Expense } from '../types';

const PAGE_SIZE = 20;

function mergeUnique(existing: Expense[], incoming: Expense[]): Expense[] {
  const seen = new Set(existing.map((item) => item.id));
  return [...existing, ...incoming.filter((item) => !seen.has(item.id))];
}

export function useExpenseList(month: string, category: Category | null) {
  const [items, setItems] = useState<Expense[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const generation = useRef(0);

  const filters = useMemo(() => {
    const { from, to } = monthRange(month);
    return { from, to, category: category ?? undefined };
  }, [month, category]);

  const loadFirstPage = useCallback(
    async (pullToRefresh: boolean) => {
      const id = ++generation.current;
      if (pullToRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      try {
        const result = await expensesApi.list({ ...filters, page: 0, size: PAGE_SIZE });
        if (id === generation.current) {
          setItems(result.content);
          setTotal(result.totalElements);
          setPage(0);
          setHasMore(!result.last);
        }
      } catch (e) {
        if (id === generation.current) {
          setError(toFormErrors(e).message);
        }
      } finally {
        if (id === generation.current) {
          setLoading(false);
          setRefreshing(false);
        }
      }
    },
    [filters],
  );

  const loadMore = useCallback(async () => {
    if (loading || refreshing || loadingMore || !hasMore) {
      return;
    }
    const id = generation.current;
    setLoadingMore(true);
    try {
      const nextPage = page + 1;
      const result = await expensesApi.list({ ...filters, page: nextPage, size: PAGE_SIZE });
      if (id === generation.current) {
        setItems((previous) => mergeUnique(previous, result.content));
        setTotal(result.totalElements);
        setPage(nextPage);
        setHasMore(!result.last);
      }
    } catch (e) {
      if (id === generation.current) {
        setError(toFormErrors(e).message);
      }
    } finally {
      setLoadingMore(false);
    }
  }, [loading, refreshing, loadingMore, hasMore, page, filters]);

  // Reload whenever the screen comes into view (for example after editing) or the filters change.
  useFocusEffect(
    useCallback(() => {
      loadFirstPage(false);
    }, [loadFirstPage]),
  );

  const removeLocal = useCallback((id: number) => {
    setItems((previous) => previous.filter((item) => item.id !== id));
    setTotal((previous) => Math.max(0, previous - 1));
  }, []);

  return {
    items,
    total,
    hasMore,
    loading,
    loadingMore,
    refreshing,
    error,
    loadMore,
    removeLocal,
    reload: () => loadFirstPage(false),
    refresh: () => loadFirstPage(true),
  };
}
