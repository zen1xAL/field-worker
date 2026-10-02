import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  setSyncing,
  setLastSyncTimestamp,
  setServerUrl,
  removeFromOutbox,
  setSyncError,
} from '@/store/slices/syncSlice';
import { setTaskSyncStatus, mergeTasksWithLWW } from '@/store/slices/tasksSlice';
import { addHistoryItem } from '@/store/slices/historySlice';
import { syncService, storageService } from '@/services';
import { ServerHealthCheckResult } from '@/services/syncService';

export const useSyncQueue = () => {
  const dispatch = useAppDispatch();

  const isOnline = useAppSelector((state) => state.sync.isOnline);
  const isSyncing = useAppSelector((state) => state.sync.isSyncing);
  const lastSyncTimestamp = useAppSelector((state) => state.sync.lastSyncTimestamp);
  const serverUrl = useAppSelector((state) => state.sync.serverUrl);
  const outboxQueue = useAppSelector((state) => state.sync.outboxQueue);
  const syncError = useAppSelector((state) => state.sync.syncError);

  const checkConnection = useCallback(
    async (urlToCheck?: string): Promise<ServerHealthCheckResult> => {
      const targetUrl = urlToCheck || serverUrl;
      return await syncService.checkConnection(targetUrl);
    },
    [serverUrl]
  );

  const updateServerUrl = useCallback(
    async (newUrl: string): Promise<void> => {
      dispatch(setServerUrl(newUrl));
      await storageService.saveServerUrl(newUrl);
    },
    [dispatch]
  );

  const triggerSync = useCallback(async (): Promise<{ success: boolean; message: string }> => {
    if (!isOnline) {
      return {
        success: false,
        message: 'Устройство находится в автономном режиме (офлайн)',
      };
    }

    if (isSyncing) {
      return {
        success: false,
        message: 'Синхронизация уже выполняется',
      };
    }

    dispatch(setSyncing(true));
    dispatch(setSyncError(null));

    let processedCount = 0;
    let failedCount = 0;

    try {
      const currentQueue = [...outboxQueue];

      for (const item of currentQueue) {
        const success = await syncService.processOutboxItem(serverUrl, item);
        if (success) {
          dispatch(removeFromOutbox(item.id));
          if (item.actionType !== 'DELETE') {
            dispatch(setTaskSyncStatus({ id: item.taskId, syncStatus: 'synced' }));
          }
          processedCount += 1;
        } else {
          dispatch(setTaskSyncStatus({ id: item.taskId, syncStatus: 'failed' }));
          failedCount += 1;
        }
      }

      const remoteTasks = await syncService.fetchRemoteTasks(serverUrl);
      if (remoteTasks && remoteTasks.length > 0) {
        dispatch(mergeTasksWithLWW(remoteTasks));
      }

      const now = new Date().toISOString();
      dispatch(setLastSyncTimestamp(now));

      const summaryDescription =
        failedCount > 0
          ? `Синхронизация с сервером: отправлено ${processedCount}, сбоев ${failedCount}`
          : `Синхронизация с сервером завершена: отправлено ${processedCount}, получено с сервера ${remoteTasks.length}`;

      dispatch(
        addHistoryItem({
          actionType: 'SYNC',
          description: summaryDescription,
        })
      );

      dispatch(setSyncing(false));
      return {
        success: true,
        message: summaryDescription,
      };
    } catch (error) {
      const err = error as Error;
      const errorMessage = err.message || 'Ошибка синхронизации с сервером';
      dispatch(setSyncError(errorMessage));
      dispatch(setSyncing(false));
      return {
        success: false,
        message: errorMessage,
      };
    }
  }, [isOnline, isSyncing, outboxQueue, serverUrl, dispatch]);

  return {
    isOnline,
    isSyncing,
    lastSyncTimestamp,
    serverUrl,
    outboxQueue,
    syncError,
    triggerSync,
    checkConnection,
    updateServerUrl,
  };
};
