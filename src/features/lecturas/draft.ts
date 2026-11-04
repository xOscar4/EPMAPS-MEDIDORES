import AsyncStorage from '@react-native-async-storage/async-storage';

import type { BorradorLectura } from '@/types/models';
import { borrarFoto } from './foto';

/** R8: un solo borrador a la vez, con la foto incluida. */
const KEY = 'EPMAPS_BORRADOR_LECTURA';

export async function leerBorrador(): Promise<BorradorLectura | null> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as BorradorLectura) : null;
  } catch {
    return null;
  }
}

export async function guardarBorrador(borrador: BorradorLectura): Promise<void> {
  await AsyncStorage.setItem(KEY, JSON.stringify(borrador));
}

export async function borrarBorrador(): Promise<void> {
  const borrador = await leerBorrador();
  if (borrador?.fotoUri) await borrarFoto(borrador.fotoUri);
  await AsyncStorage.removeItem(KEY);
}

/** Se usa al guardar: la foto ahora pertenece a la lectura, no al borrador. */
export async function limpiarBorrador(): Promise<void> {
  await AsyncStorage.removeItem(KEY);
}
