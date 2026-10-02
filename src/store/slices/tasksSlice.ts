import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SyncStatus, Task, TaskSortOptions, TaskStatus, UpdateTaskInput } from '@/types';

interface TasksState {
  items: Task[];
  sortOptions: TaskSortOptions;
  filterStatus: TaskStatus | 'All';
  searchQuery: string;
}

const initialState: TasksState = {
  items: [],
  sortOptions: {
    by: 'createdAt',
    order: 'desc',
  },
  filterStatus: 'All',
  searchQuery: '',
};

export const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setTasks: (state, action: PayloadAction<Task[]>) => {
      state.items = action.payload;
    },
    addTask: (state, action: PayloadAction<Task>) => {
      state.items.unshift(action.payload);
    },
    updateTask: (state, action: PayloadAction<UpdateTaskInput>) => {
      const index = state.items.findIndex((item) => item.id === action.payload.id);
      if (index === -1) {
        return;
      }
      const existing = state.items[index];
      state.items[index] = {
        ...existing,
        title: action.payload.title ?? existing.title,
        description: action.payload.description ?? existing.description,
        dueDate: action.payload.dueDate ?? existing.dueDate,
        location: action.payload.location ?? existing.location,
        attachments: action.payload.attachments ?? existing.attachments,
        status: action.payload.status ?? existing.status,
        updatedAt: new Date().toISOString(),
        syncStatus: 'pending',
      };
    },
    deleteTask: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    setTaskStatus: (
      state,
      action: PayloadAction<{ id: string; status: TaskStatus; updatedAt?: string }>
    ) => {
      const task = state.items.find((item) => item.id === action.payload.id);
      if (!task) {
        return;
      }
      task.status = action.payload.status;
      task.updatedAt = action.payload.updatedAt ?? new Date().toISOString();
      task.syncStatus = 'pending';
    },
    setTaskSyncStatus: (
      state,
      action: PayloadAction<{ id: string; syncStatus: SyncStatus }>
    ) => {
      const task = state.items.find((item) => item.id === action.payload.id);
      if (!task) {
        return;
      }
      task.syncStatus = action.payload.syncStatus;
    },
    mergeTasksWithLWW: (state, action: PayloadAction<Task[]>) => {
      const remoteTasks = action.payload;
      const remoteMap = new Map(remoteTasks.map((t) => [t.id, t]));

      state.items = state.items.map((localTask) => {
        const remoteTask = remoteMap.get(localTask.id);
        if (!remoteTask) {
          return localTask;
        }
        remoteMap.delete(localTask.id);

        const remoteTime = new Date(remoteTask.updatedAt).getTime();
        const localTime = new Date(localTask.updatedAt).getTime();

        if (remoteTime > localTime) {
          return {
            ...remoteTask,
            syncStatus: 'synced',
          };
        }
        return localTask;
      });

      remoteMap.forEach((newRemoteTask) => {
        state.items.unshift({
          ...newRemoteTask,
          syncStatus: 'synced',
        });
      });
    },
    setSortOptions: (state, action: PayloadAction<TaskSortOptions>) => {
      state.sortOptions = action.payload;
    },
    setFilterStatus: (state, action: PayloadAction<TaskStatus | 'All'>) => {
      state.filterStatus = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
  },
});

export const {
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
} = tasksSlice.actions;

export const tasksReducer = tasksSlice.reducer;
