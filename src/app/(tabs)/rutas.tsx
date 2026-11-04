import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';

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
      className="flex-1 bg-transparent"
      contentContainerStyle={{ paddingBottom: 118 }}
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

      <View className="gap-3.5 px-4 pt-4">
        <BuscarMedidor />

        <View className="mt-1 flex-row items-center justify-between">
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
          <View className="items-center gap-2 py-[34px]">
            <ActivityIndicator color={Brand.primary} />
            <Text className="text-[12px] font-semibold text-brand-muted">
              Descargando tu ruta…
            </Text>
          </View>
        ) : isError ? (
          <View className="gap-2">
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
          <View className="gap-3">
            {visibles.map((medidor, index) => (
              <Animated.View
                key={medidor.codigo}
                entering={FadeInUp.delay(Math.min(index, 6) * 45).duration(280)}
              >
                <MedidorCard
                  medidor={medidor}
                  estado={estadoDe(medidor.codigo)}
                  onPress={() =>
                    router.push({ pathname: '/medidor/[codigo]', params: { codigo: medidor.codigo } })
                  }
                />
              </Animated.View>
            ))}
          </View>
        )}

        <Text className="mt-1 text-center text-[10px] text-brand-muted">
          Toca un medidor para ver sus datos y registrar la lectura del mes.
        </Text>
      </View>
    </ScrollView>
  );
}

