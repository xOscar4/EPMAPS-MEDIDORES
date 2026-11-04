import { Pressable, Text, View } from 'react-native';

import { AppIcon } from '@/components/ui/app-icon';
import { Card } from '@/components/ui/card';
import { Chip } from '@/components/ui/chip';
import { Brand } from '@/constants/brand';
import { Icons } from '@/constants/icons';
import { formatearNumero } from '@/utils/format';

interface Props {
  lectura: number | null;
  anterior: number;
  promedio: number;
  consumo: number;
  anomalia: boolean;
  lecturaMenor: boolean;
  inaccesible: boolean;
  confirmado: boolean;
  onConfirmar: () => void;
  error?: string;
}

/** R6: muestra la resta y alerta cuando supera el triple del promedio. */
export function ConsumoResumen({
  lectura,
  anterior,
  promedio,
  consumo,
  anomalia,
  lecturaMenor,
  inaccesible,
  confirmado,
  onConfirmar,
  error,
}: Props) {
  if (inaccesible) {
    return (
      <Card style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <AppIcon name={Icons.block} size={22} color={Brand.textMuted} />
        <View className="flex-1 gap-0.5">
          <Text className="text-[14px] font-extrabold text-brand-text">
            Consumo no disponible
          </Text>
          <Text className="text-[12px] leading-[17px] text-brand-muted">
            El medidor está inaccesible. Se registra el motivo y no se calcula consumo.
          </Text>
        </View>
      </Card>
    );
  }

  if (lectura === null) {
    return (
      <Card style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <AppIcon name={Icons.speed} size={22} color={Brand.textMuted} />
        <View className="flex-1 gap-0.5">
          <Text className="text-[14px] font-extrabold text-brand-text">
            Aún no hay lectura
          </Text>
          <Text className="text-[12px] leading-[17px] text-brand-muted">
            Al ingresar la lectura actual verás el consumo y la alerta por consumo alto.
          </Text>
        </View>
      </Card>
    );
  }

  const limite = promedio * 3;
  const avance = limite > 0 ? Math.min(1, consumo / limite) : 1;
  const alerta = anomalia || lecturaMenor;

  return (
    <Card style={{ gap: 6 }}>
      <View className="flex-row flex-wrap items-center justify-between gap-2">
        <Text className="text-[10px] font-extrabold tracking-[1.1px] text-brand-muted">
          CONSUMO DEL MES
        </Text>
        <Chip
          label={anomalia ? 'Revisar' : lecturaMenor ? 'Lectura menor' : 'Dentro del promedio'}
          tone={alerta ? 'warning' : 'success'}
          icon={alerta ? Icons.warning : Icons.check}
        />
      </View>

      <View className="flex-row flex-wrap items-end gap-1.5">
        <Text
          className={`text-[42px] font-extrabold leading-[48px] tracking-[-1px] ${
            alerta ? 'text-brand-warning' : 'text-brand-primary-deep'
          }`}
        >
          {formatearNumero(consumo)}
        </Text>
        <Text className="mb-2 text-[15px] font-bold text-brand-muted">m³</Text>
      </View>
      <Text className="-mt-1.5 text-[12px] text-brand-muted">
        Lectura actual {formatearNumero(lectura)} − anterior {formatearNumero(anterior)}
      </Text>

      <View className="mt-2 h-2.5 overflow-hidden rounded-full border border-brand-glass-border bg-[#E7F1F7]">
        <View
          className="h-full rounded-full"
          style={{
            width: `${avance * 100}%`,
            backgroundColor: alerta ? Brand.warning : Brand.accent,
          }}
        />
      </View>
      <View className="flex-row justify-between gap-2">
        <Text className="shrink text-[10px] font-semibold text-brand-muted">
          Promedio {formatearNumero(promedio, 0)} m³
        </Text>
        <Text className="shrink text-[10px] font-semibold text-brand-muted">
          Alerta {formatearNumero(limite, 0)} m³
        </Text>
      </View>

      {alerta ? (
        <View className="mt-2 gap-[7px] rounded-[16px] border border-[rgba(154,91,0,0.28)] bg-[#FFF4DF] p-3">
          <View className="flex-row items-center gap-[7px]">
            <AppIcon name={Icons.warning} size={18} color={Brand.warning} />
            <Text className="min-w-0 flex-1 text-[13px] font-extrabold text-brand-warning">
              {anomalia ? 'Consumo mayor al triple del promedio' : 'Lectura menor que la anterior'}
            </Text>
          </View>
          <Text className="text-[11px] leading-[17px] text-[#6B4300]">
            {anomalia
              ? 'Revisa que la lectura y el medidor sean correctos antes de continuar. La lectura se guardará como anómala para que la oficina la verifique.'
              : `La lectura actual (${formatearNumero(lectura)}) es menor que la anterior (${formatearNumero(anterior)}). El consumo se registra en 0 m³ y solo es válido si cambiaron el medidor.`}
          </Text>
          <Pressable
            accessibilityRole="checkbox"
            accessibilityState={{ checked: confirmado }}
            onPress={onConfirmar}
            className={`flex-row items-center gap-2 rounded-[12px] border p-2.5 ${
              confirmado
                ? 'border-[rgba(17,112,74,0.45)] bg-brand-success-soft'
                : 'border-[rgba(154,91,0,0.30)] bg-white'
            }`}
          >
            <AppIcon
              name={confirmado ? Icons.check : Icons.info}
              size={17}
              color={confirmado ? Brand.success : Brand.warning}
            />
            <Text
              className={`min-w-0 flex-1 text-[12px] font-bold ${
                confirmado ? 'text-brand-success' : 'text-brand-warning'
              }`}
            >
              {confirmado
                ? 'Confirmado'
                : anomalia
                  ? 'Confirmo que revisé el medidor'
                  : 'Confirmo que el medidor fue reemplazado'}
            </Text>
          </Pressable>
          {error ? (
            <Text className="text-[11px] font-bold text-brand-danger">{error}</Text>
          ) : null}
        </View>
      ) : null}
    </Card>
  );
}
