import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '@/constants';
import { HistoryLogItem, Task, ThemeMode } from '@/types';

export const storageService = {
  async getTasks(): Promise<Task[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.TASKS);
      if (!data) {
        return [];
      }
      return JSON.parse(data) as Task[];
    } catch {
      return [];
    }
  },

  async saveTasks(tasks: Task[]): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
    } catch {}
  },

  async getHistory(): Promise<HistoryLogItem[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.HISTORY);
      if (!data) {
        return [];
      }
      return JSON.parse(data) as HistoryLogItem[];
    } catch {
      return [];
    }
  },

  async saveHistory(items: HistoryLogItem[]): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(items));
    } catch {}
  },

  async getTheme(): Promise<ThemeMode | null> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.THEME);
      if (data === 'light' || data === 'dark') {
        return data;
      }
      return null;
    } catch {
      return null;
    }
  },

  async saveTheme(theme: ThemeMode): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.THEME, theme);
    } catch {}
  },

  async getSyncQueue(): Promise<string[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.SYNC_QUEUE);
      if (!data) {
        return [];
      }
      return JSON.parse(data) as string[];
    } catch {
      return [];
    }
  },

  async saveSyncQueue(queue: string[]): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.SYNC_QUEUE, JSON.stringify(queue));
    } catch {}
  },
};
