import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';
import { useAppSelector } from '@/store/hooks';
import { CANDIDATE_CODE } from '@/constants';

export const SettingsScreen = () => {
  const { colors, isDark, toggleTheme } = useTheme();
  const isOnline = useAppSelector((state) => state.sync.isOnline);

  const handleDemoNotificationPress = () => {
    Alert.alert(
      'Демо-уведомление',
      'Тестовое напоминание будет запланировано через 30 секунд для проверки на видео.'
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.textPrimary }]}>Настройки</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Параметры приложения и данные кандидата
        </Text>
      </View>

      <View style={styles.content}>
        <View style={[styles.section, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.sectionHeader, { color: colors.textSecondary }]}>ИДЕНТИФИКАЦИЯ КАНДИДАТА</Text>
          <View style={styles.row}>
            <View style={styles.rowInfo}>
              <Ionicons name="finger-print-outline" size={22} color={colors.primary} />
              <View style={styles.rowTextGroup}>
                <Text style={[styles.rowLabel, { color: colors.textPrimary }]}>Код кандидата</Text>
                <Text style={[styles.rowDescription, { color: colors.textSecondary }]}>
                  Обязателен в приложении, README и на видео
                </Text>
              </View>
            </View>
            <View style={[styles.codeBadge, { backgroundColor: colors.primaryLight }]}>
              <Text style={[styles.codeText, { color: colors.primary }]}>{CANDIDATE_CODE}</Text>
            </View>
          </View>
        </View>

        <View style={[styles.section, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.sectionHeader, { color: colors.textSecondary }]}>ОФОРМЛЕНИЕ И СЕТЬ</Text>
          <View style={styles.row}>
            <View style={styles.rowInfo}>
              <Ionicons name={isDark ? 'moon-outline' : 'sunny-outline'} size={22} color={colors.primary} />
              <View style={styles.rowTextGroup}>
                <Text style={[styles.rowLabel, { color: colors.textPrimary }]}>Темная тема</Text>
                <Text style={[styles.rowDescription, { color: colors.textSecondary }]}>
                  {isDark ? 'Включена (угольная палитра)' : 'Выключена (светлая палитра)'}
                </Text>
              </View>
            </View>
            <Switch value={isDark} onValueChange={toggleTheme} />
          </View>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <View style={styles.row}>
            <View style={styles.rowInfo}>
              <Ionicons
                name={isOnline ? 'cloud-done-outline' : 'cloud-offline-outline'}
                size={22}
                color={isOnline ? colors.syncSynced : colors.syncPending}
              />
              <View style={styles.rowTextGroup}>
                <Text style={[styles.rowLabel, { color: colors.textPrimary }]}>Статус сети</Text>
                <Text style={[styles.rowDescription, { color: colors.textSecondary }]}>
                  {isOnline ? 'Подключено к сети' : 'Автономный режим (офлайн)'}
                </Text>
              </View>
            </View>
            <View
              style={[
                styles.networkBadge,
                { backgroundColor: isOnline ? colors.statusCompletedBg : colors.statusInProgressBg },
              ]}
            >
              <Text
                style={[
                  styles.networkBadgeText,
                  { color: isOnline ? colors.syncSynced : colors.syncPending },
                ]}
              >
                {isOnline ? 'Online' : 'Offline'}
              </Text>
            </View>
          </View>
        </View>

        <View style={[styles.section, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.sectionHeader, { color: colors.textSecondary }]}>ОТЛАДКА И ТЕСТИРОВАНИЕ</Text>
          <TouchableOpacity
            style={styles.actionRow}
            onPress={handleDemoNotificationPress}
            activeOpacity={0.7}
          >
            <View style={styles.rowInfo}>
              <Ionicons name="notifications-outline" size={22} color={colors.primary} />
              <View style={styles.rowTextGroup}>
                <Text style={[styles.rowLabel, { color: colors.textPrimary }]}>Демо-пуш через 30 сек</Text>
                <Text style={[styles.rowDescription, { color: colors.textSecondary }]}>
                  Для проверки уведомления на видео-демо
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: -0.4,
  },
  subtitle: {
    fontSize: 13,
    marginTop: 2,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    marginBottom: 16,
  },
  sectionHeader: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
    marginBottom: 12,
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
    marginLeft: 12,
    flex: 1,
  },
  rowLabel: {
    fontSize: 15,
    fontWeight: '600',
  },
  rowDescription: {
    fontSize: 12,
    marginTop: 2,
  },
  divider: {
    height: 1,
    marginVertical: 10,
  },
  codeBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  codeText: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  networkBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  networkBadgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
});
