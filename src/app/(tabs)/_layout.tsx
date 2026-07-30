import { Tabs } from 'expo-router';
import { Platform, View, StyleSheet } from 'react-native';
import { Map, Bell, User } from 'lucide-react-native';
import { colors, shadows, spacing, typography } from '../../theme';

export default function TabLayout() {
  return (
    <Tabs 
      screenOptions={{
        tabBarActiveTintColor: colors.actionPrimary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarLabelStyle: {
          fontFamily: typography.fontFamily.medium,
          fontSize: typography.sizes.caption,
          marginTop: -spacing.xs,
          marginBottom: spacing.xs,
        },
        headerStyle: { 
          backgroundColor: colors.brandPrimary,
        },
        headerTintColor: colors.surface,
        headerTitleStyle: { 
          fontFamily: typography.fontFamily.bold,
          fontSize: typography.sizes.headingM,
        },
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopWidth: 0,
          elevation: 8,
          shadowColor: colors.textPrimary,
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.05,
          shadowRadius: 8,
          height: Platform.OS === 'ios' ? 88 : 64,
          paddingBottom: Platform.OS === 'ios' ? 28 : spacing.sm,
          paddingTop: spacing.sm,
        },
      }}
    >
      <Tabs.Screen
        name="routes"
        options={{
          title: 'Rutas',
          headerShown: false,
          tabBarIcon: ({ color, size }) => <Map size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="notices"
        options={{
          title: 'Avisos',
          tabBarIcon: ({ color, size }) => <Bell size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color, size }) => <User size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}
