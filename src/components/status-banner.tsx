import { LinearGradient } from 'expo-linear-gradient';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Brand } from '@/constants/brand';
import { Icons } from '@/constants/icons';
import { useOutbox } from '@/features/lecturas/outbox-provider';
import { useNetworkStatus } from '@/hooks/use-network-status';
import { AppIcon } from './ui/app-icon';

/** R9: conexión y pendientes visibles en todas las pantallas. */
export function StatusBanner() {
  const insets = useSafeAreaInsets();
  const { online } = useNetworkStatus();
  const { pendientes, conError, sincronizando, sincronizar, ultimoError } = useOutbox();

  const puedeSincronizar = online && pendientes > 0 && !sincronizando;
  const sinEnviar = pendientes + conError;
  const base = !online
    ? sinEnviar === 0
      ? 'Sin conexión · sin pendientes'
      : `Sin conexión · ${sinEnviar} sin enviar`
    : pendientes > 0
      ? `${pendientes} lectura${pendientes === 1 ? '' : 's'} por enviar`
      : conError > 0
        ? `${conError} lectura${conError === 1 ? '' : 's'} con error · revisar historial`
        : 'En línea · Todo sincronizado';

  // Si el último intento falló, se muestra el motivo en la misma barra.
  const texto = online && ultimoError && pendientes > 0 ? `${base} · ${ultimoError}` : base;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={puedeSincronizar ? 'Sincronizar lecturas pendientes' : texto}
      disabled={!puedeSincronizar}
      onPress={() => void sincronizar()}
      style={[styles.bar, { paddingTop: insets.top + 8 }]}>
      <LinearGradient
        colors={online ? [Brand.deepStart, Brand.deepMid, Brand.deepEnd] : ['#46300A', '#6E4A05', '#8A5F10']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />
      <View style={styles.content}>
        {sincronizando ? (
          <ActivityIndicator size="small" color="#FFFFFF" />
        ) : (
          <AppIcon name={online ? Icons.wifi : Icons.wifiOff} size={16} color="#FFFFFF" />
        )}
        <Text style={styles.text} numberOfLines={1}>
          {sincronizando ? 'Sincronizando lecturas…' : texto}
        </Text>
        {puedeSincronizar ? (
          <View style={styles.action}>
            <AppIcon name={Icons.sync} size={14} color="#FFFFFF" />
            <Text style={styles.actionText}>Enviar</Text>
          </View>
        ) : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  bar: {
    paddingHorizontal: 16,
    paddingBottom: 9,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.18)',
    overflow: 'hidden',
  },
  content: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  text: { flex: 1, color: '#FFFFFF', fontSize: 12, fontWeight: '700', letterSpacing: 0.2 },
  action: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.35)',
    backgroundColor: 'rgba(255,255,255,0.16)',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  actionText: { color: '#FFFFFF', fontSize: 10, fontWeight: '800', letterSpacing: 0.3 },
});
