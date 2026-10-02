import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SyncState {
  isOnline: boolean;
  isSyncing: boolean;
  lastSyncTimestamp: string | null;
}

const initialState: SyncState = {
  isOnline: true,
  isSyncing: false,
  lastSyncTimestamp: null,
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
  },
});

export const { setOnlineStatus, setSyncing, setLastSyncTimestamp } = syncSlice.actions;
export const syncReducer = syncSlice.reducer;
