import { ApiError, enviarLectura } from '@/services/mockApi';
import type { LecturaLocal } from '@/types/models';
import { guardarOutbox, leerOutbox } from './outbox';

export interface ResultadoSync {
  items: LecturaLocal[];
  enviadas: number;
  errores: number;
  falloRed: boolean;
}

/**
 * R9: envía en orden y solo elimina del outbox cuando el servidor confirma.
 * Si la app muere a mitad de un envío, la lectura sigue en el outbox y se
 * reenvía con la misma idempotencia; el mock no la duplica.
 */
export async function sincronizarCola(): Promise<ResultadoSync> {
  let items = await leerOutbox();
  let enviadas = 0;
  let errores = 0;
  let falloRed = false;

  const pendientes = items.filter((item) => item.estadoSync !== 'error');

  for (const pendiente of pendientes) {
    items = items.map((item) =>
      item.id === pendiente.id ? { ...item, estadoSync: 'enviando', error: undefined } : item,
    );
    await guardarOutbox(items);

    try {
      await enviarLectura(pendiente);
      items = items.filter((item) => item.id !== pendiente.id);
      await guardarOutbox(items);
      enviadas += 1;
    } catch (error) {
      const esDuplicada = error instanceof ApiError && error.codigo === 'DUPLICADA';
      const mensaje = error instanceof Error ? error.message : 'No se pudo enviar la lectura.';
      items = items.map((item) =>
        item.id === pendiente.id
          ? {
              ...item,
              estadoSync: esDuplicada ? 'error' : 'pendiente',
              error: esDuplicada
                ? mensaje
                : 'No se pudo enviar. Se reintentará al recuperar la conexión.',
            }
          : item,
      );
      await guardarOutbox(items);
      errores += 1;
      if (!esDuplicada) {
        falloRed = true;
        break; // Sin red: no tiene sentido seguir intentando.
      }
    }
  }

  return { items, enviadas, errores, falloRed };
}
