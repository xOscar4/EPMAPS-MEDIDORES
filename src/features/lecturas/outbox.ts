import AsyncStorage from '@react-native-async-storage/async-storage';

import type { LecturaLocal } from '@/types/models';

/** R9 y R10: cola de lecturas que aún no confirma el sistema de la oficina. */
const KEY = 'EPMAPS_OUTBOX';

export async function leerOutbox(): Promise<LecturaLocal[]> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    const datos = raw ? (JSON.parse(raw) as LecturaLocal[]) : [];
    return Array.isArray(datos) ? datos : [];
  } catch {
    return [];
  }
}

export async function guardarOutbox(lecturas: LecturaLocal[]): Promise<void> {
  await AsyncStorage.setItem(KEY, JSON.stringify(lecturas));
}

export async function agregarLectura(lectura: LecturaLocal): Promise<LecturaLocal[]> {
  const lecturas = await leerOutbox();
  const siguientes = [...lecturas, lectura];
  await guardarOutbox(siguientes);
  return siguientes;
}

export async function actualizarLectura(
  id: string,
  cambios: Partial<LecturaLocal>,
): Promise<LecturaLocal[]> {
  const lecturas = await leerOutbox();
  const siguientes = lecturas.map((item) => (item.id === id ? { ...item, ...cambios } : item));
  await guardarOutbox(siguientes);
  return siguientes;
}

export async function eliminarLectura(id: string): Promise<LecturaLocal[]> {
  const lecturas = await leerOutbox();
  const siguientes = lecturas.filter((item) => item.id !== id);
  await guardarOutbox(siguientes);
  return siguientes;
}

export async function borrarOutbox(): Promise<void> {
  await AsyncStorage.removeItem(KEY);
}
