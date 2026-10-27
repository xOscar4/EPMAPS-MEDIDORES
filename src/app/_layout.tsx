import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
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
            <View style={styles.root}>
              {/* Fondo de agua: degradado y gotas difusas detrás de toda la app. */}
              <LinearGradient
                colors={[Brand.gradientTop, Brand.gradientMid, Brand.gradientBottom]}
                start={{ x: 0.1, y: 0 }}
                end={{ x: 0.9, y: 1 }}
                style={StyleSheet.absoluteFill}
              />
              <View pointerEvents="none" style={[styles.drop, styles.dropTop]} />
              <View pointerEvents="none" style={[styles.drop, styles.dropBottom]} />
              <View pointerEvents="none" style={[styles.drop, styles.dropMiddle]} />
              <View pointerEvents="none" style={[styles.current, styles.currentA]} />
              <View pointerEvents="none" style={[styles.current, styles.currentB]} />

              <StatusBanner />
              <Stack
                screenOptions={{
                  headerShown: false,
                  contentStyle: { backgroundColor: 'transparent' },
                }}>
                <Stack.Screen name="index" />
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

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Brand.gradientMid, overflow: 'hidden' },
  drop: { position: 'absolute', borderRadius: 999 },
  current: { position: 'absolute', width: 560, height: 96, borderRadius: 999 },
  currentA: {
    top: 130,
    left: -200,
    backgroundColor: 'rgba(18,166,180,0.05)',
    transform: [{ rotate: '-16deg' }],
  },
  currentB: {
    bottom: 180,
    right: -240,
    backgroundColor: 'rgba(127,210,232,0.10)',
    transform: [{ rotate: '12deg' }],
  },
  dropTop: {
    width: 280,
    height: 280,
    right: -110,
    top: -60,
    backgroundColor: 'rgba(27,184,198,0.10)',
  },
  dropMiddle: {
    width: 190,
    height: 190,
    left: -90,
    top: '38%',
    backgroundColor: 'rgba(127,210,232,0.16)',
  },
  dropBottom: {
    width: 320,
    height: 320,
    left: -140,
    bottom: -150,
    backgroundColor: 'rgba(18,166,180,0.08)',
  },
});
