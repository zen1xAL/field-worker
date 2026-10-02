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
import { formatTaskDateTime } from '@/utils/dateTime';
import { ScreenHeader } from '@/components/UI/ScreenHeader';
import { AppBadge } from '@/components/UI/AppBadge';

type MapFilterStatus = TaskStatus | 'All';

const FILTER_OPTIONS: { key: MapFilterStatus; label: string }[] = [
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
                <View
                  style={[
                    styles.calloutCard,
                    {
                      backgroundColor: colors.surface,
                      borderRadius: radius.md,
                      padding: spacing.md,
                      borderColor: colors.border,
                    },
                  ]}
                >
                  <View style={[styles.calloutHeader, { marginBottom: spacing.xs }]}>
                    <AppBadge label={task.status} variant={task.status} />
                  </View>

                  <Text
                    style={[
                      styles.calloutTitle,
                      {
                        color: colors.textPrimary,
                        fontSize: typography.fontSizes.bodyMedium,
                        fontWeight: typography.fontWeights.bold,
                        marginBottom: 2,
                      },
                    ]}
                  >
                    {task.title}
                  </Text>

                  <Text
                    style={[
                      styles.calloutAddress,
                      {
                        color: colors.textSecondary,
                        fontSize: typography.fontSizes.caption,
                        marginBottom: spacing.xs,
                      },
                    ]}
                  >
                    {task.location.address}
                  </Text>

                  <View style={styles.calloutFooter}>
                    <Text
                      style={{
                        color: colors.textMuted,
                        fontSize: typography.fontSizes.captionSmall,
                      }}
                    >
                      {formatTaskDateTime(task.dueDate)}
                    </Text>

                    <Text
                      style={{
                        color: colors.primary,
                        fontSize: typography.fontSizes.captionSmall,
                        fontWeight: typography.fontWeights.semiBold,
                      }}
                    >
                      Открыть →
                    </Text>
                  </View>
                </View>
              </Callout>
            </Marker>
          ))}
        </MapView>

        {tasksWithCoords.length === 0 && (
          <View
            style={[
              styles.floatingEmptyBanner,
              {
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
    height: 38,
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
  calloutCard: {
    width: 240,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  calloutHeader: {},
  calloutTitle: {},
  calloutAddress: {},
  calloutFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  floatingEmptyBanner: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    elevation: 3,
  },
});
