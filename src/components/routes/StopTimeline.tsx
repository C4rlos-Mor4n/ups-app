import React from 'react';
import { View, StyleSheet } from 'react-native';
import { AppText } from '../ui';
import { colors, spacing, radii } from '../../theme';

export type StopDto = {
  id: string;
  stopOrder: number;
  estimatedArrivalMinutes: number | null;
  stop: {
    id: string;
    name: string;
  };
};

interface StopTimelineProps {
  stops: StopDto[];
}

export function StopTimeline({ stops }: StopTimelineProps) {
  if (!stops || stops.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <AppText variant="bodyM" color="secondary" align="center">
          No hay paradas registradas para esta ruta.
        </AppText>
      </View>
    );
  }

  // Sort stops by stopOrder
  const sortedStops = [...stops].sort((a, b) => a.stopOrder - b.stopOrder);

  return (
    <View style={styles.container}>
      {sortedStops.map((s, index) => {
        const isFirst = index === 0;
        const isLast = index === sortedStops.length - 1;
        
        let etaText = s.estimatedArrivalMinutes ? `Aprox. ${s.estimatedArrivalMinutes} min` : null;
        if (isFirst) etaText = 'Salida';
        else if (isLast && s.estimatedArrivalMinutes) etaText = `Llegada aprox. ${s.estimatedArrivalMinutes} min`;

        return (
          <View key={s.id} style={styles.itemContainer}>
            <View style={styles.timelineColumn}>
              {!isFirst && <View style={styles.lineTop} />}
              <View style={[
                styles.dot, 
                isFirst && styles.dotStart, 
                isLast && styles.dotEnd,
                (!isFirst && !isLast) && styles.dotMiddle
              ]} />
              {!isLast && <View style={styles.lineBottom} />}
            </View>
            
            <View style={styles.contentColumn}>
              <AppText 
                variant="bodyM" 
                weight={isFirst || isLast ? 'bold' : 'medium'}
                color="primary"
                style={styles.stopName}
              >
                {s.stop.name}
              </AppText>
              {etaText && (
                <AppText variant="caption" color="secondary">
                  {etaText}
                </AppText>
              )}
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing.sm,
  },
  emptyContainer: {
    padding: spacing.xl,
    alignItems: 'center',
  },
  itemContainer: {
    flexDirection: 'row',
    minHeight: 56,
  },
  timelineColumn: {
    width: 24,
    alignItems: 'center',
    marginRight: spacing.md,
  },
  lineTop: {
    flex: 1,
    width: 2,
    backgroundColor: colors.border,
  },
  lineBottom: {
    flex: 1,
    width: 2,
    backgroundColor: colors.border,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginVertical: 4,
    zIndex: 1,
  },
  dotStart: {
    backgroundColor: colors.success,
  },
  dotMiddle: {
    backgroundColor: colors.border,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  dotEnd: {
    backgroundColor: colors.brandSecondary,
    borderWidth: 2,
    borderColor: colors.surface,
  },
  contentColumn: {
    flex: 1,
    paddingBottom: spacing.lg,
    justifyContent: 'center',
  },
  stopName: {
    marginBottom: 2,
  },
});
