/**
 * Inicialización única de Firebase para React Native.
 *
 * Se usa `initializeAuth` con `getReactNativePersistence(AsyncStorage)` para
 * que la sesión sobreviva al cierre de la app. Los valores de configuración
 * son públicos y se leen de `.env.local`; si el archivo no existe se usan los
 * del proyecto de Firebase de EPMAPS como respaldo.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getApp, getApps, initializeApp } from 'firebase/app';
import {
  getAuth,
  getReactNativePersistence,
  initializeAuth,
  type Auth,
} from 'firebase/auth';

const firebaseConfig = {
  apiKey:
    process.env.EXPO_PUBLIC_FIREBASE_API_KEY ??
    'AIzaSyBCRX56WGFPshKgUs6T9xc_ld9kkgTSEVs',
  authDomain:
    process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN ??
    'epmaps-login-3f01c.firebaseapp.com',
  projectId:
    process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID ?? 'epmaps-login-3f01c',
  storageBucket:
    process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET ??
    'epmaps-login-3f01c.firebasestorage.app',
  messagingSenderId:
    process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? '57125239203',
  appId:
    process.env.EXPO_PUBLIC_FIREBASE_APP_ID ??
    '1:57125239203:web:4c7db27d1673586baa0216',
  measurementId:
    process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID ?? 'G-SNEB7FKZMC',
};

/** Evita registrar dos veces la app al recargar con Fast Refresh. */
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

function crearAuth(): Auth {
  try {
    return initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage),
    });
  } catch {
    // initializeAuth lanza si el Auth de esta app ya fue creado (Fast Refresh).
    return getAuth(app);
  }
}

export const auth = crearAuth();

// Los correos de Firebase salen en español.
auth.languageCode = 'es';
