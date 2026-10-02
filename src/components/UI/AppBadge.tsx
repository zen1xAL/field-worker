import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { TaskStatus, SyncStatus } from '@/types';

type BadgeVariant =
  | TaskStatus
  | SyncStatus
  | 'neutral'
  | 'primary';

interface AppBadgeProps {
  label: string;
  variant?: BadgeVariant;
  icon?: React.ReactNode;
}

export const AppBadge = ({ label, variant = 'neutral', icon }: AppBadgeProps) => {
  const { colors, spacing, radius, typography } = useTheme();

  const getColors = (): { bg: string; text: string } => {
    switch (variant) {
      case 'New':
        return { bg: colors.statusNewBg, text: colors.statusNew };
      case 'In Progress':
        return { bg: colors.statusInProgressBg, text: colors.statusInProgress };
      case 'Completed':
        return { bg: colors.statusCompletedBg, text: colors.statusCompleted };
      case 'Cancelled':
        return { bg: colors.statusCancelledBg, text: colors.statusCancelled };
      case 'synced':
        return { bg: colors.statusCompletedBg, text: colors.syncSynced };
      case 'pending':
        return { bg: colors.statusInProgressBg, text: colors.syncPending };
      case 'failed':
        return { bg: colors.dangerBg, text: colors.syncFailed };
      case 'primary':
        return { bg: colors.primaryLight, text: colors.primary };
      case 'neutral':
      default:
        return { bg: colors.surfaceSecondary, text: colors.textSecondary };
    }
  };

  const palette = getColors();

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: palette.bg,
          borderRadius: radius.sm,
          paddingHorizontal: spacing.sm + 2,
          paddingVertical: spacing.xs,
        },
      ]}
    >
      {icon}
      <Text
        style={[
          styles.text,
          {
            color: palette.text,
            fontSize: typography.fontSizes.caption,
            fontWeight: typography.fontWeights.semiBold,
            marginLeft: icon ? spacing.xs : spacing.none,
          },
        ]}
      >
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  text: {
    letterSpacing: 0.2,
  },
});
