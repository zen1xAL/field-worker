import { Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { TaskAttachment } from '@/types';

export class MediaService {
  public static async capturePhoto(): Promise<TaskAttachment | null> {
    try {
      const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

      if (!permissionResult.granted) {
        Alert.alert(
          'Доступ к камере ограничен',
          'Для создания фотоотчета необходимо предоставить разрешение на использование камеры.'
        );
        return null;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'],
        allowsEditing: false,
        quality: 0.8,
      });

      if (result.canceled || !result.assets || result.assets.length === 0) {
        return null;
      }

      const asset = result.assets[0];
      const attachment: TaskAttachment = {
        id: `att-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        uri: asset.uri,
        name: asset.fileName ?? `photo_${Date.now()}.jpg`,
        type: 'image',
        size: asset.fileSize,
        createdAt: new Date().toISOString(),
      };

      return attachment;
    } catch {
      Alert.alert('Ошибка камеры', 'Не удалось сделать снимок. Попробуйте еще раз.');
      return null;
    }
  }

  public static async pickFromGallery(): Promise<TaskAttachment | null> {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permissionResult.granted) {
        Alert.alert(
          'Доступ к галерее ограничен',
          'Для выбора фотоотчета необходимо предоставить разрешение на доступ к медиафайлам.'
        );
        return null;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: false,
        quality: 0.8,
      });

      if (result.canceled || !result.assets || result.assets.length === 0) {
        return null;
      }

      const asset = result.assets[0];
      const attachment: TaskAttachment = {
        id: `att-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        uri: asset.uri,
        name: asset.fileName ?? `attachment_${Date.now()}.jpg`,
        type: 'image',
        size: asset.fileSize,
        createdAt: new Date().toISOString(),
      };

      return attachment;
    } catch {
      Alert.alert('Ошибка галереи', 'Не удалось загрузить изображение из галереи.');
      return null;
    }
  }
}
