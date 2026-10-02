import { TaskAttachment, TaskStatus } from '@/types';

export interface TaskFormErrors {
  title?: string;
  description?: string;
  dueDate?: string;
  address?: string;
}

export interface TaskValidationResult {
  isValid: boolean;
  errors: TaskFormErrors;
}

export interface TaskFormData {
  title: string;
  description: string;
  dueDate: string;
  address: string;
  latitude?: number;
  longitude?: number;
  status: TaskStatus;
  attachments: TaskAttachment[];
}

export const validateTaskForm = (data: Partial<TaskFormData>): TaskValidationResult => {
  const errors: TaskFormErrors = {};

  const trimmedTitle = data.title ? data.title.trim() : '';
  if (!trimmedTitle) {
    errors.title = 'Укажите название наряда';
  } else if (trimmedTitle.length < 3) {
    errors.title = 'Название наряда должно содержать не менее 3 символов';
  } else if (trimmedTitle.length > 120) {
    errors.title = 'Название наряда не должно превышать 120 символов';
  }

  const trimmedDescription = data.description ? data.description.trim() : '';
  if (!trimmedDescription) {
    errors.description = 'Укажите описание задачи наряда';
  } else if (trimmedDescription.length < 5) {
    errors.description = 'Описание должно содержать не менее 5 символов';
  } else if (trimmedDescription.length > 2000) {
    errors.description = 'Описание слишком длинное (максимум 2000 символов)';
  }

  const rawDueDate = data.dueDate ? data.dueDate.trim() : '';
  if (!rawDueDate) {
    errors.dueDate = 'Укажите дату и время выполнения';
  } else {
    const parsedDate = new Date(rawDueDate);
    if (isNaN(parsedDate.getTime())) {
      errors.dueDate = 'Некорректный формат даты и времени';
    }
  }

  const trimmedAddress = data.address ? data.address.trim() : '';
  if (!trimmedAddress) {
    errors.address = 'Укажите адрес объекта';
  } else if (trimmedAddress.length < 3) {
    errors.address = 'Адрес объекта должен содержать не менее 3 символов';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
