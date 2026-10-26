import { Directory, File, Paths } from 'expo-file-system';
import { Platform } from 'react-native';

/**
 * R7: la cámara entrega la foto en la caché temporal. Se copia al directorio
 * de documentos para que siga disponible aunque se reinicie el teléfono.
 */
const CARPETA = 'fotos-medidores';

export async function guardarFoto(uri: string, nombre: string): Promise<string> {
  if (Platform.OS === 'web') return uri;
  try {
    const carpeta = new Directory(Paths.document, CARPETA);
    if (!carpeta.exists) {
      carpeta.create({ intermediates: true, idempotent: true });
    }
    const destino = new File(carpeta, `${nombre}.jpg`);
    await new File(uri).copy(destino, { overwrite: true });
    return destino.uri;
  } catch {
    // Si la copia falla, la URI de caché sigue sirviendo para esta sesión.
    return uri;
  }
}

export async function borrarFoto(uri?: string | null): Promise<void> {
  if (!uri || Platform.OS === 'web') return;
  try {
    const archivo = new File(uri);
    if (archivo.exists) archivo.delete();
  } catch {
    // La foto pudo haberse borrado manualmente; no se bloquea el flujo.
  }
}
