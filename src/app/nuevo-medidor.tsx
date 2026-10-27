import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Keyboard, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppButton } from '@/components/ui/app-button';
import { AppIcon } from '@/components/ui/app-icon';
import { AppInput } from '@/components/ui/app-input';
import { Card } from '@/components/ui/card';
import { ScreenHeader } from '@/components/ui/screen-header';
import { SectionTitle } from '@/components/ui/section-title';
import { Segmented } from '@/components/ui/segmented';
import { Brand, Radius, Shadows } from '@/constants/brand';
import { Icons } from '@/constants/icons';
import { CampoFecha } from '@/features/medidores/components/campo-fecha';
import { useNetworkStatus } from '@/hooks/use-network-status';
import { crearMedidor } from '@/services/api';
import { ApiError } from '@/services/apiError';
import { fechaISO } from '@/utils/format';
import { esCodigoValido, normalizarCodigo, numeroDesdeTexto } from '@/utils/validators';

interface Formulario {
  codigo: string;
  direccion: string;
  sector: string;
  cuenta: string;
  estado: 'activo' | 'suspendido';
  ultimaLectura: string;
  fechaUltimaLectura: string;
  promedioMensual: string;
}

const INICIAL: Formulario = {
  codigo: '',
  direccion: '',
  sector: '',
  cuenta: '',
  estado: 'activo',
  ultimaLectura: '',
  fechaUltimaLectura: fechaISO(new Date()),
  promedioMensual: '',
};

