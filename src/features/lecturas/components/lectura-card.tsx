import { Image } from 'expo-image';
import { Pressable, Text, View } from 'react-native';

import { AppGradient } from '@/components/ui/app-gradient';
import { AppIcon } from '@/components/ui/app-icon';
import { Chip } from '@/components/ui/chip';
import { Brand, Shadows } from '@/constants/brand';
import { Icons } from '@/constants/icons';
import type { EstadoMedidor, LecturaLocal, LecturaServidor } from '@/types/models';
import { formatearFechaHora, formatearNumero, formatearPeriodo } from '@/utils/format';

interface Props {
  item: LecturaLocal | LecturaServidor;
  onEditar?: () => void;
  onEliminar?: () => void;
}

const ESTADOS: Record<EstadoMedidor, { label: string; tone: 'success' | 'warning' | 'danger' }> = {
  normal: { label: 'Normal', tone: 'success' },
  inaccesible: { label: 'Inaccesible', tone: 'warning' },
  danado: { label: 'Dañado', tone: 'danger' },
};

/** Tarjeta compartida por pendientes y enviadas; las enviadas no tienen acciones (R10). */
export function LecturaCard({ item, onEditar, onEliminar }: Props) {
  const enviada = 'enviadoEn' in item;
  const fecha = enviada ? item.enviadoEn : item.creadoEn;
  const estado = ESTADOS[item.estadoMedidor];
  const conError = !enviada && item.estadoSync === 'error';
  const franja =
    enviada ? '#1B9A67' : conError ? Brand.danger : item.estadoSync === 'enviando' ? Brand.accent : '#D08A16';

  return (
    <AppGradient
      colors={['#FFFFFF', '#F7FBFD']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      className={`gap-[9px] overflow-hidden rounded-[22px] border p-[15px] pl-[18px] ${
        conError ? 'border-[rgba(168,35,28,0.40)]' : 'border-brand-glass-border'
      }`}
      style={Shadows.card}
    >
      <View
        className="absolute bottom-[14px] left-0 top-[14px] w-1 rounded-r-[3px]"
        style={{ backgroundColor: franja }}
      />
      <View className="flex-row flex-wrap items-start justify-between gap-2">
        <View className="shrink gap-px">
          <Text className="text-[15px] font-extrabold tracking-[0.3px] text-brand-text" numberOfLines={1}>
            {item.medidorCodigo}
          </Text>
          <Text className="text-[11px] font-semibold text-brand-muted">
            {formatearPeriodo(item.periodo)}
          </Text>
        </View>
        {enviada ? (
          <Chip label="Enviada" tone="success" icon={Icons.verified} />
        ) : item.estadoSync === 'enviando' ? (
          <Chip label="Enviando" tone="info" icon={Icons.sync} />
        ) : conError ? (
          <Chip label="Revisar" tone="danger" icon={Icons.error} />
        ) : (
          <Chip label="Por enviar" tone="warning" icon={Icons.pending} />
        )}
      </View>

      <View className="flex-row items-center gap-3">
        <AppGradient
          colors={['#EAF7FB', '#D8EEF8']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="w-24 shrink-0 items-center gap-0 overflow-hidden rounded-[16px] border border-[rgba(10,90,140,0.12)] py-[9px]"
        >
          <Text className="text-[9px] font-extrabold uppercase tracking-[0.6px] text-brand-primary">
            Lectura
          </Text>
          <Text
            className="text-[25px] font-extrabold leading-[29px] text-brand-primary-deep"
            numberOfLines={1}
            adjustsFontSizeToFit
          >
            {item.lectura !== null ? formatearNumero(item.lectura) : '—'}
          </Text>
          <Text className="text-[9px] font-bold text-brand-accent-deep">m³</Text>
        </AppGradient>
        <View className="min-w-0 flex-1 gap-1">
          <Row label="Estado" value={estado.label} tone={estado.tone} />
          <Row label="Consumo" value={`${formatearNumero(item.consumo)} m³`} />
          <Row label="Fecha" value={formatearFechaHora(fecha)} />
        </View>
      </View>

      {item.anomalia ? (
        <View className="flex-row flex-wrap gap-1.5">
          <Chip label="Consumo anómalo" tone="warning" icon={Icons.warning} />
        </View>
      ) : null}

      {item.fotoUri ? (
        <View className="h-[110px] w-full overflow-hidden rounded-[12px] bg-brand-surface-alt">
          <Image source={{ uri: item.fotoUri }} style={{ width: '100%', height: '100%' }} contentFit="cover" />
          <View className="absolute bottom-2 left-2 flex-row items-center gap-1 rounded-full bg-[rgba(4,41,63,0.82)] px-2 py-1">
            <AppIcon name={Icons.camera} size={12} color="#FFFFFF" />
            <Text className="text-[9px] font-bold text-white">Respaldo fotográfico</Text>
          </View>
        </View>
      ) : null}

      {item.motivo ? (
        <Text className="text-[11px] italic text-brand-muted">Motivo: {item.motivo}</Text>
      ) : null}
      {item.descripcion ? (
        <Text className="text-[11px] italic text-brand-muted">Daño: {item.descripcion}</Text>
      ) : null}
      {conError && item.error ? (
        <Text className="text-[11px] font-semibold text-brand-danger">{item.error}</Text>
      ) : null}

      {enviada ? (
        <View className="flex-row items-center gap-[5px] border-t border-[rgba(10,92,142,0.10)] pt-2">
          <AppIcon name={Icons.verified} size={14} color={Brand.success} />
          <Text className="text-[10px] font-semibold text-brand-success">
            Enviada a la oficina · solo lectura
          </Text>
        </View>
      ) : onEditar || onEliminar ? (
        <View className="flex-row gap-2 border-t border-[rgba(10,92,142,0.10)] pt-[9px]">
          {onEditar ? (
            <Pressable
              onPress={onEditar}
              className="min-h-[38px] flex-1 flex-row items-center justify-center gap-[5px] rounded-[10px] border border-brand-glass-border bg-[#F2F8FB] px-2"
            >
              <AppIcon name={Icons.edit} size={15} color={Brand.primary} />
              <Text className="text-[11px] font-extrabold text-brand-primary">Corregir</Text>
            </Pressable>
          ) : null}
          {onEliminar ? (
            <Pressable
              onPress={onEliminar}
              className="min-h-[38px] flex-1 flex-row items-center justify-center gap-[5px] rounded-[10px] border border-[rgba(179,38,30,0.18)] bg-brand-danger-soft px-2"
            >
              <AppIcon name={Icons.trash} size={15} color={Brand.danger} />
              <Text className="text-[11px] font-extrabold text-brand-danger">Descartar</Text>
            </Pressable>
          ) : null}
        </View>
      ) : null}
    </AppGradient>
  );
}

function Row({ label, value, tone }: { label: string; value: string; tone?: 'success' | 'warning' | 'danger' }) {
  const color = tone === 'success' ? Brand.success : tone === 'danger' ? Brand.danger : tone === 'warning' ? Brand.warning : Brand.text;
  return (
    <View className="flex-row items-center justify-between gap-2">
      <Text className="shrink text-[10px] font-bold text-brand-muted">{label}</Text>
      <Text className="shrink text-right text-[11px] font-extrabold" style={{ color }} numberOfLines={1}>
        {value}
      </Text>
    </View>
  );
}
