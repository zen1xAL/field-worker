import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';
import { TaskSortBy, TaskSortOrder } from '@/types';

export interface SortOptionItem {
  id: string;
  label: string;
  by: TaskSortBy;
  order: TaskSortOrder;
}

export const SORT_OPTIONS: SortOptionItem[] = [
  {
    id: 'dueDate-asc',
    label: 'Дедлайн: сначала срочные',
    by: 'dueDate',
    order: 'asc',
  },
  {
    id: 'dueDate-desc',
    label: 'Дедлайн: сначала дальние',
    by: 'dueDate',
    order: 'desc',
  },
  {
    id: 'createdAt-desc',
    label: 'Создание: сначала новые',
    by: 'createdAt',
    order: 'desc',
  },
  {
    id: 'createdAt-asc',
    label: 'Создание: сначала старые',
    by: 'createdAt',
    order: 'asc',
  },
  {
    id: 'status-asc',
    label: 'По статусу выполнения',
    by: 'status',
    order: 'asc',
  },
];

interface TaskSortModalProps {
  visible: boolean;
  activeBy: TaskSortBy;
  activeOrder: TaskSortOrder;
  onSelectOption: (option: SortOptionItem) => void;
  onClose: () => void;
}

export const TaskSortModal: React.FC<TaskSortModalProps> = ({
  visible,
  activeBy,
  activeOrder,
  onSelectOption,
  onClose,
}) => {
  const { colors, spacing, typography, radius, layout } = useTheme();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={[styles.modalOverlay, { backgroundColor: colors.modalOverlay }]}>
          <TouchableWithoutFeedback>
            <View
              style={[
                styles.modalContent,
                {
                  backgroundColor: colors.surface,
                  borderRadius: radius.lg,
                  padding: spacing.lg,
                },
              ]}
            >
              <View style={[styles.modalHeader, { marginBottom: spacing.md }]}>
                <Text
                  style={[
                    styles.modalTitle,
                    {
                      color: colors.textPrimary,
                      fontSize: typography.fontSizes.titleSmall,
                      fontWeight: typography.fontWeights.semiBold,
                    },
                  ]}
                >
                  Порядок сортировки
                </Text>
                <TouchableOpacity
                  onPress={onClose}
                  hitSlop={{ top: spacing.sm, bottom: spacing.sm, left: spacing.sm, right: spacing.sm }}
                >
                  <Ionicons
                    name="close"
                    size={layout.iconMedium}
                    color={colors.textSecondary}
                  />
                </TouchableOpacity>
              </View>

              {SORT_OPTIONS.map((opt) => {
                const isSelected = activeBy === opt.by && activeOrder === opt.order;

                return (
                  <TouchableOpacity
                    key={opt.id}
                    activeOpacity={0.7}
                    onPress={() => onSelectOption(opt)}
                    style={[
                      styles.sortOptionRow,
                      {
                        minHeight: layout.minTapTarget,
                        paddingVertical: spacing.sm,
                        borderBottomWidth: 1,
                        borderBottomColor: colors.border,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.sortOptionText,
                        {
                          color: isSelected ? colors.primary : colors.textPrimary,
                          fontSize: typography.fontSizes.body,
                          fontWeight: isSelected
                            ? typography.fontWeights.semiBold
                            : typography.fontWeights.regular,
                        },
                      ]}
                    >
                      {opt.label}
                    </Text>
                    {isSelected && (
                      <Ionicons
                        name="checkmark"
                        size={layout.iconMedium}
                        color={colors.primary}
                      />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContent: {
    width: '100%',
    maxWidth: 380,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modalTitle: {},
  sortOptionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sortOptionText: {},
});
