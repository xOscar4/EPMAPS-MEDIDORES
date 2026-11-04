import {
    ActivityIndicator,
    Pressable,
    Text,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Brand } from "@/constants/brand";
import { Icons } from "@/constants/icons";
import { useOutbox } from "@/features/lecturas/outbox-provider";
import { useNetworkStatus } from "@/hooks/use-network-status";
import { AppGradient } from "./ui/app-gradient";
import { AppIcon } from "./ui/app-icon";

/** R9: conexión y pendientes visibles en todas las pantallas. */
export function StatusBanner() {
  const insets = useSafeAreaInsets();
  const { online } = useNetworkStatus();
  const { pendientes, conError, sincronizando, sincronizar, ultimoError } =
    useOutbox();

  const puedeSincronizar = online && pendientes > 0 && !sincronizando;
  const sinEnviar = pendientes + conError;
  const base = !online
    ? sinEnviar === 0
      ? "Sin conexión · sin pendientes"
      : `Sin conexión · ${sinEnviar} sin enviar`
    : pendientes > 0
      ? `${pendientes} lectura${pendientes === 1 ? "" : "s"} por enviar`
      : conError > 0
        ? `${conError} lectura${conError === 1 ? "" : "s"} con error · revisar historial`
        : "En línea · Todo sincronizado";

  // Si el último intento falló, se muestra el motivo en la misma barra.
  const texto =
    online && ultimoError && pendientes > 0 ? `${base} · ${ultimoError}` : base;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={
        puedeSincronizar ? "Sincronizar lecturas pendientes" : texto
      }
      disabled={!puedeSincronizar}
      onPress={() => void sincronizar()}
      className="overflow-hidden px-3 pb-2.5"
      style={{ paddingTop: insets.top + 8 }}
    >
      <AppGradient
        colors={
          online
            ? [Brand.deepStart, Brand.deepMid, Brand.deepEnd]
            : ["#46300A", "#6E4A05", "#8A5F10"]
        }
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        className="absolute inset-0"
        pointerEvents="none"
      />
      <View className="flex-row items-center gap-2 rounded-[16px] bg-[rgba(5,42,67,0.14)] px-3 py-[9px]">
        {sincronizando ? (
          <ActivityIndicator size="small" color="#FFFFFF" />
        ) : (
          <AppIcon
            name={online ? Icons.wifi : Icons.wifiOff}
            size={16}
            color="#FFFFFF"
          />
        )}
        <Text className="flex-1 text-[12px] font-bold tracking-[0.2px] text-white" numberOfLines={1}>
          {sincronizando ? "Sincronizando lecturas…" : texto}
        </Text>
        {puedeSincronizar ? (
          <View className="flex-row items-center gap-1 rounded-full border border-white/30 bg-white/[0.15] px-2.5 py-[5px]">
            <AppIcon name={Icons.sync} size={14} color="#FFFFFF" />
            <Text className="text-[10px] font-extrabold tracking-[0.3px] text-white">Enviar</Text>
          </View>
        ) : null}
      </View>
    </Pressable>
  );
}
