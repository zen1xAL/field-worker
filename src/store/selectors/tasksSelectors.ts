import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '@/store';
import { Task, TaskStatus } from '@/types';

export const selectTasksItems = (state: RootState): Task[] => state.tasks.items;
export const selectSortOptions = (state: RootState) => state.tasks.sortOptions;
export const selectFilterStatus = (state: RootState) => state.tasks.filterStatus;
export const selectSearchQuery = (state: RootState): string => state.tasks.searchQuery;

const STATUS_PRIORITY: Record<TaskStatus, number> = {
  New: 1,
  'In Progress': 2,
  Completed: 3,
  Cancelled: 4,
};

export const selectFilteredAndSortedTasks = createSelector(
  [selectTasksItems, selectFilterStatus, selectSearchQuery, selectSortOptions],
  (tasks, filterStatus, searchQuery, sortOptions): Task[] => {
    let result = [...tasks];

    if (filterStatus !== 'All') {
      result = result.filter((task) => task.status === filterStatus);
    }

    const trimmedQuery = searchQuery.trim().toLowerCase();
    if (trimmedQuery.length > 0) {
      result = result.filter((task) => {
        const titleMatch = task.title.toLowerCase().includes(trimmedQuery);
        const descMatch = task.description.toLowerCase().includes(trimmedQuery);
        const addressMatch = task.location.address.toLowerCase().includes(trimmedQuery);
        return titleMatch || descMatch || addressMatch;
      });
    }

    result.sort((a, b) => {
      const modifier = sortOptions.order === 'asc' ? 1 : -1;

      if (sortOptions.by === 'dueDate') {
        const timeA = new Date(a.dueDate).getTime();
        const timeB = new Date(b.dueDate).getTime();
        return (timeA - timeB) * modifier;
      }

      if (sortOptions.by === 'status') {
        const rankA = STATUS_PRIORITY[a.status];
        const rankB = STATUS_PRIORITY[b.status];
        return (rankA - rankB) * modifier;
      }

      const timeA = new Date(a.createdAt).getTime();
      const timeB = new Date(b.createdAt).getTime();
      return (timeA - timeB) * modifier;
    });

    return result;
  }
);

export const selectTaskById = (taskId: string) =>
  createSelector([selectTasksItems], (tasks): Task | undefined => {
    return tasks.find((task) => task.id === taskId);
  });

export interface TaskStatistics {
  total: number;
  new: number;
  inProgress: number;
  completed: number;
  cancelled: number;
}

export const selectTaskStats = createSelector(
  [selectTasksItems],
  (tasks): TaskStatistics => {
    const stats: TaskStatistics = {
      total: tasks.length,
      new: 0,
      inProgress: 0,
      completed: 0,
      cancelled: 0,
    };

    for (const task of tasks) {
      if (task.status === 'New') {
        stats.new += 1;
      } else if (task.status === 'In Progress') {
        stats.inProgress += 1;
      } else if (task.status === 'Completed') {
        stats.completed += 1;
      } else if (task.status === 'Cancelled') {
        stats.cancelled += 1;
      }
    }

    return stats;
  }
);
