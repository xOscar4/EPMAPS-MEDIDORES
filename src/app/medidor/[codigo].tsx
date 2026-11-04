import { Redirect, useLocalSearchParams, useRouter } from "expo-router";
import {
    ActivityIndicator,
    ScrollView,
    Text,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AppButton } from "@/components/ui/app-button";
import { AppIcon } from "@/components/ui/app-icon";
import { Card } from "@/components/ui/card";
import { Chip } from "@/components/ui/chip";
import { EmptyState } from "@/components/ui/empty-state";
import { ScreenHeader } from "@/components/ui/screen-header";
import { SectionTitle } from "@/components/ui/section-title";
import { Brand } from "@/constants/brand";
import { Icons } from "@/constants/icons";
import { useAuth } from "@/features/auth/auth-provider";
import { LecturaCard } from "@/features/lecturas/components/lectura-card";
import { useHistorial, useLecturaDelMes } from "@/features/lecturas/hooks";
import { useOutbox } from "@/features/lecturas/outbox-provider";
import { MedidorDetalleCard } from "@/features/medidores/components/medidor-detalle-card";
import { useMedidor } from "@/features/medidores/hooks";
import { useNetworkStatus } from "@/hooks/use-network-status";
import {
    formatearFechaHora,
    formatearNumero,
    formatearPeriodo,
    periodoActual,
} from "@/utils/format";
import { esCodigoValido, normalizarCodigo } from "@/utils/validators";

