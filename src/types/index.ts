export type TaskStatus = 'New' | 'In Progress' | 'Completed' | 'Cancelled';

export type SyncStatus = 'synced' | 'pending' | 'failed';

export type OutboxActionType = 'CREATE' | 'UPDATE' | 'STATUS_CHANGE' | 'DELETE';

export interface OutboxQueueItem {
  id: string;
  taskId: string;
  actionType: OutboxActionType;
  payload: Partial<Task>;
  timestamp: string;
  retryCount: number;
}

export interface TaskLocation {
  address: string;
  latitude?: number;
  longitude?: number;
}

export interface TaskAttachment {
  id: string;
  uri: string;
  name: string;
  type: 'image' | 'file';
  size?: number;
  createdAt: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  status: TaskStatus;
  location: TaskLocation;
  attachments: TaskAttachment[];
  syncStatus: SyncStatus;
  createdAt: string;
  updatedAt: string;
}

export type HistoryActionType =
  | 'CREATE'
  | 'STATUS_CHANGE'
  | 'EDIT'
  | 'ATTACHMENT_ADD'
  | 'ATTACHMENT_REMOVE'
  | 'DELETE'
  | 'SYNC';

export interface HistoryLogItem {
  id: string;
  taskId?: string;
  taskTitle?: string;
  timestamp: string;
  actionType: HistoryActionType;
  description: string;
}

export type ThemeMode = 'light' | 'dark';

export type TaskSortBy = 'createdAt' | 'dueDate' | 'status';

export type TaskSortOrder = 'asc' | 'desc';

export interface TaskSortOptions {
  by: TaskSortBy;
  order: TaskSortOrder;
}

export interface CreateTaskInput {
  title: string;
  description: string;
  dueDate: string;
  location: TaskLocation;
  attachments?: TaskAttachment[];
  status?: TaskStatus;
}

export interface UpdateTaskInput {
  id: string;
  title?: string;
  description?: string;
  dueDate?: string;
  location?: TaskLocation;
  attachments?: TaskAttachment[];
  status?: TaskStatus;
}
