import { Redirect, Tabs } from "expo-router";
import { StyleSheet, View, type ColorValue } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AppIcon } from "@/components/ui/app-icon";
import { Brand, Shadows } from "@/constants/brand";
import type { IconName } from "@/constants/icons";
import { Icons } from "@/constants/icons";
import { useAuth } from "@/features/auth/auth-provider";

function icono(nombre: IconName) {
  return function TabIcon({
    color,
    focused,
  }: {
    color: ColorValue;
    focused: boolean;
  }) {
    return (
      <View style={[styles.iconWrap, focused && styles.iconWrapActive]}>
        <AppIcon name={nombre} color={color as string} size={20} />
      </View>
    );
  };
}

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
        tabBarInactiveTintColor: "#6E8A99",
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: "800",
          letterSpacing: 0.2,
        },
        tabBarStyle: {
          position: "absolute",
          left: 14,
          right: 14,
          bottom: Math.max(insets.bottom, 10),
          height: 66,
          paddingTop: 7,
          paddingBottom: 7,
          borderRadius: 22,
          borderWidth: 1,
          borderColor: "rgba(10,90,140,0.12)",
          backgroundColor: "#FFFFFF",
          ...Shadows.floating,
        },
        tabBarHideOnKeyboard: true,
      }}
    >
      <Tabs.Screen
        name="rutas"
        options={{ title: "Mi ruta", tabBarIcon: icono(Icons.route) }}
      />
      <Tabs.Screen
        name="historial"
        options={{ title: "Historial", tabBarIcon: icono(Icons.history) }}
      />
      <Tabs.Screen
        name="ajustes"
        options={{ title: "Ajustes", tabBarIcon: icono(Icons.settings) }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconWrap: {
    width: 46,
    height: 30,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  iconWrapActive: {
    backgroundColor: "#EAF5FF",
    borderWidth: 1,
    borderColor: "rgba(13,94,140,0.08)",
  },
});
