import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { Task } from '@/types';
import { formatTaskDateTime } from '@/utils/dateTime';
import { TaskStatusBadge } from './TaskStatusBadge';

interface MapCalloutCardProps {
  task: Task;
}

export const MapCalloutCard: React.FC<MapCalloutCardProps> = ({ task }) => {
  const { colors, spacing, typography, radius, layout } = useTheme();

  return (
    <View
      style={[
        styles.calloutCard,
        {
          width: layout.calloutWidth,
          backgroundColor: colors.surface,
          borderRadius: radius.md,
          padding: spacing.md,
          borderColor: colors.border,
          shadowColor: colors.shadowColor,
        },
      ]}
    >
      <View style={[styles.calloutHeader, { marginBottom: spacing.xs }]}>
        <TaskStatusBadge status={task.status} />
      </View>

      <Text
        style={[
          styles.calloutTitle,
          {
            color: colors.textPrimary,
            fontSize: typography.fontSizes.bodyMedium,
            fontWeight: typography.fontWeights.bold,
            marginBottom: spacing.xs / 2,
          },
        ]}
      >
        {task.title}
      </Text>

      <Text
        style={[
          styles.calloutAddress,
          {
            color: colors.textSecondary,
            fontSize: typography.fontSizes.caption,
            marginBottom: spacing.xs,
          },
        ]}
      >
        {task.location.address}
      </Text>

      <View style={[styles.calloutFooter, { marginTop: spacing.xs }]}>
        <Text
          style={{
            color: colors.textMuted,
            fontSize: typography.fontSizes.captionSmall,
          }}
        >
          {formatTaskDateTime(task.dueDate)}
        </Text>

        <Text
          style={{
            color: colors.primary,
            fontSize: typography.fontSizes.captionSmall,
            fontWeight: typography.fontWeights.semiBold,
          }}
        >
          Открыть →
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  calloutCard: {
    borderWidth: 1,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  calloutHeader: {},
  calloutTitle: {},
  calloutAddress: {},
  calloutFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
