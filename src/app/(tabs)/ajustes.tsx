import Constants from 'expo-constants';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';

import { AppButton } from '@/components/ui/app-button';
import { AppIcon } from '@/components/ui/app-icon';
import { Card } from '@/components/ui/card';
import { Chip } from '@/components/ui/chip';
import { Brand, Radius, Shadows } from '@/constants/brand';
import { Icons } from '@/constants/icons';
import { useAuth } from '@/features/auth/auth-provider';
import { useOutbox } from '@/features/lecturas/outbox-provider';
import { useNetworkStatus } from '@/hooks/use-network-status';
import { MOCKAPI_URL } from '@/services/api';

export default function AjustesScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { tecnico, cerrarSesion } = useAuth();
  const { online } = useNetworkStatus();
  const { pendientes, conError, sincronizando, sincronizar } = useOutbox();
  const [actualizando, setActualizando] = useState(false);

  if (!tecnico) return null;

  const iniciales = tecnico.nombre
    .split(' ')
    .slice(0, 2)
    .map((parte) => parte.charAt(0))
    .join('');

  const actualizarDatos = async () => {
    if (!online) {
      Alert.alert('Sin conexión', 'Conéctate a internet para descargar datos nuevos. La copia guardada sigue disponible.');
      return;
    }
    setActualizando(true);
    await queryClient.invalidateQueries({ queryKey: ['medidores'] });
    await queryClient.invalidateQueries({ queryKey: ['lecturas'] });
    setActualizando(false);
    Alert.alert('Datos actualizados', 'La ruta y el historial quedaron guardados para consultarlos sin señal.');
  };

  const salir = () =>
    Alert.alert('Cerrar sesión', '¿Seguro que quieres cerrar la sesión de este teléfono?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Cerrar sesión',
        style: 'destructive',
        onPress: () => {
          void cerrarSesion();
          router.replace('/');
        },
      },
    ]);

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <LinearGradient
        colors={[Brand.deepStart, Brand.deepMid, Brand.deepEnd]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}>
        <View style={styles.headerBubble} />
        <View pointerEvents="none" style={styles.dropMark}>
          <AppIcon name={Icons.drop} size={150} color="#FFFFFF" />
        </View>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.eyebrow}>EPMAPS · CAMPO</Text>
            <Text style={styles.title}>Ajustes</Text>
            <Text style={styles.subtitle}>Cuenta, conexión y datos de la app</Text>
          </View>
          <View style={styles.headerIcon}>
            <AppIcon name={Icons.settings} size={24} color="#FFFFFF" />
          </View>
        </View>
      </LinearGradient>

      <View style={styles.body}>
        <Card style={styles.profile}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{iniciales}</Text>
          </View>
          <View style={styles.profileTexts}>
            <Text style={styles.name}>{tecnico.nombre}</Text>
            <Text style={styles.role}>Técnico de lecturas · {tecnico.codigo}</Text>
            <View style={styles.zoneRow}>
              <AppIcon name={Icons.route} size={13} color={Brand.primary} />
              <Text style={styles.zone}>{tecnico.zona}</Text>
            </View>
          </View>
          <Chip label="Sesión activa" tone="success" icon={Icons.verified} />
        </Card>

        <Text style={styles.sectionTitle}>Conexión y sincronización</Text>
        <Card style={styles.card}>
          <Row
            icon={online ? Icons.wifi : Icons.wifiOff}
            label="Conexión"
            value={online ? 'En línea' : 'Sin conexión'}
            tone={online ? 'success' : 'warning'}
          />
          <Row
            icon={Icons.pending}
            label="Lecturas por enviar"
            value={
              pendientes === 0 && conError === 0
                ? 'Todo sincronizado'
                : `${pendientes} en cola${conError > 0 ? ` · ${conError} con error` : ''}`
            }
            tone={pendientes === 0 && conError === 0 ? 'success' : 'warning'}
          />
          <Row icon={Icons.cloudDone} label="Caché de consultas" value="Guardada en el teléfono" />
          <View style={styles.actions}>
            <AppButton
              title={online ? 'Sincronizar ahora' : 'Esperando señal'}
              icon={Icons.sync}
              variant="secondary"
              loading={sincronizando}
              disabled={!online || pendientes === 0}
              onPress={() => void sincronizar()}
              style={styles.action}
            />
            <AppButton
              title="Actualizar datos"
              icon={Icons.refresh}
              variant="ghost"
              loading={actualizando}
              onPress={() => void actualizarDatos()}
              style={styles.action}
            />
          </View>
        </Card>

        <Text style={styles.sectionTitle}>Datos de demostración</Text>
        <Card style={styles.card}>
          <Row icon={Icons.person} label="Usuario" value="EMP-001 · epmaps2026" />
          <Row icon={Icons.warning} label="MED-100003" value="Consumo anómalo (> 3× promedio)" />
          <Row icon={Icons.waterDamage} label="MED-100004" value="Medidor dañado: exige foto" />
          <Row icon={Icons.pending} label="MED-100007" value="Servicio suspendido" />
        </Card>

        <Text style={styles.sectionTitle}>Acerca de</Text>
        <Card style={styles.card}>
          <Row icon={Icons.info} label="Versión" value={Constants.expoConfig?.version ?? '1.0.0'} />
          <Row icon={Icons.route} label="Sistema de oficina" value="MockAPI en la nube" />
          <Text style={styles.about}>
            Conectado a {MOCKAPI_URL}. Recursos medidores y lecturas. Sin señal se usa la copia
            guardada en el teléfono y las lecturas quedan en cola.
          </Text>
          <Text style={styles.about}>
            Las lecturas se guardan primero en el teléfono y se envían solas al recuperar la señal.
            Una lectura ya enviada no se puede editar (R10).
          </Text>
        </Card>

        <AppButton title="Cerrar sesión" icon={Icons.logout} variant="danger" onPress={salir} />
        <Text style={styles.footer}>ESFOT · Prueba I de desarrollo móvil · EPMAPS</Text>
      </View>
    </ScrollView>
  );
}

