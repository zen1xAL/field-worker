import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';
import { SyncStatus } from '@/types';
import { AppBadge } from '@/components/UI/AppBadge';

interface SyncStatusBadgeProps {
  status: SyncStatus;
}

const SYNC_LABELS: Record<SyncStatus, string> = {
  synced: 'Синхр.',
  pending: 'Ожидает',
  failed: 'Сбой',
};

export const SyncStatusBadge: React.FC<SyncStatusBadgeProps> = ({ status }) => {
  const { colors, layout } = useTheme();

  const getSyncIcon = () => {
    switch (status) {
      case 'synced':
        return (
          <Ionicons
            name="checkmark-circle-outline"
            size={layout.iconSmall - 2}
            color={colors.syncSynced}
          />
        );
      case 'pending':
        return (
          <Ionicons
            name="time-outline"
            size={layout.iconSmall - 2}
            color={colors.syncPending}
          />
        );
      case 'failed':
        return (
          <Ionicons
            name="alert-circle-outline"
            size={layout.iconSmall - 2}
            color={colors.syncFailed}
          />
        );
    }
  };

  return (
    <AppBadge
      label={SYNC_LABELS[status]}
      variant={status}
      icon={getSyncIcon()}
    />
  );
};
