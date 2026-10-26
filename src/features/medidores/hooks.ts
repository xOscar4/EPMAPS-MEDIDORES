import { useQuery } from '@tanstack/react-query';

import { getMedidor, getRuta } from '@/services/mockApi';
import { esCodigoValido } from '@/utils/validators';

/** Claves centralizadas: evitamos strings sueltos en las pantallas. */
export const medidorKeys = {
  ruta: ['medidores', 'ruta'] as const,
  detalle: (codigo: string) => ['medidores', 'detalle', codigo] as const,
};

const DOCE_HORAS = 1000 * 60 * 60 * 12;

export function useRuta() {
  return useQuery({
    queryKey: medidorKeys.ruta,
    queryFn: getRuta,
    staleTime: DOCE_HORAS,
  });
}

/** R2: la consulta ni siquiera se dispara si el código no tiene el formato. */
export function useMedidor(codigo?: string) {
  return useQuery({
    queryKey: medidorKeys.detalle(codigo ?? ''),
    queryFn: () => getMedidor(codigo as string),
    enabled: Boolean(codigo && esCodigoValido(codigo)),
    staleTime: DOCE_HORAS,
  });
}
