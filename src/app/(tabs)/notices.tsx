import React from 'react';
import { View, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../api/client';
import { colors, spacing } from '../../theme';
import { AppScreen, AppText, AppButton } from '../../components/ui';
import { NoticeCard, NoticeDto } from '../../components/notices/NoticeCard';

type MobileNoticePaginatedResponseDto = {
  data: NoticeDto[];
  meta: any;
};

export default function NoticesScreen() {
  const { data, isLoading, error, refetch, isRefetching } = useQuery({
    queryKey: ['mobileNotices'],
    queryFn: () => apiClient.get<MobileNoticePaginatedResponseDto>('/mobile/notices?limit=50'),
  });

  const notices = data?.data || [];

  const renderHeader = () => (
    <View style={styles.header}>
      <AppText variant="headingL" weight="bold" color="primary">
        Avisos
      </AppText>
      <AppText variant="bodyM" color="secondary" style={styles.subtitle}>
        Mantente informado sobre cambios y novedades.
      </AppText>
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
            No pudimos cargar los avisos.
          </AppText>
          <AppButton label="Reintentar" onPress={() => refetch()} />
        </View>
      );
    }

    return (
      <View style={styles.centerContainer}>
        <AppText variant="bodyM" color="secondary" align="center">
          No hay avisos publicados en este momento. Cuando exista una novedad importante, aparecerá aquí.
        </AppText>
      </View>
    );
  };

  return (
    <AppScreen safeAreaEdges={['top', 'left', 'right']}>
      <FlatList
        data={notices}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        onRefresh={refetch}
        refreshing={isRefetching}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        renderItem={({ item }) => <NoticeCard notice={item} />}
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
    marginBottom: spacing.xl,
  },
  subtitle: {
    marginTop: spacing.xs,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.xxxl,
    paddingHorizontal: spacing.lg,
  },
  errorText: {
    marginBottom: spacing.md,
  }
});