export default function MedidorScreen() {
  const { codigo } = useLocalSearchParams<{ codigo: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { online } = useNetworkStatus();
  const { usuario, cargando, emailVerificado } = useAuth();
  const codigoMedidor = normalizarCodigo(codigo ?? "");
  const consulta = useMedidor(codigoMedidor);
  const { lecturas } = useOutbox();
  const { data: enviadas = [] } = useHistorial();
  const { pendiente, enviada } = useLecturaDelMes(codigoMedidor);
  const valido = esCodigoValido(codigoMedidor);
  const periodo = periodoActual();
  const fechaDeOrden = (
    item: (typeof lecturas)[number] | (typeof enviadas)[number],
  ) =>
    "enviadoEn" in item
      ? item.fecha || item.enviadoEn
      : item.fecha || item.creadoEn;
  const historialMedidor = [
    ...lecturas.filter((item) => item.medidorCodigo === codigoMedidor),
    ...enviadas.filter((item) => item.medidorCodigo === codigoMedidor),
  ].sort((a, b) => fechaDeOrden(b).localeCompare(fechaDeOrden(a)));

  if (cargando) return null;
  if (!usuario) return <Redirect href="/" />;
  if (!emailVerificado) return <Redirect href="/verificar-correo" />;

  const volver = () => {
    if (router.canGoBack()) router.back();
    else router.replace("/rutas");
  };

  return (
    <View className="flex-1 bg-transparent">
      <ScreenHeader
        title="Detalle del medidor"
        subtitle={codigoMedidor}
        onBack={volver}
      />
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 14,
          paddingBottom: 28 + insets.bottom,
          gap: 14,
        }}
      >
        {!valido ? (
          <EmptyState
            icon={Icons.error}
            title="Código inválido"
            message="El código debe tener el formato MED-000000. No se consultó el servidor."
          />
        ) : consulta.isLoading ? (
          <View className="items-center gap-2 py-[50px]">
            <ActivityIndicator color={Brand.primary} />
            <Text className="text-[12px] font-semibold text-brand-muted">
              Consultando el medidor…
            </Text>
          </View>
        ) : consulta.isError || !consulta.data ? (
          <View className="gap-2.5">
            <EmptyState
              icon={Icons.cloudOff}
              title="No hay datos de este medidor"
              message="No se encontró en el servidor y no está en la caché del teléfono. Revisa el código o la conexión."
            />
            <AppButton
              title="Reintentar"
              icon={Icons.refresh}
              variant="secondary"
              onPress={() => void consulta.refetch()}
            />
          </View>
        ) : (
          <>
            <MedidorDetalleCard
              medidor={consulta.data}
              online={online}
              actualizando={consulta.isFetching}
            />

            <View className="mt-1">
              <SectionTitle
                index="2"
                title="Lectura del mes"
                subtitle={formatearPeriodo(periodo)}
              />
            </View>

            {enviada ? (
              <Card style={{ gap: 10 }}>
                <View className="flex-row items-center gap-[11px]">
                  <View className="h-[46px] w-[46px] items-center justify-center rounded-[15px] border border-brand-glass-border bg-brand-success-soft">
                    <AppIcon
                      name={Icons.verified}
                      size={22}
                      color={Brand.success}
                    />
                  </View>
                  <View className="flex-1 gap-0.5">
                    <Text className="text-[15px] font-extrabold text-brand-text">
                      Lectura enviada
                    </Text>
                    <Text className="text-[11px] text-brand-muted">
                      Recibida en MockAPI el{" "}
                      {formatearFechaHora(enviada.enviadoEn)}
                    </Text>
                  </View>
                </View>
                <View className="flex-row items-center justify-between">
                  <Text className="text-[11px] font-semibold text-brand-muted">
                    Lectura
                  </Text>
                  <Text className="text-[13px] font-extrabold text-brand-text">
                    {enviada.lectura !== null
                      ? `${formatearNumero(enviada.lectura)} m³`
                      : "Sin lectura"}
                  </Text>
                </View>
                <View className="flex-row items-center justify-between">
                  <Text className="text-[11px] font-semibold text-brand-muted">
                    Consumo
                  </Text>
                  <Text className="text-[13px] font-extrabold text-brand-text">
                    {formatearNumero(enviada.consumo)} m³
                  </Text>
                </View>
                {enviada.anomalia ? (
                  <Chip
                    label="Consumo anómalo reportado"
                    tone="warning"
                    icon={Icons.warning}
                  />
                ) : null}
                <Text className="rounded-[12px] border border-[rgba(23,164,106,0.18)] bg-brand-success-soft p-2.5 text-[10px] font-normal leading-4 text-brand-success">
                  R10: esta lectura ya está guardada en el servidor y es de solo
                  lectura. Si tiene un error, la oficina debe anularla y el
                  técnico registra una nueva.
                </Text>
                <AppButton
                  title="Registrar otra lectura"
                  icon={Icons.camera}
                  variant="secondary"
                  onPress={() =>
                    router.push({
                      pathname: "/lectura/[codigo]",
                      params: { codigo: codigoMedidor },
                    })
                  }
                />
              </Card>
            ) : pendiente ? (
              <Card style={{ gap: 10 }}>
                <View className="flex-row items-center gap-[11px]">
                  <View className="h-[46px] w-[46px] items-center justify-center rounded-[15px] border border-brand-glass-border bg-brand-warning-soft">
                    <AppIcon
                      name={Icons.pending}
                      size={22}
                      color={Brand.warning}
                    />
                  </View>
                  <View className="flex-1 gap-0.5">
                    <Text className="text-[15px] font-extrabold text-brand-text">
                      {pendiente.estadoSync === "error"
                        ? "Lectura con conflicto"
                        : "Lectura pendiente de envío y verificación"}
                    </Text>
                    <Text className="text-[11px] text-brand-muted">
                      Registrada el {formatearFechaHora(pendiente.creadoEn)}
                    </Text>
                  </View>
                </View>
                <View className="flex-row items-center justify-between">
                  <Text className="text-[11px] font-semibold text-brand-muted">
                    Lectura
                  </Text>
                  <Text className="text-[13px] font-extrabold text-brand-text">
                    {pendiente.lectura !== null
                      ? `${formatearNumero(pendiente.lectura)} m³`
                      : "Inaccesible"}
                  </Text>
                </View>
                <View className="flex-row items-center justify-between">
                  <Text className="text-[11px] font-semibold text-brand-muted">
                    Consumo
                  </Text>
                  <Text className="text-[13px] font-extrabold text-brand-text">
                    {formatearNumero(pendiente.consumo)} m³
                  </Text>
                </View>
                {pendiente.error ? (
                  <Text className="text-[11px] font-semibold text-brand-danger">
                    {pendiente.error}
                  </Text>
                ) : null}
                {pendiente.estadoSync === "error" ? (
                  <AppButton
                    title="Revisar en el historial"
                    icon={Icons.history}
                    variant="secondary"
                    onPress={() => router.replace("/historial")}
                  />
                ) : pendiente.estadoSync === "enviando" ? (
                  <Text className="rounded-[12px] border border-[rgba(13,94,140,0.16)] bg-[rgba(13,94,140,0.08)] p-2.5 text-[11px] font-semibold text-brand-primary">
                    Enviando la lectura. Espera un momento.
                  </Text>
                ) : (
                  <AppButton
                    title="Corregir lectura pendiente"
                    icon={Icons.edit}
                    variant="secondary"
                    onPress={() =>
                      router.push({
                        pathname: "/lectura/[codigo]",
                        params: {
                          codigo: codigoMedidor,
                          lecturaId: pendiente.id,
                        },
                      })
                    }
                  />
                )}
              </Card>
            ) : (
              <Card style={{ gap: 10 }}>
                <View className="flex-row items-center gap-[11px]">
                  <View className="h-[46px] w-[46px] items-center justify-center rounded-[15px] border border-brand-glass-border bg-brand-primary-light">
                    <AppIcon
                      name={Icons.speed}
                      size={22}
                      color={Brand.primary}
                    />
                  </View>
                  <View className="flex-1 gap-0.5">
                    <Text className="text-[15px] font-extrabold text-brand-text">
                      Sin lectura este mes
                    </Text>
                    <Text className="text-[11px] text-brand-muted">
                      Registra la lectura del medidor durante la visita.
                    </Text>
                  </View>
                </View>
                {consulta.data.estado === "suspendido" ? (
                  <Text className="rounded-[12px] border border-[rgba(214,138,0,0.22)] bg-brand-warning-soft p-2.5 text-[11px] font-semibold text-brand-warning">
                    El servicio figura suspendido. Verifica el medidor antes de
                    registrar.
                  </Text>
                ) : null}
                <AppButton
                  title="Registrar lectura"
                  icon={Icons.camera}
                  onPress={() =>
                    router.push({
                      pathname: "/lectura/[codigo]",
                      params: { codigo: codigoMedidor },
                    })
                  }
                />
              </Card>
            )}

            <Card style={{ gap: 12 }}>
              <View className="flex-row items-center justify-between gap-2">
                <View className="min-w-0 flex-1">
                  <Text className="text-[14px] font-extrabold text-brand-text">
                    Historial del medidor
                  </Text>
                  <Text className="text-[11px] text-brand-muted">
                    Todas las lecturas del medidor
                  </Text>
                </View>
                <AppIcon name={Icons.history} size={18} color={Brand.primary} />
              </View>

              {historialMedidor.length === 0 ? (
                <Text className="text-[11px] leading-[17px] text-brand-muted">
                  Todavía no hay lecturas para este medidor.
                </Text>
              ) : (
                <View className="gap-2.5">
                  {historialMedidor.map((item) => (
                    <View key={item.id} className="overflow-hidden">
                      <LecturaCard
                        item={item}
                        onEditar={
                          "enviadoEn" in item
                            ? undefined
                            : item.estadoSync === "pendiente"
                              ? () =>
                                  router.push({
                                    pathname: "/lectura/[codigo]",
                                    params: {
                                      codigo: codigoMedidor,
                                      lecturaId: item.id,
                                    },
                                  })
                              : undefined
                        }
                      />
                    </View>
                  ))}
                </View>
              )}
            </Card>

            <Card style={{ gap: 6 }}>
              <Text className="mb-0.5 text-[12px] font-extrabold text-brand-text">
                Qué pide cada estado (R5)
              </Text>
              <Regla icon={Icons.check} texto="Normal: lectura obligatoria." />
              <Regla
                icon={Icons.block}
                texto="Inaccesible: motivo obligatorio y sin lectura."
              />
              <Regla
                icon={Icons.waterDamage}
                texto="Dañado: descripción y foto; lectura opcional."
              />
            </Card>
          </>
        )}
      </ScrollView>
    </View>
  );
}

function Regla({
  icon,
  texto,
}: {
  icon: (typeof Icons)[keyof typeof Icons];
  texto: string;
}) {
  return (
    <View className="flex-row items-center gap-[7px]">
      <AppIcon name={icon} size={15} color={Brand.primary} />
      <Text className="flex-1 text-[11px] text-brand-muted">{texto}</Text>
    </View>
  );
}
