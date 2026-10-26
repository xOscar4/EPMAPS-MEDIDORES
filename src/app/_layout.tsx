import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { StatusBanner } from '@/components/status-banner';
import { Brand } from '@/constants/brand';
import { AuthProvider } from '@/features/auth/auth-provider';
import { DraftGate } from '@/features/lecturas/draft-gate';
import { OutboxProvider } from '@/features/lecturas/outbox-provider';
import { persistOptions, queryClient } from '@/services/queryClient';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useEffect(() => {
    void SplashScreen.hideAsync();
  }, []);

  return (
    <SafeAreaProvider>
      <PersistQueryClientProvider client={queryClient} persistOptions={persistOptions}>
        <AuthProvider>
          <OutboxProvider>
            <StatusBar style="light" />
            <View style={{ flex: 1, backgroundColor: Brand.background }}>
              <StatusBanner />
              <Stack
                screenOptions={{
                  headerShown: false,
                  contentStyle: { backgroundColor: Brand.background },
                }}>
                <Stack.Screen name="index" />
                <Stack.Screen name="(tabs)" />
                <Stack.Screen name="medidor/[codigo]" />
                <Stack.Screen name="lectura/[codigo]" />
              </Stack>
            </View>
            <DraftGate />
          </OutboxProvider>
        </AuthProvider>
      </PersistQueryClientProvider>
    </SafeAreaProvider>
  );
}
