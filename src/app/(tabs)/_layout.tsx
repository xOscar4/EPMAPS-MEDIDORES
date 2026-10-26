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
        tabBarActiveTintColor: Brand.primaryDark,
        tabBarInactiveTintColor: Brand.textMuted,
        tabBarLabelStyle: { fontSize: 10, fontWeight: '800', letterSpacing: 0.3 },
        tabBarStyle: {
          height: 64 + insets.bottom,
          paddingTop: 9,
          paddingBottom: insets.bottom + 7,
          backgroundColor: 'rgba(255,255,255,0.94)',
          borderTopColor: 'rgba(255,255,255,0.9)',
          borderTopWidth: 1,
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
