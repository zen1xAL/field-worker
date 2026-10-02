import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';
import { Task } from '@/types';
import { AppCard } from '@/components/UI/AppCard';
import { AppBadge } from '@/components/UI/AppBadge';
import { TaskStatusBadge } from './TaskStatusBadge';
import { SyncStatusBadge } from './SyncStatusBadge';
import { formatTaskDateTime, formatTimeRemaining, isTaskOverdue } from '@/utils/dateTime';

interface TaskCardProps {
  task: Task;
  onPress: (task: Task) => void;
  onQuickAdvanceStatus?: (task: Task) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onPress,
  onQuickAdvanceStatus,
}) => {
  const { colors, spacing, typography, layout, radius } = useTheme();

  const isOverdue = isTaskOverdue(task.dueDate, task.status);
  const timeRemainingLabel = formatTimeRemaining(task.dueDate, task.status);

  const getQuickActionLabel = (): string | null => {
    if (task.status === 'New') {
      return 'В работу';
    }
    if (task.status === 'In Progress') {
      return 'Завершить';
    }
    return null;
  };

  const quickActionLabel = getQuickActionLabel();

  return (
    <AppCard
      onPress={() => onPress(task)}
      style={[
        styles.cardContainer,
        { marginVertical: spacing.xs },
        isOverdue && { borderColor: colors.danger, borderWidth: 1 },
      ]}
    >
      <View style={[styles.headerRow, { marginBottom: spacing.sm }]}>
        <View style={[styles.badgesCluster, { gap: spacing.xs }]}>
          <TaskStatusBadge status={task.status} />
          <SyncStatusBadge status={task.syncStatus} />
        </View>

        <AppBadge
          label={timeRemainingLabel}
          variant={isOverdue ? 'danger' : 'neutral'}
        />
      </View>

      <Text
        style={[
          styles.title,
          {
            color: colors.textPrimary,
            fontSize: typography.fontSizes.titleSmall,
            fontWeight: typography.fontWeights.semiBold,
            marginBottom: spacing.xs,
          },
        ]}
        numberOfLines={2}
      >
        {task.title}
      </Text>

      {task.description.length > 0 && (
        <Text
          style={[
            styles.description,
            {
              color: colors.textSecondary,
              fontSize: typography.fontSizes.body,
              lineHeight: typography.lineHeights.normal,
              marginBottom: spacing.md,
            },
          ]}
          numberOfLines={2}
        >
          {task.description}
        </Text>
      )}

      <View style={[styles.metaContainer, { gap: spacing.xs, marginBottom: spacing.sm }]}>
        <View style={styles.metaRow}>
          <Ionicons
            name="location-outline"
            size={layout.iconSmall}
            color={colors.primary}
            style={{ marginRight: spacing.xs }}
          />
          <Text
            style={[
              styles.metaText,
              {
                color: colors.textSecondary,
                fontSize: typography.fontSizes.bodySmall,
              },
            ]}
            numberOfLines={1}
          >
            {task.location.address}
          </Text>
        </View>

        <View style={styles.metaRow}>
          <Ionicons
            name="calendar-outline"
            size={layout.iconSmall}
            color={colors.textMuted}
            style={{ marginRight: spacing.xs }}
          />
          <Text
            style={[
              styles.metaText,
              {
                color: colors.textSecondary,
                fontSize: typography.fontSizes.bodySmall,
              },
            ]}
          >
            {formatTaskDateTime(task.dueDate)}
          </Text>

          {task.attachments.length > 0 && (
            <View style={[styles.attachmentCounter, { marginLeft: spacing.md }]}>
              <Ionicons
                name="images-outline"
                size={layout.iconSmall}
                color={colors.textSecondary}
                style={{ marginRight: spacing.xs }}
              />
              <Text
                style={{
                  color: colors.textSecondary,
                  fontSize: typography.fontSizes.caption,
                  fontWeight: typography.fontWeights.medium,
                }}
              >
                {task.attachments.length}
              </Text>
            </View>
          )}
        </View>
      </View>

      {quickActionLabel && onQuickAdvanceStatus && (
        <View style={[styles.actionRow, { marginTop: spacing.xs, paddingTop: spacing.sm, borderTopWidth: 1, borderTopColor: colors.border }]}>
          <TouchableOpacity
            activeOpacity={0.7}
            style={[
              styles.quickButton,
              {
                minHeight: layout.minTapTarget,
                backgroundColor: task.status === 'New' ? colors.primaryLight : colors.statusCompletedBg,
                borderRadius: radius.md,
                paddingVertical: spacing.sm,
                paddingHorizontal: spacing.md,
              },
            ]}
            onPress={() => onQuickAdvanceStatus(task)}
          >
            <Ionicons
              name={task.status === 'New' ? 'play-outline' : 'checkmark-done-outline'}
              size={layout.iconSmall}
              color={task.status === 'New' ? colors.primary : colors.statusCompleted}
              style={{ marginRight: spacing.xs }}
            />
            <Text
              style={[
                styles.quickButtonText,
                {
                  color: task.status === 'New' ? colors.primary : colors.statusCompleted,
                  fontSize: typography.fontSizes.bodySmall,
                  fontWeight: typography.fontWeights.semiBold,
                },
              ]}
            >
              {quickActionLabel}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </AppCard>
  );
};

const styles = StyleSheet.create({
  cardContainer: {},
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  badgesCluster: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {},
  description: {},
  metaContainer: {},
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    flexShrink: 1,
  },
  attachmentCounter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  quickButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickButtonText: {},
});
