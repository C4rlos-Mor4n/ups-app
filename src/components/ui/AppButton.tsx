import React from 'react';
import { TouchableOpacity, ActivityIndicator, StyleSheet, TouchableOpacityProps, View } from 'react-native';
import { colors, spacing, radii } from '../../theme';
import { AppText } from './AppText';

interface AppButtonProps extends TouchableOpacityProps {
  label: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export function AppButton({
  label,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  style,
  ...props
}: AppButtonProps) {
  
  const getBackgroundColor = () => {
    if (disabled) return colors.border;
    switch (variant) {
      case 'primary': return colors.actionPrimary;
      case 'secondary': return colors.backgroundSecondary;
      case 'outline': return 'transparent';
      case 'ghost': return 'transparent';
      default: return colors.actionPrimary;
    }
  };

  const getBorderColor = () => {
    if (disabled) return 'transparent';
    if (variant === 'outline') return colors.border;
    return 'transparent';
  };

  const getTextColor = () => {
    if (disabled) return 'secondary';
    switch (variant) {
      case 'primary': return 'inverse';
      case 'secondary': return 'primary';
      case 'outline': return 'primary';
      case 'ghost': return 'actionPrimary';
      default: return 'inverse';
    }
  };

  const getPadding = () => {
    switch (size) {
      case 'sm': return { paddingVertical: spacing.sm, paddingHorizontal: spacing.md };
      case 'lg': return { paddingVertical: spacing.lg, paddingHorizontal: spacing.xxl };
      case 'md':
      default: return { paddingVertical: spacing.md, paddingHorizontal: spacing.xl };
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      disabled={disabled || loading}
      style={[
        styles.button,
        {
          backgroundColor: getBackgroundColor(),
          borderColor: getBorderColor(),
          borderWidth: variant === 'outline' ? 1 : 0,
        },
        getPadding(),
        style,
      ]}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? colors.surface : colors.actionPrimary} />
      ) : (
        <View style={styles.content}>
          {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
          <AppText color={getTextColor()} weight="medium" variant={size === 'sm' ? 'bodyS' : 'bodyM'}>
            {label}
          </AppText>
          {rightIcon && <View style={styles.rightIcon}>{rightIcon}</View>}
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  leftIcon: {
    marginRight: spacing.sm,
  },
  rightIcon: {
    marginLeft: spacing.sm,
  },
});
