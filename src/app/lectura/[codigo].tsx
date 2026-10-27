import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppButton } from '@/components/ui/app-button';
import { AppDialog } from '@/components/ui/app-dialog';
import { AppIcon } from '@/components/ui/app-icon';
import { AppInput } from '@/components/ui/app-input';
import { Card } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { ScreenHeader } from '@/components/ui/screen-header';
import { SectionTitle } from '@/components/ui/section-title';
import { Brand, Shadows } from '@/constants/brand';
import { Icons } from '@/constants/icons';
import { ConsumoResumen } from '@/features/lecturas/components/consumo-resumen';
import { EstadoPicker } from '@/features/lecturas/components/estado-picker';
import { MedidorResumen } from '@/features/lecturas/components/medidor-resumen';
import { PhotoPicker } from '@/features/lecturas/components/photo-picker';
import { useLecturaForm } from '@/features/lecturas/use-lectura-form';
import { useNetworkStatus } from '@/hooks/use-network-status';
import { formatearFechaHora, formatearNumero } from '@/utils/format';
import { esCodigoValido, normalizarCodigo, numeroDesdeTexto } from '@/utils/validators';

export default function LecturaScreen() {
  const { codigo, lecturaId, continuar } = useLocalSearchParams<{
    codigo: string;
    lecturaId?: string;
    continuar?: string;
  }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { online } = useNetworkStatus();
  const [guardadoVisible, setGuardadoVisible] = useState(false);
  const [errorFormulario, setErrorFormulario] = useState<string | null>(null);
  const codigoMedidor = normalizarCodigo(codigo ?? '');
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
  } = useLecturaForm(codigoMedidor, lecturaId, continuar === '1');

  const volver = () => {
    if (router.canGoBack()) router.back();
    else router.replace('/rutas');
  };

  const guardar = async () => {
    const resultado = await guardarLectura();
    if (!resultado.ok) {
      setErrorFormulario(resultado.mensaje ?? 'Faltan datos obligatorios.');
      return;
    }
    setGuardadoVisible(true);
  };

  const mensajeGuardado = online
    ? existente
      ? 'La corrección quedó guardada y la app la envía a la oficina automáticamente. En Historial verás el estado del envío.'
      : 'Quedó guardada y la app la envía a la oficina automáticamente. En Historial verás el estado del envío.'
    : existente
      ? 'La corrección quedó en tu teléfono y se enviará sola cuando vuelva la señal.'
      : 'Quedó en tu teléfono y se enviará sola cuando vuelva la señal. Hasta que la oficina la confirme, figura como pendiente en Historial.';

  const Regresar = (
    <View style={styles.screen}>
      <ScreenHeader title="Registrar lectura" subtitle={codigoMedidor} onBack={volver} />
      <EmptyState
        icon={Icons.info}
        title="No se puede abrir el formulario"
        message="El código del medidor no es válido. Vuelve a la ruta y selecciona un medidor."
      />
      <View style={styles.simpleAction}>
        <AppButton title="Volver a mi ruta" variant="secondary" onPress={() => router.replace('/rutas')} />
      </View>
    </View>
  );

  if (!esCodigoValido(codigoMedidor)) return Regresar;

  if (cargando) {
    return (
      <View style={styles.screen}>
        <ScreenHeader title="Registrar lectura" subtitle={codigoMedidor} onBack={volver} />
        <View style={styles.loading}>
          <ActivityIndicator color={Brand.primary} />
          <Text style={styles.loadingText}>Preparando el formulario…</Text>
        </View>
      </View>
    );
  }

  if (noEncontrada) {
    return (
      <View style={styles.screen}>
        <ScreenHeader title="Corregir lectura" subtitle={codigoMedidor} onBack={volver} />
        <EmptyState
          icon={Icons.verified}
          title="Esa lectura ya no está pendiente"
          message="Pudo haberse enviado o descartado. Revisa el historial para ver su estado actual."
        />
        <View style={styles.simpleAction}>
          <AppButton title="Ver historial" variant="secondary" onPress={() => router.replace('/historial')} />
        </View>
      </View>
    );
  }

  if (!medidor) {
    return (
      <View style={styles.screen}>
        <ScreenHeader title="Registrar lectura" subtitle={codigoMedidor} onBack={volver} />
        <EmptyState
          icon={Icons.cloudOff}
          title="Sin datos del medidor"
          message="No hay una copia guardada de este medidor. Consulta el detalle con señal antes de registrar."
        />
        <View style={styles.simpleAction}>
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
    <View style={styles.screen}>
      <ScreenHeader
        title={existente ? 'Corregir lectura' : 'Registrar lectura'}
        subtitle={`${medidor.codigo} · ${medidor.sector}`}
        onBack={volver}
      />

      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: 130 + insets.bottom }]}>
        {borrador ? (
          <Card style={styles.draftCard}>
            <View style={styles.draftHeader}>
              <AppIcon name={Icons.timer} size={20} color={Brand.warning} />
              <View style={styles.draftTexts}>
                <Text style={styles.draftTitle}>Tienes un borrador sin terminar</Text>
                <Text style={styles.draftSub}>Guardado el {formatearFechaHora(borrador.actualizadoEn)}</Text>
              </View>
            </View>
            <Text style={styles.draftBody}>
              Puedes continuar con los datos que ya ingresaste o descartarlo y empezar de nuevo.
            </Text>
            <AppButton title="Continuar con mis datos" onPress={continuarBorrador} />
            <AppButton title="Descartar borrador" variant="ghost" onPress={() => void descartarBorrador()} />
          </Card>
        ) : null}

        <MedidorResumen medidor={medidor} porEnviar={Boolean(existente)} />

        <View style={styles.section}>
          <SectionTitle index="1" title="Estado del medidor" subtitle="Obligatorio · R5" />
          <EstadoPicker value={form.estado} onChange={(valor) => setCampo('estado', valor)} error={errores.estado} />
        </View>

        <View style={styles.section}>
          <SectionTitle
            index="2"
            title={form.estado === 'inaccesible' ? 'Motivo' : 'Datos de la lectura'}
            subtitle={
              form.estado === 'danado'
                ? 'Descripción obligatoria, lectura opcional'
                : form.estado === 'inaccesible'
                  ? 'Explica por qué no pudiste leer'
                  : 'Lectura actual del medidor'
            }
          />

          {form.estado === 'inaccesible' ? (
            <AppInput
              label="Motivo de inaccesibilidad"
              value={form.motivo}
              onChangeText={(valor) => setCampo('motivo', valor)}
              placeholder="Ej. Caja bajo la calzada cubierta de agua"
              error={errores.motivo}
              hint="El consumo no se calcula para un medidor inaccesible."
              multiline
              style={styles.textArea}
            />
          ) : (
            <>
              <AppInput
                label={form.estado === 'danado' ? 'Lectura actual (opcional)' : 'Lectura actual (m³)'}
                value={form.lectura}
                onChangeText={(valor) => setCampo('lectura', valor)}
                placeholder="Ej. 263"
                keyboardType="decimal-pad"
                error={errores.lectura}
                hint={`Última lectura: ${formatearNumero(medidor.ultimaLectura, 0)} m³`}
              />
              {form.estado === 'danado' ? (
                <AppInput
                  label="Descripción del daño"
                  value={form.descripcion}
                  onChangeText={(valor) => setCampo('descripcion', valor)}
                  placeholder="Ej. Tapa rota y carátula ilegible"
                  error={errores.descripcion}
                  multiline
                  style={styles.textArea}
                />
              ) : null}
            </>
          )}
        </View>

        <View style={styles.section}>
          <SectionTitle index="3" title="Consumo del mes" subtitle="Calculado automáticamente · R6" />
          <ConsumoResumen
            lectura={form.estado === 'inaccesible' ? null : numeroDesdeTexto(form.lectura)}
            anterior={medidor.ultimaLectura}
            promedio={medidor.promedioMensual}
            consumo={consumo}
            anomalia={anomalia}
            lecturaMenor={lecturaMenor}
            inaccesible={form.estado === 'inaccesible'}
            confirmado={form.confirmoAnomalia}
            onConfirmar={() => setCampo('confirmoAnomalia', !form.confirmoAnomalia)}
            error={errores.confirmacion}
          />
        </View>

        <View style={styles.section}>
          <SectionTitle index="4" title="Respaldo fotográfico" subtitle="R7" />
          <PhotoPicker
            fotoUri={form.fotoUri}
            requerida={fotoRequerida}
            error={errores.foto}
            onChange={(uri) => setCampo('fotoUri', uri)}
          />
        </View>

        {!existente ? (
          <Text style={styles.draftNote}>
            Borrador automático activo: si cierras la app, podrás continuar donde lo dejaste.
          </Text>
        ) : (
          <Text style={styles.draftNote}>Estás corrigiendo una lectura que aún no se ha enviado.</Text>
        )}
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 12 }]}>
        <View style={styles.footerTexts}>
          <AppIcon
            name={online ? Icons.cloudDone : Icons.cloudOff}
            size={13}
            color={online ? Brand.primary : Brand.textMuted}
          />
          <Text style={styles.footerText}>
            {online
              ? 'Se guarda en el teléfono y se envía a la oficina.'
              : 'Se guarda en el teléfono y se envía sola al volver la señal.'}
          </Text>
        </View>
        <AppButton
          title={existente ? 'Guardar corrección' : 'Guardar lectura'}
          icon={Icons.check}
          loading={guardando}
          onPress={() => void guardar()}
        />
      </View>

      <AppDialog
        visible={guardadoVisible}
        icon={Icons.verified}
        tone="success"
        title={existente ? 'Corrección guardada' : 'Lectura guardada'}
        message={mensajeGuardado}
        primaryLabel="Seguir en la ruta"
        onPrimary={() => router.replace('/rutas')}
        secondaryLabel="Ver historial"
        onSecondary={() => router.replace('/historial')}
        onRequestClose={() => router.replace('/rutas')}
      />

      <AppDialog
        visible={errorFormulario !== null}
        icon={Icons.warning}
        tone="warning"
        title="Revisa el formulario"
        message={errorFormulario ?? ''}
        primaryLabel="Entendido"
        onPrimary={() => setErrorFormulario(null)}
        onRequestClose={() => setErrorFormulario(null)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: 'transparent' },
  content: { paddingHorizontal: 16, paddingTop: 14, gap: 18 },
  loading: { alignItems: 'center', paddingVertical: 60, gap: 8 },
  loadingText: { fontSize: 12, color: Brand.textMuted, fontWeight: '600' },
  simpleAction: { paddingHorizontal: 16 },
  section: { gap: 11 },
  draftCard: { gap: 9, borderColor: 'rgba(214,138,0,0.55)', borderWidth: 1.5 },
  draftHeader: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  draftTexts: { flex: 1, gap: 1 },
  draftTitle: { fontSize: 14, fontWeight: '800', color: Brand.text },
  draftSub: { fontSize: 11, color: Brand.textMuted },
  draftBody: { fontSize: 12, lineHeight: 18, color: Brand.textMuted },
  textArea: { minHeight: 78, textAlignVertical: 'top' },
  draftNote: { fontSize: 10, color: Brand.textMuted, textAlign: 'center', fontStyle: 'italic' },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: Brand.glassBorder,
    paddingHorizontal: 16,
    paddingTop: 10,
    gap: 8,
    ...Shadows.floating,
  },
  footerTexts: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  footerText: { flex: 1, fontSize: 10, color: Brand.textMuted },
});
