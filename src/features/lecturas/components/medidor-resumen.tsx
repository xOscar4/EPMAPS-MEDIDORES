import { Text, View } from 'react-native';

import { AppIcon } from '@/components/ui/app-icon';
import { Card } from '@/components/ui/card';
import { Chip } from '@/components/ui/chip';
import { Brand } from '@/constants/brand';
import { Icons } from '@/constants/icons';
import type { Medidor } from '@/types/models';
import { formatearFecha, formatearNumero } from '@/utils/format';

interface Props {
  medidor: Medidor;
  porEnviar?: boolean;
}

/** Los siete datos de R3, resumidos para no perder contexto mientras se llena. */
export function MedidorResumen({ medidor, porEnviar }: Props) {
  return (
    <Card style={{ gap: 5 }}>
      <View className="flex-row items-center justify-between gap-2">
        <View className="shrink flex-row items-center gap-[7px]">
          <AppIcon name={Icons.drop} size={18} color={Brand.primary} />
          <Text className="shrink text-[18px] font-extrabold tracking-[0.4px] text-brand-text">
            {medidor.codigo}
          </Text>
        </View>
        <Chip
          label={porEnviar ? 'Corrigiendo pendiente' : 'Consulta guardada'}
          tone={porEnviar ? 'warning' : 'info'}
          icon={porEnviar ? Icons.edit : Icons.cloudDone}
        />
      </View>

      <Text className="text-[13px] font-semibold text-brand-text">{medidor.direccion}</Text>
      <Text className="text-[11px] text-brand-muted">{medidor.sector} · Cuenta {medidor.cuenta}</Text>

      <View className="mt-2 flex-row gap-2">
        <View className="min-w-0 flex-1 gap-0.5 rounded-[12px] border border-brand-glass-border bg-[#F7FBFD] p-2">
          <Text className="text-[9px] font-bold uppercase tracking-[0.3px] text-brand-muted">
            Lectura anterior
          </Text>
          <Text className="text-[12px] font-extrabold text-brand-primary-dark">
            {formatearNumero(medidor.ultimaLectura, 0)} m³
          </Text>
        </View>
        <View className="min-w-0 flex-1 gap-0.5 rounded-[12px] border border-brand-glass-border bg-[#F7FBFD] p-2">
          <Text className="text-[9px] font-bold uppercase tracking-[0.3px] text-brand-muted">
            Promedio mensual
          </Text>
          <Text className="text-[12px] font-extrabold text-brand-primary-dark">
            {formatearNumero(medidor.promedioMensual, 0)} m³
          </Text>
        </View>
        <View className="min-w-0 flex-1 gap-0.5 rounded-[12px] border border-brand-glass-border bg-[#F7FBFD] p-2">
          <Text className="text-[9px] font-bold uppercase tracking-[0.3px] text-brand-muted">
            Última visita
          </Text>
          <Text className="text-[12px] font-extrabold text-brand-primary-dark">
            {formatearFecha(medidor.fechaUltimaLectura)}
          </Text>
        </View>
      </View>
    </Card>
  );
}
