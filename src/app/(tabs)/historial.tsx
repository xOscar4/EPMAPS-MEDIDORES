import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { AppButton } from '@/components/ui/app-button';
import { AppIcon } from '@/components/ui/app-icon';
import { Chip } from '@/components/ui/chip';
import { EmptyState } from '@/components/ui/empty-state';
import { Segmented } from '@/components/ui/segmented';
import { Brand, Radius, Shadows } from '@/constants/brand';
import { Icons } from '@/constants/icons';
import { LecturaCard } from '@/features/lecturas/components/lectura-card';
import { useHistorial } from '@/features/lecturas/hooks';
import { useOutbox } from '@/features/lecturas/outbox-provider';
import { useNetworkStatus } from '@/hooks/use-network-status';

type Filtro = 'todos' | 'pendientes' | 'enviadas';

export default function HistorialScreen() {
  const router = useRouter();
  const { online } = useNetworkStatus();
  const { lecturas, pendientes, sincronizando, ultimoError, eliminar, sincronizar, refrescar } = useOutbox();
  const { data: enviadas = [], refetch, isFetching, isError } = useHistorial();
  const [filtro, setFiltro] = useState<Filtro>('todos');

  const locales = filtro === 'enviadas' ? [] : lecturas;
  const remotas = filtro === 'pendientes' ? [] : enviadas;
  const total = locales.length + remotas.length;

  const descartar = (id: string) =>
    Alert.alert('Descartar lectura', 'Se borrará del teléfono y no llegará a la oficina.', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Descartar', style: 'destructive', onPress: () => void eliminar(id) },
    ]);

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
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
      }>
      <View style={styles.header}>
        <View style={styles.headerBubble} />
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.eyebrow}>MIS REGISTROS</Text>
            <Text style={styles.title}>Historial</Text>
            <Text style={styles.subtitle}>Lecturas guardadas en este teléfono</Text>
          </View>
          <View style={styles.headerIcon}>
            <AppIcon name={Icons.history} size={24} color="#FFFFFF" />
          </View>
        </View>

        <View style={styles.stats}>
          <View style={styles.stat}>
            <AppIcon name={Icons.pending} size={15} color="#FFD9A3" />
            <Text style={styles.statValue}>{lecturas.length}</Text>
            <Text style={styles.statLabel}>Sin enviar</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.stat}>
            <AppIcon name={Icons.verified} size={15} color="#9FE3C2" />
            <Text style={styles.statValue}>{enviadas.length}</Text>
            <Text style={styles.statLabel}>Enviadas</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.stat}>
            <AppIcon name={online ? Icons.wifi : Icons.wifiOff} size={15} color="#9FD4DC" />
            <Text style={styles.statValue}>{online ? 'Sí' : 'No'}</Text>
            <Text style={styles.statLabel}>Conexión</Text>
          </View>
        </View>
      </View>

      <View style={styles.body}>
        {pendientes > 0 ? (
          <AppButton
            title={online ? 'Enviar lecturas pendientes' : 'Sin conexión: esperando señal'}
            icon={online ? Icons.sync : Icons.cloudOff}
            loading={sincronizando}
            disabled={!online}
            onPress={() => void sincronizar()}
          />
        ) : null}

        {ultimoError ? (
          <View style={styles.alertBox}>
            <AppIcon name={Icons.warning} size={16} color={Brand.warning} />
            <Text style={styles.alertText}>{ultimoError}</Text>
          </View>
        ) : null}

        {isError ? (
          <View style={styles.alertBox}>
            <AppIcon name={Icons.cloudOff} size={16} color={Brand.warning} />
            <Text style={styles.alertText}>No se pudo consultar el servidor. Se muestran los datos locales.</Text>
          </View>
        ) : null}

        <Segmented
          value={filtro}
          onChange={(valor) => setFiltro(valor as Filtro)}
          options={[
            { key: 'todos', label: 'Todos', count: lecturas.length + enviadas.length },
            { key: 'pendientes', label: 'Pendientes', count: lecturas.length },
            { key: 'enviadas', label: 'Enviadas', count: enviadas.length },
          ]}
        />

        {isFetching && lecturas.length === 0 && enviadas.length === 0 ? (
          <View style={styles.loading}>
            <ActivityIndicator color={Brand.primary} />
            <Text style={styles.loadingText}>Revisando lecturas…</Text>
          </View>
        ) : total === 0 ? (
          <EmptyState
            icon={Icons.list}
            title="Todavía no hay lecturas"
            message="Registra tu primera lectura desde Mi ruta. Aquí verás las pendientes y las confirmadas por la oficina."
          />
        ) : (
          <View style={styles.list}>
            {locales.map((item) => (
              <View key={item.id} style={styles.item}>
                <LecturaCard
                  item={item}
                  onEditar={
                    item.estadoSync === 'pendiente'
                      ? () =>
                          router.push({
                            pathname: '/lectura/[codigo]',
                            params: { codigo: item.medidorCodigo, lecturaId: item.id },
                          })
                      : undefined
                  }
                  onEliminar={
                    item.estadoSync === 'enviando' ? undefined : () => descartar(item.id)
                  }
                />
              </View>
            ))}
            {remotas.map((item) => (
              <View key={item.id} style={styles.item}>
                <LecturaCard item={item} />
              </View>
            ))}
          </View>
        )}

        <View style={styles.legend}>
          <Chip label="Pendiente: se puede corregir" tone="warning" icon={Icons.edit} />
          <Chip label="Enviada: solo lectura" tone="success" icon={Icons.verified} />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Brand.background },
  content: { paddingBottom: 28 },
  header: {
    backgroundColor: Brand.primaryDark,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    padding: 20,
    paddingBottom: 22,
    overflow: 'hidden',
    gap: 16,
  },
  headerBubble: {
    position: 'absolute',
    right: -60,
    top: -70,
    width: 190,
    height: 190,
    borderRadius: 95,
    backgroundColor: 'rgba(18,166,180,0.22)',
  },
  headerTop: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' },
  eyebrow: { color: '#8FDDE4', fontSize: 10, fontWeight: '800', letterSpacing: 1.3 },
  title: { color: '#FFFFFF', fontSize: 28, fontWeight: '800', lineHeight: 34 },
  subtitle: { color: '#C9DEEA', fontSize: 12, marginTop: 2 },
  headerIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stats: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.10)',
    borderRadius: 16,
    paddingVertical: 10,
  },
  stat: { flex: 1, alignItems: 'center', gap: 1 },
  statValue: { color: '#FFFFFF', fontSize: 17, fontWeight: '800' },
  statLabel: { color: '#A9C8D8', fontSize: 9, fontWeight: '700', textTransform: 'uppercase' },
  statDivider: { width: 1, height: 26, backgroundColor: 'rgba(255,255,255,0.15)' },
  body: { paddingHorizontal: 16, paddingTop: 14, gap: 12 },
  alertBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Brand.warningSoft,
    borderRadius: Radius.sm,
    padding: 10,
  },
  alertText: { flex: 1, fontSize: 11, fontWeight: '600', color: Brand.warning },
  loading: { alignItems: 'center', paddingVertical: 30, gap: 8 },
  loadingText: { fontSize: 12, color: Brand.textMuted, fontWeight: '600' },
  list: { gap: 10 },
  item: { ...Shadows.card, borderRadius: Radius.lg },
  legend: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 4 },
});
