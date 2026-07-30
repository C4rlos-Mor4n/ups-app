import React, { useRef, useState } from 'react';
import { View, TextInput, StyleSheet, Pressable } from 'react-native';
import { AppText } from '../ui/AppText';
import { colors, radii, spacing, typography } from '../../theme';

interface OtpInputProps {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  error?: boolean;
}

export function OtpInput({ length = 6, value, onChange, error }: OtpInputProps) {
  const inputRef = useRef<TextInput>(null);
  const [isFocused, setIsFocused] = useState(false);

  const handlePress = () => {
    inputRef.current?.focus();
  };

  const renderCells = () => {
    const cells = [];
    for (let i = 0; i < length; i++) {
      const char = value[i] || '';
      const isActive = isFocused && value.length === i;
      const isFilled = char !== '';
      
      cells.push(
        <View 
          key={i} 
          style={[
            styles.cell,
            isActive && styles.cellActive,
            isFilled && styles.cellFilled,
            error && styles.cellError,
          ]}
        >
          <AppText 
            variant="headingM" 
            weight="medium" 
            color={error ? 'error' : 'primary'}
            align="center"
          >
            {char}
          </AppText>
        </View>
      );
    }
    return cells;
  };

  return (
    <View style={styles.container}>
      <Pressable style={styles.cellsContainer} onPress={handlePress}>
        {renderCells()}
      </Pressable>
      <TextInput
        ref={inputRef}
        style={styles.hiddenInput}
        value={value}
        onChangeText={(text) => {
          const cleaned = text.replace(/[^0-9]/g, '');
          if (cleaned.length <= length) {
            onChange(cleaned);
          }
        }}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        maxLength={length}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        caretHidden
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: spacing.xl,
  },
  cellsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  cell: {
    width: 44,
    height: 56,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.sm,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cellActive: {
    borderColor: colors.actionPrimary,
    borderWidth: 2,
  },
  cellFilled: {
    borderColor: colors.textSecondary,
  },
  cellError: {
    borderColor: colors.error,
    backgroundColor: colors.errorBackground,
  },
  hiddenInput: {
    position: 'absolute',
    opacity: 0,
    width: 1,
    height: 1,
  }
});
