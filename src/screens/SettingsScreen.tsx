import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  Alert,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';
import { useSyncQueue } from '@/hooks/useSyncQueue';
import { CANDIDATE_CODE, DEFAULT_SERVER_URL, NETWORK_STATUS_LABELS } from '@/constants';
import { NotificationService } from '@/services/notificationService';
import { formatTaskDateTime } from '@/utils/dateTime';
import { ScreenHeader, AppCard, AppBadge, AppButton, AppInput } from '@/components/UI';

export const SettingsScreen = () => {
  const { colors, isDark, toggleTheme, spacing, typography, layout, radius } = useTheme();
  const {
    isOnline,
    isSyncing,
    lastSyncTimestamp,
    serverUrl,
    outboxQueue,
    syncError,
    checkConnection,
    updateServerUrl,
    triggerSync,
  } = useSyncQueue();

  const [inputUrl, setInputUrl] = useState(serverUrl);
  const [checkingConnection, setCheckingConnection] = useState(false);

  useEffect(() => {
    setInputUrl(serverUrl);
  }, [serverUrl]);

  const handleSaveUrl = async () => {
    const trimmed = inputUrl.trim();
    if (!trimmed) {
      Alert.alert('Ошибка', 'Адрес сервера не может быть пустым.');
      return;
    }
    await updateServerUrl(trimmed);
    Alert.alert('Адрес сохранен', `Сервер синхронизации установлен:\n${trimmed}`);
  };

  const handleResetUrl = async () => {
    await updateServerUrl(DEFAULT_SERVER_URL);
    setInputUrl(DEFAULT_SERVER_URL);
    Alert.alert('Сброс выполнен', `Установлен стандартный адрес:\n${DEFAULT_SERVER_URL}`);
  };

  const handleCheckConnectionPress = async () => {
    setCheckingConnection(true);
    const result = await checkConnection(inputUrl.trim());
    setCheckingConnection(false);
    if (result.ok) {
      Alert.alert('Связь установлена', result.message);
    } else {
      Alert.alert('Ошибка соединения', result.message);
    }
  };

  const handleManualSyncPress = async () => {
    const result = await triggerSync();
    if (result.success) {
      Alert.alert('Синхронизация завершена', result.message);
    } else {
      Alert.alert('Внимание', result.message);
    }
  };

  const handleTestNotificationPress = async () => {
    const notificationId = await NotificationService.triggerTestReminder('Проверка службы нарядов');
    if (notificationId) {
      Alert.alert(
        'Оповещение запланировано',
        'Служебное уведомление поступит на устройство через 30 секунд для проверки канала связи.'
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

      <ScrollView
        contentContainerStyle={[styles.content, { padding: spacing.lg, gap: spacing.lg }]}
        showsVerticalScrollIndicator={false}
      >
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
            СЕРВЕР СИНХРОНИЗАЦИИ (REST API)
          </Text>

          <AppInput
            label="Адрес mock-сервера (json-server)"
            value={inputUrl}
            onChangeText={setInputUrl}
            autoCapitalize="none"
            autoCorrect={false}
            placeholder="http://192.168.1.100:3000"
            containerStyle={{ marginBottom: spacing.md }}
          />

          <View style={[styles.actionRowGrid, { gap: spacing.sm, marginBottom: spacing.md }]}>
            <AppButton
              title="Сохранить"
              onPress={handleSaveUrl}
              variant="primary"
              style={styles.flexButton}
            />
            <AppButton
              title="Сброс"
              onPress={handleResetUrl}
              variant="secondary"
              style={styles.flexButton}
            />
          </View>

          <View style={[styles.actionRowGrid, { gap: spacing.sm, marginBottom: spacing.lg }]}>
            <AppButton
              title="Проверить связь"
              onPress={handleCheckConnectionPress}
              variant="outline"
              loading={checkingConnection}
              icon={
                <Ionicons
                  name="pulse-outline"
                  size={layout.iconSmall}
                  color={colors.primary}
                />
              }
              style={styles.flexButton}
            />
            <AppButton
              title="Синхронизировать"
              onPress={handleManualSyncPress}
              variant="secondary"
              loading={isSyncing}
              disabled={!isOnline}
              icon={
                <Ionicons
                  name="sync-outline"
                  size={layout.iconSmall}
                  color={colors.textPrimary}
                />
              }
              style={styles.flexButton}
            />
          </View>

          <View style={[styles.divider, { backgroundColor: colors.border, marginBottom: spacing.md }]} />

          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: colors.textSecondary, fontSize: typography.fontSizes.caption }]}>
              Очередь выгрузки (Outbox):
            </Text>
            <AppBadge
              label={
                outboxQueue.length > 0
                  ? `${outboxQueue.length} нарядов`
                  : 'Все отправлено'
              }
              variant={outboxQueue.length > 0 ? 'pending' : 'synced'}
            />
          </View>

          <View style={[styles.infoRow, { marginTop: spacing.sm }]}>
            <Text style={[styles.infoLabel, { color: colors.textSecondary, fontSize: typography.fontSizes.caption }]}>
              Последняя синхронизация:
            </Text>
            <Text
              style={[
                styles.infoValue,
                { color: colors.textPrimary, fontSize: typography.fontSizes.caption },
              ]}
            >
              {lastSyncTimestamp ? formatTaskDateTime(lastSyncTimestamp) : 'Не выполнялась'}
            </Text>
          </View>

          {syncError && (
            <View
              style={[
                styles.errorBox,
                {
                  backgroundColor: colors.dangerBg,
                  borderRadius: radius.sm,
                  padding: spacing.sm,
                  marginTop: spacing.md,
                },
              ]}
            >
              <Text style={{ color: colors.danger, fontSize: typography.fontSizes.captionSmall }}>
                {syncError}
              </Text>
            </View>
          )}
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
            СЛУЖБА ОПОВЕЩЕНИЙ И СВЯЗИ
          </Text>
          <TouchableOpacity
            style={styles.actionRow}
            onPress={handleTestNotificationPress}
            activeOpacity={0.7}
          >
            <View style={styles.rowInfo}>
              <Ionicons
                name="notifications-outline"
                size={layout.iconMedium}
                color={colors.primary}
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
                  Тестовое оповещение наряда
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
                  Проверка доставки служебного уведомления (30 сек)
                </Text>
              </View>
            </View>
            <Ionicons
              name="chevron-forward"
              size={layout.iconMedium}
              color={colors.textMuted}
            />
          </TouchableOpacity>
        </AppCard>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingBottom: 40,
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
  actionRowGrid: {
    flexDirection: 'row',
  },
  flexButton: {
    flex: 1,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoLabel: {},
  infoValue: {
    fontWeight: '500',
  },
  errorBox: {},
});
