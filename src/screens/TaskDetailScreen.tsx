import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';
import { useAppSelector } from '@/store/hooks';
import { selectTaskById } from '@/store/selectors/tasksSelectors';
import { useTaskActions } from '@/hooks/useTaskActions';
import { NotificationService } from '@/services/notificationService';
import { RootStackParamList } from '@/navigation/types';
import { TaskStatus } from '@/types';
import { formatTaskDateTime, formatTimeRemaining, isTaskOverdue } from '@/utils/dateTime';
import { ScreenHeader } from '@/components/UI/ScreenHeader';
import { AppCard } from '@/components/UI/AppCard';
import { AppButton } from '@/components/UI/AppButton';
import { AppBadge } from '@/components/UI/AppBadge';
import { TaskStatusBadge } from '@/components/Features/TaskStatusBadge';
import { SyncStatusBadge } from '@/components/Features/SyncStatusBadge';
import { AttachmentPickerSection } from '@/components/Features/AttachmentPickerSection';

export const TaskDetailScreen = () => {
  const { colors, spacing, typography, layout, radius } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'TaskDetail'>>();
  const taskId = route.params.taskId;

  const task = useAppSelector(selectTaskById(taskId));
  const { changeStatus, removeTask, addAttachment, removeAttachment } = useTaskActions();

  if (!task) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <ScreenHeader
          title="Детали наряда"
          showBackButton
          onBackPress={() => navigation.goBack()}
        />
        <View style={[styles.notFoundContainer, { padding: spacing.xl }]}>
          <Ionicons
            name="alert-circle-outline"
            size={layout.iconHero}
            color={colors.textMuted}
            style={{ marginBottom: spacing.md }}
          />
          <Text
            style={[
              styles.notFoundTitle,
              {
                color: colors.textPrimary,
                fontSize: typography.fontSizes.titleSmall,
                fontWeight: typography.fontWeights.semiBold,
                marginBottom: spacing.xs,
              },
            ]}
          >
            Наряд не найден
          </Text>
          <Text
            style={[
              styles.notFoundText,
              {
                color: colors.textSecondary,
                fontSize: typography.fontSizes.body,
                marginBottom: spacing.lg,
                textAlign: 'center',
              },
            ]}
          >
            Возможно, он был удален или перемещен.
          </Text>
          <AppButton title="Вернуться к списку" onPress={() => navigation.goBack()} />
        </View>
      </View>
    );
  }

  const isOverdue = isTaskOverdue(task.dueDate, task.status);
  const timeRemaining = formatTimeRemaining(task.dueDate, task.status);

  const handleEditPress = () => {
    navigation.navigate('CreateEditTask', { taskId: task.id });
  };

  const handleDeletePress = () => {
    Alert.alert(
      'Удаление наряда',
      `Вы действительно хотите удалить наряд «${task.title}»? Действие нельзя отменить.`,
      [
        { text: 'Отмена', style: 'cancel' },
        {
          text: 'Удалить',
          style: 'destructive',
          onPress: () => {
            removeTask(task.id);
            navigation.goBack();
          },
        },
      ]
    );
  };

  const handleStatusChange = (newStatus: TaskStatus) => {
    changeStatus(task.id, newStatus);
  };

  const handleTriggerDemoReminder = async () => {
    const notificationId = await NotificationService.triggerDemoReminder(task.title);
    if (notificationId) {
      Alert.alert(
        'Демо-уведомление запланировано',
        'Локальное пуш-уведомление поступит ровно через 30 секунд для проверки доставки.'
      );
    } else {
      Alert.alert(
        'Уведомления отключены',
        'Проверьте системные разрешения на показ уведомлений в настройках устройства.'
      );
    }
  };

  const handleShowOnMap = () => {
    navigation.navigate('MainTabs', {
      screen: 'MapTab',
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScreenHeader
        title="Детали наряда"
        subtitle={`ID: ${task.id}`}
        showBackButton
        onBackPress={() => navigation.goBack()}
        rightElement={
          <View style={[styles.headerActions, { gap: spacing.sm }]}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={handleEditPress}
              style={[
                styles.iconButton,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                  borderRadius: radius.md,
                  width: layout.minTapTarget,
                  height: layout.minTapTarget,
                },
              ]}
            >
              <Ionicons
                name="create-outline"
                size={layout.iconMedium}
                color={colors.primary}
              />
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={handleDeletePress}
              style={[
                styles.iconButton,
                {
                  backgroundColor: colors.dangerBg,
                  borderRadius: radius.md,
                  width: layout.minTapTarget,
                  height: layout.minTapTarget,
                },
              ]}
            >
              <Ionicons
                name="trash-outline"
                size={layout.iconMedium}
                color={colors.danger}
              />
            </TouchableOpacity>
          </View>
        }
      />

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingHorizontal: spacing.lg,
            paddingTop: spacing.md,
            paddingBottom: spacing.xxxl * 2,
          },
        ]}
      >
        <AppCard style={{ marginBottom: spacing.md }}>
          <View style={[styles.badgeCluster, { gap: spacing.xs, marginBottom: spacing.sm }]}>
            <TaskStatusBadge status={task.status} />
            <SyncStatusBadge status={task.syncStatus} />
            <AppBadge
              label={timeRemaining}
              variant={isOverdue ? 'danger' : 'neutral'}
            />
          </View>

          <Text
            style={[
              styles.taskTitle,
              {
                color: colors.textPrimary,
                fontSize: typography.fontSizes.titleMedium,
                fontWeight: typography.fontWeights.bold,
                marginBottom: spacing.xs,
              },
            ]}
          >
            {task.title}
          </Text>

          <View style={[styles.dateRow, { marginTop: spacing.xs }]}>
            <Text
              style={{
                color: colors.textMuted,
                fontSize: typography.fontSizes.caption,
              }}
            >
              Создан: {formatTaskDateTime(task.createdAt)}
            </Text>
          </View>
        </AppCard>

        <AppCard style={{ marginBottom: spacing.md }}>
          <Text
            style={[
              styles.sectionTitle,
              {
                color: colors.textSecondary,
                fontSize: typography.fontSizes.bodySmall,
                fontWeight: typography.fontWeights.semiBold,
                marginBottom: spacing.xs,
              },
            ]}
          >
            Описание задачи
          </Text>
          <Text
            style={[
              styles.descriptionText,
              {
                color: colors.textPrimary,
                fontSize: typography.fontSizes.body,
                lineHeight: typography.lineHeights.relaxed,
              },
            ]}
          >
            {task.description}
          </Text>
        </AppCard>

        <AppCard style={{ marginBottom: spacing.md }}>
          <Text
            style={[
              styles.sectionTitle,
              {
                color: colors.textSecondary,
                fontSize: typography.fontSizes.bodySmall,
                fontWeight: typography.fontWeights.semiBold,
                marginBottom: spacing.xs,
              },
            ]}
          >
            Дедлайн и напоминание
          </Text>

          <View style={[styles.deadlineContainer, { gap: spacing.sm }]}>
            <View style={styles.deadlineRow}>
              <Ionicons
                name="calendar"
                size={layout.iconMedium}
                color={colors.primary}
                style={{ marginRight: spacing.sm }}
              />
              <View>
                <Text
                  style={{
                    color: colors.textPrimary,
                    fontSize: typography.fontSizes.bodyMedium,
                    fontWeight: typography.fontWeights.semiBold,
                  }}
                >
                  {formatTaskDateTime(task.dueDate)}
                </Text>
                <Text
                  style={{
                    color: colors.textMuted,
                    fontSize: typography.fontSizes.caption,
                    marginTop: 2,
                  }}
                >
                  Плановое время прибытия и выполнения
                </Text>
              </View>
            </View>

            <AppButton
              title="Проверить пуш-уведомление (Демо 30с)"
              variant="secondary"
              onPress={handleTriggerDemoReminder}
              icon={
                <Ionicons
                  name="notifications-outline"
                  size={layout.iconSmall}
                  color={colors.primary}
                />
              }
            />
          </View>
        </AppCard>

        <AppCard style={{ marginBottom: spacing.md }}>
          <Text
            style={[
              styles.sectionTitle,
              {
                color: colors.textSecondary,
                fontSize: typography.fontSizes.bodySmall,
                fontWeight: typography.fontWeights.semiBold,
                marginBottom: spacing.xs,
              },
            ]}
          >
            Объект и адрес выезда
          </Text>

          <View style={[styles.locationRow, { marginBottom: spacing.sm }]}>
            <Ionicons
              name="location"
              size={layout.iconMedium}
              color={colors.primary}
              style={{ marginRight: spacing.sm }}
            />
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  color: colors.textPrimary,
                  fontSize: typography.fontSizes.body,
                  fontWeight: typography.fontWeights.medium,
                }}
              >
                {task.location.address}
              </Text>

              {task.location.latitude !== undefined && task.location.longitude !== undefined && (
                <Text
                  style={{
                    color: colors.textMuted,
                    fontSize: typography.fontSizes.caption,
                    marginTop: 2,
                  }}
                >
                  GPS: {task.location.latitude.toFixed(4)}, {task.location.longitude.toFixed(4)}
                </Text>
              )}
            </View>
          </View>

          <AppButton
            title="Показать на карте"
            variant="secondary"
            onPress={handleShowOnMap}
            icon={
              <Ionicons
                name="map-outline"
                size={layout.iconSmall}
                color={colors.primary}
              />
            }
          />
        </AppCard>

        <AppCard style={{ marginBottom: spacing.lg }}>
          <AttachmentPickerSection
            attachments={task.attachments}
            onAddAttachment={(att) => addAttachment(task.id, att)}
            onRemoveAttachment={(attId) => removeAttachment(task.id, attId)}
          />
        </AppCard>

        <View style={[styles.statusActionsContainer, { gap: spacing.sm }]}>
          <Text
            style={[
              styles.actionsHeader,
              {
                color: colors.textSecondary,
                fontSize: typography.fontSizes.bodySmall,
                fontWeight: typography.fontWeights.semiBold,
                marginBottom: spacing.xs,
              },
            ]}
          >
            Смена статуса наряда
          </Text>

          {task.status !== 'In Progress' && task.status !== 'Completed' && (
            <AppButton
              title="Взять в работу"
              onPress={() => handleStatusChange('In Progress')}
              icon={
                <Ionicons
                  name="play-circle-outline"
                  size={layout.iconMedium}
                  color={colors.white}
                />
              }
            />
          )}

          {task.status !== 'Completed' && task.status !== 'Cancelled' && (
            <AppButton
              title="Завершить наряд"
              variant="primary"
              style={{ backgroundColor: colors.statusCompleted }}
              onPress={() => handleStatusChange('Completed')}
              icon={
                <Ionicons
                  name="checkmark-done-circle-outline"
                  size={layout.iconMedium}
                  color={colors.white}
                />
              }
            />
          )}

          {task.status !== 'Cancelled' && task.status !== 'Completed' && (
            <AppButton
              title="Отменить наряд"
              variant="outline"
              onPress={() => handleStatusChange('Cancelled')}
              icon={
                <Ionicons
                  name="close-circle-outline"
                  size={layout.iconMedium}
                  color={colors.textSecondary}
                />
              }
            />
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {},
  notFoundContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 60,
  },
  notFoundTitle: {},
  notFoundText: {},
  badgeCluster: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  taskTitle: {},
  dateRow: {},
  sectionTitle: {},
  descriptionText: {},
  deadlineContainer: {},
  deadlineRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusActionsContainer: {},
  actionsHeader: {},
});
