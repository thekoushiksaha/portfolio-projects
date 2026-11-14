import { useFocusEffect } from 'expo-router';
import { useCallback, useRef, useState } from 'react';

import { toFormErrors } from '@/shared/api/errors';
import type { Page } from '@/shared/api/types';

function mergeUnique<T extends { id: number }>(existing: T[], incoming: T[]): T[] {
  const seen = new Set(existing.map((item) => item.id));
  return [...existing, ...incoming.filter((item) => !seen.has(item.id))];
}

// `fetchPage` must be wrapped in useCallback by the caller.
export function usePagedList<T extends { id: number }>(
  fetchPage: (page: number, size: number) => Promise<Page<T>>,
  pageSize = 20,
) {
  const [items, setItems] = useState<T[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const generation = useRef(0);

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
        const result = await fetchPage(0, pageSize);
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
    [fetchPage, pageSize],
  );

  const loadMore = useCallback(async () => {
    if (loading || refreshing || loadingMore || !hasMore) {
      return;
    }
    const id = generation.current;
    setLoadingMore(true);
    try {
      const nextPage = page + 1;
      const result = await fetchPage(nextPage, pageSize);
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
  }, [loading, refreshing, loadingMore, hasMore, page, fetchPage, pageSize]);

  useFocusEffect(
    useCallback(() => {
      loadFirstPage(false);
    }, [loadFirstPage]),
  );

  return {
    items,
    total,
    hasMore,
    loading,
    loadingMore,
    refreshing,
    error,
    loadMore,
    reload: () => loadFirstPage(false),
    refresh: () => loadFirstPage(true),
  };
}
