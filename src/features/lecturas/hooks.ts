import { useQuery } from '@tanstack/react-query';

import { getLecturasEnviadas } from '@/services/api';
import { periodoActual } from '@/utils/format';
import { useOutbox } from './outbox-provider';

export const lecturaKeys = {
  historial: ['lecturas', 'enviadas'] as const,
};

export function useHistorial() {
  return useQuery({
    queryKey: lecturaKeys.historial,
    queryFn: getLecturasEnviadas,
    staleTime: 1000 * 15,
  });
}

/** R10: evita ofrecer un segundo registro del mismo medidor en el mes. */
export function useLecturaDelMes(codigo: string) {
  const { lecturas } = useOutbox();
  const { data: enviadas = [] } = useHistorial();
  const periodo = periodoActual();

  return {
    pendiente: lecturas.find(
      (item) => item.medidorCodigo === codigo && item.periodo === periodo,
    ),
    enviada: enviadas.find(
      (item) => item.medidorCodigo === codigo && item.periodo === periodo,
    ),
  };
}
