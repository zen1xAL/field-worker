import {
  historyReducer,
  setHistory,
  addHistoryItem,
  clearHistory,
} from '@/store/slices/historySlice';
import { HistoryLogItem } from '@/types';

describe('historySlice', () => {
  const initialEmptyState = {
    items: [],
  };

  const sampleLog: HistoryLogItem = {
    id: 'hist-1',
    taskId: 'task-100',
    taskTitle: 'Проверка щита',
    timestamp: '2026-10-02T10:00:00.000Z',
    actionType: 'CREATE',
    description: 'Создан наряд на выезд',
  };

  it('should handle setHistory', () => {
    const state = historyReducer(initialEmptyState, setHistory([sampleLog]));
    expect(state.items).toHaveLength(1);
    expect(state.items[0].id).toBe('hist-1');
  });

  it('should handle addHistoryItem and generate id and timestamp if not provided', () => {
    const state = historyReducer(
      initialEmptyState,
      addHistoryItem({
        actionType: 'STATUS_CHANGE',
        description: 'Статус наряда изменен на В работе',
        taskId: 'task-100',
      })
    );

    expect(state.items).toHaveLength(1);
    expect(state.items[0].id).toMatch(/^hist-/);
    expect(state.items[0].actionType).toBe('STATUS_CHANGE');
    expect(new Date(state.items[0].timestamp).getTime()).not.toBeNaN();
  });

  it('should prepend newer history items to the beginning', () => {
    const stateWithOne = historyReducer(initialEmptyState, setHistory([sampleLog]));
    const state = historyReducer(
      stateWithOne,
      addHistoryItem({
        id: 'hist-2',
        actionType: 'SYNC',
        description: 'Синхронизация с сервером выполнена',
      })
    );

    expect(state.items).toHaveLength(2);
    expect(state.items[0].id).toBe('hist-2');
    expect(state.items[1].id).toBe('hist-1');
  });

  it('should clear history', () => {
    const stateWithOne = historyReducer(initialEmptyState, setHistory([sampleLog]));
    const state = historyReducer(stateWithOne, clearHistory());
    expect(state.items).toHaveLength(0);
  });
});
