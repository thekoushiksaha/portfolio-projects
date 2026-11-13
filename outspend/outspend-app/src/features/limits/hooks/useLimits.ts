import { useCallback } from 'react';

import { useLoad } from '@/shared/hooks/useLoad';

import { limitsApi } from '../api';

export function useLimits(month: string) {
  const load = useCallback(() => limitsApi.list(month), [month]);
  const { data, ...state } = useLoad(load);

  return { ...state, limits: data };
}
