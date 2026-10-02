import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';
import { ScreenHeader, AppCard } from '@/components/UI';

export const MapScreen = () => {
  const { colors, spacing, typography } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScreenHeader
        title="Карта объектов"
        subtitle="Геопозиция активных точек и нарядов"
      />
      <View style={[styles.content, { padding: spacing.lg }]}>
        <AppCard style={styles.placeholderCard}>
          <Ionicons name="map-outline" size={48} color={colors.primary} />
          <Text
            style={[
              styles.placeholderTitle,
              {
                color: colors.textPrimary,
                fontSize: typography.fontSizes.titleSmall,
                fontWeight: typography.fontWeights.semiBold,
                marginTop: spacing.md,
              },
            ]}
          >
            Модуль карты готов к интеграции
          </Text>
          <Text
            style={[
              styles.placeholderText,
              {
                color: colors.textSecondary,
                fontSize: typography.fontSizes.body,
                marginTop: spacing.xs + 2,
              },
            ]}
          >
            react-native-maps установлен и ожидает подключения маркеров задач.
          </Text>
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
  placeholderCard: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
  },
  placeholderTitle: {
    textAlign: 'center',
  },
  placeholderText: {
    textAlign: 'center',
    lineHeight: 20,
  },
});
