import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
  TouchableWithoutFeedback,
} from 'react-native';
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
  const [showCoordinates, setShowCoordinates] = useState(
    Boolean(location.latitude && location.longitude)
  );

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
    setShowCoordinates(true);
    setIsModalVisible(false);
  };

  const handleLatitudeChange = (text: string) => {
    const parsed = parseFloat(text);
    onChangeLocation({
      ...location,
      latitude: isNaN(parsed) ? undefined : parsed,
    });
  };

  const handleLongitudeChange = (text: string) => {
    const parsed = parseFloat(text);
    onChangeLocation({
      ...location,
      longitude: isNaN(parsed) ? undefined : parsed,
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
            size={layout.iconSmall + 2}
            color={colors.primary}
          />
        }
      />

      <View style={[styles.actionsRow, { gap: spacing.sm, marginTop: spacing.xs }]}>
        <AppButton
          title="Справочник типовых объектов"
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
          onPress={() => setShowCoordinates(!showCoordinates)}
          style={[
            styles.toggleCoordsButton,
            {
              backgroundColor: colors.surfaceSecondary,
              borderRadius: radius.md,
              height: layout.minTapTarget,
              paddingHorizontal: spacing.md,
            },
          ]}
        >
          <Ionicons
            name={showCoordinates ? 'navigate' : 'navigate-outline'}
            size={layout.iconMedium}
            color={colors.textSecondary}
          />
        </TouchableOpacity>
      </View>

      {showCoordinates && (
        <View
          style={[
            styles.coordinatesContainer,
            {
              backgroundColor: colors.surfaceSecondary,
              borderRadius: radius.md,
              padding: spacing.md,
              marginTop: spacing.sm,
            },
          ]}
        >
          <Text
            style={[
              styles.coordsLabel,
              {
                color: colors.textSecondary,
                fontSize: typography.fontSizes.caption,
                fontWeight: typography.fontWeights.medium,
                marginBottom: spacing.xs,
              },
            ]}
          >
            GPS Координаты (для карты)
          </Text>

          <View style={[styles.coordsInputsRow, { gap: spacing.sm }]}>
            <View style={{ flex: 1 }}>
              <AppInput
                placeholder="Широта (Lat)"
                value={location.latitude !== undefined ? String(location.latitude) : ''}
                onChangeText={handleLatitudeChange}
                keyboardType="numeric"
                containerStyle={{ marginBottom: 0 }}
              />
            </View>
            <View style={{ flex: 1 }}>
              <AppInput
                placeholder="Долгота (Lng)"
                value={location.longitude !== undefined ? String(location.longitude) : ''}
                onChangeText={handleLongitudeChange}
                keyboardType="numeric"
                containerStyle={{ marginBottom: 0 }}
              />
            </View>
          </View>
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
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
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
                      <View style={[styles.predefinedIconCircle, { backgroundColor: colors.primaryLight, borderRadius: radius.full, padding: spacing.xs, marginRight: spacing.md }]}>
                        <Ionicons
                          name="location"
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
                              marginTop: 2,
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
  toggleCoordsButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  coordinatesContainer: {},
  coordsLabel: {},
  coordsInputsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
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
