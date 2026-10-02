import React from 'react';
import { TaskStatus } from '@/types';
import { AppBadge } from '@/components/UI/AppBadge';

interface TaskStatusBadgeProps {
  status: TaskStatus;
}

const STATUS_LABELS: Record<TaskStatus, string> = {
  New: 'Новый',
  'In Progress': 'В работе',
  Completed: 'Завершен',
  Cancelled: 'Отменен',
};

export const TaskStatusBadge: React.FC<TaskStatusBadgeProps> = ({ status }) => {
  return (
    <AppBadge
      label={STATUS_LABELS[status]}
      variant={status}
    />
  );
};
