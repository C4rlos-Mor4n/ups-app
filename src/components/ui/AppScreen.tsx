import React from 'react';
import { View, StyleSheet, ViewProps, StyleProp, ViewStyle } from 'react-native';
import { SafeAreaView, Edge } from 'react-native-safe-area-context';
import { colors } from '../../theme';

interface AppScreenProps extends ViewProps {
  safeAreaEdges?: Edge[];
  backgroundColor?: string;
  contentContainerStyle?: StyleProp<ViewStyle>;
}

export function AppScreen({
  children,
  safeAreaEdges = ['top', 'left', 'right'],
  backgroundColor = colors.backgroundMain,
  style,
  contentContainerStyle,
  ...props
}: AppScreenProps) {
  return (
    <SafeAreaView 
      style={[styles.container, { backgroundColor }, style]} 
      edges={safeAreaEdges}
      {...props}
    >
      <View style={[styles.content, contentContainerStyle]}>
        {children}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
});
