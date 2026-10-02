import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  addTask,
  updateTask,
  deleteTask,
  setTaskStatus,
} from '@/store/slices/tasksSlice';
import { addHistoryItem } from '@/store/slices/historySlice';
import { NotificationService } from '@/services/notificationService';
import { CreateTaskInput, Task, TaskAttachment, TaskStatus, UpdateTaskInput } from '@/types';

export const useTaskActions = () => {
  const dispatch = useAppDispatch();
  const tasks = useAppSelector((state) => state.tasks.items);

  const createTask = async (input: CreateTaskInput): Promise<Task> => {
    const timestamp = new Date().toISOString();
    const newTask: Task = {
      id: `task-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      title: input.title,
      description: input.description,
      dueDate: input.dueDate,
      status: input.status ?? 'New',
      location: input.location,
      attachments: input.attachments ?? [],
      syncStatus: 'pending',
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    dispatch(addTask(newTask));
    dispatch(
      addHistoryItem({
        actionType: 'CREATE',
        taskId: newTask.id,
        taskTitle: newTask.title,
        description: `Создан наряд на выезд «${newTask.title}»`,
      })
    );

    await NotificationService.scheduleTaskReminder(newTask);
    return newTask;
  };

  const editTask = async (input: UpdateTaskInput): Promise<void> => {
    dispatch(updateTask(input));

    const existingTask = tasks.find((item) => item.id === input.id);
    const title = input.title ?? existingTask?.title;

    dispatch(
      addHistoryItem({
        actionType: 'EDIT',
        taskId: input.id,
        taskTitle: title,
        description: `Обновлены данные наряда «${title ?? input.id}»`,
      })
    );

    if (existingTask && input.dueDate) {
      const updatedTask: Task = {
        ...existingTask,
        ...input,
        title: title ?? existingTask.title,
        description: input.description ?? existingTask.description,
        dueDate: input.dueDate,
        location: input.location ?? existingTask.location,
        attachments: input.attachments ?? existingTask.attachments,
        status: input.status ?? existingTask.status,
        updatedAt: new Date().toISOString(),
        syncStatus: 'pending',
      };
      await NotificationService.scheduleTaskReminder(updatedTask);
    }
  };

  const changeStatus = (taskId: string, newStatus: TaskStatus): void => {
    const existingTask = tasks.find((item) => item.id === taskId);
    dispatch(setTaskStatus({ id: taskId, status: newStatus }));

    dispatch(
      addHistoryItem({
        actionType: 'STATUS_CHANGE',
        taskId,
        taskTitle: existingTask?.title,
        description: `Статус наряда изменен на «${newStatus}»`,
      })
    );
  };

  const removeTask = (taskId: string): void => {
    const existingTask = tasks.find((item) => item.id === taskId);
    dispatch(deleteTask(taskId));

    dispatch(
      addHistoryItem({
        actionType: 'DELETE',
        taskId,
        taskTitle: existingTask?.title,
        description: `Удален наряд «${existingTask?.title ?? taskId}»`,
      })
    );
  };

  const addAttachment = (taskId: string, attachment: TaskAttachment): void => {
    const existingTask = tasks.find((item) => item.id === taskId);
    if (!existingTask) {
      return;
    }

    const updatedAttachments = [...existingTask.attachments, attachment];
    dispatch(updateTask({ id: taskId, attachments: updatedAttachments }));

    dispatch(
      addHistoryItem({
        actionType: 'ATTACHMENT_ADD',
        taskId,
        taskTitle: existingTask.title,
        description: `Добавлено фото «${attachment.name}»`,
      })
    );
  };

  const removeAttachment = (taskId: string, attachmentId: string): void => {
    const existingTask = tasks.find((item) => item.id === taskId);
    if (!existingTask) {
      return;
    }

    const updatedAttachments = existingTask.attachments.filter(
      (item) => item.id !== attachmentId
    );
    dispatch(updateTask({ id: taskId, attachments: updatedAttachments }));

    dispatch(
      addHistoryItem({
        actionType: 'ATTACHMENT_REMOVE',
        taskId,
        taskTitle: existingTask.title,
        description: 'Удалено фото из наряда',
      })
    );
  };

  return {
    createTask,
    editTask,
    changeStatus,
    removeTask,
    addAttachment,
    removeAttachment,
  };
};
