import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';

export const HistoryScreen = () => {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.textPrimary }]}>Журнал истории</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Аудит действий, смены статусов и синхронизации
        </Text>
      </View>
      <View style={styles.content}>
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Ionicons name="time-outline" size={48} color={colors.textMuted} />
          <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>История пуста</Text>
          <Text style={[styles.cardText, { color: colors.textSecondary }]}>
            Все изменения по нарядам и события синхронизации будут фиксироваться здесь с точными метками времени.
          </Text>
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
  card: {
    padding: 32,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '600',
    marginTop: 12,
  },
  cardText: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 20,
  },
});
