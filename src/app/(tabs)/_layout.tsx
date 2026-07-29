import { Tabs } from 'expo-router';
import { colors } from '../../theme/colors';
import { Map, Bell, User } from 'lucide-react-native';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{
      tabBarActiveTintColor: colors.button,
      tabBarInactiveTintColor: colors.textLight,
      headerStyle: { backgroundColor: colors.primary },
      headerTintColor: colors.surfaceLight,
      headerTitleStyle: { fontWeight: 'bold' },
      tabBarStyle: {
        backgroundColor: colors.surfaceLight,
        borderTopColor: colors.border,
      },
    }}>
      <Tabs.Screen
        name="routes"
        options={{
          title: 'Rutas',
          headerShown: false,
          tabBarIcon: ({ color }) => <Map size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="notices"
        options={{
          title: 'Avisos',
          tabBarIcon: ({ color }) => <Bell size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color }) => <User size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}
