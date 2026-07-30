import React from 'react';
import { View, StyleSheet } from 'react-native';
import { AppText } from '../ui/AppText';
import { colors, radii, spacing } from '../../theme';

interface RouteDirectionBadgeProps {
  direction: string; // 'Ida', 'Retorno', etc.
}

export function RouteDirectionBadge({ direction }: RouteDirectionBadgeProps) {
  // Normalize string for safety
  const dir = direction.toUpperCase();
  const isIda = dir.includes('IDA');
  
  return (
    <View style={[
      styles.badge, 
      isIda ? styles.idaBadge : styles.retornoBadge
    ]}>
      <AppText 
        variant="caption" 
        weight="bold" 
        color={isIda ? 'brandPrimary' : 'brandSecondary'}
      >
        {direction}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radii.xs,
    borderWidth: 1,
  },
  idaBadge: {
    backgroundColor: 'rgba(0, 32, 91, 0.05)',
    borderColor: 'rgba(0, 32, 91, 0.2)',
  },
  retornoBadge: {
    backgroundColor: 'rgba(242, 169, 0, 0.1)',
    borderColor: 'rgba(242, 169, 0, 0.4)',
  }
});
