import { z } from 'zod';

export const taskLocationSchema = z.object({
  address: z.string().trim().min(3, 'Укажите точный адрес объекта (минимум 3 символа)'),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});

export const taskAttachmentSchema = z.object({
  id: z.string(),
  uri: z.string().min(1, 'Некорректный путь к файлу'),
  name: z.string().min(1, 'Укажите имя файла'),
  type: z.enum(['image', 'file']),
  size: z.number().optional(),
  createdAt: z.string(),
});

export const taskValidationSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, 'Название наряда должно содержать не менее 3 символов')
    .max(120, 'Название наряда не должно превышать 120 символов'),
  description: z
    .string()
    .trim()
    .min(5, 'Описание наряда должно содержать не менее 5 символов')
    .max(2000, 'Описание наряда слишком длинное (максимум 2000 символов)'),
  dueDate: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), {
      message: 'Укажите корректную дату и время дедлайна',
    }),
  location: taskLocationSchema,
  status: z.enum(['New', 'In Progress', 'Completed', 'Cancelled']).default('New'),
  attachments: z.array(taskAttachmentSchema).default([]),
});

export type TaskValidationForm = z.infer<typeof taskValidationSchema>;
