import React, { memo } from 'react';
import { View, StyleSheet } from 'react-native';
import { ChevronRight, MapPin } from 'lucide-react-native';
import { AppCard, AppText } from '../ui';
import { RouteDirectionBadge } from './RouteDirectionBadge';
import { colors, spacing } from '../../theme';

export type RouteDto = {
  id: string;
  name: string;
  description: string | null;
  direction: string;
  status: string;
  isActive: boolean;
};

interface RouteCardProps {
  route: RouteDto;
  onPress: () => void;
}

function RouteCardComponent({ route, onPress }: RouteCardProps) {
  return (
    <AppCard onPress={onPress} style={styles.card}>
      <View style={styles.iconContainer}>
        <MapPin color={colors.brandPrimary} size={24} />
      </View>
      
      <View style={styles.contentContainer}>
        <View style={styles.headerRow}>
          <AppText variant="bodyM" weight="bold" color="primary" numberOfLines={1} style={styles.title}>
            {route.name}
          </AppText>
        </View>
        
        <View style={styles.directionRow}>
          <RouteDirectionBadge direction={route.direction} />
        </View>

        {route.description ? (
          <AppText variant="bodyS" color="secondary" numberOfLines={2}>
            {route.description}
          </AppText>
        ) : null}
      </View>

      <View style={styles.chevronContainer}>
        <ChevronRight color={colors.textSecondary} size={20} />
      </View>
    </AppCard>
  );
}

export const RouteCard = memo(RouteCardComponent);

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  iconContainer: {
    backgroundColor: colors.backgroundMain,
    padding: spacing.md,
    borderRadius: 12,
    marginRight: spacing.md,
  },
  contentContainer: {
    flex: 1,
    marginRight: spacing.sm,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  title: {
    flex: 1,
    marginRight: spacing.sm,
  },
  directionRow: {
    flexDirection: 'row',
    marginBottom: spacing.xs,
  },
  chevronContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  }
});
