import { Pressable, Text, View } from "react-native";

import { AppGradient } from "@/components/ui/app-gradient";
import { AppIcon } from "@/components/ui/app-icon";
import { Chip } from "@/components/ui/chip";
import { Brand, Shadows } from "@/constants/brand";
import { Icons } from "@/constants/icons";
import type { Medidor } from "@/types/models";
import { formatearNumero } from "@/utils/format";

/** Tres estados visuales de la ruta: sin registrar, por enviar o ya enviada. */
export type EstadoRuta = "sin-registrar" | "por-enviar" | "enviada";

interface Props {
  medidor: Medidor;
  estado: EstadoRuta;
  onPress: () => void;
}

const ESTADOS = {
  "sin-registrar": {
    label: "Pendiente",
    tone: "warning" as const,
    color: "#D08A16",
  },
  "por-enviar": {
    label: "Por enviar",
    tone: "info" as const,
    color: Brand.accent,
  },
  enviada: { label: "Enviada", tone: "success" as const, color: "#1B9A67" },
};

export function MedidorCard({ medidor, estado, onPress }: Props) {
  const meta = ESTADOS[estado];

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Medidor ${medidor.codigo}, ${meta.label}`}
      onPress={onPress}
      style={({ pressed }) => [
        Shadows.card,
        pressed ? { opacity: 0.9, transform: [{ scale: 0.995 }] } : null,
      ]}
      className="flex-row overflow-hidden rounded-[22px] border border-brand-border bg-white"
    >
      <AppGradient
        colors={["#FFFFFF", "#F5FBFE"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="absolute inset-0"
        pointerEvents="none"
      />
      <View className="w-2 items-center" style={{ backgroundColor: meta.color }}>
        <View className="mt-4 h-[26px] w-[3px] rounded-[2px] bg-white/60" />
      </View>

      <View className="flex-1 gap-[7px] p-[15px] pl-[13px]">
        <View className="flex-row flex-wrap items-center justify-between gap-2">
          <View className="shrink gap-0">
            <Text className="text-[8px] font-extrabold tracking-[1.2px] text-brand-muted">
              MEDIDOR
            </Text>
            <Text className="text-[17px] font-extrabold tracking-[0.2px] text-brand-text" numberOfLines={1}>
              {medidor.codigo}
            </Text>
          </View>
          <Chip
            label={meta.label}
            tone={meta.tone}
            icon={estado === "enviada" ? Icons.verified : Icons.pending}
          />
        </View>

        <View className="flex-row items-center gap-1.5">
          <View className="h-[22px] w-[22px] items-center justify-center rounded-[8px] border border-brand-border bg-brand-primary-soft">
            <AppIcon name={Icons.location} size={11} color={Brand.primary} />
          </View>
          <Text className="min-w-0 flex-1 text-[12px] font-bold text-brand-primary" numberOfLines={1}>
            {medidor.sector}
          </Text>
          {medidor.estado === "suspendido" ? (
            <Chip label="Suspendido" tone="danger" />
          ) : null}
        </View>
        <Text className="text-[11.5px] text-brand-muted" numberOfLines={1}>
          {medidor.direccion}
        </Text>

        <View className="mt-0.5 flex-row items-center gap-2">
          <View className="min-w-0 flex-1 flex-row gap-[7px]">
            <View className="min-w-0 flex-1 gap-0 rounded-[12px] border border-[rgba(13,94,140,0.08)] bg-[#F3FAFD] px-2 py-[6px]">
              <Text className="text-[8px] font-extrabold uppercase tracking-[0.6px] text-brand-muted">
                Última
              </Text>
              <Text className="text-[14px] font-extrabold text-brand-primary-deep">
                {formatearNumero(medidor.ultimaLectura, 0)}
                <Text className="text-[9px] font-bold text-brand-muted"> m³</Text>
              </Text>
            </View>
            <View className="min-w-0 flex-1 gap-0 rounded-[12px] border border-[rgba(13,94,140,0.08)] bg-[#F3FAFD] px-2 py-[6px]">
              <Text className="text-[8px] font-extrabold uppercase tracking-[0.6px] text-brand-muted">
                Promedio
              </Text>
              <Text className="text-[14px] font-extrabold text-brand-primary-deep">
                {formatearNumero(medidor.promedioMensual, 0)}
                <Text className="text-[9px] font-bold text-brand-muted"> m³</Text>
              </Text>
            </View>
          </View>

          <AppGradient
            colors={[Brand.deepMid, Brand.deepEnd]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="h-[34px] w-[34px] items-center justify-center rounded-[12px]"
          >
            <AppIcon name={Icons.chevronRight} size={17} color="#FFFFFF" />
          </AppGradient>
        </View>
      </View>
    </Pressable>
  );
}
