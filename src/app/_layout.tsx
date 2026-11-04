import "@/global.css";

import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Uniwind } from "uniwind";

import { StatusBanner } from "@/components/status-banner";
import { WaterBackground } from "@/components/water-background";
import { AuthProvider } from "@/features/auth/auth-provider";
import { DraftGate } from "@/features/lecturas/draft-gate";
import { OutboxProvider } from "@/features/lecturas/outbox-provider";
import { persistOptions, queryClient } from "@/services/queryClient";

// La app está pensada en modo claro (app.json: userInterfaceStyle "light").
// Fijar el tema evita que Uniwind cambie los colores con el sistema.
Uniwind.setTheme("light");

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useEffect(() => {
    void SplashScreen.hideAsync();
  }, []);

  return (
    <SafeAreaProvider>
      <PersistQueryClientProvider
        client={queryClient}
        persistOptions={persistOptions}
      >
        <AuthProvider>
          <OutboxProvider>
            <StatusBar style="light" />
            <View className="flex-1 overflow-hidden bg-brand-background">
              <WaterBackground />

              <StatusBanner />
              <Stack
                screenOptions={{
                  headerShown: false,
                  contentStyle: { backgroundColor: "transparent" },
                }}
              >
                <Stack.Screen name="index" />
                <Stack.Screen name="registro" />
                <Stack.Screen name="recuperar" />
                <Stack.Screen name="verificar-correo" />
                <Stack.Screen name="editar-nombre" />
                <Stack.Screen name="cambiar-clave" />
                <Stack.Screen name="(tabs)" />
                <Stack.Screen name="medidor/[codigo]" />
                <Stack.Screen name="lectura/[codigo]" />
                <Stack.Screen name="nuevo-medidor" />
              </Stack>
            </View>
            <DraftGate />
          </OutboxProvider>
        </AuthProvider>
      </PersistQueryClientProvider>
    </SafeAreaProvider>
  );
}

