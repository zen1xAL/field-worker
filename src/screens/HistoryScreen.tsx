import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { clearHistory } from '@/store/slices/historySlice';
import { HistoryActionType, HistoryLogItem } from '@/types';
import { formatTaskDateTime } from '@/utils/dateTime';
import { ScreenHeader } from '@/components/UI/ScreenHeader';
import { AppCard } from '@/components/UI/AppCard';
import { AppBadge } from '@/components/UI/AppBadge';

export const HistoryScreen = () => {
  const { colors, spacing, typography, layout, radius } = useTheme();
  const dispatch = useAppDispatch();
  const historyItems = useAppSelector((state) => state.history.items);

  const getActionConfig = (actionType: HistoryActionType): {
    label: string;
    iconName: keyof typeof Ionicons.glyphMap;
    color: string;
    bg: string;
  } => {
    switch (actionType) {
      case 'CREATE':
        return {
          label: 'Создание',
          iconName: 'add-circle-outline',
          color: colors.statusCompleted,
          bg: colors.statusCompletedBg,
        };
      case 'STATUS_CHANGE':
        return {
          label: 'Статус',
          iconName: 'sync-outline',
          color: colors.statusInProgress,
          bg: colors.statusInProgressBg,
        };
      case 'EDIT':
        return {
          label: 'Правка',
          iconName: 'create-outline',
          color: colors.primary,
          bg: colors.primaryLight,
        };
      case 'ATTACHMENT_ADD':
        return {
          label: 'Вложение (+)',
          iconName: 'image-outline',
          color: colors.primary,
          bg: colors.primaryLight,
        };
      case 'ATTACHMENT_REMOVE':
        return {
          label: 'Вложение (-)',
          iconName: 'trash-outline',
          color: colors.danger,
          bg: colors.dangerBg,
        };
      case 'DELETE':
        return {
          label: 'Удаление',
          iconName: 'close-circle-outline',
          color: colors.danger,
          bg: colors.dangerBg,
        };
      case 'SYNC':
        return {
          label: 'Синхронизация',
          iconName: 'cloud-done-outline',
          color: colors.syncSynced,
          bg: colors.statusCompletedBg,
        };
    }
  };

  const handleClearHistory = () => {
    Alert.alert(
      'Очистка журнала',
      'Вы действительно хотите удалить все записи журнала истории? Это действие нельзя отменить.',
      [
        { text: 'Отмена', style: 'cancel' },
        {
          text: 'Очистить',
          style: 'destructive',
          onPress: () => dispatch(clearHistory()),
        },
      ]
    );
  };

  const renderHistoryItem = ({ item }: { item: HistoryLogItem }) => {
    const config = getActionConfig(item.actionType);

    return (
      <AppCard style={[styles.historyCard, { marginBottom: spacing.sm }]}>
        <View style={[styles.cardHeader, { marginBottom: spacing.xs }]}>
          <AppBadge
            label={config.label}
            customColor={config.color}
            customBackgroundColor={config.bg}
            icon={
              <Ionicons
                name={config.iconName}
                size={layout.iconSmall - 2}
                color={config.color}
              />
            }
          />

          <Text
            style={[
              styles.timestamp,
              {
                color: colors.textMuted,
                fontSize: typography.fontSizes.caption,
              },
            ]}
          >
            {formatTaskDateTime(item.timestamp)}
          </Text>
        </View>

        <Text
          style={[
            styles.description,
            {
              color: colors.textPrimary,
              fontSize: typography.fontSizes.body,
              fontWeight: typography.fontWeights.medium,
              marginBottom: spacing.xs / 2,
            },
          ]}
        >
          {item.description}
        </Text>

        {Boolean(item.taskTitle) && (
          <Text
            style={[
              styles.taskReference,
              {
                color: colors.textSecondary,
                fontSize: typography.fontSizes.caption,
              },
            ]}
          >
            Объект: {item.taskTitle}
          </Text>
        )}
      </AppCard>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScreenHeader
        title="Журнал истории"
        subtitle={`Всего записей аудита: ${historyItems.length}`}
        rightElement={
          historyItems.length > 0 ? (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={handleClearHistory}
              style={[
                styles.clearButton,
                {
                  backgroundColor: colors.surfaceSecondary,
                  borderRadius: radius.md,
                  height: layout.minTapTarget,
                  paddingHorizontal: spacing.md,
                },
              ]}
            >
              <Ionicons
                name="trash-bin-outline"
                size={layout.iconSmall + 2}
                color={colors.danger}
                style={{ marginRight: spacing.xs }}
              />
              <Text
                style={{
                  color: colors.danger,
                  fontSize: typography.fontSizes.caption,
                  fontWeight: typography.fontWeights.semiBold,
                }}
              >
                Очистить
              </Text>
            </TouchableOpacity>
          ) : undefined
        }
      />

      <FlatList
        data={historyItems}
        keyExtractor={(item) => item.id}
        renderItem={renderHistoryItem}
        contentContainerStyle={[
          styles.listContent,
          {
            paddingHorizontal: spacing.lg,
            paddingTop: spacing.md,
            paddingBottom: spacing.xxxl,
          },
        ]}
        ListEmptyComponent={
          <AppCard
            style={[
              styles.emptyCard,
              {
                paddingVertical: spacing.xxxl,
                paddingHorizontal: spacing.xl,
                marginTop: spacing.xl,
              },
            ]}
          >
            <Ionicons
              name="time-outline"
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
              Журнал аудита пуст
            </Text>
            <Text
              style={[
                styles.emptySubtitle,
                {
                  color: colors.textSecondary,
                  fontSize: typography.fontSizes.body,
                  lineHeight: typography.lineHeights.normal,
                  textAlign: 'center',
                },
              ]}
            >
              Любые действия мастера (создание нарядов, правка данных, переключение статусов и добавление фотоотчетов) автоматически сохраняются здесь с точной датой и временем.
            </Text>
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
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  listContent: {
    flexGrow: 1,
  },
  historyCard: {},
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  timestamp: {},
  description: {},
  taskReference: {},
  emptyCard: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    textAlign: 'center',
  },
  emptySubtitle: {},
});
