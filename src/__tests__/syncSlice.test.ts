import {
  syncReducer,
  setOnlineStatus,
  setSyncing,
  setLastSyncTimestamp,
  setServerUrl,
  setOutboxQueue,
  addToOutbox,
  removeFromOutbox,
  clearOutbox,
  setSyncError,
} from '@/store/slices/syncSlice';
import { OutboxQueueItem } from '@/types';
import { DEFAULT_SERVER_URL } from '@/constants';

describe('syncSlice', () => {
  const initialSyncState = {
    isOnline: true,
    isSyncing: false,
    lastSyncTimestamp: null,
    serverUrl: DEFAULT_SERVER_URL,
    outboxQueue: [],
    syncError: null,
  };

  const sampleOutboxItem: OutboxQueueItem = {
    id: 'outbox-1',
    taskId: 'task-100',
    actionType: 'CREATE',
    payload: {
      id: 'task-100',
      title: 'Новый наряд',
    },
    timestamp: '2026-10-02T12:00:00.000Z',
    retryCount: 0,
  };

  it('should have correct default initial state', () => {
    const state = syncReducer(undefined, { type: 'unknown' });
    expect(state.isOnline).toBe(true);
    expect(state.isSyncing).toBe(false);
    expect(state.lastSyncTimestamp).toBeNull();
    expect(state.serverUrl).toBe(DEFAULT_SERVER_URL);
    expect(state.outboxQueue).toHaveLength(0);
  });

  it('should update online status', () => {
    const state = syncReducer(initialSyncState, setOnlineStatus(false));
    expect(state.isOnline).toBe(false);
  });

  it('should update syncing status', () => {
    const state = syncReducer(initialSyncState, setSyncing(true));
    expect(state.isSyncing).toBe(true);
  });

  it('should update last sync timestamp', () => {
    const now = '2026-10-02T14:30:00.000Z';
    const state = syncReducer(initialSyncState, setLastSyncTimestamp(now));
    expect(state.lastSyncTimestamp).toBe(now);
  });

  it('should update server url', () => {
    const customUrl = 'http://192.168.1.50:4000';
    const state = syncReducer(initialSyncState, setServerUrl(customUrl));
    expect(state.serverUrl).toBe(customUrl);
  });

  it('should add item to outbox queue', () => {
    const state = syncReducer(initialSyncState, addToOutbox(sampleOutboxItem));
    expect(state.outboxQueue).toHaveLength(1);
    expect(state.outboxQueue[0].id).toBe('outbox-1');
  });

  it('should replace existing item in outbox if taskId matches', () => {
    const stateWithOne = syncReducer(initialSyncState, addToOutbox(sampleOutboxItem));

    const updatedItem: OutboxQueueItem = {
      ...sampleOutboxItem,
      id: 'outbox-2',
      actionType: 'UPDATE',
      payload: { title: 'Измененный наряд' },
    };

    const state = syncReducer(stateWithOne, addToOutbox(updatedItem));
    expect(state.outboxQueue).toHaveLength(1);
    expect(state.outboxQueue[0].id).toBe('outbox-2');
    expect(state.outboxQueue[0].actionType).toBe('UPDATE');
  });

  it('should remove item from outbox by id', () => {
    const stateWithOne = syncReducer(initialSyncState, addToOutbox(sampleOutboxItem));
    const state = syncReducer(stateWithOne, removeFromOutbox('outbox-1'));
    expect(state.outboxQueue).toHaveLength(0);
  });

  it('should clear outbox queue', () => {
    const stateWithOne = syncReducer(initialSyncState, addToOutbox(sampleOutboxItem));
    const state = syncReducer(stateWithOne, clearOutbox());
    expect(state.outboxQueue).toHaveLength(0);
  });

  it('should set and clear sync error', () => {
    const stateWithError = syncReducer(
      initialSyncState,
      setSyncError('Сбой соединения с сервером')
    );
    expect(stateWithError.syncError).toBe('Сбой соединения с сервером');

    const stateCleared = syncReducer(stateWithError, setSyncError(null));
    expect(stateCleared.syncError).toBeNull();
  });
});
