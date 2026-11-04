import { useQuery } from '@tanstack/react-query';

import {
  getMedidor,
  getRuta,
  guardarMedidorVisto,
  guardarMedidoresVistos,
  leerMedidorVisto,
} from '@/services/api';
import { esCodigoValido } from '@/utils/validators';
import { ApiError } from '@/services/apiError';

/** Claves centralizadas: evitamos strings sueltos en las pantallas. */
export const medidorKeys = {
  ruta: ['medidores', 'ruta'] as const,
  detalle: (codigo: string) => ['medidores', 'detalle', codigo] as const,
};

const DOCE_HORAS = 1000 * 60 * 60 * 12;

export function useRuta() {
  return useQuery({
    queryKey: medidorKeys.ruta,
    queryFn: async () => {
      const ruta = await getRuta();
      // R3: copia en AsyncStorage para no depender solo de la caché de Query.
      await guardarMedidoresVistos(ruta);
      return ruta;
    },
    staleTime: DOCE_HORAS,
  });
}

/**
 * R2: la consulta ni siquiera se dispara si el código no tiene el formato.
 * R3: si no hay red, se devuelve la copia guardada de ese medidor.
 */
export function useMedidor(codigo?: string) {
  return useQuery({
    queryKey: medidorKeys.detalle(codigo ?? ''),
    queryFn: async () => {
      try {
        const medidor = await getMedidor(codigo as string);
        await guardarMedidorVisto(medidor);
        return medidor;
      } catch (error) {
        const guardado = await leerMedidorVisto(codigo as string);
        const noExiste = error instanceof ApiError && error.codigo === 'NO_ENCONTRADO';
        if (guardado && !noExiste) return guardado;
        throw error;
      }
    },
    enabled: Boolean(codigo && esCodigoValido(codigo)),
    staleTime: DOCE_HORAS,
  });
}
