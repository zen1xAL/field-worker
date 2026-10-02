import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  setFilterStatus,
  setSearchQuery,
  setSortOptions,
} from '@/store/slices/tasksSlice';
import {
  selectFilterStatus,
  selectSearchQuery,
  selectSortOptions,
  selectTaskStats,
} from '@/store/selectors/tasksSelectors';
import { TaskSortBy, TaskSortOrder, TaskStatus } from '@/types';
import { AppInput } from '@/components/UI/AppInput';

interface SortOptionItem {
  id: string;
  label: string;
  by: TaskSortBy;
  order: TaskSortOrder;
}

const SORT_OPTIONS: SortOptionItem[] = [
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

type FilterTabKey = TaskStatus | 'All';

interface FilterTabItem {
  key: FilterTabKey;
  label: string;
}

const FILTER_TABS: FilterTabItem[] = [
  { key: 'All', label: 'Все' },
  { key: 'New', label: 'Новые' },
  { key: 'In Progress', label: 'В работе' },
  { key: 'Completed', label: 'Завершены' },
  { key: 'Cancelled', label: 'Отменены' },
];

export const TaskSortFilterBar = () => {
  const { colors, spacing, typography, radius, layout } = useTheme();
  const dispatch = useAppDispatch();

  const searchQuery = useAppSelector(selectSearchQuery);
  const filterStatus = useAppSelector(selectFilterStatus);
  const sortOptions = useAppSelector(selectSortOptions);
  const stats = useAppSelector(selectTaskStats);

  const [isSortModalVisible, setIsSortModalVisible] = useState(false);

  const handleSearchChange = (text: string) => {
    dispatch(setSearchQuery(text));
  };

  const handleClearSearch = () => {
    dispatch(setSearchQuery(''));
  };

  const handleFilterSelect = (key: FilterTabKey) => {
    dispatch(setFilterStatus(key));
  };

  const handleSortSelect = (option: SortOptionItem) => {
    dispatch(setSortOptions({ by: option.by, order: option.order }));
    setIsSortModalVisible(false);
  };

  const getTabCount = (key: FilterTabKey): number => {
    switch (key) {
      case 'All':
        return stats.total;
      case 'New':
        return stats.new;
      case 'In Progress':
        return stats.inProgress;
      case 'Completed':
        return stats.completed;
      case 'Cancelled':
        return stats.cancelled;
    }
  };

  const activeSortLabel =
    SORT_OPTIONS.find(
      (opt) => opt.by === sortOptions.by && opt.order === sortOptions.order
    )?.label ?? 'Сортировка';

  return (
    <View style={[styles.container, { paddingHorizontal: spacing.lg, paddingBottom: spacing.sm }]}>
      <View style={[styles.searchRow, { gap: spacing.sm, marginBottom: spacing.sm }]}>
        <View style={styles.searchInputWrapper}>
          <AppInput
            placeholder="Поиск по названию, адресу, описанию..."
            value={searchQuery}
            onChangeText={handleSearchChange}
            containerStyle={{ marginBottom: 0 }}
            leftIcon={
              <Ionicons
                name="search-outline"
                size={layout.iconSmall + 2}
                color={colors.textMuted}
              />
            }
            rightIcon={
              searchQuery.length > 0 ? (
                <TouchableOpacity onPress={handleClearSearch} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                  <Ionicons
                    name="close-circle"
                    size={layout.iconSmall + 2}
                    color={colors.textMuted}
                  />
                </TouchableOpacity>
              ) : undefined
            }
          />
        </View>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setIsSortModalVisible(true)}
          style={[
            styles.sortButton,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
              borderRadius: radius.md,
              height: layout.minTapTarget,
              paddingHorizontal: spacing.md,
            },
          ]}
        >
          <Ionicons
            name="swap-vertical"
            size={layout.iconMedium}
            color={colors.primary}
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[styles.tabsScrollContent, { gap: spacing.xs + 2 }]}
      >
        {FILTER_TABS.map((tab) => {
          const isActive = filterStatus === tab.key;
          const count = getTabCount(tab.key);

          return (
            <TouchableOpacity
              key={tab.key}
              activeOpacity={0.7}
              onPress={() => handleFilterSelect(tab.key)}
              style={[
                styles.tabChip,
                {
                  borderRadius: radius.md,
                  paddingHorizontal: spacing.md,
                  backgroundColor: isActive ? colors.primary : colors.surface,
                  borderColor: isActive ? colors.primary : colors.border,
                },
              ]}
            >
              <Text
                style={[
                  styles.tabLabel,
                  {
                    color: isActive ? colors.white : colors.textPrimary,
                    fontSize: typography.fontSizes.bodySmall,
                    fontWeight: isActive
                      ? typography.fontWeights.semiBold
                      : typography.fontWeights.medium,
                  },
                ]}
              >
                {tab.label}
              </Text>
              <View
                style={[
                  styles.countBadge,
                  {
                    backgroundColor: isActive
                      ? 'rgba(255, 255, 255, 0.25)'
                      : colors.surfaceSecondary,
                    borderRadius: radius.full,
                    marginLeft: spacing.xs,
                    paddingHorizontal: spacing.xs + 2,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.countText,
                    {
                      color: isActive ? colors.white : colors.textSecondary,
                      fontSize: typography.fontSizes.captionSmall,
                      fontWeight: typography.fontWeights.semiBold,
                    },
                  ]}
                >
                  {count}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <Modal
        visible={isSortModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsSortModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setIsSortModalVisible(false)}>
          <View style={[styles.modalOverlay, { backgroundColor: 'rgba(0, 0, 0, 0.45)' }]}>
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
                    onPress={() => setIsSortModalVisible(false)}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <Ionicons
                      name="close"
                      size={layout.iconMedium}
                      color={colors.textSecondary}
                    />
                  </TouchableOpacity>
                </View>

                {SORT_OPTIONS.map((opt) => {
                  const isSelected =
                    sortOptions.by === opt.by && sortOptions.order === opt.order;

                  return (
                    <TouchableOpacity
                      key={opt.id}
                      activeOpacity={0.7}
                      onPress={() => handleSortSelect(opt)}
                      style={[
                        styles.sortOptionRow,
                        {
                          paddingVertical: spacing.md,
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchInputWrapper: {
    flex: 1,
  },
  sortButton: {
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabsScrollContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tabChip: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 38,
    borderWidth: 1,
  },
  tabLabel: {},
  countBadge: {
    paddingVertical: 1,
    minWidth: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  countText: {},
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
