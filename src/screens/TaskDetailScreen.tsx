import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme } from '@/hooks/useTheme';
import { RootStackParamList } from '@/navigation/types';
import { ScreenHeader, AppCard } from '@/components/UI';

export const TaskDetailScreen = () => {
  const { colors, spacing, typography } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'TaskDetail'>>();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScreenHeader
        title="Детали наряда"
        showBackButton
        onBackPress={() => navigation.goBack()}
      />
      <View style={[styles.content, { padding: spacing.lg }]}>
        <AppCard>
          <Text
            style={[
              styles.label,
              {
                color: colors.textSecondary,
                fontSize: typography.fontSizes.bodySmall,
                marginBottom: spacing.xs,
              },
            ]}
          >
            ID Задачи
          </Text>
          <Text
            style={[
              styles.value,
              {
                color: colors.textPrimary,
                fontSize: typography.fontSizes.titleSmall,
                fontWeight: typography.fontWeights.semiBold,
              },
            ]}
          >
            {route.params.taskId}
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
  label: {},
  value: {},
});
