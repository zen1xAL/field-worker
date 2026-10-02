import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';
import { useAppSelector } from '@/store/hooks';
import { CANDIDATE_CODE, NETWORK_STATUS_LABELS } from '@/constants';
import { NotificationService } from '@/services/notificationService';
import { ScreenHeader, AppCard, AppBadge } from '@/components/UI';

export const SettingsScreen = () => {
  const { colors, isDark, toggleTheme, spacing, typography } = useTheme();
  const isOnline = useAppSelector((state) => state.sync.isOnline);

  const handleDemoNotificationPress = async () => {
    const notificationId = await NotificationService.triggerDemoReminder('Тестовое напоминание мастера');
    if (notificationId) {
      Alert.alert(
        'Демо-уведомление запланировано',
        'Тестовое напоминание поступит ровно через 30 секунд для проверки на видео.'
      );
    } else {
      Alert.alert(
        'Уведомления отключены',
        'Проверьте системные разрешения на показ уведомлений в настройках устройства.'
      );
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScreenHeader
        title="Настройки"
        subtitle="Параметры приложения и данные кандидата"
      />

      <View style={[styles.content, { padding: spacing.lg }]}>
        <AppCard style={[styles.section, { marginBottom: spacing.lg }]}>
          <Text
            style={[
              styles.sectionHeader,
              {
                color: colors.textSecondary,
                fontSize: typography.fontSizes.captionSmall,
                fontWeight: typography.fontWeights.bold,
                marginBottom: spacing.md,
              },
            ]}
          >
            ИДЕНТИФИКАЦИЯ КАНДИДАТА
          </Text>
          <View style={styles.row}>
            <View style={styles.rowInfo}>
              <Ionicons name="finger-print-outline" size={22} color={colors.primary} />
              <View style={[styles.rowTextGroup, { marginLeft: spacing.md }]}>
                <Text
                  style={[
                    styles.rowLabel,
                    {
                      color: colors.textPrimary,
                      fontSize: typography.fontSizes.bodyMedium,
                      fontWeight: typography.fontWeights.semiBold,
                    },
                  ]}
                >
                  Код кандидата
                </Text>
                <Text
                  style={[
                    styles.rowDescription,
                    {
                      color: colors.textSecondary,
                      fontSize: typography.fontSizes.caption,
                      marginTop: spacing.xs / 2,
                    },
                  ]}
                >
                  Обязателен в приложении, README и на видео
                </Text>
              </View>
            </View>
            <AppBadge label={CANDIDATE_CODE} variant="primary" />
          </View>
        </AppCard>

        <AppCard style={[styles.section, { marginBottom: spacing.lg }]}>
          <Text
            style={[
              styles.sectionHeader,
              {
                color: colors.textSecondary,
                fontSize: typography.fontSizes.captionSmall,
                fontWeight: typography.fontWeights.bold,
                marginBottom: spacing.md,
              },
            ]}
          >
            ОФОРМЛЕНИЕ И СЕТЬ
          </Text>
          <View style={styles.row}>
            <View style={styles.rowInfo}>
              <Ionicons name={isDark ? 'moon-outline' : 'sunny-outline'} size={22} color={colors.primary} />
              <View style={[styles.rowTextGroup, { marginLeft: spacing.md }]}>
                <Text
                  style={[
                    styles.rowLabel,
                    {
                      color: colors.textPrimary,
                      fontSize: typography.fontSizes.bodyMedium,
                      fontWeight: typography.fontWeights.semiBold,
                    },
                  ]}
                >
                  Темная тема
                </Text>
                <Text
                  style={[
                    styles.rowDescription,
                    {
                      color: colors.textSecondary,
                      fontSize: typography.fontSizes.caption,
                      marginTop: spacing.xs / 2,
                    },
                  ]}
                >
                  {isDark ? 'Включена (угольная палитра)' : 'Выключена (светлая палитра)'}
                </Text>
              </View>
            </View>
            <Switch value={isDark} onValueChange={toggleTheme} />
          </View>

          <View style={[styles.divider, { backgroundColor: colors.border, marginVertical: spacing.md }]} />

          <View style={styles.row}>
            <View style={styles.rowInfo}>
              <Ionicons
                name={isOnline ? 'cloud-done-outline' : 'cloud-offline-outline'}
                size={22}
                color={isOnline ? colors.syncSynced : colors.syncPending}
              />
              <View style={[styles.rowTextGroup, { marginLeft: spacing.md }]}>
                <Text
                  style={[
                    styles.rowLabel,
                    {
                      color: colors.textPrimary,
                      fontSize: typography.fontSizes.bodyMedium,
                      fontWeight: typography.fontWeights.semiBold,
                    },
                  ]}
                >
                  Статус сети
                </Text>
                <Text
                  style={[
                    styles.rowDescription,
                    {
                      color: colors.textSecondary,
                      fontSize: typography.fontSizes.caption,
                      marginTop: spacing.xs / 2,
                    },
                  ]}
                >
                  {isOnline ? 'Подключено к сети' : 'Автономный режим (офлайн)'}
                </Text>
              </View>
            </View>
            <AppBadge
              label={isOnline ? NETWORK_STATUS_LABELS.online : NETWORK_STATUS_LABELS.offline}
              variant={isOnline ? 'synced' : 'pending'}
            />
          </View>
        </AppCard>

        <AppCard style={styles.section}>
          <Text
            style={[
              styles.sectionHeader,
              {
                color: colors.textSecondary,
                fontSize: typography.fontSizes.captionSmall,
                fontWeight: typography.fontWeights.bold,
                marginBottom: spacing.md,
              },
            ]}
          >
            ОТЛАДКА И ТЕСТИРОВАНИЕ
          </Text>
          <TouchableOpacity
            style={styles.actionRow}
            onPress={handleDemoNotificationPress}
            activeOpacity={0.7}
          >
            <View style={styles.rowInfo}>
              <Ionicons name="notifications-outline" size={22} color={colors.primary} />
              <View style={[styles.rowTextGroup, { marginLeft: spacing.md }]}>
                <Text
                  style={[
                    styles.rowLabel,
                    {
                      color: colors.textPrimary,
                      fontSize: typography.fontSizes.bodyMedium,
                      fontWeight: typography.fontWeights.semiBold,
                    },
                  ]}
                >
                  Демо-пуш через 30 сек
                </Text>
                <Text
                  style={[
                    styles.rowDescription,
                    {
                      color: colors.textSecondary,
                      fontSize: typography.fontSizes.caption,
                      marginTop: spacing.xs / 2,
                    },
                  ]}
                >
                  Для проверки уведомления на видео-демо
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
          </TouchableOpacity>
        </AppCard>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  section: {},
  sectionHeader: {
    letterSpacing: 0.8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 48,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 48,
  },
  rowInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  rowTextGroup: {
    flex: 1,
  },
  rowLabel: {},
  rowDescription: {},
  divider: {
    height: 1,
  },
});
