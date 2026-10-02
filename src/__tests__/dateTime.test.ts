import {
  formatTaskDateTime,
  formatTaskDateOnly,
  formatTaskTimeOnly,
  isTaskOverdue,
  formatTimeRemaining,
  getDefaultDueDate,
} from '@/utils/dateTime';

describe('dateTime utils', () => {
  it('should format task date and time with Russian month name', () => {
    const formatted = formatTaskDateTime('2026-10-05T14:30:00.000Z');
    expect(formatted).toContain('окт');
  });

  it('should handle invalid date string in formatTaskDateTime gracefully', () => {
    const formatted = formatTaskDateTime('invalid');
    expect(formatted).toBe('Дата не указана');
  });

  it('should format date only and time only', () => {
    const dateOnly = formatTaskDateOnly('2026-10-05T14:30:00.000Z');
    expect(dateOnly).toContain('2026');

    const timeOnly = formatTaskTimeOnly('2026-10-05T14:30:00.000Z');
    expect(timeOnly).toMatch(/^\d{2}:\d{2}$/);
  });

  it('should check overdue status correctly', () => {
    const pastDate = new Date(Date.now() - 3600 * 1000).toISOString();
    const futureDate = new Date(Date.now() + 3600 * 1000).toISOString();

    expect(isTaskOverdue(pastDate, 'New')).toBe(true);
    expect(isTaskOverdue(pastDate, 'In Progress')).toBe(true);
    expect(isTaskOverdue(pastDate, 'Completed')).toBe(false);
    expect(isTaskOverdue(pastDate, 'Cancelled')).toBe(false);
    expect(isTaskOverdue(futureDate, 'New')).toBe(false);
  });

  it('should format time remaining for completed and cancelled tasks', () => {
    const pastDate = new Date(Date.now() - 3600 * 1000).toISOString();
    expect(formatTimeRemaining(pastDate, 'Completed')).toBe('Выполнен');
    expect(formatTimeRemaining(pastDate, 'Cancelled')).toBe('Отменен');
  });

  it('should provide default due date in future', () => {
    const defaultDate = getDefaultDueDate();
    const parsed = new Date(defaultDate).getTime();
    expect(parsed).toBeGreaterThan(Date.now());
  });
});
