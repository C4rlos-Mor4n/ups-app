import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { AppText } from '../ui/AppText';
import { spacing } from '../../theme';

interface AuthBrandHeaderProps {
  title: string;
  subtitle?: string;
}

export function AuthBrandHeader({ title, subtitle }: AuthBrandHeaderProps) {
  return (
    <View style={styles.container}>
      <Image 
        source={require('../../../assets/images/icon.png')} 
        style={styles.logo} 
        contentFit="contain" 
      />
      <AppText variant="headingL" weight="bold" color="primary" align="center" style={styles.title}>
        {title}
      </AppText>
      {subtitle && (
        <AppText variant="bodyM" color="secondary" align="center">
          {subtitle}
        </AppText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginBottom: spacing.xxxl,
  },
  logo: {
    width: 88,
    height: 88,
    borderRadius: 20,
    marginBottom: spacing.xl,
  },
  title: {
    marginBottom: spacing.sm,
  }
});
