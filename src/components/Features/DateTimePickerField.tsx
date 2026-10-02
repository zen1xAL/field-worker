import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';
import { formatTaskDateOnly, formatTaskTimeOnly } from '@/utils/dateTime';

interface DateTimePickerFieldProps {
  dueDate: string;
  onChangeDueDate: (dueDateIso: string) => void;
  error?: string;
}

export const DateTimePickerField: React.FC<DateTimePickerFieldProps> = ({
  dueDate,
  onChangeDueDate,
  error,
}) => {
  const { colors, spacing, typography, radius, layout } = useTheme();

  const [currentDate, setCurrentDate] = useState<Date>(() => {
    const parsed = new Date(dueDate);
    return isNaN(parsed.getTime()) ? new Date() : parsed;
  });

  const [pickerMode, setPickerMode] = useState<'date' | 'time'>('date');
  const [showPicker, setShowPicker] = useState(false);

  const handleOpenPicker = (mode: 'date' | 'time') => {
    setPickerMode(mode);
    setShowPicker(true);
  };

  const handlePickerChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowPicker(false);
    }

    if (event.type === 'dismissed' || !selectedDate) {
      return;
    }

    setCurrentDate(selectedDate);
    onChangeDueDate(selectedDate.toISOString());

    if (Platform.OS === 'android' && pickerMode === 'date') {
      setTimeout(() => {
        setPickerMode('time');
        setShowPicker(true);
      }, 150);
    }
  };

  const handleApplyPreset = (hoursOffset: number, fixedHour?: number) => {
    const nextDate = new Date();
    if (fixedHour !== undefined) {
      nextDate.setDate(nextDate.getDate() + 1);
      nextDate.setHours(fixedHour, 0, 0, 0);
    } else {
      nextDate.setHours(nextDate.getHours() + hoursOffset);
      nextDate.setMinutes(0, 0, 0);
    }
    setCurrentDate(nextDate);
    onChangeDueDate(nextDate.toISOString());
  };

  return (
    <View style={[styles.container, { marginBottom: spacing.md }]}>
      <Text
        style={[
          styles.label,
          {
            color: colors.textPrimary,
            fontSize: typography.fontSizes.bodyMedium,
            fontWeight: typography.fontWeights.semiBold,
            marginBottom: spacing.xs,
          },
        ]}
      >
        Дедлайн и плановое время
      </Text>

      <View style={[styles.displayRow, { gap: spacing.sm }]}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => handleOpenPicker('date')}
          style={[
            styles.selectorBox,
            {
              backgroundColor: colors.surface,
              borderColor: error ? colors.danger : colors.border,
              borderRadius: radius.md,
              height: layout.minTapTarget,
              paddingHorizontal: spacing.md,
            },
          ]}
        >
          <Ionicons
            name="calendar-outline"
            size={layout.iconSmall + 2}
            color={colors.primary}
            style={{ marginRight: spacing.xs }}
          />
          <Text
            style={[
              styles.selectorText,
              {
                color: colors.textPrimary,
                fontSize: typography.fontSizes.body,
              },
            ]}
          >
            {formatTaskDateOnly(dueDate)}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => handleOpenPicker('time')}
          style={[
            styles.selectorBox,
            {
              backgroundColor: colors.surface,
              borderColor: error ? colors.danger : colors.border,
              borderRadius: radius.md,
              height: layout.minTapTarget,
              paddingHorizontal: spacing.md,
              width: layout.timePickerWidth,
            },
          ]}
        >
          <Ionicons
            name="time-outline"
            size={layout.iconSmall + 2}
            color={colors.primary}
            style={{ marginRight: spacing.xs }}
          />
          <Text
            style={[
              styles.selectorText,
              {
                color: colors.textPrimary,
                fontSize: typography.fontSizes.body,
              },
            ]}
          >
            {formatTaskTimeOnly(dueDate)}
          </Text>
        </TouchableOpacity>
      </View>

      {Boolean(error) && (
        <Text
          style={[
            styles.errorText,
            {
              color: colors.danger,
              fontSize: typography.fontSizes.caption,
              marginTop: spacing.xs,
            },
          ]}
        >
          {error}
        </Text>
      )}

      <View style={[styles.presetsRow, { gap: spacing.xs, marginTop: spacing.sm }]}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => handleApplyPreset(1)}
          style={[
            styles.presetChip,
            {
              backgroundColor: colors.surfaceSecondary,
              borderRadius: radius.sm,
              paddingVertical: spacing.xs + 2,
              paddingHorizontal: spacing.sm,
            },
          ]}
        >
          <Text
            style={{
              color: colors.textSecondary,
              fontSize: typography.fontSizes.captionSmall,
              fontWeight: typography.fontWeights.medium,
            }}
          >
            +1 час
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => handleApplyPreset(3)}
          style={[
            styles.presetChip,
            {
              backgroundColor: colors.surfaceSecondary,
              borderRadius: radius.sm,
              paddingVertical: spacing.xs + 2,
              paddingHorizontal: spacing.sm,
            },
          ]}
        >
          <Text
            style={{
              color: colors.textSecondary,
              fontSize: typography.fontSizes.captionSmall,
              fontWeight: typography.fontWeights.medium,
            }}
          >
            +3 часа
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => handleApplyPreset(0, 9)}
          style={[
            styles.presetChip,
            {
              backgroundColor: colors.surfaceSecondary,
              borderRadius: radius.sm,
              paddingVertical: spacing.xs + 2,
              paddingHorizontal: spacing.sm,
            },
          ]}
        >
          <Text
            style={{
              color: colors.textSecondary,
              fontSize: typography.fontSizes.captionSmall,
              fontWeight: typography.fontWeights.medium,
            }}
          >
            Завтра 09:00
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => handleApplyPreset(0, 18)}
          style={[
            styles.presetChip,
            {
              backgroundColor: colors.surfaceSecondary,
              borderRadius: radius.sm,
              paddingVertical: spacing.xs + 2,
              paddingHorizontal: spacing.sm,
            },
          ]}
        >
          <Text
            style={{
              color: colors.textSecondary,
              fontSize: typography.fontSizes.captionSmall,
              fontWeight: typography.fontWeights.medium,
            }}
          >
            Завтра 18:00
          </Text>
        </TouchableOpacity>
      </View>

      {showPicker && (
        <DateTimePicker
          value={currentDate}
          mode={pickerMode}
          is24Hour={true}
          display="default"
          onChange={handlePickerChange}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  label: {},
  displayRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectorBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
  },
  selectorText: {},
  errorText: {},
  presetsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  presetChip: {},
});
