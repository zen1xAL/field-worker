import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme } from '@/hooks/useTheme';
import { RootStackParamList } from '@/navigation/types';
import { ScreenHeader, AppCard } from '@/components/UI';

export const CreateEditTaskScreen = () => {
  const { colors, spacing, typography } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'CreateEditTask'>>();
  const isEditing = Boolean(route.params?.taskId);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScreenHeader
        title={isEditing ? 'Редактирование наряда' : 'Новый наряд'}
        showBackButton
        onBackPress={() => navigation.goBack()}
      />
      <View style={[styles.content, { padding: spacing.lg }]}>
        <AppCard>
          <Text
            style={[
              styles.title,
              {
                color: colors.textPrimary,
                fontSize: typography.fontSizes.titleSmall,
                fontWeight: typography.fontWeights.semiBold,
                marginBottom: spacing.xs,
              },
            ]}
          >
            Форма наряда
          </Text>
          <Text
            style={[
              styles.subtitle,
              {
                color: colors.textSecondary,
                fontSize: typography.fontSizes.body,
                lineHeight: typography.lineHeights.normal,
              },
            ]}
          >
            На следующем шаге подключим валидацию Zod, выбор координат и прикрепление фото.
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
  title: {},
  subtitle: {},
});
