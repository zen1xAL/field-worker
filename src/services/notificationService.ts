import { Platform } from 'react-native';
import { setNotificationHandler } from 'expo-notifications/build/NotificationsHandler';
import {
  getPermissionsAsync,
  requestPermissionsAsync,
} from 'expo-notifications/build/NotificationPermissions';
import { setNotificationChannelAsync } from 'expo-notifications/build/setNotificationChannelAsync';
import { AndroidImportance } from 'expo-notifications/build/NotificationChannelManager.types';
import { scheduleNotificationAsync } from 'expo-notifications/build/scheduleNotificationAsync';
import { cancelScheduledNotificationAsync } from 'expo-notifications/build/cancelScheduledNotificationAsync';
import { SchedulableTriggerInputTypes } from 'expo-notifications/build/Notifications.types';
import { NOTIFICATION_CONFIG } from '@/constants';
import { Task } from '@/types';

setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export class NotificationService {
  private static isInitialized = false;

  public static async initialize(): Promise<void> {
    if (this.isInitialized) {
      return;
    }

    try {
      const { status: existingStatus } = await getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        return;
      }

      if (Platform.OS === 'android') {
        await setNotificationChannelAsync(NOTIFICATION_CONFIG.CHANNEL_ID, {
          name: NOTIFICATION_CONFIG.CHANNEL_NAME,
          importance: AndroidImportance.HIGH,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#2563EB',
          sound: 'default',
        });
      }

      this.isInitialized = true;
    } catch {
      this.isInitialized = false;
    }
  }

  public static async scheduleTaskReminder(task: Task): Promise<string | null> {
    try {
      await this.initialize();

      const dueDate = new Date(task.dueDate);
      if (isNaN(dueDate.getTime())) {
        return null;
      }

      const offsetMs = NOTIFICATION_CONFIG.STANDARD_OFFSET_MINUTES * 60 * 1000;
      const scheduledTime = dueDate.getTime() - offsetMs;
      const now = Date.now();

      let delaySeconds = Math.floor((scheduledTime - now) / 1000);

      if (delaySeconds <= 0) {
        const directDiffSeconds = Math.floor((dueDate.getTime() - now) / 1000);
        if (directDiffSeconds > 60) {
          delaySeconds = 60;
        } else {
          return null;
        }
      }

      const notificationId = await scheduleNotificationAsync({
        content: {
          title: `Напоминание о выезде: ${task.title}`,
          body: `Объект: ${task.location.address}. Дедлайн приближается!`,
          data: { taskId: task.id },
          sound: 'default',
        },
        trigger: {
          type: SchedulableTriggerInputTypes.TIME_INTERVAL,
          seconds: delaySeconds,
        },
      });

      return notificationId;
    } catch {
      return null;
    }
  }

  public static async triggerDemoReminder(taskTitle: string): Promise<string | null> {
    try {
      await this.initialize();

      const notificationId = await scheduleNotificationAsync({
        content: {
          title: `[ДЕМО 30с] Напоминание по задаче`,
          body: `Наряд: «${taskTitle}». Проверка доставки локального уведомления.`,
          sound: 'default',
        },
        trigger: {
          type: SchedulableTriggerInputTypes.TIME_INTERVAL,
          seconds: NOTIFICATION_CONFIG.DEMO_DELAY_SECONDS,
        },
      });

      return notificationId;
    } catch {
      return null;
    }
  }

  public static async cancelReminder(notificationId: string): Promise<void> {
    try {
      await cancelScheduledNotificationAsync(notificationId);
    } catch {
      return;
    }
  }
}
