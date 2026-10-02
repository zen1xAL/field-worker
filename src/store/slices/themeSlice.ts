import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ThemeMode } from '@/types';

interface ThemeState {
  mode: ThemeMode;
}

const initialState: ThemeState = {
  mode: 'light',
};

export const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.mode = state.mode === 'light' ? 'dark' : 'light';
    },
    setThemeMode: (state, action: PayloadAction<ThemeMode>) => {
      state.mode = action.payload;
    },
  },
});

export const { toggleTheme, setThemeMode } = themeSlice.actions;
export const themeReducer = themeSlice.reducer;
