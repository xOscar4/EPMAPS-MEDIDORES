import { Redirect, useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
    ActivityIndicator,
    ScrollView,
    Text,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AppButton } from "@/components/ui/app-button";
import { AppDialog } from "@/components/ui/app-dialog";
import { AppIcon } from "@/components/ui/app-icon";
import { AppInput } from "@/components/ui/app-input";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { ScreenHeader } from "@/components/ui/screen-header";
import { SectionTitle } from "@/components/ui/section-title";
import { Brand, Shadows } from "@/constants/brand";
import { Icons } from "@/constants/icons";
import { useAuth } from "@/features/auth/auth-provider";
import { ConsumoResumen } from "@/features/lecturas/components/consumo-resumen";
import { EstadoPicker } from "@/features/lecturas/components/estado-picker";
import { MedidorResumen } from "@/features/lecturas/components/medidor-resumen";
import { PhotoPicker } from "@/features/lecturas/components/photo-picker";
import { useLecturaForm } from "@/features/lecturas/use-lectura-form";
import { CampoFecha } from "@/features/medidores/components/campo-fecha";
import { useNetworkStatus } from "@/hooks/use-network-status";
import { formatearFechaHora, formatearNumero } from "@/utils/format";
import {
    esCodigoValido,
    normalizarCodigo,
    numeroDesdeTexto,
} from "@/utils/validators";

