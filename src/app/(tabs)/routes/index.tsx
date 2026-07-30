import React, { useState, useMemo } from 'react';
import { View, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { Search } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { apiClient } from '../../../api/client';
import { colors, spacing } from '../../../theme';
import { AppScreen, AppText, AppTextField, AppButton, AppCard } from '../../../components/ui';
import { RouteCard, RouteDto } from '../../../components/routes/RouteCard';

type RoutePaginatedResponseDto = {
  data: RouteDto[];
  meta: any;
};

export default function RoutesListScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  
  const { data, isLoading, error, refetch, isRefetching } = useQuery({
    queryKey: ['mobileRoutes'],
    queryFn: () => apiClient.get<RoutePaginatedResponseDto>('/mobile/routes?limit=50&status=ACTIVE'),
  });

  const routes = data?.data || [];

  // Local filtering based on query
  const filteredRoutes = useMemo(() => {
    if (!searchQuery) return routes;
    const lowerQuery = searchQuery.toLowerCase();
    return routes.filter(
      (r) =>
        r.name.toLowerCase().includes(lowerQuery) ||
        (r.description && r.description.toLowerCase().includes(lowerQuery)) ||
        r.direction.toLowerCase().includes(lowerQuery)
    );
  }, [routes, searchQuery]);

  const renderHeader = () => (
    <View style={styles.header}>
      <AppText variant="headingL" weight="bold" color="primary">
        Rutas
      </AppText>
      <AppText variant="bodyM" color="secondary" style={styles.subtitle}>
        Consulta horarios y paradas disponibles
      </AppText>
      <AppTextField
        placeholder="Buscar por nombre, descripción o ruta"
        value={searchQuery}
        onChangeText={setSearchQuery}
        leftIcon={<Search color={colors.textSecondary} size={20} />}
        style={styles.searchInput}
      />
    </View>
  );

  const renderEmpty = () => {
    if (isLoading) {
      return (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.actionPrimary} />
        </View>
      );
    }
    
    if (error) {
      return (
        <View style={styles.centerContainer}>
          <AppText variant="bodyM" color="error" align="center" style={styles.errorText}>
            No pudimos cargar las rutas.
          </AppText>
          <AppButton label="Reintentar" onPress={() => refetch()} />
        </View>
      );
    }

    return (
      <View style={styles.centerContainer}>
        <AppText variant="bodyM" color="secondary" align="center">
          {searchQuery ? 'No encontramos rutas para tu búsqueda.' : 'No hay rutas disponibles en este momento.'}
        </AppText>
      </View>
    );
  };

  return (
    <AppScreen safeAreaEdges={['top', 'left', 'right']}>
      <FlatList
        data={filteredRoutes}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        onRefresh={refetch}
        refreshing={isRefetching}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        renderItem={({ item }) => (
          <RouteCard 
            route={item} 
            onPress={() => router.push(`/(tabs)/routes/${item.id}`)} 
          />
        )}
      />
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  listContent: {
    padding: spacing.lg,
    paddingBottom: spacing.xxxl,
    flexGrow: 1,
  },
  header: {
    marginBottom: spacing.lg,
  },
  subtitle: {
    marginBottom: spacing.lg,
    marginTop: spacing.xs,
  },
  searchInput: {
    minHeight: 44,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.xxxl,
  },
  errorText: {
    marginBottom: spacing.md,
  }
});
