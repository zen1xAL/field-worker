import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';
import { useAppSelector } from '@/store/hooks';
import { selectFilteredAndSortedTasks, selectSearchQuery, selectFilterStatus } from '@/store/selectors/tasksSelectors';
import { useTaskActions } from '@/hooks/useTaskActions';
import { useSyncQueue } from '@/hooks/useSyncQueue';
import { RootStackParamList } from '@/navigation/types';
import { CANDIDATE_CODE, NETWORK_STATUS_LABELS } from '@/constants';
import { Task, TaskStatus } from '@/types';
import { ScreenHeader } from '@/components/UI/ScreenHeader';
import { AppButton } from '@/components/UI/AppButton';
import { AppCard } from '@/components/UI/AppCard';
import { AppBadge } from '@/components/UI/AppBadge';
import { TaskCard } from '@/components/Features/TaskCard';
import { TaskSortFilterBar } from '@/components/Features/TaskSortFilterBar';

export const TaskListScreen = () => {
  const { colors, spacing, typography, layout, radius } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { changeStatus } = useTaskActions();

  const tasks = useAppSelector(selectFilteredAndSortedTasks);
  const searchQuery = useAppSelector(selectSearchQuery);
  const filterStatus = useAppSelector(selectFilterStatus);
  const { isOnline, isSyncing, outboxQueue, triggerSync } = useSyncQueue();

  const handleRefresh = async () => {
    await triggerSync();
  };

  const handleCreatePress = () => {
    navigation.navigate('CreateEditTask', {});
  };

  const handleTaskPress = (task: Task) => {
    navigation.navigate('TaskDetail', { taskId: task.id });
  };

  const handleQuickAdvanceStatus = (task: Task) => {
    let nextStatus: TaskStatus | null = null;
    if (task.status === 'New') {
      nextStatus = 'In Progress';
    } else if (task.status === 'In Progress') {
      nextStatus = 'Completed';
    }

    if (nextStatus) {
      changeStatus(task.id, nextStatus);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScreenHeader
        title="Задачи на смену"
        subtitle={`Код специалиста: ${CANDIDATE_CODE}`}
        rightElement={
          <View style={[styles.headerActions, { gap: spacing.sm }]}>
            <AppBadge
              label={
                isSyncing
                  ? 'Синхронизация...'
                  : isOnline
                  ? NETWORK_STATUS_LABELS.online
                  : outboxQueue.length > 0
                  ? `Автономно (${outboxQueue.length})`
                  : NETWORK_STATUS_LABELS.offline
              }
              variant={isSyncing ? 'In Progress' : isOnline ? 'Completed' : 'Cancelled'}
              icon={
                <Ionicons
                  name={isSyncing ? 'sync' : isOnline ? 'wifi' : 'wifi-outline'}
                  size={layout.iconSmall - 2}
                  color={
                    isSyncing
                      ? colors.statusInProgress
                      : isOnline
                      ? colors.statusCompleted
                      : colors.statusCancelled
                  }
                />
              }
            />
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={handleCreatePress}
              style={[
                styles.headerAddButton,
                {
                  backgroundColor: colors.primary,
                  borderRadius: radius.md,
                  width: layout.minTapTarget,
                  height: layout.minTapTarget,
                },
              ]}
            >
              <Ionicons name="add" size={layout.iconLarge} color={colors.white} />
            </TouchableOpacity>
          </View>
        }
      />

      <TaskSortFilterBar />

      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TaskCard
            task={item}
            onPress={handleTaskPress}
            onQuickAdvanceStatus={handleQuickAdvanceStatus}
          />
        )}
        contentContainerStyle={[
          styles.listContent,
          {
            paddingHorizontal: spacing.lg,
            paddingBottom: spacing.xxxl,
          },
        ]}
        refreshControl={
          <RefreshControl
            refreshing={isSyncing}
            onRefresh={handleRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
        ListEmptyComponent={
          <AppCard
            style={[
              styles.emptyContainer,
              {
                paddingVertical: spacing.xxxl,
                paddingHorizontal: spacing.xl,
                marginTop: spacing.xl,
              },
            ]}
          >
            <Ionicons
              name={searchQuery.length > 0 ? 'search-outline' : 'clipboard-outline'}
              size={layout.iconHero}
              color={colors.textMuted}
              style={{ marginBottom: spacing.md }}
            />
            <Text
              style={[
                styles.emptyTitle,
                {
                  color: colors.textPrimary,
                  fontSize: typography.fontSizes.titleSmall,
                  fontWeight: typography.fontWeights.semiBold,
                  marginBottom: spacing.xs,
                },
              ]}
            >
              {searchQuery.length > 0
                ? 'Наряды не найдены'
                : filterStatus !== 'All'
                ? `Нет нарядов в статусе «${filterStatus}»`
                : 'Список нарядов пуст'}
            </Text>
            <Text
              style={[
                styles.emptySubtitle,
                {
                  color: colors.textSecondary,
                  fontSize: typography.fontSizes.body,
                  lineHeight: typography.lineHeights.normal,
                  marginBottom: spacing.lg,
                },
              ]}
            >
              {searchQuery.length > 0
                ? 'Попробуйте изменить поисковый запрос или сбросить фильтры'
                : 'Создайте первый рабочий наряд для учета задач и геопозиции на смене.'}
            </Text>

            {searchQuery.length === 0 && filterStatus === 'All' && (
              <AppButton
                title="Создать наряд"
                onPress={handleCreatePress}
                icon={<Ionicons name="add-circle-outline" size={layout.iconMedium} color={colors.white} />}
              />
            )}
          </AppCard>
        }
      />
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
  headerAddButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  listContent: {
    flexGrow: 1,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    textAlign: 'center',
  },
  emptySubtitle: {
    textAlign: 'center',
  },
});
