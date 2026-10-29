import { useCallback } from 'react';

import { publicApi } from '@/features/public/api';
import {
  Body,
  Button,
  Card,
  ErrorBanner,
  LoadingView,
  Logo,
  Muted,
  ResponsiveRow,
  Screen,
  SectionTitle,
  ThemeSwitcher,
  Title,
} from '@/shared/components';
import { useLoad } from '@/shared/hooks/useLoad';
import { useLayout } from '@/shared/layout/useLayout';
import { useTheme } from '@/shared/theme';

export default function FoundationCheckScreen() {
  const load = useCallback(() => publicApi.about(), []);
  const { data, error, loading, refreshing, refresh, reload } = useLoad(load);
  const { width, height, breakpoint, isLandscape } = useLayout();
  const { scheme, preference } = useTheme();

  if (loading && !data) {
    return <LoadingView message="Connecting... the server may take a minute to wake up." />;
  }

  return (
    <Screen onRefresh={refresh} refreshing={refreshing}>
      <Logo />
      <Title>OutSpend</Title>
      <Muted>Foundation check</Muted>

      <ErrorBanner message={error} />
      {error && !data ? <Button title="Try again" variant="secondary" onPress={reload} /> : null}

      <ResponsiveRow>
        {data ? (
          <Card tinted>
            <Title>{data.name}</Title>
            <Muted>Version {data.version}</Muted>
            <Body>{data.description}</Body>
          </Card>
        ) : null}

        <Card>
          <SectionTitle>Layout</SectionTitle>
          <Body>
            {`${Math.round(width)} x ${Math.round(height)} (${isLandscape ? 'landscape' : 'portrait'})`}
          </Body>
          <Muted>Size class: {breakpoint}</Muted>
          <Muted>
            Theme choice: {preference}, showing: {scheme}
          </Muted>
        </Card>
      </ResponsiveRow>

      <SectionTitle>Appearance</SectionTitle>
      <ThemeSwitcher />
    </Screen>
  );
}
