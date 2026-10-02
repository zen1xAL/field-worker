import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Modal,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';
import { TaskAttachment } from '@/types';
import { MediaService } from '@/services/mediaService';
import { AppButton } from '@/components/UI/AppButton';

interface AttachmentPickerSectionProps {
  attachments: TaskAttachment[];
  onAddAttachment: (attachment: TaskAttachment) => void;
  onRemoveAttachment: (attachmentId: string) => void;
  readOnly?: boolean;
}

export const AttachmentPickerSection: React.FC<AttachmentPickerSectionProps> = ({
  attachments,
  onAddAttachment,
  onRemoveAttachment,
  readOnly = false,
}) => {
  const { colors, spacing, typography, radius, layout } = useTheme();
  const [selectedPhotoUri, setSelectedPhotoUri] = useState<string | null>(null);

  const handleCameraPress = async () => {
    const attachment = await MediaService.capturePhoto();
    if (attachment) {
      onAddAttachment(attachment);
    }
  };

  const handleGalleryPress = async () => {
    const attachment = await MediaService.pickFromGallery();
    if (attachment) {
      onAddAttachment(attachment);
    }
  };

  return (
    <View style={[styles.container, { marginBottom: spacing.md }]}>
      <View style={[styles.headerRow, { marginBottom: spacing.xs }]}>
        <Text
          style={[
            styles.sectionTitle,
            {
              color: colors.textPrimary,
              fontSize: typography.fontSizes.bodyMedium,
              fontWeight: typography.fontWeights.semiBold,
            },
          ]}
        >
          Фотоотчет и вложения ({attachments.length})
        </Text>
      </View>

      {!readOnly && (
        <View style={[styles.buttonsRow, { gap: spacing.sm, marginBottom: spacing.sm }]}>
          <AppButton
            title="Камера"
            variant="secondary"
            icon={
              <Ionicons
                name="camera-outline"
                size={layout.iconSmall}
                color={colors.primary}
              />
            }
            onPress={handleCameraPress}
            style={{ flex: 1 }}
          />

          <AppButton
            title="Галерея"
            variant="secondary"
            icon={
              <Ionicons
                name="images-outline"
                size={layout.iconSmall}
                color={colors.primary}
              />
            }
            onPress={handleGalleryPress}
            style={{ flex: 1 }}
          />
        </View>
      )}

      {attachments.length === 0 ? (
        <View
          style={[
            styles.emptyContainer,
            {
              backgroundColor: colors.surfaceSecondary,
              borderRadius: radius.md,
              padding: spacing.md,
              alignItems: 'center',
            },
          ]}
        >
          <Ionicons
            name="image-outline"
            size={layout.iconMedium}
            color={colors.textMuted}
            style={{ marginBottom: spacing.xs }}
          />
          <Text
            style={[
              styles.emptyText,
              {
                color: colors.textSecondary,
                fontSize: typography.fontSizes.bodySmall,
              },
            ]}
          >
            {readOnly
              ? 'К этому наряду фотоотчет пока не прикреплен'
              : 'Сделайте фото с объекта или добавьте снимок из галереи'}
          </Text>
        </View>
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={[styles.thumbnailsList, { gap: spacing.sm }]}
        >
          {attachments.map((item) => (
            <View key={item.id} style={styles.thumbnailWrapper}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setSelectedPhotoUri(item.uri)}
                style={[
                  styles.imageContainer,
                  {
                    borderRadius: radius.md,
                    borderColor: colors.border,
                    backgroundColor: colors.surfaceSecondary,
                  },
                ]}
              >
                <Image
                  source={{ uri: item.uri }}
                  style={[styles.thumbnailImage, { borderRadius: radius.md }]}
                  resizeMode="cover"
                />
              </TouchableOpacity>

              {!readOnly && (
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => onRemoveAttachment(item.id)}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  style={[
                    styles.deleteBadge,
                    {
                      backgroundColor: colors.danger,
                      borderRadius: radius.full,
                    },
                  ]}
                >
                  <Ionicons name="close" size={14} color={colors.white} />
                </TouchableOpacity>
              )}
            </View>
          ))}
        </ScrollView>
      )}

      <Modal
        visible={Boolean(selectedPhotoUri)}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedPhotoUri(null)}
      >
        <View style={styles.fullscreenModalContainer}>
          <TouchableOpacity
            style={[styles.closePreviewButton, { top: spacing.xxl, right: spacing.lg }]}
            onPress={() => setSelectedPhotoUri(null)}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <Ionicons name="close-circle" size={36} color="#FFFFFF" />
          </TouchableOpacity>

          {selectedPhotoUri && (
            <Image
              source={{ uri: selectedPhotoUri }}
              style={styles.fullscreenImage}
              resizeMode="contain"
            />
          )}
        </View>
      </Modal>
    </View>
  );
};

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {},
  headerRow: {},
  sectionTitle: {},
  buttonsRow: {
    flexDirection: 'row',
  },
  emptyContainer: {},
  emptyText: {
    textAlign: 'center',
  },
  thumbnailsList: {
    paddingVertical: 4,
  },
  thumbnailWrapper: {
    position: 'relative',
  },
  imageContainer: {
    width: 76,
    height: 76,
    borderWidth: 1,
    overflow: 'hidden',
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
  },
  deleteBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullscreenModalContainer: {
    flex: 1,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closePreviewButton: {
    position: 'absolute',
    zIndex: 10,
  },
  fullscreenImage: {
    width: windowWidth,
    height: windowHeight * 0.85,
  },
});
