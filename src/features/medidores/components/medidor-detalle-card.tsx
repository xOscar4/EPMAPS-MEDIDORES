import { Text, View } from "react-native";

import { AppGradient } from "@/components/ui/app-gradient";
import { AppIcon } from "@/components/ui/app-icon";
import { Card } from "@/components/ui/card";
import { Chip } from "@/components/ui/chip";
import { Brand, Shadows } from "@/constants/brand";
import { Icons } from "@/constants/icons";
import type { Medidor } from "@/types/models";
import { formatearFecha, formatearNumero } from "@/utils/format";

interface Props {
  medidor: Medidor;
  online: boolean;
  actualizando: boolean;
}

/** R3: los siete datos del medidor, con aviso de que están guardados localmente. */
export function MedidorDetalleCard({ medidor, online, actualizando }: Props) {
  return (
    <View className="gap-3">
      <AppGradient
        colors={[Brand.deepStart, Brand.deepMid, Brand.deepEnd]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="gap-[3px] overflow-hidden rounded-[26px] border border-white/25 p-[18px]"
        style={Shadows.floating}
      >
        <View className="absolute right-[-56px] top-[-70px] h-[180px] w-[180px] rounded-full bg-[rgba(22,201,218,0.22)]" />
        <View pointerEvents="none" className="absolute bottom-[-36px] right-[-28px] opacity-10">
          <AppIcon name={Icons.drop} size={140} color="#FFFFFF" />
        </View>
        <View className="mb-2 flex-row flex-wrap items-center justify-between gap-2">
          <Chip
            label={
              medidor.estado === "activo"
                ? "Servicio activo"
                : "Servicio suspendido"
            }
            tone={medidor.estado === "activo" ? "success" : "danger"}
            icon={medidor.estado === "activo" ? Icons.check : Icons.block}
          />
          <Chip
            label={
              actualizando
                ? "Actualizando"
                : online
                  ? "En línea"
                  : "Desde caché"
            }
            tone="info"
            icon={
              actualizando ? Icons.sync : online ? Icons.wifi : Icons.cloudOff
            }
          />
        </View>
        <Text className="shrink text-[27px] font-extrabold tracking-[0.6px] text-white">
          {medidor.codigo}
        </Text>
        <Text className="text-[13px] font-bold text-[#BFEFF7]">{medidor.sector}</Text>
        <View className="mt-1.5 flex-row items-center gap-1.5">
          <AppIcon name={Icons.location} size={15} color="#A9E7EE" />
          <Text className="min-w-0 flex-1 text-[12px] text-[#DEF7FB]">{medidor.direccion}</Text>
        </View>
      </AppGradient>

      <Card style={{ gap: 12 }}>
        <View className="flex-row flex-wrap gap-2">
          <Dato label="Cuenta" value={medidor.cuenta} icon={Icons.receipt} />
          <Dato
            label="Estado"
            value={medidor.estado === "activo" ? "Activo" : "Suspendido"}
            icon={Icons.info}
          />
          <Dato
            label="Última lectura"
            value={`${formatearNumero(medidor.ultimaLectura, 0)} m³`}
            icon={Icons.speed}
          />
          <Dato
            label="Promedio mensual"
            value={`${formatearNumero(medidor.promedioMensual, 0)} m³`}
            icon={Icons.drop}
          />
          <Dato
            label="Fecha última"
            value={formatearFecha(medidor.fechaUltimaLectura)}
            icon={Icons.calendar}
          />
          <Dato label="Código" value={medidor.codigo} icon={Icons.list} />
        </View>
        <View className="flex-row items-center gap-1.5">
          <AppIcon name={Icons.cloudDone} size={14} color={Brand.success} />
          <Text className="flex-1 text-[10px] font-semibold text-brand-success">
            Guardado en el teléfono: puedes consultarlo otra vez sin señal.
          </Text>
        </View>
      </Card>
    </View>
  );
}

function Dato({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: (typeof Icons)[keyof typeof Icons];
}) {
  return (
    <View className="w-[47%] min-w-0 flex-grow gap-px rounded-[14px] border border-brand-glass-border bg-[#F7FBFD] p-2.5">
      <View className="mb-1 h-7 w-7 items-center justify-center rounded-[10px] bg-brand-primary-light">
        <AppIcon name={icon} size={14} color={Brand.primary} />
      </View>
      <Text className="text-[9px] font-extrabold uppercase tracking-[0.35px] text-brand-muted">
        {label}
      </Text>
      <Text className="text-[12px] font-extrabold text-brand-text" numberOfLines={1}>
        {value}
      </Text>
    </View>
  );
}
