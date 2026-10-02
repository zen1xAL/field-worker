import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setTasks } from '@/store/slices/tasksSlice';
import { setHistory } from '@/store/slices/historySlice';
import { setThemeMode } from '@/store/slices/themeSlice';
import { storageService } from '@/services';

export const useAppInitialization = () => {
  const dispatch = useAppDispatch();
  const [isReady, setIsReady] = useState(false);

  const tasks = useAppSelector((state) => state.tasks.items);
  const history = useAppSelector((state) => state.history.items);
  const themeMode = useAppSelector((state) => state.theme.mode);

  useEffect(() => {
    let isMounted = true;

    const initialize = async () => {
      const [savedTasks, savedHistory, savedTheme] = await Promise.all([
        storageService.getTasks(),
        storageService.getHistory(),
        storageService.getTheme(),
      ]);

      if (!isMounted) {
        return;
      }

      if (savedTasks.length > 0) {
        dispatch(setTasks(savedTasks));
      }
      if (savedHistory.length > 0) {
        dispatch(setHistory(savedHistory));
      }
      if (savedTheme) {
        dispatch(setThemeMode(savedTheme));
      }

      setIsReady(true);
    };

    initialize();

    return () => {
      isMounted = false;
    };
  }, [dispatch]);

  useEffect(() => {
    if (!isReady) {
      return;
    }
    storageService.saveTasks(tasks);
  }, [tasks, isReady]);

  useEffect(() => {
    if (!isReady) {
      return;
    }
    storageService.saveHistory(history);
  }, [history, isReady]);

  useEffect(() => {
    if (!isReady) {
      return;
    }
    storageService.saveTheme(themeMode);
  }, [themeMode, isReady]);

  return { isReady };
};
