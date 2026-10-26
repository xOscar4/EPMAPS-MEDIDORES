import { Pressable, StyleSheet, Text, View, ActivityIndicator } from 'react-native';
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
  const { pendientes, conError, sincronizando, sincronizar } = useOutbox();

  const puedeSincronizar = online && pendientes > 0 && !sincronizando;
  const sinEnviar = pendientes + conError;
  const texto = !online
    ? sinEnviar === 0
      ? 'Sin conexión · sin pendientes'
      : `Sin conexión · ${sinEnviar} sin enviar`
    : pendientes > 0
      ? `${pendientes} lectura${pendientes === 1 ? '' : 's'} por enviar`
      : conError > 0
        ? `${conError} lectura${conError === 1 ? '' : 's'} con error · revisar historial`
        : 'En línea · Todo sincronizado';

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={puedeSincronizar ? 'Sincronizar lecturas pendientes' : texto}
      disabled={!puedeSincronizar}
      onPress={() => void sincronizar()}
      style={[styles.bar, { paddingTop: insets.top + 7 }, !online && styles.barOffline]}>
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
          <AppIcon name={Icons.sync} size={15} color="#FFFFFF" />
          <Text style={styles.actionText}>Enviar</Text>
        </View>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  bar: {
    backgroundColor: Brand.primaryDeep,
    paddingHorizontal: 16,
    paddingBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  barOffline: { backgroundColor: Brand.offline },
  text: { flex: 1, color: '#FFFFFF', fontSize: 12, fontWeight: '700' },
  action: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  actionText: { color: '#FFFFFF', fontSize: 11, fontWeight: '800' },
});
