import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AppIcon } from '@/components/ui/app-icon';
import { Chip } from '@/components/ui/chip';
import { Brand, Radius, Shadows } from '@/constants/brand';
import { Icons } from '@/constants/icons';
import type { Medidor } from '@/types/models';
import { formatearNumero } from '@/utils/format';

/** Tres estados visuales de la ruta: sin registrar, por enviar o ya enviada. */
export type EstadoRuta = 'sin-registrar' | 'por-enviar' | 'enviada';

interface Props {
  medidor: Medidor;
  estado: EstadoRuta;
  onPress: () => void;
}

const ESTADOS = {
  'sin-registrar': { label: 'Pendiente', tone: 'warning' as const, color: Brand.warning },
  'por-enviar': { label: 'Por enviar', tone: 'info' as const, color: Brand.primary },
  enviada: { label: 'Enviada', tone: 'success' as const, color: Brand.success },
};

export function MedidorCard({ medidor, estado, onPress }: Props) {
  const meta = ESTADOS[estado];

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Medidor ${medidor.codigo}, ${meta.label}`}
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
      <View style={[styles.accent, { backgroundColor: meta.color }]} />
      <View style={styles.body}>
        <View style={styles.topRow}>
          <Text style={styles.codigo}>{medidor.codigo}</Text>
          <Chip label={meta.label} tone={meta.tone} icon={estado === 'enviada' ? Icons.verified : Icons.pending} />
        </View>

        <View style={styles.sectorRow}>
          <AppIcon name={Icons.location} size={14} color={Brand.primary} />
          <Text style={styles.sector}>{medidor.sector}</Text>
          {medidor.estado === 'suspendido' ? <Chip label="Suspendido" tone="danger" /> : null}
        </View>
        <Text style={styles.direccion} numberOfLines={1}>
          {medidor.direccion}
        </Text>

        <View style={styles.bottomRow}>
          <View style={styles.metric}>
            <Text style={styles.metricLabel}>Última lectura</Text>
            <Text style={styles.metricValue}>{formatearNumero(medidor.ultimaLectura, 0)} m³</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.metric}>
            <Text style={styles.metricLabel}>Promedio</Text>
            <Text style={styles.metricValue}>{formatearNumero(medidor.promedioMensual, 0)} m³</Text>
          </View>
          <View style={styles.arrow}>
            <AppIcon name={Icons.chevronRight} size={18} color={Brand.primaryDark} />
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: Brand.surface,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Brand.border,
    overflow: 'hidden',
    ...Shadows.card,
  },
  pressed: { opacity: 0.88, transform: [{ scale: 0.995 }] },
  accent: { width: 5 },
  body: { flex: 1, padding: 15, gap: 6 },
  topRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  codigo: { fontSize: 16, fontWeight: '800', color: Brand.text, letterSpacing: 0.4 },
  sectorRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  sector: { fontSize: 12, fontWeight: '700', color: Brand.primary, flex: 1 },
  direccion: { fontSize: 12, color: Brand.textMuted },
  bottomRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 4 },
  metric: { gap: 1 },
  metricLabel: { fontSize: 10, color: Brand.textMuted, textTransform: 'uppercase', fontWeight: '700' },
  metricValue: { fontSize: 13, fontWeight: '800', color: Brand.text },
  divider: { width: 1, height: 26, backgroundColor: Brand.border },
  arrow: {
    marginLeft: 'auto',
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Brand.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
