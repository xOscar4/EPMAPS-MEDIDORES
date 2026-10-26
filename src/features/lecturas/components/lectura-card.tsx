import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AppIcon } from '@/components/ui/app-icon';
import { Chip } from '@/components/ui/chip';
import { Brand, Radius, Shadows } from '@/constants/brand';
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

  return (
    <LinearGradient
      colors={['rgba(255,255,255,0.94)', 'rgba(255,255,255,0.58)']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.card, conError && styles.cardError]}>
      <View style={styles.topRow}>
        <View style={styles.codeBox}>
          <Text style={styles.codigo}>{item.medidorCodigo}</Text>
          <Text style={styles.periodo}>{formatearPeriodo(item.periodo)}</Text>
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

      <View style={styles.bodyRow}>
        <View style={styles.readingBox}>
          <Text style={styles.readingLabel}>Lectura</Text>
          <Text style={styles.reading}>{item.lectura !== null ? formatearNumero(item.lectura) : '—'}</Text>
          <Text style={styles.readingUnit}>m³</Text>
        </View>
        <View style={styles.data}>
          <Row label="Estado" value={estado.label} tone={estado.tone} />
          <Row label="Consumo" value={`${formatearNumero(item.consumo)} m³`} />
          <Row label="Fecha" value={formatearFechaHora(fecha)} />
        </View>
      </View>

      {item.anomalia ? (
        <View style={styles.badges}>
          <Chip label="Consumo anómalo" tone="warning" icon={Icons.warning} />
        </View>
      ) : null}

      {item.fotoUri ? (
        <View style={styles.photoWrap}>
          <Image source={{ uri: item.fotoUri }} style={styles.photo} contentFit="cover" />
          <View style={styles.photoTag}>
            <AppIcon name={Icons.camera} size={12} color="#FFFFFF" />
            <Text style={styles.photoTagText}>Respaldo fotográfico</Text>
          </View>
        </View>
      ) : null}

      {item.motivo ? <Text style={styles.note}>Motivo: {item.motivo}</Text> : null}
      {item.descripcion ? <Text style={styles.note}>Daño: {item.descripcion}</Text> : null}
      {conError && item.error ? <Text style={styles.error}>{item.error}</Text> : null}

      {enviada ? (
        <View style={styles.locked}>
          <AppIcon name={Icons.verified} size={14} color={Brand.success} />
          <Text style={styles.lockedText}>Enviada a la oficina · solo lectura</Text>
        </View>
      ) : onEditar || onEliminar ? (
        <View style={styles.actions}>
          {onEditar ? (
            <Pressable onPress={onEditar} style={styles.action}>
              <AppIcon name={Icons.edit} size={15} color={Brand.primary} />
              <Text style={styles.actionText}>Corregir</Text>
            </Pressable>
          ) : null}
          {onEliminar ? (
            <Pressable onPress={onEliminar} style={[styles.action, styles.actionDanger]}>
              <AppIcon name={Icons.trash} size={15} color={Brand.danger} />
              <Text style={[styles.actionText, { color: Brand.danger }]}>Descartar</Text>
            </Pressable>
          ) : null}
        </View>
      ) : null}
    </LinearGradient>
  );
}

function Row({ label, value, tone }: { label: string; value: string; tone?: 'success' | 'warning' | 'danger' }) {
  const color = tone === 'success' ? Brand.success : tone === 'danger' ? Brand.danger : tone === 'warning' ? Brand.warning : Brand.text;
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={[styles.rowValue, { color }]} numberOfLines={1}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Brand.glassBorder,
    padding: 15,
    gap: 9,
    overflow: 'hidden',
    ...Shadows.card,
  },
  cardError: { borderColor: 'rgba(179,38,30,0.40)' },
  topRow: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 },
  codeBox: { gap: 1 },
  codigo: { fontSize: 15, fontWeight: '800', color: Brand.text, letterSpacing: 0.3 },
  periodo: { fontSize: 11, color: Brand.textMuted, fontWeight: '600' },
  bodyRow: { flexDirection: 'row', gap: 12, alignItems: 'center' },
  readingBox: {
    width: 94,
    borderRadius: 14,
    backgroundColor: 'rgba(228,242,250,0.85)',
    borderWidth: 1,
    borderColor: Brand.glassBorder,
    paddingVertical: 10,
    alignItems: 'center',
  },
  readingLabel: { fontSize: 9, fontWeight: '800', color: Brand.primary, textTransform: 'uppercase' },
  reading: { fontSize: 24, fontWeight: '800', color: Brand.primaryDeep, lineHeight: 28 },
  readingUnit: { fontSize: 9, fontWeight: '700', color: Brand.primary },
  data: { flex: 1, gap: 3 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  rowLabel: { fontSize: 10, color: Brand.textMuted, fontWeight: '600' },
  rowValue: { fontSize: 11, fontWeight: '800' },
  badges: { flexDirection: 'row', gap: 6, flexWrap: 'wrap' },
  photoWrap: {
    height: 112,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: Brand.surfaceAlt,
  },
  photo: { width: '100%', height: '100%' },
  photoTag: {
    position: 'absolute',
    left: 8,
    bottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(4,41,63,0.82)',
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  photoTagText: { color: '#FFFFFF', fontSize: 9, fontWeight: '700' },
  note: { fontSize: 11, color: Brand.textMuted, fontStyle: 'italic' },
  error: { fontSize: 11, color: Brand.danger, fontWeight: '600' },
  locked: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    borderTopWidth: 1,
    borderTopColor: 'rgba(10,92,142,0.10)',
    paddingTop: 8,
  },
  lockedText: { fontSize: 10, color: Brand.success, fontWeight: '600' },
  actions: {
    flexDirection: 'row',
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(10,92,142,0.10)',
    paddingTop: 9,
  },
  action: {
    flex: 1,
    minHeight: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.66)',
    borderWidth: 1,
    borderColor: Brand.glassBorderSoft,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
  },
  actionDanger: { backgroundColor: Brand.dangerSoft },
  actionText: { fontSize: 11, fontWeight: '800', color: Brand.primary },
});
