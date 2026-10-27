import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
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
import { StatTile } from '@/components/ui/stat-tile';
import { WaterGlow, WaterWaves } from '@/components/ui/water-decor';
import { Brand, Radius } from '@/constants/brand';
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
      <LinearGradient
        colors={[Brand.deepStart, Brand.deepMid, Brand.deepEnd]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}>
        <WaterGlow style={{ right: -90, top: -100 }} opacity={0.58} />
        <WaterWaves opacity={0.15} />
        <Text style={styles.eyebrow}>MIS REGISTROS</Text>
        <View style={styles.headerTop}>
          <View style={styles.headerTexts}>
            <Text style={styles.title}>Historial</Text>
            <Text style={styles.subtitle}>Lecturas guardadas en este teléfono</Text>
          </View>
          <View style={styles.headerIcon}>
            <AppIcon name={Icons.history} size={22} color="#FFFFFF" />
          </View>
        </View>
      </LinearGradient>

      <View style={styles.statsRow}>
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
          value={online ? 'Sí' : 'No'}
          label="Conexión"
          icon={online ? Icons.wifi : Icons.wifiOff}
          tone="brand"
          appearance="solid"
        />
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
  screen: { flex: 1, backgroundColor: 'transparent' },
  content: { paddingBottom: 118 },
  header: {
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 52,
    overflow: 'hidden',
    gap: 4,
    borderBottomWidth: 1,
    borderColor: 'rgba(255,255,255,0.16)',
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  headerTexts: { flex: 1, minWidth: 0, gap: 1 },
  eyebrow: { color: '#B9E7EF', fontSize: 10, fontWeight: '800', letterSpacing: 1.4 },
  title: { color: '#FFFFFF', fontSize: 30, fontWeight: '800', lineHeight: 35, letterSpacing: -0.6 },
  subtitle: { color: '#D6EAF3', fontSize: 12, marginTop: 1 },
  headerIcon: {
    width: 46,
    height: 46,
    borderRadius: 15,
    backgroundColor: 'rgba(255,255,255,0.16)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.30)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 8,
    marginHorizontal: 16,
    marginTop: -30,
  },
  body: { paddingHorizontal: 16, paddingTop: 18, gap: 12 },
  alertBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Brand.warningSoft,
    borderWidth: 1,
    borderColor: 'rgba(214,138,0,0.22)',
    borderRadius: Radius.sm,
    padding: 11,
  },
  alertText: { flex: 1, fontSize: 11, fontWeight: '600', color: Brand.warning },
  loading: { alignItems: 'center', paddingVertical: 30, gap: 8 },
  loadingText: { fontSize: 12, color: Brand.textMuted, fontWeight: '600' },
  list: { gap: 12 },
  item: { borderRadius: Radius.lg },
  legend: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 4 },
});
