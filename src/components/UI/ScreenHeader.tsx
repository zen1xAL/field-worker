import React, { ReactNode } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';

interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  rightElement?: ReactNode;
  showBackButton?: boolean;
  onBackPress?: () => void;
}

export const ScreenHeader = ({
  title,
  subtitle,
  rightElement,
  showBackButton = false,
  onBackPress,
}: ScreenHeaderProps) => {
  const { colors, spacing, typography } = useTheme();

  return (
    <View style={[styles.container, { paddingHorizontal: spacing.lg, paddingVertical: spacing.md }]}>
      <View style={styles.leftGroup}>
        {showBackButton && (
          <TouchableOpacity
            style={[styles.backButton, { marginRight: spacing.sm }]}
            onPress={onBackPress}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
        )}
        <View style={styles.titleGroup}>
          <Text
            style={[
              styles.title,
              {
                color: colors.textPrimary,
                fontSize: typography.fontSizes.titleLarge,
                fontWeight: typography.fontWeights.bold,
              },
            ]}
          >
            {title}
          </Text>
          {subtitle && (
            <Text
              style={[
                styles.subtitle,
                {
                  color: colors.textSecondary,
                  fontSize: typography.fontSizes.bodySmall,
                  marginTop: spacing.xs / 2,
                },
              ]}
            >
              {subtitle}
            </Text>
          )}
        </View>
      </View>
      {rightElement && <View style={styles.rightGroup}>{rightElement}</View>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  titleGroup: {
    flex: 1,
  },
  title: {
    letterSpacing: -0.4,
  },
  subtitle: {},
  backButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rightGroup: {
    marginLeft: 12,
  },
});
