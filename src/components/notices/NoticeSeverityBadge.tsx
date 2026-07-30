import React from 'react';
import { View, StyleSheet } from 'react-native';
import { AlertCircle, AlertTriangle, Info } from 'lucide-react-native';
import { AppText } from '../ui/AppText';
import { colors, spacing, radii } from '../../theme';

interface NoticeSeverityBadgeProps {
  severity: 'INFO' | 'WARNING' | 'CRITICAL';
}

export function NoticeSeverityBadge({ severity }: NoticeSeverityBadgeProps) {
  let bgColor = colors.infoBackground;
  let textColor = colors.info;
  let icon = <Info color={colors.info} size={14} />;
  let label = 'Información';

  if (severity === 'WARNING') {
    bgColor = colors.warningBackground;
    textColor = colors.warning;
    icon = <AlertTriangle color={colors.warning} size={14} />;
    label = 'Importante';
  } else if (severity === 'CRITICAL') {
    bgColor = colors.errorBackground;
    textColor = colors.error;
    icon = <AlertCircle color={colors.error} size={14} />;
    label = 'Urgente';
  }

  return (
    <View style={[styles.badge, { backgroundColor: bgColor }]}>
      {icon}
      <AppText 
        variant="caption" 
        weight="bold" 
        style={[styles.text, { color: textColor }]}
      >
        {label}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radii.full,
    alignSelf: 'flex-start',
    gap: 4,
  },
  text: {
    textTransform: 'uppercase',
  }
});
