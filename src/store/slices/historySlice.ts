import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { HistoryLogItem } from '@/types';

interface HistoryState {
  items: HistoryLogItem[];
}

const initialState: HistoryState = {
  items: [],
};

export const historySlice = createSlice({
  name: 'history',
  initialState,
  reducers: {
    setHistory: (state, action: PayloadAction<HistoryLogItem[]>) => {
      state.items = action.payload;
    },
    addHistoryItem: (
      state,
      action: PayloadAction<Omit<HistoryLogItem, 'id' | 'timestamp'> & { id?: string; timestamp?: string }>
    ) => {
      const newItem: HistoryLogItem = {
        id: action.payload.id ?? `hist-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        timestamp: action.payload.timestamp ?? new Date().toISOString(),
        actionType: action.payload.actionType,
        description: action.payload.description,
        taskId: action.payload.taskId,
        taskTitle: action.payload.taskTitle,
      };
      state.items.unshift(newItem);
    },
    clearHistory: (state) => {
      state.items = [];
    },
  },
});

export const { setHistory, addHistoryItem, clearHistory } = historySlice.actions;
export const historyReducer = historySlice.reducer;
