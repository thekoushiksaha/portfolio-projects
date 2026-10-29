import { useFocusEffect } from 'expo-router';
import { useCallback, useRef, useState } from 'react';

import { ApiError } from '@/shared/api/errors';

export function useLoad<T>(loader: () => Promise<T>) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const latest = useRef(0);

  const run = useCallback(
    async (pullToRefresh: boolean) => {
      const id = ++latest.current;
      if (pullToRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      try {
        const result = await loader();
        if (id === latest.current) {
          setData(result);
        }
      } catch (e) {
        if (id === latest.current) {
          setError(e instanceof ApiError ? e.message : 'Something went wrong. Try again');
        }
      } finally {
        if (id === latest.current) {
          setLoading(false);
          setRefreshing(false);
        }
      }
    },
    [loader],
  );

  // Runs when the screen gains focus, and again whenever `loader` changes.
  useFocusEffect(
    useCallback(() => {
      run(false);
    }, [run]),
  );

  return {
    data,
    error,
    loading,
    refreshing,
    reload: () => run(false),
    refresh: () => run(true),
  };
}
