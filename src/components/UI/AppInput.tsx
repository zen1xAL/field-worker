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

export interface AppInputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: StyleProp<ViewStyle>;
  required?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const AppInput = ({
  label,
  error,
  containerStyle,
  required = false,
  leftIcon,
  rightIcon,
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
      {label && (
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
      )}

      <View
        style={[
          styles.inputWrapper,
          {
            backgroundColor: colors.surface,
            borderColor: getBorderColor(),
            borderRadius: radius.md,
          },
        ]}
      >
        {leftIcon && (
          <View style={[styles.iconContainer, { paddingLeft: spacing.md }]}>
            {leftIcon}
          </View>
        )}

        <TextInput
          style={[
            styles.input,
            {
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

        {rightIcon && (
          <View style={[styles.iconContainer, { paddingRight: spacing.md }]}>
            {rightIcon}
          </View>
        )}
      </View>

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
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    minHeight: 48,
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    flex: 1,
  },
  errorText: {
    fontWeight: '500',
  },
});
