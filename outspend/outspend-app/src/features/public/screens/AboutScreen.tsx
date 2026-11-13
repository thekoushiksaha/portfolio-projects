import Constants from 'expo-constants';
import { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';

import {
  Body,
  Button,
  Card,
  ErrorBanner,
  FadeInView,
  Logo,
  Muted,
  ResponsiveRow,
  Screen,
  Title,
} from '@/shared/components';
import { useLoad } from '@/shared/hooks/useLoad';
import { spacing } from '@/shared/theme';

import { publicApi } from '../api';
import { AboutSkeleton } from '../components/AboutSkeleton';
import { BuiltWithCard } from '../components/BuiltWithCard';
import { DeveloperCard } from '../components/DeveloperCard';

export function AboutScreen() {
  const load = useCallback(() => publicApi.about(), []);
  const { data, error, loading, refreshing, refresh, reload } = useLoad(load);
  const appVersion = Constants.expoConfig?.version ?? '1.0.0';

  return (
    <Screen hasHeader width="content" onRefresh={refresh} refreshing={refreshing}>
      <View style={styles.hero}>
        <Logo />
        <Title>OutSpend</Title>
        <Muted>{`App version ${appVersion}`}</Muted>
      </View>

      <ErrorBanner message={error} />
      {error && !data ? <Button title="Try again" variant="secondary" onPress={reload} /> : null}

      {loading && !data ? <AboutSkeleton /> : null}

      {data ? (
        <FadeInView>
          <Card tinted>
            <Body>{data.description}</Body>
            <Muted>{`Server version ${data.version}`}</Muted>
          </Card>
        </FadeInView>
      ) : null}

      <ResponsiveRow>
        <BuiltWithCard />
        <DeveloperCard />
      </ResponsiveRow>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: { gap: spacing.sm, alignItems: 'flex-start' },
});