export default function LecturaScreen() {
  const { codigo, lecturaId, continuar } = useLocalSearchParams<{
    codigo: string;
    lecturaId?: string;
    continuar?: string;
  }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { online } = useNetworkStatus();
  const { usuario, cargando: cargandoSesion, emailVerificado } = useAuth();
  const [guardadoVisible, setGuardadoVisible] = useState(false);
  const [errorFormulario, setErrorFormulario] = useState<string | null>(null);
  const codigoMedidor = normalizarCodigo(codigo ?? "");
  const {
    form,
    setCampo,
    errores,
    cargando,
    guardando,
    medidor,
    medidorQuery,
    existente,
    noEncontrada,
    borrador,
    continuarBorrador,
    descartarBorrador,
    consumo,
    anomalia,
    lecturaMenor,
    fotoRequerida,
    guardarLectura,
  } = useLecturaForm(codigoMedidor, lecturaId, continuar === "1");

  if (cargandoSesion) return null;
  if (!usuario) return <Redirect href="/" />;
  if (!emailVerificado) return <Redirect href="/verificar-correo" />;

  const volver = () => {
    if (router.canGoBack()) router.back();
    else router.replace("/rutas");
  };

  const guardar = async () => {
    const resultado = await guardarLectura();
    if (!resultado.ok) {
      setErrorFormulario(resultado.mensaje ?? "Faltan datos obligatorios.");
      return;
    }
    setGuardadoVisible(true);
  };

  const mensajeGuardado = online
    ? existente
      ? "La corrección quedó guardada y la app la envía a la oficina automáticamente. En Historial verás el estado del envío."
      : "Quedó guardada y la app la envía a la oficina automáticamente. En Historial verás el estado del envío."
    : existente
      ? "La corrección quedó en tu teléfono y se enviará sola cuando vuelva la señal."
      : "Quedó en tu teléfono y se enviará sola cuando vuelva la señal. Hasta que la oficina la confirme, figura como pendiente en Historial.";

  const Regresar = (
    <View className="flex-1 bg-transparent">
      <ScreenHeader
        title="Registrar lectura"
        subtitle={codigoMedidor}
        onBack={volver}
      />
      <EmptyState
        icon={Icons.info}
        title="No se puede abrir el formulario"
        message="El código del medidor no es válido. Vuelve a la ruta y selecciona un medidor."
      />
      <View className="px-4">
        <AppButton
          title="Volver a mi ruta"
          variant="secondary"
          onPress={() => router.replace("/rutas")}
        />
      </View>
    </View>
  );

  if (!esCodigoValido(codigoMedidor)) return Regresar;

  if (cargando) {
    return (
      <View className="flex-1 bg-transparent">
        <ScreenHeader
          title="Registrar lectura"
          subtitle={codigoMedidor}
          onBack={volver}
        />
        <View className="items-center gap-2 py-[60px]">
          <ActivityIndicator color={Brand.primary} />
          <Text className="text-[12px] font-semibold text-brand-muted">
            Preparando el formulario…
          </Text>
        </View>
      </View>
    );
  }

  if (noEncontrada) {
    return (
      <View className="flex-1 bg-transparent">
        <ScreenHeader
          title="Corregir lectura"
          subtitle={codigoMedidor}
          onBack={volver}
        />
        <EmptyState
          icon={Icons.verified}
          title="Esa lectura ya no está pendiente"
          message="Pudo haberse enviado o descartado. Revisa el historial para ver su estado actual."
        />
        <View className="px-4">
          <AppButton
            title="Ver historial"
            variant="secondary"
            onPress={() => router.replace("/historial")}
          />
        </View>
      </View>
    );
  }

  if (!medidor) {
    return (
      <View className="flex-1 bg-transparent">
        <ScreenHeader
          title="Registrar lectura"
          subtitle={codigoMedidor}
          onBack={volver}
        />
        <EmptyState
          icon={Icons.cloudOff}
          title="Sin datos del medidor"
          message="No hay una copia guardada de este medidor. Consulta el detalle con señal antes de registrar."
        />
        <View className="px-4">
          <AppButton
            title="Reintentar"
            icon={Icons.refresh}
            variant="secondary"
            onPress={() => void medidorQuery.refetch()}
          />
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-transparent">
      <ScreenHeader
        title={existente ? "Corregir lectura" : "Registrar lectura"}
        subtitle={`${medidor.codigo} · ${medidor.sector}`}
        onBack={volver}
      />

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 14,
          paddingBottom: 130 + insets.bottom,
          gap: 18,
        }}
      >
        {borrador ? (
          <Card
            style={{ gap: 9, borderColor: "rgba(214,138,0,0.55)", borderWidth: 1.5 }}
          >
            <View className="flex-row items-center gap-2.5">
              <AppIcon name={Icons.timer} size={20} color={Brand.warning} />
              <View className="flex-1 gap-px">
                <Text className="text-[14px] font-extrabold text-brand-text">
                  Tienes un borrador sin terminar
                </Text>
                <Text className="text-[11px] text-brand-muted">
                  Guardado el {formatearFechaHora(borrador.actualizadoEn)}
                </Text>
              </View>
            </View>
            <Text className="text-[12px] leading-[18px] text-brand-muted">
              Puedes continuar con los datos que ya ingresaste o descartarlo y
              empezar de nuevo.
            </Text>
            <AppButton
              title="Continuar con mis datos"
              onPress={continuarBorrador}
            />
            <AppButton
              title="Descartar borrador"
              variant="ghost"
              onPress={() => void descartarBorrador()}
            />
          </Card>
        ) : null}

        <MedidorResumen medidor={medidor} porEnviar={Boolean(existente)} />

        <View className="gap-[11px]">
          <SectionTitle
            index="1"
            title="Estado del medidor"
            subtitle="Obligatorio · R5"
          />
          <EstadoPicker
            value={form.estado}
            onChange={(valor) => setCampo("estado", valor)}
            error={errores.estado}
          />
        </View>

        <View className="gap-[11px]">
          <SectionTitle index="2" title="Fecha de lectura" subtitle="R10" />
          <CampoFecha
            label="Fecha de la lectura"
            value={form.fechaLectura}
            onChange={(valor) => setCampo("fechaLectura", valor)}
            error={errores.fechaLectura}
            hint="La lectura se valida por mes y año para evitar duplicados del mismo medidor."
          />
        </View>

        <View className="gap-[11px]">
          <SectionTitle
            index="3"
            title={
              form.estado === "inaccesible" ? "Motivo" : "Datos de la lectura"
            }
            subtitle={
              form.estado === "danado"
                ? "Descripción obligatoria, lectura opcional"
                : form.estado === "inaccesible"
                  ? "Explica por qué no pudiste leer"
                  : "Lectura actual del medidor"
            }
          />

          {form.estado === "inaccesible" ? (
            <AppInput
              label="Motivo de inaccesibilidad"
              value={form.motivo}
              onChangeText={(valor) => setCampo("motivo", valor)}
              placeholder="Ej. Caja bajo la calzada cubierta de agua"
              error={errores.motivo}
              hint="El consumo no se calcula para un medidor inaccesible."
              multiline
              style={{ minHeight: 78, textAlignVertical: "top" }}
            />
          ) : (
            <>
              <AppInput
                label={
                  form.estado === "danado"
                    ? "Lectura actual (opcional)"
                    : "Lectura actual (m³)"
                }
                value={form.lectura}
                onChangeText={(valor) => setCampo("lectura", valor)}
                placeholder="Ej. 263"
                keyboardType="decimal-pad"
                error={errores.lectura}
                hint={`Última lectura: ${formatearNumero(medidor.ultimaLectura, 0)} m³`}
              />
              {form.estado === "danado" ? (
                <AppInput
                  label="Descripción del daño"
                  value={form.descripcion}
                  onChangeText={(valor) => setCampo("descripcion", valor)}
                  placeholder="Ej. Tapa rota y carátula ilegible"
                  error={errores.descripcion}
                  multiline
                  style={{ minHeight: 78, textAlignVertical: "top" }}
                />
              ) : null}
            </>
          )}
        </View>

        <View className="gap-[11px]">
          <SectionTitle
            index="4"
            title="Consumo del mes"
            subtitle="Calculado automáticamente · R6"
          />
          <ConsumoResumen
            lectura={
              form.estado === "inaccesible"
                ? null
                : numeroDesdeTexto(form.lectura)
            }
            anterior={medidor.ultimaLectura}
            promedio={medidor.promedioMensual}
            consumo={consumo}
            anomalia={anomalia}
            lecturaMenor={lecturaMenor}
            inaccesible={form.estado === "inaccesible"}
            confirmado={form.confirmoAnomalia}
            onConfirmar={() =>
              setCampo("confirmoAnomalia", !form.confirmoAnomalia)
            }
            error={errores.confirmacion}
          />
        </View>

        <View className="gap-[11px]">
          <SectionTitle index="5" title="Respaldo fotográfico" subtitle="R7" />
          <PhotoPicker
            fotoUri={form.fotoUri}
            requerida={fotoRequerida}
            error={errores.foto}
            onChange={(uri) => setCampo("fotoUri", uri)}
          />
        </View>

        {!existente ? (
          <Text className="text-center text-[10px] italic text-brand-muted">
            Borrador automático activo: si cierras la app, podrás continuar
            donde lo dejaste.
          </Text>
        ) : (
          <Text className="text-center text-[10px] italic text-brand-muted">
            Estás corrigiendo una lectura que aún no se ha enviado.
          </Text>
        )}
      </ScrollView>

      <View
        className="absolute bottom-0 left-0 right-0 gap-2 border-t border-brand-glass-border bg-white px-4 pt-2.5"
        style={[Shadows.floating, { paddingBottom: insets.bottom + 12 }]}
      >
        <View className="flex-row items-center gap-[5px]">
          <AppIcon
            name={online ? Icons.cloudDone : Icons.cloudOff}
            size={13}
            color={online ? Brand.primary : Brand.textMuted}
          />
          <Text className="flex-1 text-[10px] text-brand-muted">
            {online
              ? "Se guarda en el teléfono y se envía a la oficina."
              : "Se guarda en el teléfono y se envía sola al volver la señal."}
          </Text>
        </View>
        <AppButton
          title={existente ? "Guardar corrección" : "Guardar lectura"}
          icon={Icons.check}
          loading={guardando}
          onPress={() => void guardar()}
        />
      </View>

      <AppDialog
        visible={guardadoVisible}
        icon={Icons.verified}
        tone="success"
        title={existente ? "Corrección guardada" : "Lectura guardada"}
        message={mensajeGuardado}
        primaryLabel="Seguir en la ruta"
        onPrimary={() => router.replace("/rutas")}
        secondaryLabel="Ver historial"
        onSecondary={() => router.replace("/historial")}
        onRequestClose={() => router.replace("/rutas")}
      />

      <AppDialog
        visible={errorFormulario !== null}
        icon={Icons.warning}
        tone="warning"
        title="Revisa el formulario"
        message={errorFormulario ?? ""}
        primaryLabel="Entendido"
        onPrimary={() => setErrorFormulario(null)}
        onRequestClose={() => setErrorFormulario(null)}
      />
    </View>
  );
}

