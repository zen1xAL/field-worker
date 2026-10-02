import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setTasks } from '@/store/slices/tasksSlice';
import { setHistory } from '@/store/slices/historySlice';
import { setThemeMode } from '@/store/slices/themeSlice';
import { setOutboxQueue, setServerUrl } from '@/store/slices/syncSlice';
import { storageService } from '@/services';
import { NotificationService } from '@/services/notificationService';

export const useAppInitialization = () => {
  const dispatch = useAppDispatch();
  const [isReady, setIsReady] = useState(false);

  const tasks = useAppSelector((state) => state.tasks.items);
  const history = useAppSelector((state) => state.history.items);
  const themeMode = useAppSelector((state) => state.theme.mode);
  const outboxQueue = useAppSelector((state) => state.sync.outboxQueue);

  useEffect(() => {
    let isMounted = true;

    const initialize = async () => {
      const [savedTasks, savedHistory, savedTheme, savedQueue, savedServerUrl] =
        await Promise.all([
          storageService.getTasks(),
          storageService.getHistory(),
          storageService.getTheme(),
          storageService.getSyncQueue(),
          storageService.getServerUrl(),
          NotificationService.initialize(),
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
      if (savedQueue.length > 0) {
        dispatch(setOutboxQueue(savedQueue));
      }
      if (savedServerUrl) {
        dispatch(setServerUrl(savedServerUrl));
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

  useEffect(() => {
    if (!isReady) {
      return;
    }
    storageService.saveSyncQueue(outboxQueue);
  }, [outboxQueue, isReady]);

  return { isReady };
};
