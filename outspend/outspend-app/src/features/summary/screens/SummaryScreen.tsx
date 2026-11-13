import { useState } from 'react';
import { ActivityIndicator, View } from 'react-native';

import {
  Button,
  ErrorBanner,
  MonthSwitcher,
  ResponsiveRow,
  Screen,
  SectionTitle,
  Title,
} from '@/shared/components';
import { currentMonth } from '@/shared/lib/dates';
import { useTheme } from '@/shared/theme';

import { CategoryBreakdown } from '../components/CategoryBreakdown';
import { TotalCard } from '../components/TotalCard';
import { TrendCard } from '../components/TrendChart';
import { useSummary } from '../hooks/useSummary';

export function SummaryScreen() {
  const { colors } = useTheme();
  const [month, setMonth] = useState(currentMonth());
  const { summary, trend, error, loading, refreshing, refresh, reload } = useSummary(month);

  return (
    <Screen width="wide" onRefresh={refresh} refreshing={refreshing}>
      <Title>Summary</Title>
      <MonthSwitcher month={month} onChange={setMonth} />

      {loading ? <ActivityIndicator color={colors.primary} /> : null}

      <ErrorBanner message={error} />
      {error && !summary ? <Button title="Try again" variant="secondary" onPress={reload} /> : null}

      {summary ? (
        <View style={{ gap: 16, opacity: loading ? 0.5 : 1 }}>
          <ResponsiveRow>
            <TotalCard summary={summary} />
            {trend ? <TrendCard data={trend} selected={summary.month} /> : null}
          </ResponsiveRow>

          <SectionTitle>By category</SectionTitle>
          <CategoryBreakdown items={summary.byCategory} />
        </View>
      ) : null}
    </Screen>
  );
}
