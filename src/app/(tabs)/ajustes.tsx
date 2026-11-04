import { useQueryClient } from '@tanstack/react-query';
import Constants from 'expo-constants';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, ScrollView, Text, View } from 'react-native';

import { AppButton } from '@/components/ui/app-button';
import { AppGradient } from '@/components/ui/app-gradient';
import { AppIcon } from '@/components/ui/app-icon';
import { Card } from '@/components/ui/card';
import { Chip } from '@/components/ui/chip';
import { WaterGlow, WaterRipples } from '@/components/ui/water-decor';
import { Brand } from '@/constants/brand';
import { Icons } from '@/constants/icons';
import { useAuth } from '@/features/auth/auth-provider';
import { useOutbox } from '@/features/lecturas/outbox-provider';
import { useNetworkStatus } from '@/hooks/use-network-status';
import { MOCKAPI_URL } from '@/services/api';

export default function AjustesScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { tecnico, cerrarSesion, nombre, correo, emailVerificado } = useAuth();
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
    <ScrollView className="flex-1 bg-transparent" contentContainerStyle={{ paddingBottom: 122 }}>
      <AppGradient
        colors={[Brand.deepStart, Brand.deepMid, Brand.deepEnd]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="gap-[3px] overflow-hidden rounded-b-[30px] border-b border-white/[0.15] px-5 pb-[58px] pt-[18px]"
      >
        <WaterGlow style={{ left: -80, top: -100 }} opacity={0.55} />
        <WaterRipples size={170} tone="rgba(255,255,255,0.20)" style={{ right: -46, top: -34 }} />
        <Text className="text-[10px] font-extrabold tracking-[1.4px] text-[#B9E7EF]">
          EPMAPS · CAMPO
        </Text>
        <Text className="text-[30px] font-extrabold leading-[35px] tracking-[-0.6px] text-white">
          Ajustes
        </Text>
        <Text className="mt-px text-[12px] text-[#D6EAF3]">
          Cuenta, conexión y datos de la app
        </Text>
      </AppGradient>

      <View className="-mt-[42px] gap-3 px-4">
        <Card
          variant="accent"
          style={{ flexDirection: 'row', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}
        >
          <AppGradient
            colors={[Brand.primary, Brand.deepEnd, Brand.accentBright]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="h-[54px] w-[54px] items-center justify-center rounded-[18px] border-2 border-white"
          >
            <Text className="text-[18px] font-extrabold text-white">{iniciales}</Text>
          </AppGradient>
          <View className="min-w-[120px] flex-1 gap-px">
            <Text className="text-[16px] font-extrabold text-brand-text">
              {nombre ?? tecnico.nombre}
            </Text>
            <Text className="text-[11px] text-brand-muted">
              Técnico de lecturas · {tecnico.codigo}
            </Text>
            <Text className="text-[11px] font-semibold text-brand-primary">
              {correo}
            </Text>
            <View className="mt-0.5 flex-row items-center gap-1">
              <AppIcon name={Icons.route} size={13} color={Brand.primary} />
              <Text className="shrink text-[10px] font-bold text-brand-primary">
                {tecnico.zona}
              </Text>
            </View>
          </View>
          <Chip
            label={emailVerificado ? 'Correo verificado' : 'Sin verificar'}
            tone={emailVerificado ? 'success' : 'warning'}
            icon={Icons.verified}
          />
          <View className="mt-1 w-full flex-row gap-2">
            <AppButton
              title="Editar nombre"
              icon={Icons.edit}
              variant="secondary"
              style={{ flex: 1, minHeight: 44 }}
              onPress={() => router.push('/editar-nombre')}
            />
            <AppButton
              title="Cambiar contraseña"
              icon={Icons.lock}
              variant="ghost"
              style={{ flex: 1, minHeight: 44 }}
              onPress={() => router.push('/cambiar-clave')}
            />
          </View>
        </Card>

        <SectionLabel>Conexión y sincronización</SectionLabel>
        <Card style={{ gap: 2 }}>
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
          <View className="mt-1.5 gap-2.5">
            <AppButton
              title={online ? 'Sincronizar ahora' : 'Esperando señal'}
              icon={Icons.sync}
              variant="secondary"
              loading={sincronizando}
              disabled={!online || pendientes === 0}
              onPress={() => void sincronizar()}
              style={{ minHeight: 46 }}
            />
            <AppButton
              title="Actualizar datos"
              icon={Icons.refresh}
              variant="ghost"
              loading={actualizando}
              onPress={() => void actualizarDatos()}
              style={{ minHeight: 46 }}
            />
          </View>
        </Card>

        <SectionLabel>Datos de demostración</SectionLabel>
        <Card variant="plain" style={{ gap: 2 }}>
          <Row icon={Icons.warning} label="MED-100003" value="Consumo anómalo (> 3× promedio)" />
          <Row icon={Icons.waterDamage} label="MED-100004" value="Medidor dañado: exige foto" />
          <Row icon={Icons.pending} label="MED-100007" value="Servicio suspendido" />
        </Card>

        <SectionLabel>Acerca de</SectionLabel>
        <Card variant="plain" style={{ gap: 2 }}>
          <Row icon={Icons.info} label="Versión" value={Constants.expoConfig?.version ?? '1.0.0'} />
          <Row icon={Icons.route} label="Sistema de oficina" value="MockAPI en la nube" />
          <Text className="mt-1 text-[11px] leading-[17px] text-brand-muted">
            Conectado a {MOCKAPI_URL}. Recursos medidores y lecturas. Sin señal se usa la copia
            guardada en el teléfono y las lecturas quedan en cola.
          </Text>
          <Text className="mt-1 text-[11px] leading-[17px] text-brand-muted">
            Las lecturas se guardan primero en el teléfono y se envían solas al recuperar la señal.
            Una lectura ya enviada no se puede editar (R10).
          </Text>
        </Card>

        <AppButton title="Cerrar sesión" icon={Icons.logout} variant="danger" onPress={salir} />
        <Text className="mt-2 text-center text-[10px] text-brand-muted">
          ESFOT · Prueba I de desarrollo móvil · EPMAPS
        </Text>
      </View>
    </ScrollView>
  );
}

function SectionLabel({ children }: { children: string }) {
  return (
    <View className="ml-0.5 mt-2 flex-row items-center gap-[7px]">
      <View className="h-1.5 w-1.5 rounded-full bg-brand-accent" />
      <Text className="text-[10px] font-extrabold uppercase tracking-[1px] text-brand-primary-dark">
        {children}
      </Text>
      <View className="h-px flex-1 bg-[rgba(10,90,140,0.12)]" />
    </View>
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
    <View className="flex-row items-center gap-2.5 py-[7px]">
      <View
        className={`h-8 w-8 items-center justify-center rounded-[10px] border border-brand-glass-border ${
          tone === 'warning' ? 'bg-brand-warning-soft' : 'bg-brand-primary-light'
        }`}
      >
        <AppIcon name={icon} size={16} color={tone === 'warning' ? Brand.warning : Brand.primary} />
      </View>
      <View className="min-w-0 flex-1 gap-px">
        <Text className="text-[12px] font-semibold text-brand-text">{label}</Text>
        <Text className="text-[11px] font-extrabold" style={{ color }}>
          {value}
        </Text>
      </View>
    </View>
  );
}
