import { configureStore } from '@reduxjs/toolkit';
import { themeReducer } from './slices/themeSlice';
import { tasksReducer } from './slices/tasksSlice';
import { historyReducer } from './slices/historySlice';
import { syncReducer } from './slices/syncSlice';

export const store = configureStore({
  reducer: {
    theme: themeReducer,
    tasks: tasksReducer,
    history: historyReducer,
    sync: syncReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
