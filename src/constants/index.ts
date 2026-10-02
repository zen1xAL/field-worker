import { SyncStatus, TaskStatus, ThemeMode } from '@/types';

export const CANDIDATE_CODE = 'SA-RN-2026-X1';

export const STORAGE_KEYS = {
  TASKS: '@field_worker/tasks',
  HISTORY: '@field_worker/history',
  THEME: '@field_worker/theme',
  SYNC_QUEUE: '@field_worker/sync_queue',
} as const;

export const NOTIFICATION_CONFIG = {
  STANDARD_OFFSET_MINUTES: 30,
  DEMO_DELAY_SECONDS: 30,
  CHANNEL_ID: 'field-worker-task-reminders',
  CHANNEL_NAME: 'Напоминания о выездах',
} as const;

export const DEFAULT_MAP_REGION = {
  latitude: 53.9006,
  longitude: 27.559,
  latitudeDelta: 0.12,
  longitudeDelta: 0.12,
} as const;

export const SPACING = {
  none: 0,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
} as const;

export const RADIUS = {
  none: 0,
  xs: 4,
  sm: 6,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
} as const;

export const LAYOUT = {
  minTapTarget: 48,
  iconSmall: 16,
  iconMedium: 22,
  iconLarge: 28,
  iconHero: 48,
  tabBarHeight: 60,
  headerHeight: 56,
  calloutWidth: 240,
  photoThumbnailSize: 76,
  deleteBadgeSize: 22,
  timePickerWidth: 120,
  multilineInputHeight: 96,
} as const;

export const TYPOGRAPHY = {
  fontSizes: {
    captionSmall: 11,
    caption: 12,
    bodySmall: 13,
    body: 14,
    bodyMedium: 15,
    titleSmall: 16,
    titleMedium: 18,
    titleLarge: 22,
    headline: 26,
  },
  fontWeights: {
    regular: '400' as const,
    medium: '500' as const,
    semiBold: '600' as const,
    bold: '700' as const,
  },
  lineHeights: {
    tight: 18,
    normal: 20,
    relaxed: 24,
    loose: 28,
  },
} as const;

export const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
  New: 'Новый',
  'In Progress': 'В работе',
  Completed: 'Завершен',
  Cancelled: 'Отменен',
} as const;

export const SYNC_STATUS_LABELS: Record<SyncStatus, string> = {
  synced: 'Синхронизировано',
  pending: 'Ожидает',
  failed: 'Сбой',
} as const;

export const NETWORK_STATUS_LABELS = {
  online: 'В сети',
  offline: 'Автономно',
} as const;

export const PREDEFINED_LOCATIONS = [
  {
    title: 'Технический этаж / Серверная',
    address: 'ул. Ленина, д. 45, корп. 2',
    latitude: 53.9006,
    longitude: 27.559,
  },
  {
    title: 'Электрощитовая ЩР-3',
    address: 'пр. Победителей, д. 103',
    latitude: 53.9312,
    longitude: 27.493,
  },
  {
    title: 'ЦТП-4 Автоматика',
    address: 'ул. Притыцкого, д. 29',
    latitude: 53.9085,
    longitude: 27.4862,
  },
  {
    title: 'Трансформаторная подстанция ТП-112',
    address: 'ул. Козлова, д. 18',
    latitude: 53.9082,
    longitude: 27.5898,
  },
  {
    title: 'Базовая станция связи БС-44',
    address: 'пр. Дзержинского, д. 57',
    latitude: 53.8761,
    longitude: 27.4998,
  },
] as const;

export const THEME_COLORS = {
  light: {
    background: '#F8FAFC',
    surface: '#FFFFFF',
    surfaceSecondary: '#F1F5F9',
    border: '#E2E8F0',
    borderStrong: '#CBD5E1',
    textPrimary: '#0F172A',
    textSecondary: '#475569',
    textMuted: '#94A3B8',
    primary: '#2563EB',
    primaryLight: 'rgba(37, 99, 235, 0.12)',
    primaryDark: '#1D4ED8',
    statusNew: '#2563EB',
    statusNewBg: 'rgba(37, 99, 235, 0.12)',
    statusInProgress: '#D97706',
    statusInProgressBg: 'rgba(217, 119, 6, 0.12)',
    statusCompleted: '#059669',
    statusCompletedBg: 'rgba(5, 150, 105, 0.12)',
    statusCancelled: '#64748B',
    statusCancelledBg: 'rgba(100, 116, 139, 0.12)',
    syncSynced: '#059669',
    syncPending: '#D97706',
    syncFailed: '#DC2626',
    danger: '#DC2626',
    dangerBg: 'rgba(220, 38, 38, 0.12)',
    white: '#FFFFFF',
    modalOverlay: 'rgba(0, 0, 0, 0.45)',
    shadowColor: '#0F172A',
  },
  dark: {
    background: '#0F172A',
    surface: '#1E293B',
    surfaceSecondary: '#334155',
    border: '#334155',
    borderStrong: '#475569',
    textPrimary: '#F8FAFC',
    textSecondary: '#94A3B8',
    textMuted: '#64748B',
    primary: '#3B82F6',
    primaryLight: 'rgba(59, 130, 246, 0.2)',
    primaryDark: '#2563EB',
    statusNew: '#3B82F6',
    statusNewBg: 'rgba(59, 130, 246, 0.2)',
    statusInProgress: '#F59E0B',
    statusInProgressBg: 'rgba(245, 158, 11, 0.2)',
    statusCompleted: '#10B981',
    statusCompletedBg: 'rgba(16, 185, 129, 0.2)',
    statusCancelled: '#94A3B8',
    statusCancelledBg: 'rgba(148, 163, 184, 0.2)',
    syncSynced: '#10B981',
    syncPending: '#F59E0B',
    syncFailed: '#EF4444',
    danger: '#EF4444',
    dangerBg: 'rgba(239, 68, 68, 0.2)',
    white: '#FFFFFF',
    modalOverlay: 'rgba(0, 0, 0, 0.65)',
    shadowColor: '#000000',
  },
} as const;

export type ThemeColors = typeof THEME_COLORS[ThemeMode];
export type Spacing = typeof SPACING;
export type Radius = typeof RADIUS;
export type Typography = typeof TYPOGRAPHY;
export type Layout = typeof LAYOUT;
