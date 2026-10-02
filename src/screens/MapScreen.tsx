import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';

export const MapScreen = () => {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.textPrimary }]}>Карта объектов</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Геопозиция активных точек и нарядов
        </Text>
      </View>
      <View style={styles.content}>
        <View style={[styles.placeholderCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Ionicons name="map-outline" size={48} color={colors.primary} />
          <Text style={[styles.placeholderTitle, { color: colors.textPrimary }]}>Модуль карты готов к интеграции</Text>
          <Text style={[styles.placeholderText, { color: colors.textSecondary }]}>
            react-native-maps установлен и ожидает подключения маркеров задач.
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
  placeholderCard: {
    padding: 32,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
  },
  placeholderTitle: {
    fontSize: 17,
    fontWeight: '600',
    marginTop: 12,
    textAlign: 'center',
  },
  placeholderText: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 20,
  },
});
