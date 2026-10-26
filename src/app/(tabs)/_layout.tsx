import { Redirect, Tabs } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppIcon } from '@/components/ui/app-icon';
import { Brand } from '@/constants/brand';
import { Icons } from '@/constants/icons';
import { useAuth } from '@/features/auth/auth-provider';

export default function TabsLayout() {
  const { tecnico, cargando } = useAuth();
  const insets = useSafeAreaInsets();

  if (cargando) return null;
  if (!tecnico) return <Redirect href="/" />;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Brand.primary,
        tabBarInactiveTintColor: Brand.textMuted,
        tabBarLabelStyle: { fontSize: 11, fontWeight: '700' },
        tabBarStyle: {
          height: 62 + insets.bottom,
          paddingTop: 8,
          paddingBottom: insets.bottom + 6,
          backgroundColor: Brand.surface,
          borderTopColor: Brand.border,
        },
        tabBarHideOnKeyboard: true,
      }}>
      <Tabs.Screen
        name="rutas"
        options={{
          title: 'Mi ruta',
          tabBarIcon: ({ color, size }) => <AppIcon name={Icons.route} color={color as string} size={size} />,
        }}
      />
      <Tabs.Screen
        name="historial"
        options={{
          title: 'Historial',
          tabBarIcon: ({ color, size }) => <AppIcon name={Icons.history} color={color as string} size={size} />,
        }}
      />
      <Tabs.Screen
        name="ajustes"
        options={{
          title: 'Ajustes',
          tabBarIcon: ({ color, size }) => <AppIcon name={Icons.settings} color={color as string} size={size} />,
        }}
      />
    </Tabs>
  );
}
