import { useCallback } from 'react';

import { useLoad } from '@/shared/hooks/useLoad';

import { summaryApi } from '../api';

const TREND_MONTHS = 6;

export function useSummary(month: string) {
  const load = useCallback(
    () => Promise.all([summaryApi.monthly(month), summaryApi.trend(TREND_MONTHS)]),
    [month],
  );
  const { data, ...state } = useLoad(load);

  return {
    ...state,
    summary: data ? data[0] : null,
    trend: data ? data[1] : null,
  };
}
