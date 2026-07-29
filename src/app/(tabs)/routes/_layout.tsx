import { Stack } from 'expo-router';
import { colors } from '../../../theme/colors';

export default function RoutesLayout() {
  return (
    <Stack screenOptions={{
      headerStyle: { backgroundColor: colors.primary },
      headerTintColor: colors.surfaceLight,
      headerTitleStyle: { fontWeight: 'bold' },
    }}>
      <Stack.Screen 
        name="index" 
        options={{ title: 'Rutas Disponibles' }} 
      />
      <Stack.Screen 
        name="[id]" 
        options={{ title: 'Detalle de Ruta' }} 
      />
    </Stack>
  );
}
