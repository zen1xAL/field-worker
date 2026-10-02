import { OutboxQueueItem, Task } from '@/types';

export interface ServerHealthCheckResult {
  ok: boolean;
  message: string;
  count?: number;
}

export const syncService = {
  async checkConnection(serverUrl: string): Promise<ServerHealthCheckResult> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);

      const response = await fetch(`${serverUrl}/tasks`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        return {
          ok: false,
          message: `Сервер вернул статус ${response.status} ${response.statusText}`,
        };
      }

      const tasks = (await response.json()) as Task[];
      return {
        ok: true,
        message: `Подключение успешно. На сервере обнаружено нарядов: ${tasks.length}`,
        count: tasks.length,
      };
    } catch (error) {
      const err = error as Error;
      if (err.name === 'AbortError') {
        return {
          ok: false,
          message: 'Таймаут подключения (сервер не ответил за 4 секунды)',
        };
      }
      return {
        ok: false,
        message: `Сетевая ошибка: ${err.message || 'Не удалось установить соединение'}`,
      };
    }
  },

  async fetchRemoteTasks(serverUrl: string): Promise<Task[]> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    try {
      const response = await fetch(`${serverUrl}/tasks`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Ошибка получения данных: ${response.status}`);
      }

      const tasks = (await response.json()) as Task[];
      return tasks.map((task) => ({
        ...task,
        syncStatus: 'synced',
      }));
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  },

  async processOutboxItem(serverUrl: string, item: OutboxQueueItem): Promise<boolean> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    try {
      if (item.actionType === 'DELETE') {
        const response = await fetch(`${serverUrl}/tasks/${item.taskId}`, {
          method: 'DELETE',
          signal: controller.signal,
        });
        clearTimeout(timeoutId);
        return response.ok || response.status === 404;
      }

      if (item.actionType === 'CREATE') {
        const payloadWithSyncedStatus: Task = {
          ...(item.payload as Task),
          syncStatus: 'synced',
        };

        const postResponse = await fetch(`${serverUrl}/tasks`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payloadWithSyncedStatus),
          signal: controller.signal,
        });

        if (postResponse.ok || postResponse.status === 201) {
          clearTimeout(timeoutId);
          return true;
        }

        const putResponse = await fetch(`${serverUrl}/tasks/${item.taskId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payloadWithSyncedStatus),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);
        return putResponse.ok;
      }

      const patchResponse = await fetch(`${serverUrl}/tasks/${item.taskId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...item.payload,
          syncStatus: 'synced',
        }),
        signal: controller.signal,
      });

      if (patchResponse.ok) {
        clearTimeout(timeoutId);
        return true;
      }

      if (patchResponse.status === 404 && item.payload) {
        const postFallback = await fetch(`${serverUrl}/tasks`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...item.payload,
            syncStatus: 'synced',
          }),
          signal: controller.signal,
        });
        clearTimeout(timeoutId);
        return postFallback.ok || postFallback.status === 201;
      }

      clearTimeout(timeoutId);
      return false;
    } catch {
      clearTimeout(timeoutId);
      return false;
    }
  },
};
