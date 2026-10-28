import { useLocalSearchParams, useRouter } from "expo-router";
import {
    ActivityIndicator,
    ScrollView,
    StyleSheet,
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
import { Brand, Radius } from "@/constants/brand";
import { Icons } from "@/constants/icons";
import { useLecturaDelMes } from "@/features/lecturas/hooks";
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
  const codigoMedidor = normalizarCodigo(codigo ?? "");
  const consulta = useMedidor(codigoMedidor);
  const { pendiente, enviada } = useLecturaDelMes(codigoMedidor);
  const valido = esCodigoValido(codigoMedidor);
  const periodo = periodoActual();

  const volver = () => {
    if (router.canGoBack()) router.back();
    else router.replace("/rutas");
  };

  return (
    <View style={styles.screen}>
      <ScreenHeader
        title="Detalle del medidor"
        subtitle={codigoMedidor}
        onBack={volver}
      />
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: 28 + insets.bottom },
        ]}
      >
        {!valido ? (
          <EmptyState
            icon={Icons.error}
            title="Código inválido"
            message="El código debe tener el formato MED-000000. No se consultó el servidor."
          />
        ) : consulta.isLoading ? (
          <View style={styles.loading}>
            <ActivityIndicator color={Brand.primary} />
            <Text style={styles.loadingText}>Consultando el medidor…</Text>
          </View>
        ) : consulta.isError || !consulta.data ? (
          <View style={styles.errorBox}>
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

            <View style={styles.sectionRow}>
              <SectionTitle
                index="2"
                title="Lectura del mes"
                subtitle={formatearPeriodo(periodo)}
              />
            </View>

            {enviada ? (
              <Card style={styles.stateCard}>
                <View style={styles.stateHeader}>
                  <View
                    style={[
                      styles.stateIcon,
                      { backgroundColor: Brand.successSoft },
                    ]}
                  >
                    <AppIcon
                      name={Icons.verified}
                      size={22}
                      color={Brand.success}
                    />
                  </View>
                  <View style={styles.stateTexts}>
                    <Text style={styles.stateTitle}>Lectura enviada</Text>
                    <Text style={styles.stateSub}>
                      Recibida en MockAPI el{" "}
                      {formatearFechaHora(enviada.enviadoEn)}
                    </Text>
                  </View>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Lectura</Text>
                  <Text style={styles.infoValue}>
                    {enviada.lectura !== null
                      ? `${formatearNumero(enviada.lectura)} m³`
                      : "Sin lectura"}
                  </Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Consumo</Text>
                  <Text style={styles.infoValue}>
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
                <Text style={styles.locked}>
                  R10: esta lectura ya está guardada en el servidor y es de solo
                  lectura. Si tiene un error, la oficina debe anularla y el
                  técnico registra una nueva.
                </Text>
              </Card>
            ) : pendiente ? (
              <Card style={styles.stateCard}>
                <View style={styles.stateHeader}>
                  <View
                    style={[
                      styles.stateIcon,
                      { backgroundColor: Brand.warningSoft },
                    ]}
                  >
                    <AppIcon
                      name={Icons.pending}
                      size={22}
                      color={Brand.warning}
                    />
                  </View>
                  <View style={styles.stateTexts}>
                    <Text style={styles.stateTitle}>
                      {pendiente.estadoSync === "error"
                        ? "Lectura con conflicto"
                        : "Lectura pendiente de envío y verificación"}
                    </Text>
                    <Text style={styles.stateSub}>
                      Registrada el {formatearFechaHora(pendiente.creadoEn)}
                    </Text>
                  </View>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Lectura</Text>
                  <Text style={styles.infoValue}>
                    {pendiente.lectura !== null
                      ? `${formatearNumero(pendiente.lectura)} m³`
                      : "Inaccesible"}
                  </Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Consumo</Text>
                  <Text style={styles.infoValue}>
                    {formatearNumero(pendiente.consumo)} m³
                  </Text>
                </View>
                {pendiente.error ? (
                  <Text style={styles.errorText}>{pendiente.error}</Text>
                ) : null}
                {pendiente.estadoSync === "error" ? (
                  <AppButton
                    title="Revisar en el historial"
                    icon={Icons.history}
                    variant="secondary"
                    onPress={() => router.replace("/historial")}
                  />
                ) : pendiente.estadoSync === "enviando" ? (
                  <Text style={styles.sending}>
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
              <Card style={styles.stateCard}>
                <View style={styles.stateHeader}>
                  <View
                    style={[
                      styles.stateIcon,
                      { backgroundColor: Brand.primaryLight },
                    ]}
                  >
                    <AppIcon
                      name={Icons.speed}
                      size={22}
                      color={Brand.primary}
                    />
                  </View>
                  <View style={styles.stateTexts}>
                    <Text style={styles.stateTitle}>Sin lectura este mes</Text>
                    <Text style={styles.stateSub}>
                      Registra la lectura del medidor durante la visita.
                    </Text>
                  </View>
                </View>
                {consulta.data.estado === "suspendido" ? (
                  <Text style={styles.suspended}>
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

            <Card style={styles.rulesCard}>
              <Text style={styles.rulesTitle}>Qué pide cada estado (R5)</Text>
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
    <View style={styles.regla}>
      <AppIcon name={icon} size={15} color={Brand.primary} />
      <Text style={styles.reglaText}>{texto}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "transparent" },
  content: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 30,
    gap: 14,
  },
  loading: { alignItems: "center", paddingVertical: 50, gap: 8 },
  loadingText: { fontSize: 12, color: Brand.textMuted, fontWeight: "600" },
  errorBox: { gap: 10 },
  sectionRow: { marginTop: 4 },
  stateCard: { gap: 10 },
  stateHeader: { flexDirection: "row", alignItems: "center", gap: 11 },
  stateIcon: {
    width: 46,
    height: 46,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: Brand.glassBorder,
    alignItems: "center",
    justifyContent: "center",
  },
  stateTexts: { flex: 1, gap: 2 },
  stateTitle: { fontSize: 15, fontWeight: "800", color: Brand.text },
  stateSub: { fontSize: 11, color: Brand.textMuted },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  infoLabel: { fontSize: 11, color: Brand.textMuted, fontWeight: "600" },
  infoValue: { fontSize: 13, fontWeight: "800", color: Brand.text },
  locked: {
    fontSize: 10,
    lineHeight: 16,
    color: Brand.success,
    backgroundColor: Brand.successSoft,
    borderWidth: 1,
    borderColor: "rgba(23,164,106,0.18)",
    borderRadius: Radius.sm,
    padding: 10,
  },
  errorText: { fontSize: 11, color: Brand.danger, fontWeight: "600" },
  sending: {
    fontSize: 11,
    color: Brand.primary,
    backgroundColor: "rgba(13,94,140,0.08)",
    borderWidth: 1,
    borderColor: "rgba(13,94,140,0.16)",
    borderRadius: Radius.sm,
    padding: 10,
    fontWeight: "600",
  },
  suspended: {
    fontSize: 11,
    color: Brand.warning,
    backgroundColor: Brand.warningSoft,
    borderWidth: 1,
    borderColor: "rgba(214,138,0,0.22)",
    borderRadius: Radius.sm,
    padding: 10,
    fontWeight: "600",
  },
  rulesCard: { gap: 6 },
  rulesTitle: {
    fontSize: 12,
    fontWeight: "800",
    color: Brand.text,
    marginBottom: 2,
  },
  regla: { flexDirection: "row", alignItems: "center", gap: 7 },
  reglaText: { flex: 1, fontSize: 11, color: Brand.textMuted },
});
