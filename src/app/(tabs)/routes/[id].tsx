import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../../api/client';
import { colors } from '../../../theme/colors';
import { LeafletMap, MapStop } from '../../../components/Map/LeafletMap';
import { Clock, Navigation } from 'lucide-react-native';

type MobileRouteDetailResponseDto = {
  route: {
    id: string;
    name: string;
    description: string | null;
    direction: string;
  };
  stops: {
    id: string;
    stopOrder: number;
    estimatedArrivalMinutes: number | null;
    stop: {
      id: string;
      name: string;
      latitude: number;
      longitude: number;
    };
  }[];
  schedules: {
    id: string;
    dayOfWeek: string;
    departureTime: string;
    approximateArrivalTime: string | null;
  }[];
};

export default function RouteDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const { data, isLoading, error } = useQuery({
    queryKey: ['routeDetail', id],
    queryFn: () => apiClient.get<MobileRouteDetailResponseDto>(`/mobile/routes/${id}`),
  });

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (error || !data) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Error al cargar el detalle de la ruta</Text>
      </View>
    );
  }

  const { route, stops, schedules } = data;

  const mapStops: MapStop[] = stops.map((s) => ({
    id: s.stop.id,
    name: s.stop.name,
    latitude: s.stop.latitude,
    longitude: s.stop.longitude,
  }));

  return (
    <ScrollView style={styles.container} contentInsetAdjustmentBehavior="automatic">
      <View style={styles.header}>
        <Text style={styles.title}>{route.name}</Text>
        <Text style={styles.subtitle}>Dirección: {route.direction}</Text>
        {route.description ? (
          <Text style={styles.description}>{route.description}</Text>
        ) : null}
      </View>

      <View style={styles.mapContainer}>
        <LeafletMap stops={mapStops} />
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Clock color={colors.primary} size={20} />
          <Text style={styles.sectionTitle}>Horarios Activos</Text>
        </View>
        
        {schedules.length === 0 ? (
          <Text style={styles.emptyText}>No hay horarios disponibles</Text>
        ) : (
          schedules.map((schedule) => (
            <View key={schedule.id} style={styles.scheduleCard}>
              <Text style={styles.dayText}>{schedule.dayOfWeek}</Text>
              <Text style={styles.timeText}>
                {schedule.departureTime} 
                {schedule.approximateArrivalTime ? ` - ${schedule.approximateArrivalTime}` : ''}
              </Text>
            </View>
          ))
        )}
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Navigation color={colors.primary} size={20} />
          <Text style={styles.sectionTitle}>Paradas ({stops.length})</Text>
        </View>

        {stops.map((s, index: number) => (
          <View key={s.id} style={styles.stopCard}>
            <View style={styles.stopIndex}>
              <Text style={styles.stopIndexText}>{index + 1}</Text>
            </View>
            <View style={styles.stopContent}>
              <Text style={styles.stopName}>{s.stop.name}</Text>
              {s.estimatedArrivalMinutes ? (
                <Text style={styles.stopETA}>ETA: {s.estimatedArrivalMinutes} min</Text>
              ) : null}
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  header: {
    padding: 16,
    backgroundColor: colors.surfaceLight,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: colors.secondary,
    fontWeight: '600',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: colors.text,
  },
  mapContainer: {
    height: 250,
    margin: 16,
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
  },
  scheduleCard: {
    backgroundColor: colors.surfaceLight,
    padding: 12,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    borderLeftWidth: 4,
    borderLeftColor: colors.secondary,
  },
  dayText: {
    fontWeight: 'bold',
    color: colors.text,
  },
  timeText: {
    color: colors.button,
    fontWeight: '600',
  },
  stopCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceLight,
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  stopIndex: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  stopIndexText: {
    color: colors.surfaceLight,
    fontWeight: 'bold',
  },
  stopContent: {
    flex: 1,
  },
  stopName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  stopETA: {
    fontSize: 12,
    color: colors.textLight,
    marginTop: 2,
  },
  errorText: {
    color: colors.error,
    fontSize: 16,
  },
  emptyText: {
    color: colors.textLight,
    fontStyle: 'italic',
  }
});
