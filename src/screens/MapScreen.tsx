import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import MapView, { Marker, Callout, Region } from 'react-native-maps';
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
import { MapCalloutCard } from '@/components/Features/MapCalloutCard';

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
  const mapRef = useRef<MapView | null>(null);

  const allTasks = useAppSelector(selectTasksItems);
  const [filter, setFilter] = useState<MapFilterStatus>('All');

  const tasksWithCoords = allTasks.filter((task): task is Task & {
    location: { address: string; latitude: number; longitude: number };
  } => {
    const hasCoords =
      task.location.latitude !== undefined && task.location.longitude !== undefined;
    if (!hasCoords) {
      return false;
    }
    if (filter === 'All') {
      return true;
    }
    return task.status === filter;
  });

  const getMarkerPinColor = (status: TaskStatus): string => {
    switch (status) {
      case 'New':
        return colors.statusNew;
      case 'In Progress':
        return colors.statusInProgress;
      case 'Completed':
        return colors.statusCompleted;
      case 'Cancelled':
        return colors.statusCancelled;
    }
  };

  const handleCenterMap = () => {
    if (mapRef.current) {
      const region: Region = {
        latitude: DEFAULT_MAP_REGION.latitude,
        longitude: DEFAULT_MAP_REGION.longitude,
        latitudeDelta: DEFAULT_MAP_REGION.latitudeDelta,
        longitudeDelta: DEFAULT_MAP_REGION.longitudeDelta,
      };
      mapRef.current.animateToRegion(region, 500);
    }
  };

  const handleCalloutPress = (taskId: string) => {
    navigation.navigate('TaskDetail', { taskId });
  };

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

      <View style={[styles.filterBarWrapper, { paddingHorizontal: spacing.lg, paddingBottom: spacing.sm }]}>
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
        <MapView
          ref={mapRef}
          style={styles.map}
          initialRegion={{
            latitude: DEFAULT_MAP_REGION.latitude,
            longitude: DEFAULT_MAP_REGION.longitude,
            latitudeDelta: DEFAULT_MAP_REGION.latitudeDelta,
            longitudeDelta: DEFAULT_MAP_REGION.longitudeDelta,
          }}
          showsCompass
          showsScale
        >
          {tasksWithCoords.map((task) => (
            <Marker
              key={task.id}
              coordinate={{
                latitude: task.location.latitude,
                longitude: task.location.longitude,
              }}
              pinColor={getMarkerPinColor(task.status)}
              title={task.title}
              description={task.location.address}
            >
              <Callout tooltip onPress={() => handleCalloutPress(task.id)}>
                <MapCalloutCard task={task} />
              </Callout>
            </Marker>
          ))}
        </MapView>

        {tasksWithCoords.length === 0 && (
          <View
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
              Нет объектов с GPS координатами для отображения на карте. Выберите типовой объект при создании наряда.
            </Text>
          </View>
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
  map: {
    ...StyleSheet.absoluteFill,
  },
  floatingEmptyBanner: {
    position: 'absolute',
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    elevation: 3,
  },
});
