import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';
import { RootStackParamList } from '@/navigation/types';
import { ScreenHeader, AppCard, AppButton } from '@/components/UI';

export const TaskListScreen = () => {
  const { colors, spacing, typography } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handleCreatePress = () => {
    navigation.navigate('CreateEditTask', {});
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScreenHeader
        title="Задачи на смену"
        subtitle="Учет выездов и назначенных объектов"
        rightElement={
          <AppButton
            title=""
            icon={<Ionicons name="add" size={24} color={colors.white} />}
            onPress={handleCreatePress}
            style={styles.addButton}
          />
        }
      />

      <View style={[styles.content, { paddingHorizontal: spacing.lg, paddingTop: spacing.md }]}>
        <AppCard style={styles.emptyCard}>
          <Ionicons name="clipboard-outline" size={48} color={colors.textMuted} />
          <Text
            style={[
              styles.emptyTitle,
              {
                color: colors.textPrimary,
                fontSize: typography.fontSizes.titleSmall,
                fontWeight: typography.fontWeights.semiBold,
                marginTop: spacing.md,
              },
            ]}
          >
            Нет активных задач
          </Text>
          <Text
            style={[
              styles.emptyDescription,
              {
                color: colors.textSecondary,
                fontSize: typography.fontSizes.body,
                marginTop: spacing.xs + 2,
              },
            ]}
          >
            Нажмите кнопку создания, чтобы добавить первый наряд на выезд.
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
  addButton: {
    width: 48,
    height: 48,
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  content: {
    flex: 1,
  },
  emptyCard: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
  },
  emptyTitle: {},
  emptyDescription: {
    textAlign: 'center',
    lineHeight: 20,
  },
});
