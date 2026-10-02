import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';
import { useAppSelector } from '@/store/hooks';
import { selectTasksItems } from '@/store/selectors/tasksSelectors';
import { RootStackParamList } from '@/navigation/types';
import { DEFAULT_MAP_REGION } from '@/constants';
import { Task, TaskStatus } from '@/types';
import { ScreenHeader } from '@/components/UI/ScreenHeader';
import {
  InteractiveMapView,
  InteractiveMapViewRef,
} from '@/components/Features/InteractiveMapView';

type MapFilterStatus = TaskStatus | 'All';

interface FilterOptionItem {
  key: MapFilterStatus;
  label: string;
}

const FILTER_OPTIONS: FilterOptionItem[] = [
  { key: 'All', label: 'Все объекты' },
  { key: 'New', label: 'Новые' },
  { key: 'In Progress', label: 'В работе' },
  { key: 'Completed', label: 'Завершенные' },
];

export const MapScreen = () => {
  const { colors, spacing, typography, layout, radius } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const mapRef = useRef<InteractiveMapViewRef | null>(null);

  const allTasks = useAppSelector(selectTasksItems);
  const [filter, setFilter] = useState<MapFilterStatus>('All');

  const tasksWithCoords = allTasks.filter((task): task is Task & {
    location: { address: string; latitude: number; longitude: number };
  } => {
    const hasCoords =
      task.location.latitude !== undefined &&
      task.location.longitude !== undefined &&
      !isNaN(task.location.latitude) &&
      !isNaN(task.location.longitude);
    if (!hasCoords) {
      return false;
    }
    if (filter === 'All') {
      return true;
    }
    return task.status === filter;
  });

  const totalTasksWithCoords = allTasks.filter(
    (task): task is Task & {
      location: { address: string; latitude: number; longitude: number };
    } =>
      task.location.latitude !== undefined &&
      task.location.longitude !== undefined &&
      !isNaN(task.location.latitude) &&
      !isNaN(task.location.longitude)
  );

  const latestTaskWithCoords = totalTasksWithCoords[0];

  const initialLatitude = latestTaskWithCoords
    ? latestTaskWithCoords.location.latitude
    : DEFAULT_MAP_REGION.latitude;

  const initialLongitude = latestTaskWithCoords
    ? latestTaskWithCoords.location.longitude
    : DEFAULT_MAP_REGION.longitude;

  const handleCenterMap = () => {
    if (!mapRef.current) {
      return;
    }
    if (tasksWithCoords.length > 0) {
      const coords = tasksWithCoords.map((task) => ({
        latitude: task.location.latitude,
        longitude: task.location.longitude,
      }));
      mapRef.current.centerOnCoordinates(coords);
    } else {
      mapRef.current.resetView(initialLatitude, initialLongitude);
    }
  };

  const handleOpenTask = (taskId: string) => {
    navigation.navigate('TaskDetail', { taskId });
  };

  const activeFilterLabel =
    FILTER_OPTIONS.find((item) => item.key === filter)?.label ?? '';

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScreenHeader
        title="Карта объектов"
        subtitle={`Точек с координатами: ${tasksWithCoords.length}`}
        rightElement={
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handleCenterMap}
            style={[
              styles.centerButton,
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
              name="locate"
              size={layout.iconMedium}
              color={colors.primary}
            />
          </TouchableOpacity>
        }
      />

      <View
        style={[
          styles.filterBarWrapper,
          { paddingHorizontal: spacing.lg, paddingBottom: spacing.sm },
        ]}
      >
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={[styles.filtersScroll, { gap: spacing.xs }]}
        >
          {FILTER_OPTIONS.map((item) => {
            const isActive = filter === item.key;
            return (
              <TouchableOpacity
                key={item.key}
                activeOpacity={0.7}
                onPress={() => setFilter(item.key)}
                style={[
                  styles.filterChip,
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
                  style={{
                    color: isActive ? colors.white : colors.textPrimary,
                    fontSize: typography.fontSizes.bodySmall,
                    fontWeight: isActive
                      ? typography.fontWeights.semiBold
                      : typography.fontWeights.medium,
                  }}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <View style={styles.mapContainer}>
        <InteractiveMapView
          ref={mapRef}
          tasks={tasksWithCoords}
          onSelectTask={handleOpenTask}
          initialLatitude={initialLatitude}
          initialLongitude={initialLongitude}
        />

        {tasksWithCoords.length === 0 && (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              if (totalTasksWithCoords.length > 0) {
                setFilter('All');
              }
            }}
            style={[
              styles.floatingEmptyBanner,
              {
                bottom: spacing.xl,
                backgroundColor: colors.surface,
                borderRadius: radius.md,
                padding: spacing.md,
                margin: spacing.lg,
                borderColor: colors.border,
              },
            ]}
          >
            <Ionicons
              name="information-circle-outline"
              size={layout.iconMedium}
              color={colors.primary}
              style={{ marginRight: spacing.sm }}
            />
            <Text
              style={{
                color: colors.textSecondary,
                fontSize: typography.fontSizes.bodySmall,
                flex: 1,
              }}
            >
              {totalTasksWithCoords.length > 0
                ? `В статусе «${activeFilterLabel}» нет объектов. Нажмите здесь, чтобы показать все ${totalTasksWithCoords.length} метки на карте.`
                : 'Нет объектов с GPS-координатами. Выберите типовой объект или нажмите «GPS» при создании наряда.'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerButton: {
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterBarWrapper: {},
  filtersScroll: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterChip: {
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapContainer: {
    flex: 1,
    position: 'relative',
  },
  floatingEmptyBanner: {
    position: 'absolute',
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
  },
});
