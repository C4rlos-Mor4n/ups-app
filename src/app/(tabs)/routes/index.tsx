import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../../api/client';
import { colors } from '../../../theme/colors';
import { useRouter } from 'expo-router';
import { MapPin, ChevronRight } from 'lucide-react-native';

type RouteResponseDto = {
  id: string;
  name: string;
  description: string | null;
  direction: string;
  status: string;
  isActive: boolean;
};

type RoutePaginatedResponseDto = {
  data: RouteResponseDto[];
  meta: {
    itemCount: number;
    totalItems: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
  };
};

export default function RoutesListScreen() {
  const router = useRouter();
  
  const { data, isLoading, error, refetch, isRefetching } = useQuery({
    queryKey: ['mobileRoutes'],
    queryFn: () => apiClient.get<RoutePaginatedResponseDto>('/mobile/routes?limit=50&status=ACTIVE'),
  });

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Error al cargar las rutas</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => refetch()}>
          <Text style={styles.retryText}>Reintentar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const routes = data?.data || [];

  return (
    <View style={styles.container}>
      <FlatList
        data={routes}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        onRefresh={refetch}
        refreshing={isRefetching}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No hay rutas activas disponibles.</Text>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.card}
            onPress={() => router.push(`/(tabs)/routes/${item.id}`)}
          >
            <View style={styles.cardIcon}>
              <MapPin color={colors.primary} size={24} />
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>{item.name}</Text>
              <Text style={styles.cardSubtitle}>Dirección: {item.direction}</Text>
              {item.description ? (
                <Text style={styles.cardDescription} numberOfLines={2}>
                  {item.description}
                </Text>
              ) : null}
            </View>
            <ChevronRight color={colors.border} size={24} />
          </TouchableOpacity>
        )}
      />
    </View>
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
  list: {
    padding: 16,
    gap: 12,
  },
  card: {
    backgroundColor: colors.surfaceLight,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
  },
  cardIcon: {
    backgroundColor: colors.background,
    padding: 12,
    borderRadius: 12,
    marginRight: 16,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    color: colors.secondary,
    fontWeight: '600',
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 14,
    color: colors.textLight,
  },
  errorText: {
    color: colors.error,
    fontSize: 16,
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: colors.button,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryText: {
    color: colors.surfaceLight,
    fontWeight: 'bold',
  },
  emptyContainer: {
    padding: 32,
    alignItems: 'center',
  },
  emptyText: {
    color: colors.textLight,
    fontSize: 16,
    textAlign: 'center',
  },
});
