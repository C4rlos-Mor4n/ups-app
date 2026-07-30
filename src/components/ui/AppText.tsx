import React from 'react';
import { Text, TextProps, StyleSheet } from 'react-native';
import { colors, typography } from '../../theme';

type AppTextVariant = keyof typeof typography.sizes;
type AppTextColor = 'primary' | 'secondary' | 'inverse' | 'error' | 'warning' | 'success' | 'info' | 'brandPrimary' | 'brandSecondary' | 'actionPrimary';

interface AppTextProps extends TextProps {
  variant?: AppTextVariant;
  color?: AppTextColor;
  weight?: 'regular' | 'medium' | 'bold';
  align?: 'auto' | 'left' | 'right' | 'center' | 'justify';
}

export function AppText({ 
  children, 
  variant = 'bodyM', 
  color = 'primary', 
  weight = 'regular',
  align = 'auto',
  style, 
  ...props 
}: AppTextProps) {
  
  const getTextColor = () => {
    switch (color) {
      case 'primary': return colors.textPrimary;
      case 'secondary': return colors.textSecondary;
      case 'inverse': return colors.textInverse;
      case 'error': return colors.error;
      case 'warning': return colors.warning;
      case 'success': return colors.success;
      case 'info': return colors.info;
      case 'brandPrimary': return colors.brandPrimary;
      case 'brandSecondary': return colors.brandSecondary;
      default: return colors.textPrimary;
    }
  };

  const textStyle = [
    {
      fontFamily: typography.fontFamily[weight],
      fontSize: typography.sizes[variant],
      lineHeight: typography.lineHeights[variant],
      color: getTextColor(),
      textAlign: align,
    },
    style,
  ];

  return (
    <Text style={textStyle} {...props}>
      {children}
    </Text>
  );
}
