import React from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../api/client';
import { colors } from '../../theme/colors';
import { AlertTriangle, Info, AlertCircle } from 'lucide-react-native';

type MobileNoticeResponseDto = {
  id: string;
  title: string;
  message: string;
  severity: 'INFO' | 'WARNING' | 'CRITICAL';
  publishedFrom: string;
  publishedUntil: string | null;
};

type MobileNoticePaginatedResponseDto = {
  data: MobileNoticeResponseDto[];
  meta: {
    itemCount: number;
    totalItems: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
  };
};

const SeverityIcon = ({ severity, size = 24 }: { severity: string, size?: number }) => {
  switch (severity) {
    case 'CRITICAL':
      return <AlertCircle color={colors.error} size={size} />;
    case 'WARNING':
      return <AlertTriangle color={colors.warning} size={size} />;
    default:
      return <Info color={colors.button} size={size} />;
  }
};

export default function NoticesScreen() {
  const { data, isLoading, error, refetch, isRefetching } = useQuery({
    queryKey: ['mobileNotices'],
    queryFn: () => apiClient.get<MobileNoticePaginatedResponseDto>('/mobile/notices?limit=50'),
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
        <Text style={styles.errorText}>Error al cargar los avisos</Text>
      </View>
    );
  }

  const notices = data?.data || [];

  return (
    <View style={styles.container}>
      <FlatList
        data={notices}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        onRefresh={refetch}
        refreshing={isRefetching}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No hay avisos publicados en este momento.</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={[styles.card, { borderLeftColor: item.severity === 'CRITICAL' ? colors.error : item.severity === 'WARNING' ? colors.warning : colors.button }]}>
            <View style={styles.cardHeader}>
              <SeverityIcon severity={item.severity} />
              <Text style={styles.cardTitle}>{item.title}</Text>
            </View>
            <Text style={styles.cardMessage}>{item.message}</Text>
            <Text style={styles.cardDate}>
              Publicado: {new Date(item.publishedFrom).toLocaleDateString()}
            </Text>
          </View>
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
  },
  list: {
    padding: 16,
    gap: 16,
  },
  card: {
    backgroundColor: colors.surfaceLight,
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 6,
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
    flex: 1,
  },
  cardMessage: {
    fontSize: 15,
    color: colors.text,
    lineHeight: 22,
    marginBottom: 12,
  },
  cardDate: {
    fontSize: 12,
    color: colors.textLight,
    textAlign: 'right',
  },
  errorText: {
    color: colors.error,
    fontSize: 16,
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
