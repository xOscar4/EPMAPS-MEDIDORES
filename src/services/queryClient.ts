/**
 * Cliente global de TanStack Query con persistencia en AsyncStorage.
 *
 * Decisión registrada en docs/adr/ADR-001.
 * La caché de consultas sobrevive al cierre de la app; la cola de lecturas
 * pendientes vive en un outbox aparte (docs/adr/ADR-002).
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import { QueryClient } from '@tanstack/react-query';
import type { PersistQueryClientOptions } from '@tanstack/react-query-persist-client';

/** 7 días: la ruta se descarga un día antes y puede consultarse toda la semana. */
const UNA_SEMANA = 1000 * 60 * 60 * 24 * 7;

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // 5 minutos por defecto; los medidores usan 12 h en su propio hook.
      staleTime: 1000 * 60 * 5,
      // Debe ser >= maxAge para no borrar de memoria lo que aún está persistido.
      gcTime: UNA_SEMANA,
      retry: 2,
      // Muestra la caché aunque no haya red; la red se intenta en segundo plano.
      networkMode: 'offlineFirst',
      refetchOnReconnect: true,
    },
  },
});

export const asyncStoragePersister = createAsyncStoragePersister({
  storage: AsyncStorage,
  key: 'EPMAPS_QUERY_CACHE',
  // Agrupa escrituras: menos I/O y menos consumo de batería.
  throttleTime: 1000,
});

export const persistOptions: Omit<PersistQueryClientOptions, 'queryClient'> = {
  persister: asyncStoragePersister,
  maxAge: UNA_SEMANA,
  // Subir este valor si cambia la estructura de Medidor.
  buster: 'v1',
  dehydrateOptions: {
    // Solo se guardan consultas exitosas; los errores se vuelven a intentar.
    shouldDehydrateQuery: (query) => query.state.status === 'success',
  },
};
