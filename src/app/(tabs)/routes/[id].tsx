import React from 'react';
import { View, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Clock, Map as MapIcon } from 'lucide-react-native';
import { apiClient } from '../../../api/client';
import { colors, spacing, radii, shadows } from '../../../theme';
import { LeafletMap, MapStop } from '../../../components/Map/LeafletMap';
import { AppScreen, AppText, AppButton, AppCard } from '../../../components/ui';
import { RouteDirectionBadge } from '../../../components/routes/RouteDirectionBadge';
import { StopTimeline } from '../../../components/routes/StopTimeline';

type MobileRouteDetailResponseDto = {
  route: {
    id: string;
    name: string;
    description: string | null;
    direction: string;
  };
  stops: any[];
  schedules: {
    id: string;
    dayOfWeek: string;
    departureTime: string;
    approximateArrivalTime: string | null;
  }[];
};

const translateDay = (dayEn: string) => {
  const map: Record<string, string> = {
    MONDAY: 'Lunes',
    TUESDAY: 'Martes',
    WEDNESDAY: 'Miércoles',
    THURSDAY: 'Jueves',
    FRIDAY: 'Viernes',
    SATURDAY: 'Sábado',
    SUNDAY: 'Domingo',
  };
  return map[dayEn.toUpperCase()] || dayEn;
};

export default function RouteDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['routeDetail', id],
    queryFn: () => apiClient.get<MobileRouteDetailResponseDto>(`/mobile/routes/${id}`),
  });

  const renderHeader = () => (
    <View style={styles.header}>
      <AppButton
        label=""
        variant="ghost"
        size="sm"
        leftIcon={<ArrowLeft color={colors.actionPrimary} size={24} />}
        onPress={() => router.back()}
        style={styles.backButton}
      />
      <AppText variant="headingM" weight="bold" color="primary">
        Detalle de ruta
      </AppText>
      <View style={{ width: 44 }} />
    </View>
  );

  if (isLoading) {
    return (
      <AppScreen safeAreaEdges={['top']}>
        {renderHeader()}
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.actionPrimary} />
        </View>
      </AppScreen>
    );
  }

  if (error || !data) {
    return (
      <AppScreen safeAreaEdges={['top']}>
        {renderHeader()}
        <View style={styles.centerContainer}>
          <AppText variant="bodyM" color="error" style={styles.errorText}>
            No pudimos cargar el detalle de la ruta.
          </AppText>
          <AppButton label="Reintentar" onPress={() => refetch()} />
        </View>
      </AppScreen>
    );
  }

  const { route, stops, schedules } = data;

  const mapStops: MapStop[] = stops.map((s) => ({
    id: s.stop.id,
    name: s.stop.name, // The component should sanitize this inside LeafletMap HTML creation
    latitude: s.stop.latitude,
    longitude: s.stop.longitude,
  }));

  return (
    <AppScreen safeAreaEdges={['top', 'left', 'right']} backgroundColor={colors.backgroundMain}>
      {renderHeader()}
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Resumen */}
        <AppCard style={styles.summaryCard}>
          <View style={styles.titleRow}>
            <AppText variant="headingM" weight="bold" color="primary" style={styles.routeName}>
              {route.name}
            </AppText>
            <RouteDirectionBadge direction={route.direction} />
          </View>
          {route.description ? (
            <AppText variant="bodyM" color="secondary">
              {route.description}
            </AppText>
          ) : null}
        </AppCard>

        {/* Mapa */}
        <View style={styles.mapWrapper}>
          <LeafletMap stops={mapStops} />
        </View>

        {/* Horarios */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Clock color={colors.actionPrimary} size={20} />
            <AppText variant="headingM" weight="bold" color="primary">
              Horarios
            </AppText>
          </View>

          {schedules.length === 0 ? (
            <AppText variant="bodyM" color="secondary" style={styles.emptyText}>
              No hay horarios disponibles.
            </AppText>
          ) : (
            <View style={styles.schedulesContainer}>
              {schedules.map((schedule) => (
                <View key={schedule.id} style={styles.scheduleItem}>
                  <AppText variant="bodyM" weight="bold" color="primary">
                    {translateDay(schedule.dayOfWeek)}
                  </AppText>
                  <View style={styles.timeBlock}>
                    <AppText variant="bodyM" weight="medium" color="actionPrimary">
                      {schedule.departureTime.substring(0, 5)}
                    </AppText>
                    {schedule.approximateArrivalTime && (
                      <AppText variant="bodyS" color="secondary">
                        Llegada: {schedule.approximateArrivalTime.substring(0, 5)}
                      </AppText>
                    )}
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Paradas */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MapIcon color={colors.actionPrimary} size={20} />
            <AppText variant="headingM" weight="bold" color="primary">
              Paradas ({stops.length})
            </AppText>
          </View>
          <AppCard variant="flat">
            <StopTimeline stops={stops} />
          </AppCard>
        </View>

      </ScrollView>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.md,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
    ...shadows.soft,
  },
  backButton: {
    paddingHorizontal: spacing.sm,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xxl,
  },
  errorText: {
    marginBottom: spacing.lg,
  },
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: spacing.massive,
  },
  summaryCard: {
    marginBottom: spacing.lg,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  routeName: {
    flex: 1,
    marginRight: spacing.md,
  },
  mapWrapper: {
    height: 240,
    borderRadius: radii.md,
    overflow: 'hidden',
    marginBottom: spacing.xxl,
    backgroundColor: colors.surface,
    ...shadows.soft,
  },
  section: {
    marginBottom: spacing.xxxl,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  emptyText: {
    fontStyle: 'italic',
  },
  schedulesContainer: {
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    padding: spacing.md,
    ...shadows.soft,
  },
  scheduleItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  timeBlock: {
    alignItems: 'flex-end',
  },
});
