import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';
import { useAppSelector } from '@/store/hooks';
import { useTaskActions } from '@/hooks/useTaskActions';
import { RootStackParamList } from '@/navigation/types';
import { TaskAttachment, TaskLocation, TaskStatus } from '@/types';
import { getDefaultDueDate } from '@/utils/dateTime';
import { TaskFormErrors, validateTaskForm } from '@/utils/validation';
import { ScreenHeader } from '@/components/UI/ScreenHeader';
import { AppInput } from '@/components/UI/AppInput';
import { AppButton } from '@/components/UI/AppButton';
import { AppCard } from '@/components/UI/AppCard';
import { LocationPickerSection } from '@/components/Features/LocationPickerSection';
import { AttachmentPickerSection } from '@/components/Features/AttachmentPickerSection';
import { DateTimePickerField } from '@/components/Features/DateTimePickerField';

export const CreateEditTaskScreen = () => {
  const { colors, spacing, layout } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'CreateEditTask'>>();
  const taskId = route.params?.taskId;

  const existingTask = useAppSelector((state) =>
    taskId ? state.tasks.items.find((item) => item.id === taskId) : undefined
  );

  const { createTask, editTask } = useTaskActions();

  const [title, setTitle] = useState(existingTask?.title ?? '');
  const [description, setDescription] = useState(existingTask?.description ?? '');
  const [dueDate, setDueDate] = useState(existingTask?.dueDate ?? getDefaultDueDate());
  const [location, setLocation] = useState<TaskLocation>(
    existingTask?.location ?? { address: '' }
  );
  const [status] = useState<TaskStatus>(existingTask?.status ?? 'New');
  const [attachments, setAttachments] = useState<TaskAttachment[]>(
    existingTask?.attachments ?? []
  );

  const [errors, setErrors] = useState<TaskFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddAttachment = (newAttachment: TaskAttachment) => {
    setAttachments((prev) => [...prev, newAttachment]);
  };

  const handleRemoveAttachment = (attachmentId: string) => {
    setAttachments((prev) => prev.filter((item) => item.id !== attachmentId));
  };

  const handleSubmit = async () => {
    const validationResult = validateTaskForm({
      title,
      description,
      dueDate,
      address: location.address,
    });

    if (!validationResult.isValid) {
      setErrors(validationResult.errors);
      Alert.alert(
        'Проверьте заполнение полей',
        'Пожалуйста, исправьте отмеченные ошибки перед сохранением наряда.'
      );
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      if (taskId && existingTask) {
        await editTask({
          id: taskId,
          title: title.trim(),
          description: description.trim(),
          dueDate,
          location,
          status,
          attachments,
        });
      } else {
        await createTask({
          title: title.trim(),
          description: description.trim(),
          dueDate,
          location,
          status,
          attachments,
        });
      }

      navigation.goBack();
    } catch {
      Alert.alert('Ошибка сохранения', 'Не удалось сохранить наряд. Попробуйте еще раз.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScreenHeader
        title={taskId ? 'Редактирование наряда' : 'Новый наряд'}
        subtitle={taskId ? `ID: ${taskId}` : 'Создание задачи на смену'}
        showBackButton
        onBackPress={() => navigation.goBack()}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            {
              paddingHorizontal: spacing.lg,
              paddingTop: spacing.md,
              paddingBottom: spacing.xxxl * 2,
            },
          ]}
          keyboardShouldPersistTaps="handled"
        >
          <AppCard style={{ marginBottom: spacing.md }}>
            <AppInput
              label="Название наряда"
              placeholder="Например: Аварийный ремонт шкафа автоматики"
              value={title}
              onChangeText={(text) => {
                setTitle(text);
                if (errors.title) {
                  setErrors((prev) => ({ ...prev, title: undefined }));
                }
              }}
              error={errors.title}
              required
              containerStyle={{ marginBottom: spacing.md }}
            />

            <AppInput
              label="Описание задачи"
              placeholder="Опишите характер неисправности, необходимые инструменты и регламент..."
              value={description}
              onChangeText={(text) => {
                setDescription(text);
                if (errors.description) {
                  setErrors((prev) => ({ ...prev, description: undefined }));
                }
              }}
              error={errors.description}
              required
              multiline
              numberOfLines={4}
              style={{ minHeight: layout.multilineInputHeight, textAlignVertical: 'top' }}
              containerStyle={{ marginBottom: spacing.sm }}
            />
          </AppCard>

          <AppCard style={{ marginBottom: spacing.md }}>
            <DateTimePickerField
              dueDate={dueDate}
              onChangeDueDate={(newDate) => {
                setDueDate(newDate);
                if (errors.dueDate) {
                  setErrors((prev) => ({ ...prev, dueDate: undefined }));
                }
              }}
              error={errors.dueDate}
            />
          </AppCard>

          <AppCard style={{ marginBottom: spacing.md }}>
            <LocationPickerSection
              location={location}
              onChangeLocation={(newLoc) => {
                setLocation(newLoc);
                if (errors.address) {
                  setErrors((prev) => ({ ...prev, address: undefined }));
                }
              }}
              error={errors.address}
            />
          </AppCard>

          <AppCard style={{ marginBottom: spacing.lg }}>
            <AttachmentPickerSection
              attachments={attachments}
              onAddAttachment={handleAddAttachment}
              onRemoveAttachment={handleRemoveAttachment}
            />
          </AppCard>

          <AppButton
            title={taskId ? 'Сохранить изменения' : 'Создать наряд'}
            onPress={handleSubmit}
            loading={isSubmitting}
            icon={
              <Ionicons
                name="checkmark-circle-outline"
                size={layout.iconMedium}
                color={colors.white}
              />
            }
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {},
});