function Row({
  icon,
  label,
  value,
  tone,
}: {
  icon: (typeof Icons)[keyof typeof Icons];
  label: string;
  value: string;
  tone?: 'success' | 'warning';
}) {
  const color = tone === 'success' ? Brand.success : tone === 'warning' ? Brand.warning : Brand.text;
  return (
    <View style={styles.row}>
      <View style={[styles.rowIcon, tone === 'warning' && styles.rowIconWarning]}>
        <AppIcon name={icon} size={16} color={tone === 'warning' ? Brand.warning : Brand.primary} />
      </View>
      <View style={styles.rowTexts}>
        <Text style={styles.rowLabel}>{label}</Text>
        <Text style={[styles.rowValue, { color }]}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: 'transparent' },
  content: { paddingBottom: 34 },
  header: {
    marginHorizontal: 12,
    marginTop: 10,
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.22)',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 26,
    overflow: 'hidden',
    ...Shadows.card,
  },
  headerBubble: {
    position: 'absolute',
    right: -60,
    top: -70,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(27,184,198,0.26)',
  },
  dropMark: { position: 'absolute', right: -28, top: 16, opacity: 0.10 },
  headerTop: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' },
  eyebrow: { color: '#A9E7EE', fontSize: 10, fontWeight: '800', letterSpacing: 1.4 },
  title: { color: '#FFFFFF', fontSize: 28, fontWeight: '800', lineHeight: 34, letterSpacing: -0.4 },
  subtitle: { color: '#D6EAF3', fontSize: 12, marginTop: 2 },
  headerIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.16)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.28)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: { paddingHorizontal: 16, marginTop: 16, gap: 12 },
  profile: { flexDirection: 'row', alignItems: 'center', gap: 12, flexWrap: 'wrap' },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 18,
    backgroundColor: Brand.primary,
    borderWidth: 1,
    borderColor: Brand.glassBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: '#FFFFFF', fontSize: 18, fontWeight: '800' },
  profileTexts: { flex: 1, minWidth: 120, gap: 1 },
  name: { fontSize: 16, fontWeight: '800', color: Brand.text },
  role: { fontSize: 11, color: Brand.textMuted },
  zoneRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  zone: { fontSize: 10, fontWeight: '700', color: Brand.primary, flexShrink: 1 },
  sectionTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: Brand.primaryDark,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginTop: 8,
    marginLeft: 4,
  },
  card: { gap: 2 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 7 },
  rowIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: Brand.primaryLight,
    borderWidth: 1,
    borderColor: Brand.glassBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowIconWarning: { backgroundColor: Brand.warningSoft },
  rowTexts: { flex: 1, minWidth: 0, gap: 1 },
  rowLabel: { fontSize: 12, fontWeight: '600', color: Brand.text },
  rowValue: { fontSize: 11, fontWeight: '800' },
  actions: { gap: 10, marginTop: 6 },
  action: { minHeight: 46 },
  about: { fontSize: 11, lineHeight: 17, color: Brand.textMuted, marginTop: 4 },
  footer: { textAlign: 'center', fontSize: 10, color: Brand.textMuted, marginTop: 8 },
});
