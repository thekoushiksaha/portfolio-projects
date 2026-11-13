import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { toFormErrors } from '@/shared/api/errors';
import {
  Button,
  Card,
  ConfirmDialog,
  ErrorBanner,
  FadeInView,
  MonthSwitcher,
  Muted,
  Screen,
  SuccessBanner,
  Title,
} from '@/shared/components';
import { categoryInfo } from '@/shared/domain/categories';
import { useLayout } from '@/shared/layout/useLayout';
import { currentMonth } from '@/shared/lib/dates';
import { spacing } from '@/shared/theme';

import { limitsApi } from '../api';
import { LimitCard } from '../components/LimitCard';
import { LimitFormModal, type LimitFormInitial } from '../components/LimitFormModal';
import { LimitsSkeleton } from '../components/LimitsSkeleton';
import { useLimits } from '../hooks/useLimits';
import type { Limit } from '../types';

export function LimitsScreen() {
  const { isCompact } = useLayout();
  const [month, setMonth] = useState(currentMonth());
  const { limits, error, loading, refreshing, refresh, reload } = useLimits(month);

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<LimitFormInitial | null>(null);
  const [pendingRemove, setPendingRemove] = useState<Limit | null>(null);
  const [removing, setRemoving] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);

  // Hide the confirmation after a few seconds.
  useEffect(() => {
    if (!saved) {
      return;
    }
    const timer = setTimeout(() => setSaved(null), 4000);
    return () => clearTimeout(timer);
  }, [saved]);

  function openNew() {
    setEditing(null);
    setFormOpen(true);
  }

  function openEdit(limit: Limit) {
    setEditing({ category: limit.category, amount: limit.monthlyLimit });
    setFormOpen(true);
  }

  async function confirmRemove() {
    if (!pendingRemove) {
      return;
    }
    setRemoving(true);
    try {
      await limitsApi.remove(pendingRemove.id);
      setSaved(`Removed the ${categoryInfo(pendingRemove.category).label} limit`);
      setPendingRemove(null);
      reload();
    } catch (e) {
      setPendingRemove(null);
      setActionError(toFormErrors(e).message);
    } finally {
      setRemoving(false);
    }
  }

  const showSkeleton = loading && !limits;

  return (
    <>
      <Screen width="wide" onRefresh={refresh} refreshing={refreshing}>
        <Title>Limits</Title>
        <Muted>Get a heads-up before you overspend. Limits repeat every month.</Muted>

        <MonthSwitcher month={month} onChange={setMonth} />

        <View style={isCompact ? undefined : styles.buttonWide}>
          <Button title="Set a limit" onPress={openNew} />
        </View>

        <SuccessBanner message={saved} />
        <ErrorBanner message={actionError ?? error} />
        {error && !limits ? (
          <Button title="Try again" variant="secondary" onPress={reload} />
        ) : null}

        {showSkeleton ? <LimitsSkeleton /> : null}

        {limits && limits.length === 0 ? (
          <Card>
            <Muted>
              No limits yet. Set an overall limit, or one for a category like Food, and the bars
              will show how much you have used.
            </Muted>
          </Card>
        ) : null}

        {limits && limits.length > 0 ? (
          <View style={[styles.grid, { opacity: loading ? 0.5 : 1 }]}>
            {limits.map((limit, index) => (
              <FadeInView
                key={limit.id}
                delay={index * 60}
                style={{ width: isCompact ? '100%' : '48%' }}
              >
                <LimitCard
                  limit={limit}
                  onEdit={() => openEdit(limit)}
                  onRemove={() => setPendingRemove(limit)}
                />
              </FadeInView>
            ))}
          </View>
        ) : null}
      </Screen>

      <LimitFormModal
        visible={formOpen}
        initial={editing}
        existing={limits ?? []}
        onClose={() => setFormOpen(false)}
        onSaved={() => {
          setFormOpen(false);
          setActionError(null);
          setSaved('Limit saved');
          reload();
        }}
      />

      <ConfirmDialog
        visible={pendingRemove !== null}
        title="Remove this limit?"
        message="Your expenses stay as they are. Only the limit is removed."
        confirmLabel="Remove"
        loading={removing}
        onConfirm={confirmRemove}
        onCancel={() => setPendingRemove(null)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  buttonWide: { alignSelf: 'flex-start', minWidth: 220 },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: spacing.md,
  },
});
