import { useCallback } from 'react';
import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';

import { useAuth } from '@/features/auth/AuthProvider';
import { isAdmin } from '@/features/auth/roles';
import { Button, Card, ErrorBanner, Muted, SafeScreen, Screen } from '@/shared/components';
import { usePagedList } from '@/shared/hooks/usePagedList';
import { useContentStyle } from '@/shared/layout/useContentStyle';
import { spacing, useTheme } from '@/shared/theme';

import { adminApi } from '../api';
import { MessageCard } from '../components/MessageCard';
import { MessageListSkeleton } from '../components/MessageListSkeleton';

function MessageList() {
  const { colors } = useTheme();
  const contentStyle = useContentStyle('content');
  const fetchPage = useCallback(
    (page: number, size: number) => adminApi.contactMessages(page, size),
    [],
  );
  const list = usePagedList(fetchPage);

  const header = (
    <View style={styles.header}>
      <ErrorBanner message={list.error} />
      {list.error && list.items.length === 0 ? (
        <Button title="Try again" variant="secondary" onPress={list.reload} />
      ) : null}
      {!list.loading || list.items.length > 0 ? (
        <Muted>{`${list.total} ${list.total === 1 ? 'message' : 'messages'}`}</Muted>
      ) : null}
    </View>
  );

  const empty = list.loading ? (
    <MessageListSkeleton />
  ) : list.error ? undefined : (
    <Card>
      <Muted>No messages yet. They appear here when people use the Contact screen.</Muted>
    </Card>
  );

  return (
    <SafeScreen hasHeader>
      <FlatList
        data={list.items}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={contentStyle}
        ItemSeparatorComponent={() => <View style={{ height: spacing.sm }} />}
        ListHeaderComponent={header}
        ListEmptyComponent={empty}
        ListFooterComponent={list.loadingMore ? <MessageListSkeleton count={1} /> : undefined}
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
        renderItem={({ item }) => <MessageCard message={item} />}
      />
    </SafeScreen>
  );
}

export function ContactMessagesScreen() {
  const { user } = useAuth();

  if (!isAdmin(user)) {
    return (
      <Screen hasHeader width="form">
        <Muted>This area is for administrators only.</Muted>
      </Screen>
    );
  }
  return <MessageList />;
}

const styles = StyleSheet.create({
  header: { gap: spacing.md, marginBottom: spacing.sm },
});
