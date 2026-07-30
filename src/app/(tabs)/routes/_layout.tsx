import { Stack } from 'expo-router';
import { colors, typography } from '../../../theme';

export default function RoutesLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.brandPrimary },
        headerTintColor: colors.surface,
        headerTitleStyle: { 
          fontFamily: typography.fontFamily.bold,
          fontSize: typography.sizes.headingM
        },
      }}
    >
      <Stack.Screen 
        name="index" 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="[id]" 
        options={{ headerShown: false }} 
      />
    </Stack>
  );
}
