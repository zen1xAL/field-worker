import React, { ReactNode } from 'react';
import { View, StyleSheet, TouchableOpacity, StyleProp, ViewStyle } from 'react-native';
import { useTheme } from '@/hooks/useTheme';

interface AppCardProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  variant?: 'default' | 'secondary' | 'highlighted';
}

export const AppCard = ({
  children,
  style,
  onPress,
  variant = 'default',
}: AppCardProps) => {
  const { colors, spacing, radius } = useTheme();

  const getBackgroundColor = () => {
    switch (variant) {
      case 'secondary':
        return colors.surfaceSecondary;
      case 'highlighted':
        return colors.primaryLight;
      default:
        return colors.surface;
    }
  };

  const cardStyle: ViewStyle = {
    backgroundColor: getBackgroundColor(),
    borderColor: variant === 'highlighted' ? colors.primary : colors.border,
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
  };

  if (onPress) {
    return (
      <TouchableOpacity
        style={[cardStyle, style]}
        onPress={onPress}
        activeOpacity={0.7}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return <View style={[cardStyle, style]}>{children}</View>;
};
