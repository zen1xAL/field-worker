import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DEFAULT_SERVER_URL } from '@/constants';
import { OutboxQueueItem } from '@/types';

interface SyncState {
  isOnline: boolean;
  isSyncing: boolean;
  lastSyncTimestamp: string | null;
  serverUrl: string;
  outboxQueue: OutboxQueueItem[];
  syncError: string | null;
}

const initialState: SyncState = {
  isOnline: true,
  isSyncing: false,
  lastSyncTimestamp: null,
  serverUrl: DEFAULT_SERVER_URL,
  outboxQueue: [],
  syncError: null,
};

export const syncSlice = createSlice({
  name: 'sync',
  initialState,
  reducers: {
    setOnlineStatus: (state, action: PayloadAction<boolean>) => {
      state.isOnline = action.payload;
    },
    setSyncing: (state, action: PayloadAction<boolean>) => {
      state.isSyncing = action.payload;
    },
    setLastSyncTimestamp: (state, action: PayloadAction<string>) => {
      state.lastSyncTimestamp = action.payload;
    },
    setServerUrl: (state, action: PayloadAction<string>) => {
      state.serverUrl = action.payload;
    },
    setOutboxQueue: (state, action: PayloadAction<OutboxQueueItem[]>) => {
      state.outboxQueue = action.payload;
    },
    addToOutbox: (state, action: PayloadAction<OutboxQueueItem>) => {
      const existingIndex = state.outboxQueue.findIndex(
        (item) => item.taskId === action.payload.taskId
      );
      if (existingIndex >= 0) {
        state.outboxQueue[existingIndex] = action.payload;
      } else {
        state.outboxQueue.push(action.payload);
      }
    },
    removeFromOutbox: (state, action: PayloadAction<string>) => {
      state.outboxQueue = state.outboxQueue.filter((item) => item.id !== action.payload);
    },
    clearOutbox: (state) => {
      state.outboxQueue = [];
    },
    setSyncError: (state, action: PayloadAction<string | null>) => {
      state.syncError = action.payload;
    },
  },
});

export const {
  setOnlineStatus,
  setSyncing,
  setLastSyncTimestamp,
  setServerUrl,
  setOutboxQueue,
  addToOutbox,
  removeFromOutbox,
  clearOutbox,
  setSyncError,
} = syncSlice.actions;

export const syncReducer = syncSlice.reducer;
