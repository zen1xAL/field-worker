import {
  tasksReducer,
  setTasks,
  addTask,
  updateTask,
  deleteTask,
  setTaskStatus,
  setTaskSyncStatus,
  mergeTasksWithLWW,
  setSortOptions,
  setFilterStatus,
  setSearchQuery,
} from '@/store/slices/tasksSlice';
import { Task } from '@/types';

describe('tasksSlice', () => {
  const initialEmptyState = {
    items: [],
    sortOptions: { by: 'createdAt' as const, order: 'desc' as const },
    filterStatus: 'All' as const,
    searchQuery: '',
  };

  const sampleTask: Task = {
    id: 'task-100',
    title: 'Диагностика щита',
    description: 'Проверка срабатывания автомата',
    dueDate: '2026-10-04T12:00:00.000Z',
    status: 'New',
    location: {
      address: 'пр. Победителей, д. 103',
      latitude: 53.9312,
      longitude: 27.493,
    },
    attachments: [],
    syncStatus: 'synced',
    createdAt: '2026-10-02T10:00:00.000Z',
    updatedAt: '2026-10-02T10:00:00.000Z',
  };

  it('should handle setTasks', () => {
    const state = tasksReducer(initialEmptyState, setTasks([sampleTask]));
    expect(state.items).toHaveLength(1);
    expect(state.items[0].id).toBe('task-100');
  });

  it('should handle addTask by placing it at the beginning', () => {
    const stateWithOne = { ...initialEmptyState, items: [sampleTask] };
    const newTask: Task = {
      ...sampleTask,
      id: 'task-101',
      title: 'Второй наряд',
      createdAt: '2026-10-02T11:00:00.000Z',
      updatedAt: '2026-10-02T11:00:00.000Z',
    };

    const state = tasksReducer(stateWithOne, addTask(newTask));
    expect(state.items).toHaveLength(2);
    expect(state.items[0].id).toBe('task-101');
    expect(state.items[1].id).toBe('task-100');
  });

  it('should handle updateTask and set pending sync status', () => {
    const stateWithOne = { ...initialEmptyState, items: [sampleTask] };
    const state = tasksReducer(
      stateWithOne,
      updateTask({ id: 'task-100', title: 'Обновленный заголовок' })
    );

    expect(state.items[0].title).toBe('Обновленный заголовок');
    expect(state.items[0].syncStatus).toBe('pending');
  });

  it('should handle deleteTask', () => {
    const stateWithOne = { ...initialEmptyState, items: [sampleTask] };
    const state = tasksReducer(stateWithOne, deleteTask('task-100'));
    expect(state.items).toHaveLength(0);
  });

  it('should handle setTaskStatus and update syncStatus to pending', () => {
    const stateWithOne = { ...initialEmptyState, items: [sampleTask] };
    const state = tasksReducer(
      stateWithOne,
      setTaskStatus({ id: 'task-100', status: 'In Progress' })
    );

    expect(state.items[0].status).toBe('In Progress');
    expect(state.items[0].syncStatus).toBe('pending');
  });

  it('should handle setTaskSyncStatus', () => {
    const stateWithOne = { ...initialEmptyState, items: [sampleTask] };
    const state = tasksReducer(
      stateWithOne,
      setTaskSyncStatus({ id: 'task-100', syncStatus: 'failed' })
    );

    expect(state.items[0].syncStatus).toBe('failed');
  });

  it('should apply Last-Write-Wins (LWW) conflict resolution in mergeTasksWithLWW', () => {
    const localOldTask: Task = {
      ...sampleTask,
      id: 'task-100',
      title: 'Локальная старая версия',
      updatedAt: '2026-10-02T10:00:00.000Z',
      syncStatus: 'pending',
    };

    const localNewTask: Task = {
      ...sampleTask,
      id: 'task-200',
      title: 'Локальная свежая версия',
      updatedAt: '2026-10-02T15:00:00.000Z',
      syncStatus: 'pending',
    };

    const remoteNewerTask: Task = {
      ...sampleTask,
      id: 'task-100',
      title: 'Серверная более свежая версия',
      updatedAt: '2026-10-02T12:00:00.000Z',
      syncStatus: 'synced',
    };

    const remoteOlderTask: Task = {
      ...sampleTask,
      id: 'task-200',
      title: 'Серверная устаревшая версия',
      updatedAt: '2026-10-02T14:00:00.000Z',
      syncStatus: 'synced',
    };

    const remoteBrandNewTask: Task = {
      ...sampleTask,
      id: 'task-300',
      title: 'Новый наряд с сервера',
      updatedAt: '2026-10-02T16:00:00.000Z',
      syncStatus: 'synced',
    };

    const initialState = {
      ...initialEmptyState,
      items: [localOldTask, localNewTask],
    };

    const state = tasksReducer(
      initialState,
      mergeTasksWithLWW([remoteNewerTask, remoteOlderTask, remoteBrandNewTask])
    );

    expect(state.items).toHaveLength(3);

    const task100 = state.items.find((t) => t.id === 'task-100');
    expect(task100?.title).toBe('Серверная более свежая версия');
    expect(task100?.syncStatus).toBe('synced');

    const task200 = state.items.find((t) => t.id === 'task-200');
    expect(task200?.title).toBe('Локальная свежая версия');

    const task300 = state.items.find((t) => t.id === 'task-300');
    expect(task300?.title).toBe('Новый наряд с сервера');
    expect(task300?.syncStatus).toBe('synced');
  });

  it('should handle setSortOptions, setFilterStatus and setSearchQuery', () => {
    let state = tasksReducer(
      initialEmptyState,
      setSortOptions({ by: 'dueDate', order: 'asc' })
    );
    expect(state.sortOptions.by).toBe('dueDate');
    expect(state.sortOptions.order).toBe('asc');

    state = tasksReducer(state, setFilterStatus('Completed'));
    expect(state.filterStatus).toBe('Completed');

    state = tasksReducer(state, setSearchQuery('кабель'));
    expect(state.searchQuery).toBe('кабель');
  });
});
