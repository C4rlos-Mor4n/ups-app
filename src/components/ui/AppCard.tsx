import React from 'react';
import { View, ViewProps, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, spacing, radii, shadows } from '../../theme';

interface AppCardProps extends ViewProps {
  variant?: 'elevated' | 'outlined' | 'flat';
  onPress?: () => void;
}

export function AppCard({ 
  children, 
  variant = 'elevated', 
  style, 
  onPress,
  ...props 
}: AppCardProps) {
  const cardStyle = [
    styles.card,
    variant === 'elevated' && shadows.soft,
    variant === 'outlined' && styles.outlined,
    variant === 'flat' && styles.flat,
    style,
  ];

  if (onPress) {
    return (
      <TouchableOpacity activeOpacity={0.8} onPress={onPress} style={cardStyle} {...(props as any)}>
        {children}
      </TouchableOpacity>
    );
  }

  return (
    <View style={cardStyle} {...props}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    padding: spacing.lg,
    overflow: 'hidden',
  },
  outlined: {
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  flat: {
    backgroundColor: colors.backgroundSecondary,
  },
});
