import type { ErrorBoundaryProps } from 'expo-router';

import { ErrorScreen } from './ErrorScreen';

export function AppErrorBoundary({ error, retry }: ErrorBoundaryProps) {
  return (
    <ErrorScreen
      detail={__DEV__ ? error.message : undefined}
      onRetry={() => {
        retry();
      }}
    />
  );
}