/** Alta de un medidor nuevo en la ruta; se guarda en el MockAPI real. */
export default function NuevoMedidorScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const queryClient = useQueryClient();
  const { online } = useNetworkStatus();
  const [form, setForm] = useState<Formulario>(INICIAL);
  const [errores, setErrores] = useState<Record<string, string>>({});
  const [errorGeneral, setErrorGeneral] = useState('');
  const [guardando, setGuardando] = useState(false);

  const volver = () => {
    if (router.canGoBack()) router.back();
    else router.replace('/rutas');
  };

  const setCampo = <K extends keyof Formulario>(campo: K, valor: Formulario[K]) => {
    setForm((previo) => ({ ...previo, [campo]: valor }));
    setErrores((previos) => ({ ...previos, [campo]: '' }));
    setErrorGeneral('');
  };

  const validar = () => {
    const encontrados: Record<string, string> = {};

    if (!esCodigoValido(form.codigo)) {
      encontrados.codigo = 'Usa el formato MED- seguido de 6 dígitos.';
    }
    if (form.direccion.trim().length < 5) {
      encontrados.direccion = 'Escribe la dirección completa.';
    }
    if (form.sector.trim().length < 3) {
      encontrados.sector = 'Escribe el sector o parroquia.';
    }
    if (!/^\d{6,12}$/.test(form.cuenta.trim())) {
      encontrados.cuenta = 'La cuenta debe tener entre 6 y 12 dígitos.';
    }
    const ultima = numeroDesdeTexto(form.ultimaLectura);
    if (ultima === null || ultima < 0) {
      encontrados.ultimaLectura = 'Ingresa la última lectura en m³.';
    }
    if (!form.fechaUltimaLectura) {
      encontrados.fechaUltimaLectura = 'Selecciona la fecha de la última lectura.';
    }
    const promedio = numeroDesdeTexto(form.promedioMensual);
    if (promedio === null || promedio <= 0) {
      encontrados.promedioMensual = 'El promedio debe ser mayor a 0.';
    }

    setErrores(encontrados);
    return Object.keys(encontrados).length === 0;
  };

  const guardar = async () => {
    Keyboard.dismiss();
    if (!validar()) return;

    if (!online) {
      setErrorGeneral('Necesitas conexión para dar de alta un medidor. Se guarda en MockAPI.');
      return;
    }

    setGuardando(true);
    setErrorGeneral('');
    try {
      const medidor = await crearMedidor({
        codigo: normalizarCodigo(form.codigo),
        direccion: form.direccion.trim(),
        sector: form.sector.trim(),
        cuenta: form.cuenta.trim(),
        estado: form.estado,
        ultimaLectura: numeroDesdeTexto(form.ultimaLectura) ?? 0,
        fechaUltimaLectura: form.fechaUltimaLectura,
        promedioMensual: numeroDesdeTexto(form.promedioMensual) ?? 0,
      });

      await queryClient.invalidateQueries({ queryKey: ['medidores'] });
      setForm(INICIAL);

      Alert.alert(
        'Medidor agregado',
        `${medidor.codigo} ya está en tu ruta y guardado en el teléfono.`,
        [
          { text: 'Volver a mi ruta', onPress: () => router.replace('/rutas') },
          {
            text: 'Ver medidor',
            onPress: () =>
              router.replace({ pathname: '/medidor/[codigo]', params: { codigo: medidor.codigo } }),
          },
        ],
        { cancelable: false },
      );
    } catch (error) {
      if (error instanceof ApiError && error.codigo === 'DUPLICADA') {
        setErrores((previos) => ({ ...previos, codigo: error.message }));
      } else {
        setErrorGeneral('No se pudo crear el medidor. Revisa la conexión e intenta de nuevo.');
      }
    } finally {
      setGuardando(false);
    }
  };

  return (
    <View style={styles.screen}>
      <ScreenHeader title="Nuevo medidor" subtitle="Alta en la ruta" onBack={volver} />

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: 132 + insets.bottom }]}
        keyboardShouldPersistTaps="handled">
        <Card style={styles.intro}>
          <View style={styles.introHeader}>
            <AppIcon name={Icons.add} size={18} color={Brand.primary} />
            <Text style={styles.introTitle}>Datos del medidor</Text>
          </View>
          <Text style={styles.introText}>
            Se crea en MockAPI y queda disponible en Mi ruta y sin conexión. El código no puede
            repetirse.
          </Text>
        </Card>

        <View style={styles.section}>
          <SectionTitle index="1" title="Identificación" subtitle="Código, dirección y cuenta" />
          <AppInput
            label="Código del medidor"
            value={form.codigo}
            onChangeText={(valor) => setCampo('codigo', valor.toUpperCase())}
            placeholder="MED-100009"
            autoCapitalize="characters"
            autoCorrect={false}
            maxLength={10}
            error={errores.codigo}
            hint="Formato: MED- seguido de 6 dígitos"
          />
          <AppInput
            label="Dirección"
            value={form.direccion}
            onChangeText={(valor) => setCampo('direccion', valor)}
            placeholder="Ej. Av. Amazonas N34-120"
            error={errores.direccion}
          />
          <AppInput
            label="Sector / Parroquia"
            value={form.sector}
            onChangeText={(valor) => setCampo('sector', valor)}
            placeholder="Iñaquito"
            error={errores.sector}
          />
          <AppInput
            label="N.º de cuenta"
            value={form.cuenta}
            onChangeText={(valor) => setCampo('cuenta', valor.replace(/\D/g, ''))}
            placeholder="0012345686"
            keyboardType="number-pad"
            maxLength={12}
            error={errores.cuenta}
            hint="Entre 6 y 12 dígitos"
          />
        </View>

        <View style={styles.section}>
          <SectionTitle index="2" title="Servicio" subtitle="Estado y última lectura registrada" />
          <Segmented
            value={form.estado}
            onChange={(valor) => setCampo('estado', valor as Formulario['estado'])}
            options={[
              { key: 'activo', label: 'Activo' },
              { key: 'suspendido', label: 'Suspendido' },
            ]}
          />
          <AppInput
            label="Última lectura (m³)"
            value={form.ultimaLectura}
            onChangeText={(valor) => setCampo('ultimaLectura', valor)}
            placeholder="Ej. 320"
            keyboardType="decimal-pad"
            error={errores.ultimaLectura}
            hint="Lectura que dejó el mes anterior"
          />
          <CampoFecha
            label="Fecha de la última lectura"
            value={form.fechaUltimaLectura}
            onChange={(iso) => setCampo('fechaUltimaLectura', iso)}
            error={errores.fechaUltimaLectura}
            hint="Toca el campo para abrir el calendario"
          />
          <AppInput
            label="Promedio mensual (m³)"
            value={form.promedioMensual}
            onChangeText={(valor) => setCampo('promedioMensual', valor)}
            placeholder="Ej. 18"
            keyboardType="decimal-pad"
            error={errores.promedioMensual}
            hint="Se usa para la alerta de consumo anómalo (R6)"
          />
        </View>

        {errorGeneral ? (
          <View style={styles.errorBox}>
            <AppIcon name={Icons.error} size={17} color={Brand.danger} />
            <Text style={styles.errorText}>{errorGeneral}</Text>
          </View>
        ) : null}

        <Text style={styles.footerNote}>
          El alta se envía a MockAPI. Si no hay señal, espera a recuperar la conexión.
        </Text>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 12 }]}>
        <AppButton
          title="Guardar medidor"
          icon={Icons.save}
          loading={guardando}
          disabled={!online}
          onPress={() => void guardar()}
        />
        {!online ? (
          <Text style={styles.offline}>Sin conexión: no se puede dar de alta hasta recuperar la señal.</Text>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: 'transparent' },
  content: { paddingHorizontal: 16, paddingTop: 14, gap: 18 },
  intro: { gap: 4 },
  introHeader: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  introTitle: { fontSize: 14, fontWeight: '800', color: Brand.text },
  introText: { fontSize: 12, lineHeight: 17, color: Brand.textMuted },
  section: { gap: 11 },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    backgroundColor: 'rgba(179,38,30,0.07)',
    borderWidth: 1,
    borderColor: 'rgba(179,38,30,0.22)',
    borderRadius: Radius.sm,
    padding: 11,
  },
  errorText: { flex: 1, fontSize: 12, color: Brand.danger, fontWeight: '600' },
  footerNote: { fontSize: 10, color: Brand.textMuted, textAlign: 'center', fontStyle: 'italic' },
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
    gap: 6,
    ...Shadows.floating,
  },
  offline: { fontSize: 10, color: Brand.offline, textAlign: 'center', fontWeight: '600' },
});
