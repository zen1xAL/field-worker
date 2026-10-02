import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TextInputProps,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { useTheme } from '@/hooks/useTheme';

interface AppInputProps extends TextInputProps {
  label: string;
  error?: string;
  containerStyle?: StyleProp<ViewStyle>;
  required?: boolean;
}

export const AppInput = ({
  label,
  error,
  containerStyle,
  required = false,
  style,
  ...props
}: AppInputProps) => {
  const { colors, spacing, radius, typography } = useTheme();
  const [isFocused, setIsFocused] = useState(false);

  const getBorderColor = (): string => {
    if (error) {
      return colors.danger;
    }
    if (isFocused) {
      return colors.primary;
    }
    return colors.border;
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <View style={styles.labelRow}>
        <Text
          style={[
            styles.label,
            {
              color: colors.textSecondary,
              fontSize: typography.fontSizes.bodySmall,
              fontWeight: typography.fontWeights.medium,
              marginBottom: spacing.xs,
            },
          ]}
        >
          {label}
        </Text>
        {required && (
          <Text
            style={[
              styles.requiredAsterisk,
              {
                color: colors.danger,
                fontSize: typography.fontSizes.bodySmall,
                marginLeft: spacing.xs,
              },
            ]}
          >
            *
          </Text>
        )}
      </View>
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: colors.surface,
            borderColor: getBorderColor(),
            borderRadius: radius.md,
            color: colors.textPrimary,
            fontSize: typography.fontSizes.body,
            paddingHorizontal: spacing.md,
            paddingVertical: props.multiline ? spacing.md : spacing.sm,
          },
          style,
        ]}
        placeholderTextColor={colors.textMuted}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        {...props}
      />
      {error && (
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {},
  requiredAsterisk: {},
  input: {
    minHeight: 48,
    borderWidth: 1,
  },
  errorText: {
    fontWeight: '500',
  },
});
