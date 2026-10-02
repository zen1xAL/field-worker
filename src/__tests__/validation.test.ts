import { validateTaskForm, TaskFormData } from '@/utils/validation';

describe('validateTaskForm', () => {
  const validData: TaskFormData = {
    title: 'Монтаж оптического кабеля',
    description: 'Прокладка оптики до кроссового шкафа A12',
    dueDate: '2026-10-05T14:00:00.000Z',
    address: 'ул. Ленина, д. 45, корп. 2',
    status: 'New',
    attachments: [],
  };

  it('should validate completely valid form data', () => {
    const result = validateTaskForm(validData);
    expect(result.isValid).toBe(true);
    expect(Object.keys(result.errors)).toHaveLength(0);
  });

  it('should fail when title is missing or empty', () => {
    const result = validateTaskForm({ ...validData, title: '' });
    expect(result.isValid).toBe(false);
    expect(result.errors.title).toBe('Укажите название наряда');
  });

  it('should fail when title has less than 3 characters', () => {
    const result = validateTaskForm({ ...validData, title: 'Аб' });
    expect(result.isValid).toBe(false);
    expect(result.errors.title).toBe('Название наряда должно содержать не менее 3 символов');
  });

  it('should fail when title exceeds 120 characters', () => {
    const longTitle = 'A'.repeat(121);
    const result = validateTaskForm({ ...validData, title: longTitle });
    expect(result.isValid).toBe(false);
    expect(result.errors.title).toBe('Название наряда не должно превышать 120 символов');
  });

  it('should fail when description is missing or empty', () => {
    const result = validateTaskForm({ ...validData, description: '' });
    expect(result.isValid).toBe(false);
    expect(result.errors.description).toBe('Укажите описание задачи наряда');
  });

  it('should fail when description has less than 5 characters', () => {
    const result = validateTaskForm({ ...validData, description: 'Тест' });
    expect(result.isValid).toBe(false);
    expect(result.errors.description).toBe('Описание должно содержать не менее 5 символов');
  });

  it('should fail when dueDate is missing', () => {
    const result = validateTaskForm({ ...validData, dueDate: '' });
    expect(result.isValid).toBe(false);
    expect(result.errors.dueDate).toBe('Укажите дату и время выполнения');
  });

  it('should fail when dueDate format is invalid', () => {
    const result = validateTaskForm({ ...validData, dueDate: 'invalid-date' });
    expect(result.isValid).toBe(false);
    expect(result.errors.dueDate).toBe('Некорректный формат даты и времени');
  });

  it('should fail when address is missing or empty', () => {
    const result = validateTaskForm({ ...validData, address: '' });
    expect(result.isValid).toBe(false);
    expect(result.errors.address).toBe('Укажите адрес объекта');
  });

  it('should fail when address has less than 3 characters', () => {
    const result = validateTaskForm({ ...validData, address: 'Ул' });
    expect(result.isValid).toBe(false);
    expect(result.errors.address).toBe('Адрес объекта должен содержать не менее 3 символов');
  });
});
