import AsyncStorage from '@react-native-async-storage/async-storage';

import type { Tecnico } from '@/types/models';

/** R1: la sesión se guarda sin la clave y se borra al cerrar sesión. */
const KEY = 'EPMAPS_SESION';

export async function leerSesion(): Promise<Tecnico | null> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Tecnico) : null;
  } catch {
    return null;
  }
}

export async function guardarSesion(tecnico: Tecnico): Promise<void> {
  await AsyncStorage.setItem(KEY, JSON.stringify(tecnico));
}

export async function borrarSesion(): Promise<void> {
  await AsyncStorage.removeItem(KEY);
}
