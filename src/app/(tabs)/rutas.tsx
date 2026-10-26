import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { AppButton } from '@/components/ui/app-button';
import { Chip } from '@/components/ui/chip';
import { EmptyState } from '@/components/ui/empty-state';
import { SectionTitle } from '@/components/ui/section-title';
import { Segmented } from '@/components/ui/segmented';
import { Brand } from '@/constants/brand';
import { Icons } from '@/constants/icons';
import { useAuth } from '@/features/auth/auth-provider';
import { useHistorial } from '@/features/lecturas/hooks';
import { useOutbox } from '@/features/lecturas/outbox-provider';
import { BuscarMedidor } from '@/features/medidores/components/buscar-medidor';
import { MedidorCard, type EstadoRuta } from '@/features/medidores/components/medidor-card';
import { RutaHero } from '@/features/medidores/components/ruta-hero';
import { useRuta } from '@/features/medidores/hooks';
import { useNetworkStatus } from '@/hooks/use-network-status';
import { periodoActual } from '@/utils/format';

type Filtro = 'todos' | 'pendientes' | 'registrados';

export default function RutasScreen() {
  const { tecnico } = useAuth();
  const router = useRouter();
  const { online } = useNetworkStatus();
  const { data: medidores = [], isLoading, isError, refetch, isFetching } = useRuta();
  const { lecturas } = useOutbox();
  const { data: enviadas = [] } = useHistorial();
  const [filtro, setFiltro] = useState<Filtro>('todos');

  if (!tecnico) return null;

  const periodo = periodoActual();
  const conPendiente = new Set(
    lecturas.filter((item) => item.periodo === periodo).map((item) => item.medidorCodigo),
  );
  const conEnviada = new Set(
    enviadas.filter((item) => item.periodo === periodo).map((item) => item.medidorCodigo),
  );
  const estadoDe = (codigo: string): EstadoRuta =>
    conEnviada.has(codigo) ? 'enviada' : conPendiente.has(codigo) ? 'por-enviar' : 'sin-registrar';

  const registrados = medidores.filter((item) => estadoDe(item.codigo) !== 'sin-registrar').length;
  const porVisitar = medidores.length - registrados;
  const visibles = medidores.filter((item) => {
    if (filtro === 'todos') return true;
    const registrado = estadoDe(item.codigo) !== 'sin-registrar';
    return filtro === 'registrados' ? registrado : !registrado;
  });

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl
          refreshing={isFetching && !isLoading}
          onRefresh={() => void refetch()}
          tintColor={Brand.primary}
          colors={[Brand.primary]}
        />
      }>
      <RutaHero
        tecnico={tecnico}
        total={medidores.length}
        registrados={registrados}
        porEnviar={conPendiente.size}
        online={online}
      />

      <View style={styles.body}>
        <BuscarMedidor />

        <View style={styles.sectionRow}>
          <SectionTitle
            index="1"
            title="Mi ruta de hoy"
            subtitle={`${porVisitar} medidor${porVisitar === 1 ? '' : 'es'} por visitar`}
          />
          {isFetching && !isLoading ? <Chip label="Actualizando" tone="info" icon={Icons.sync} /> : null}
        </View>

        <Segmented
          value={filtro}
          onChange={(valor) => setFiltro(valor as Filtro)}
          options={[
            { key: 'todos', label: 'Todos', count: medidores.length },
            { key: 'pendientes', label: 'Pendientes', count: porVisitar },
            { key: 'registrados', label: 'Registrados', count: registrados },
          ]}
        />

        {isLoading ? (
          <View style={styles.loading}>
            <ActivityIndicator color={Brand.primary} />
            <Text style={styles.loadingText}>Descargando tu ruta…</Text>
          </View>
        ) : isError ? (
          <View style={styles.errorBox}>
            <EmptyState
              icon={Icons.cloudOff}
              title="No se pudo descargar la ruta"
              message="Revisa tu conexión. Si ya la descargaste antes, cierra y vuelve a abrir la app: está guardada en el teléfono."
            />
            <AppButton title="Reintentar" icon={Icons.refresh} variant="secondary" onPress={() => void refetch()} />
          </View>
        ) : visibles.length === 0 ? (
          <EmptyState
            icon={Icons.check}
            title={filtro === 'registrados' ? 'Aún no registras lecturas' : '¡Ruta completada!'}
            message={
              filtro === 'registrados'
                ? 'Cuando guardes una lectura aparecerá aquí con su estado de envío.'
                : 'Todos los medidores de este filtro ya tienen lectura. Revisa la pestaña Historial.'
            }
          />
        ) : (
          <View style={styles.list}>
            {visibles.map((medidor) => (
              <MedidorCard
                key={medidor.codigo}
                medidor={medidor}
                estado={estadoDe(medidor.codigo)}
                onPress={() =>
                  router.push({ pathname: '/medidor/[codigo]', params: { codigo: medidor.codigo } })
                }
              />
            ))}
          </View>
        )}

        <Text style={styles.footer}>
          Toca un medidor para ver sus datos y registrar la lectura del mes.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: 'transparent' },
  content: { paddingBottom: 30 },
  body: { paddingHorizontal: 16, paddingTop: 16, gap: 14 },
  sectionRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 },
  list: { gap: 12 },
  loading: { alignItems: 'center', paddingVertical: 34, gap: 8 },
  loadingText: { fontSize: 12, color: Brand.textMuted, fontWeight: '600' },
  errorBox: { gap: 8 },
  footer: { fontSize: 10, color: Brand.textMuted, textAlign: 'center', marginTop: 4 },
});
