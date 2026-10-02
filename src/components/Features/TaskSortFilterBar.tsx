import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
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
import { TaskStatus } from '@/types';
import { AppInput } from '@/components/UI/AppInput';
import { TaskSortModal, SortOptionItem } from './TaskSortModal';

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
                <TouchableOpacity
                  onPress={handleClearSearch}
                  hitSlop={{ top: spacing.sm, bottom: spacing.sm, left: spacing.sm, right: spacing.sm }}
                >
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
              width: layout.minTapTarget,
              height: layout.minTapTarget,
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
                  height: layout.minTapTarget,
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

      <TaskSortModal
        visible={isSortModalVisible}
        activeBy={sortOptions.by}
        activeOrder={sortOptions.order}
        onSelectOption={handleSortSelect}
        onClose={() => setIsSortModalVisible(false)}
      />
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
    borderWidth: 1,
  },
  tabLabel: {},
  countBadge: {
    paddingVertical: 2,
    minWidth: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  countText: {},
});
