import React, { useState } from 'react';
import { View, TextInput, TextInputProps, StyleSheet } from 'react-native';
import { colors, spacing, radii, typography } from '../../theme';
import { AppText } from './AppText';

interface AppTextFieldProps extends TextInputProps {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
}

export function AppTextField({
  label,
  error,
  leftIcon,
  style,
  onFocus,
  onBlur,
  ...props
}: AppTextFieldProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={styles.container}>
      {label && (
        <AppText variant="label" weight="medium" color="secondary" style={styles.label}>
          {label}
        </AppText>
      )}
      <View
        style={[
          styles.inputContainer,
          isFocused && styles.inputFocused,
          error ? styles.inputError : null,
          props.editable === false && styles.inputDisabled,
        ]}
      >
        {leftIcon && <View style={styles.icon}>{leftIcon}</View>}
        <TextInput
          style={[styles.input, style]}
          placeholderTextColor={colors.textSecondary}
          onFocus={(e) => {
            setIsFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            onBlur?.(e);
          }}
          {...props}
        />
      </View>
      {error && (
        <AppText variant="caption" color="error" style={styles.errorText}>
          {error}
        </AppText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.lg,
  },
  label: {
    marginBottom: spacing.xs,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.sm,
    minHeight: 48,
    paddingHorizontal: spacing.md,
  },
  inputFocused: {
    borderColor: colors.actionPrimary,
    backgroundColor: colors.surface,
  },
  inputError: {
    borderColor: colors.error,
  },
  inputDisabled: {
    backgroundColor: colors.backgroundSecondary,
  },
  icon: {
    marginRight: spacing.sm,
  },
  input: {
    flex: 1,
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.sizes.bodyM,
    color: colors.textPrimary,
    minHeight: 48,
  },
  errorText: {
    marginTop: spacing.xs,
  },
});
