import { useRouter } from "expo-router";
import { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    RefreshControl,
    ScrollView,
    Text,
    View,
} from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";

import { AppButton } from "@/components/ui/app-button";
import { AppGradient } from "@/components/ui/app-gradient";
import { AppIcon } from "@/components/ui/app-icon";
import { Chip } from "@/components/ui/chip";
import { EmptyState } from "@/components/ui/empty-state";
import { Segmented } from "@/components/ui/segmented";
import { StatTile } from "@/components/ui/stat-tile";
import { WaterGlow, WaterWaves } from "@/components/ui/water-decor";
import { Brand } from "@/constants/brand";
import { Icons } from "@/constants/icons";
import { LecturaCard } from "@/features/lecturas/components/lectura-card";
import { useHistorial } from "@/features/lecturas/hooks";
import { useOutbox } from "@/features/lecturas/outbox-provider";
import { useNetworkStatus } from "@/hooks/use-network-status";

type Filtro = "todos" | "pendientes" | "enviadas";

export default function HistorialScreen() {
  const router = useRouter();
  const { online } = useNetworkStatus();
  const {
    lecturas,
    pendientes,
    sincronizando,
    ultimoError,
    eliminar,
    sincronizar,
    refrescar,
  } = useOutbox();
  const { data: enviadas = [], refetch, isFetching, isError } = useHistorial();
  const [filtro, setFiltro] = useState<Filtro>("todos");

  const localesOrdenadas = [...lecturas].sort((a, b) =>
    (b.fecha || b.creadoEn || "").localeCompare(a.fecha || a.creadoEn || ""),
  );
  const remotasOrdenadas = [...enviadas].sort((a, b) =>
    (b.fecha || b.enviadoEn || "").localeCompare(a.fecha || a.enviadoEn || ""),
  );
  const locales = filtro === "enviadas" ? [] : localesOrdenadas;
  const remotas = filtro === "pendientes" ? [] : remotasOrdenadas;
  const total = locales.length + remotas.length;

  const descartar = (id: string) =>
    Alert.alert(
      "Descartar lectura",
      "Se borrará del teléfono y no llegará a la oficina.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Descartar",
          style: "destructive",
          onPress: () => void eliminar(id),
        },
      ],
    );

  return (
    <ScrollView
      className="flex-1 bg-transparent"
      contentContainerStyle={{ paddingBottom: 118 }}
      refreshControl={
        <RefreshControl
          refreshing={isFetching}
          onRefresh={() => {
            void refrescar();
            void refetch();
          }}
          tintColor={Brand.primary}
          colors={[Brand.primary]}
        />
      }
    >
      <AppGradient
        colors={[Brand.deepStart, Brand.deepMid, Brand.deepEnd]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="gap-1 overflow-hidden rounded-b-[30px] border-b border-white/[0.15] px-5 pb-[54px] pt-[18px]"
      >
        <WaterGlow style={{ right: -90, top: -100 }} opacity={0.58} />
        <WaterWaves opacity={0.15} />
        <Text className="text-[10px] font-extrabold tracking-[1.4px] text-[#B9E7EF]">
          MIS REGISTROS
        </Text>
        <View className="flex-row items-center justify-between gap-3">
          <View className="min-w-0 flex-1 gap-px">
            <Text className="text-[30px] font-extrabold leading-[35px] tracking-[-0.6px] text-white">
              Historial
            </Text>
            <Text className="mt-px text-[12px] text-[#D6EAF3]">
              Lecturas guardadas en este teléfono
            </Text>
          </View>
          <View className="h-[46px] w-[46px] items-center justify-center rounded-[15px] border border-white/30 bg-white/[0.15]">
            <AppIcon name={Icons.history} size={22} color="#FFFFFF" />
          </View>
        </View>
      </AppGradient>

      <View className="-mt-[30px] flex-row gap-2 px-4">
        <StatTile
          value={lecturas.length}
          label="Sin enviar"
          icon={Icons.pending}
          tone="warning"
          appearance="solid"
        />
        <StatTile
          value={enviadas.length}
          label="Enviadas"
          icon={Icons.verified}
          tone="success"
          appearance="solid"
        />
        <StatTile
          value={online ? "Sí" : "No"}
          label="Conexión"
          icon={online ? Icons.wifi : Icons.wifiOff}
          tone="brand"
          appearance="solid"
        />
      </View>

      <View className="gap-3 px-4 pt-[18px]">
        {pendientes > 0 ? (
          <AppButton
            title={
              online
                ? "Enviar lecturas pendientes"
                : "Sin conexión: esperando señal"
            }
            icon={online ? Icons.sync : Icons.cloudOff}
            loading={sincronizando}
            disabled={!online}
            onPress={() => void sincronizar()}
          />
        ) : null}

        {ultimoError ? (
          <View className="flex-row items-center gap-2 rounded-[12px] border border-[rgba(214,138,0,0.22)] bg-brand-warning-soft p-[11px]">
            <AppIcon name={Icons.warning} size={16} color={Brand.warning} />
            <Text className="flex-1 text-[11px] font-semibold text-brand-warning">
              {ultimoError}
            </Text>
          </View>
        ) : null}

        {isError ? (
          <View className="flex-row items-center gap-2 rounded-[12px] border border-[rgba(214,138,0,0.22)] bg-brand-warning-soft p-[11px]">
            <AppIcon name={Icons.cloudOff} size={16} color={Brand.warning} />
            <Text className="flex-1 text-[11px] font-semibold text-brand-warning">
              No se pudo consultar el servidor. Se muestran los datos locales.
            </Text>
          </View>
        ) : null}

        <Segmented
          value={filtro}
          onChange={(valor) => setFiltro(valor as Filtro)}
          options={[
            {
              key: "todos",
              label: "Todos",
              count: lecturas.length + enviadas.length,
            },
            { key: "pendientes", label: "Pendientes", count: lecturas.length },
            { key: "enviadas", label: "Enviadas", count: enviadas.length },
          ]}
        />

        {isFetching && lecturas.length === 0 && enviadas.length === 0 ? (
          <View className="items-center gap-2 py-[30px]">
            <ActivityIndicator color={Brand.primary} />
            <Text className="text-[12px] font-semibold text-brand-muted">
              Revisando lecturas…
            </Text>
          </View>
        ) : total === 0 ? (
          <EmptyState
            icon={Icons.list}
            title="Todavía no hay lecturas"
            message="Registra tu primera lectura desde Mi ruta. Aquí verás las pendientes y las confirmadas por la oficina."
          />
        ) : (
          <View className="gap-3">
            {locales.map((item, index) => (
              <Animated.View
                key={item.id}
                entering={FadeInUp.delay(Math.min(index, 6) * 45).duration(280)}
                className="rounded-[18px]"
              >
                <LecturaCard
                  item={item}
                  onEditar={
                    item.estadoSync === "pendiente"
                      ? () =>
                          router.push({
                            pathname: "/lectura/[codigo]",
                            params: {
                              codigo: item.medidorCodigo,
                              lecturaId: item.id,
                            },
                          })
                      : undefined
                  }
                  onEliminar={
                    item.estadoSync === "enviando"
                      ? undefined
                      : () => descartar(item.id)
                  }
                />
              </Animated.View>
            ))}
            {remotas.map((item, index) => (
              <Animated.View
                key={item.id}
                entering={FadeInUp.delay(Math.min(index + locales.length, 6) * 45).duration(280)}
                className="rounded-[18px]"
              >
                <LecturaCard item={item} />
              </Animated.View>
            ))}
          </View>
        )}

        <View className="mt-1 flex-row flex-wrap gap-1.5">
          <Chip
            label="Pendiente: se puede corregir"
            tone="warning"
            icon={Icons.edit}
          />
          <Chip
            label="Enviada: solo lectura"
            tone="success"
            icon={Icons.verified}
          />
        </View>
      </View>
    </ScrollView>
  );
}
