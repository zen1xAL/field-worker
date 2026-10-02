import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
  TouchableWithoutFeedback,
  ActivityIndicator,
} from 'react-native';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';
import { PREDEFINED_LOCATIONS } from '@/constants';
import { TaskLocation } from '@/types';
import { AppInput } from '@/components/UI/AppInput';
import { AppButton } from '@/components/UI/AppButton';

interface LocationPickerSectionProps {
  location: TaskLocation;
  onChangeLocation: (location: TaskLocation) => void;
  error?: string;
}

export const LocationPickerSection: React.FC<LocationPickerSectionProps> = ({
  location,
  onChangeLocation,
  error,
}) => {
  const { colors, spacing, typography, radius, layout } = useTheme();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLocating, setIsLocating] = useState(false);

  const hasCoords =
    location.latitude !== undefined &&
    location.longitude !== undefined &&
    !isNaN(location.latitude) &&
    !isNaN(location.longitude);

  const handleAddressTextChange = (text: string) => {
    onChangeLocation({
      ...location,
      address: text,
    });
  };

  const handleSelectPredefined = (item: (typeof PREDEFINED_LOCATIONS)[number]) => {
    onChangeLocation({
      address: item.address,
      latitude: item.latitude,
      longitude: item.longitude,
    });
    setIsModalVisible(false);
  };

  const handleGetCurrentLocation = async () => {
    try {
      setIsLocating(true);
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setIsLocating(false);
        return;
      }

      const position = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const lat = position.coords.latitude;
      const lng = position.coords.longitude;
      let resolvedAddress = location.address.trim();

      try {
        const [geo] = await Location.reverseGeocodeAsync({
          latitude: lat,
          longitude: lng,
        });

        if (geo) {
          const parts = [geo.street, geo.streetNumber, geo.city].filter(Boolean);
          if (parts.length > 0) {
            resolvedAddress = parts.join(', ');
          }
        }
      } catch {
        if (!resolvedAddress) {
          resolvedAddress = `Координаты: ${lat.toFixed(4)}, ${lng.toFixed(4)}`;
        }
      }

      onChangeLocation({
        address: resolvedAddress || `Координаты: ${lat.toFixed(4)}, ${lng.toFixed(4)}`,
        latitude: lat,
        longitude: lng,
      });
    } catch {
      return;
    } finally {
      setIsLocating(false);
    }
  };

  const handleClearCoords = () => {
    onChangeLocation({
      ...location,
      latitude: undefined,
      longitude: undefined,
    });
  };

  return (
    <View style={[styles.container, { marginBottom: spacing.md }]}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: colors.textPrimary,
            fontSize: typography.fontSizes.bodyMedium,
            fontWeight: typography.fontWeights.semiBold,
            marginBottom: spacing.xs,
          },
        ]}
      >
        Локация объекта
      </Text>

      <AppInput
        placeholder="Укажите точный адрес объекта..."
        value={location.address}
        onChangeText={handleAddressTextChange}
        error={error}
        leftIcon={
          <Ionicons
            name="location-outline"
            size={layout.iconSmall + spacing.xs}
            color={colors.primary}
          />
        }
      />

      <View style={[styles.actionsRow, { gap: spacing.sm, marginTop: spacing.xs }]}>
        <AppButton
          title="Справочник объектов"
          variant="secondary"
          icon={
            <Ionicons
              name="business-outline"
              size={layout.iconSmall}
              color={colors.primary}
            />
          }
          onPress={() => setIsModalVisible(true)}
          style={{ flex: 1 }}
        />

        <TouchableOpacity
          activeOpacity={0.7}
          disabled={isLocating}
          onPress={handleGetCurrentLocation}
          style={[
            styles.gpsButton,
            {
              backgroundColor: colors.surfaceSecondary,
              borderColor: colors.border,
              borderRadius: radius.md,
              height: layout.minTapTarget,
              paddingHorizontal: spacing.md,
            },
          ]}
        >
          {isLocating ? (
            <ActivityIndicator size="small" color={colors.primary} />
          ) : (
            <View style={[styles.gpsContent, { gap: spacing.xs }]}>
              <Ionicons
                name="navigate"
                size={layout.iconSmall}
                color={colors.primary}
              />
              <Text
                style={{
                  color: colors.primary,
                  fontSize: typography.fontSizes.bodySmall,
                  fontWeight: typography.fontWeights.medium,
                }}
              >
                GPS
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {hasCoords && (
        <View
          style={[
            styles.coordsBadgeContainer,
            {
              backgroundColor: colors.surfaceSecondary,
              borderRadius: radius.md,
              borderColor: colors.border,
              paddingVertical: spacing.sm,
              paddingHorizontal: spacing.md,
              marginTop: spacing.sm,
              gap: spacing.sm,
            },
          ]}
        >
          <Ionicons
            name="checkmark-circle"
            size={layout.iconSmall}
            color={colors.statusCompleted}
          />
          <Text
            style={[
              styles.coordsBadgeText,
              {
                color: colors.textSecondary,
                fontSize: typography.fontSizes.caption,
                fontWeight: typography.fontWeights.medium,
                flex: 1,
              },
            ]}
          >
            GPS зафиксирован: {location.latitude?.toFixed(4)}, {location.longitude?.toFixed(4)}
          </Text>
          <TouchableOpacity
            onPress={handleClearCoords}
            hitSlop={{
              top: spacing.sm,
              bottom: spacing.sm,
              left: spacing.sm,
              right: spacing.sm,
            }}
          >
            <Ionicons
              name="close-circle"
              size={layout.iconSmall + spacing.xs}
              color={colors.textMuted}
            />
          </TouchableOpacity>
        </View>
      )}

      <Modal
        visible={isModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setIsModalVisible(false)}>
          <View style={[styles.modalOverlay, { backgroundColor: colors.modalOverlay }]}>
            <TouchableWithoutFeedback>
              <View
                style={[
                  styles.modalContent,
                  {
                    backgroundColor: colors.surface,
                    borderRadius: radius.lg,
                    padding: spacing.lg,
                    maxHeight: '80%',
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
                    Выберите объект из справочника
                  </Text>
                  <TouchableOpacity
                    onPress={() => setIsModalVisible(false)}
                    hitSlop={{
                      top: spacing.sm,
                      bottom: spacing.sm,
                      left: spacing.sm,
                      right: spacing.sm,
                    }}
                  >
                    <Ionicons
                      name="close"
                      size={layout.iconMedium}
                      color={colors.textSecondary}
                    />
                  </TouchableOpacity>
                </View>

                <FlatList
                  data={PREDEFINED_LOCATIONS}
                  keyExtractor={(item) => item.address}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      activeOpacity={0.7}
                      onPress={() => handleSelectPredefined(item)}
                      style={[
                        styles.predefinedItem,
                        {
                          paddingVertical: spacing.md,
                          borderBottomWidth: 1,
                          borderBottomColor: colors.border,
                        },
                      ]}
                    >
                      <View
                        style={[
                          styles.predefinedIconCircle,
                          {
                            backgroundColor: colors.primaryLight,
                            borderRadius: radius.full,
                            padding: spacing.xs,
                            marginRight: spacing.md,
                          },
                        ]}
                      >
                        <Ionicons
                          name="business"
                          size={layout.iconSmall}
                          color={colors.primary}
                        />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text
                          style={[
                            styles.predefinedTitle,
                            {
                              color: colors.textPrimary,
                              fontSize: typography.fontSizes.body,
                              fontWeight: typography.fontWeights.semiBold,
                            },
                          ]}
                        >
                          {item.title}
                        </Text>
                        <Text
                          style={[
                            styles.predefinedAddress,
                            {
                              color: colors.textSecondary,
                              fontSize: typography.fontSizes.bodySmall,
                              marginTop: spacing.xs,
                            },
                          ]}
                        >
                          {item.address}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  )}
                />
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
  sectionTitle: {},
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  gpsButton: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  gpsContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  coordsBadgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
  },
  coordsBadgeText: {},
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContent: {
    width: '100%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modalTitle: {},
  predefinedItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  predefinedIconCircle: {},
  predefinedTitle: {},
  predefinedAddress: {},
});
