import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';
import { ScreenHeader, AppCard } from '@/components/UI';

export const HistoryScreen = () => {
  const { colors, spacing, typography } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScreenHeader
        title="Журнал истории"
        subtitle="Аудит действий, смены статусов и синхронизации"
      />
      <View style={[styles.content, { padding: spacing.lg }]}>
        <AppCard style={styles.card}>
          <Ionicons name="time-outline" size={48} color={colors.textMuted} />
          <Text
            style={[
              styles.cardTitle,
              {
                color: colors.textPrimary,
                fontSize: typography.fontSizes.titleSmall,
                fontWeight: typography.fontWeights.semiBold,
                marginTop: spacing.md,
              },
            ]}
          >
            История пуста
          </Text>
          <Text
            style={[
              styles.cardText,
              {
                color: colors.textSecondary,
                fontSize: typography.fontSizes.body,
                marginTop: spacing.xs + 2,
              },
            ]}
          >
            Все изменения по нарядам и события синхронизации будут фиксироваться здесь с точными метками времени.
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
  card: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
  },
  cardTitle: {},
  cardText: {
    textAlign: 'center',
    lineHeight: 20,
  },
});
