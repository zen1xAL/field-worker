import { TaskStatus } from '@/types';

const MONTH_NAMES_SHORT = [
  'янв',
  'фев',
  'мар',
  'апр',
  'мая',
  'июн',
  'июл',
  'авг',
  'сен',
  'окт',
  'ноя',
  'дек',
] as const;

const padZero = (value: number): string => {
  return value < 10 ? `0${value}` : `${value}`;
};

export const formatTaskDateTime = (isoString: string): string => {
  const date = new Date(isoString);
  if (isNaN(date.getTime())) {
    return 'Дата не указана';
  }

  const day = date.getDate();
  const month = MONTH_NAMES_SHORT[date.getMonth()];
  const hours = padZero(date.getHours());
  const minutes = padZero(date.getMinutes());

  return `${day} ${month}, ${hours}:${minutes}`;
};

export const formatTaskDateOnly = (isoString: string): string => {
  const date = new Date(isoString);
  if (isNaN(date.getTime())) {
    return '–';
  }

  const day = date.getDate();
  const month = MONTH_NAMES_SHORT[date.getMonth()];
  const year = date.getFullYear();

  return `${day} ${month} ${year}`;
};

export const formatTaskTimeOnly = (isoString: string): string => {
  const date = new Date(isoString);
  if (isNaN(date.getTime())) {
    return '–';
  }

  const hours = padZero(date.getHours());
  const minutes = padZero(date.getMinutes());

  return `${hours}:${minutes}`;
};

export const isTaskOverdue = (dueDateIso: string, status: TaskStatus): boolean => {
  if (status === 'Completed' || status === 'Cancelled') {
    return false;
  }

  const dueDate = new Date(dueDateIso);
  if (isNaN(dueDate.getTime())) {
    return false;
  }

  return dueDate.getTime() < Date.now();
};

export const formatTimeRemaining = (dueDateIso: string, status: TaskStatus): string => {
  if (status === 'Completed') {
    return 'Выполнен';
  }
  if (status === 'Cancelled') {
    return 'Отменен';
  }

  const dueDate = new Date(dueDateIso);
  if (isNaN(dueDate.getTime())) {
    return '–';
  }

  const diffMs = dueDate.getTime() - Date.now();
  const isOverdue = diffMs < 0;
  const absDiffMinutes = Math.floor(Math.abs(diffMs) / (1000 * 60));

  if (absDiffMinutes < 60) {
    return isOverdue
      ? `Просрочено на ${absDiffMinutes} мин`
      : `Осталось ${absDiffMinutes} мин`;
  }

  const hours = Math.floor(absDiffMinutes / 60);
  const remainingMinutes = absDiffMinutes % 60;

  if (hours < 24) {
    return isOverdue
      ? `Просрочено на ${hours} ч ${remainingMinutes} мин`
      : `Осталось ${hours} ч ${remainingMinutes} мин`;
  }

  const days = Math.floor(hours / 24);
  return isOverdue ? `Просрочено на ${days} дн` : `Осталось ${days} дн`;
};

export const getDefaultDueDate = (): string => {
  const date = new Date();
  date.setHours(date.getHours() + 3);
  date.setMinutes(0);
  date.setSeconds(0);
  date.setMilliseconds(0);
  return date.toISOString();
};
