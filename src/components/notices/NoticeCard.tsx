import React, { memo } from 'react';
import { View, StyleSheet } from 'react-native';
import { AppCard, AppText } from '../ui';
import { NoticeSeverityBadge } from './NoticeSeverityBadge';
import { spacing, colors } from '../../theme';

export type NoticeDto = {
  id: string;
  title: string;
  message: string;
  severity: 'INFO' | 'WARNING' | 'CRITICAL';
  publishedFrom: string;
};

interface NoticeCardProps {
  notice: NoticeDto;
}

function NoticeCardComponent({ notice }: NoticeCardProps) {
  
  // Format date nicely
  const dateObj = new Date(notice.publishedFrom);
  const dateStr = dateObj.toLocaleDateString('es-ES', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });

  return (
    <AppCard style={styles.card} variant="elevated">
      <View style={styles.header}>
        <NoticeSeverityBadge severity={notice.severity} />
        <AppText variant="caption" color="secondary">
          {dateStr}
        </AppText>
      </View>
      <AppText variant="headingM" weight="bold" color="primary" style={styles.title}>
        {notice.title}
      </AppText>
      <AppText variant="bodyM" color="primary" style={styles.message}>
        {notice.message}
      </AppText>
    </AppCard>
  );
}

export const NoticeCard = memo(NoticeCardComponent);

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  title: {
    marginBottom: spacing.xs,
  },
  message: {
    lineHeight: 24,
  }
});
