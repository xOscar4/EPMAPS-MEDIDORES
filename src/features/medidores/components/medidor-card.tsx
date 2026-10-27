import { LinearGradient } from 'expo-linear-gradient';
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
  'sin-registrar': { label: 'Pendiente', tone: 'warning' as const, color: '#D08A16' },
  'por-enviar': { label: 'Por enviar', tone: 'info' as const, color: Brand.accent },
  enviada: { label: 'Enviada', tone: 'success' as const, color: '#1B9A67' },
};

export function MedidorCard({ medidor, estado, onPress }: Props) {
  const meta = ESTADOS[estado];

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Medidor ${medidor.codigo}, ${meta.label}`}
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
      <LinearGradient
        colors={['#FFFFFF', '#F5FBFE']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />
      <View style={[styles.rail, { backgroundColor: meta.color }]}>
        <View style={styles.railShine} />
      </View>

      <View style={styles.body}>
        <View style={styles.topRow}>
          <View style={styles.codeBox}>
            <Text style={styles.codeLabel}>MEDIDOR</Text>
            <Text style={styles.codigo} numberOfLines={1}>
              {medidor.codigo}
            </Text>
          </View>
          <Chip
            label={meta.label}
            tone={meta.tone}
            icon={estado === 'enviada' ? Icons.verified : Icons.pending}
          />
        </View>

        <View style={styles.sectorRow}>
          <View style={styles.sectorBadge}>
            <AppIcon name={Icons.location} size={11} color={Brand.primary} />
          </View>
          <Text style={styles.sector} numberOfLines={1}>
            {medidor.sector}
          </Text>
          {medidor.estado === 'suspendido' ? <Chip label="Suspendido" tone="danger" /> : null}
        </View>
        <Text style={styles.direccion} numberOfLines={1}>
          {medidor.direccion}
        </Text>

        <View style={styles.footerRow}>
          <View style={styles.metrics}>
            <View style={styles.metric}>
              <Text style={styles.metricLabel}>Última</Text>
              <Text style={styles.metricValue}>
                {formatearNumero(medidor.ultimaLectura, 0)}
                <Text style={styles.unit}> m³</Text>
              </Text>
            </View>
            <View style={styles.metric}>
              <Text style={styles.metricLabel}>Promedio</Text>
              <Text style={styles.metricValue}>
                {formatearNumero(medidor.promedioMensual, 0)}
                <Text style={styles.unit}> m³</Text>
              </Text>
            </View>
          </View>

          <LinearGradient
            colors={[Brand.deepMid, Brand.deepEnd]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.arrow}>
            <AppIcon name={Icons.chevronRight} size={17} color="#FFFFFF" />
          </LinearGradient>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Brand.glassBorder,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
    ...Shadows.card,
  },
  pressed: { opacity: 0.9, transform: [{ scale: 0.995 }] },
  rail: { width: 7, alignItems: 'center' },
  railShine: {
    marginTop: 14,
    width: 3,
    height: 26,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.55)',
  },
  body: { flex: 1, padding: 14, paddingLeft: 13, gap: 6 },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    flexWrap: 'wrap',
  },
  codeBox: { flexShrink: 1, gap: 0 },
  codeLabel: { fontSize: 8, fontWeight: '800', color: Brand.textMuted, letterSpacing: 1.2 },
  codigo: { fontSize: 17, fontWeight: '800', color: Brand.text, letterSpacing: 0.2 },
  sectorRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  sectorBadge: {
    width: 20,
    height: 20,
    borderRadius: 7,
    backgroundColor: Brand.primarySoft,
    borderWidth: 1,
    borderColor: Brand.glassBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sector: { fontSize: 12, fontWeight: '700', color: Brand.primary, flex: 1, minWidth: 0 },
  direccion: { fontSize: 11.5, color: Brand.textMuted },
  footerRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 },
  metrics: { flex: 1, minWidth: 0, flexDirection: 'row', gap: 7 },
  metric: {
    flex: 1,
    minWidth: 0,
    borderRadius: 11,
    backgroundColor: '#F3FAFD',
    borderWidth: 1,
    borderColor: 'rgba(10,90,140,0.08)',
    paddingHorizontal: 8,
    paddingVertical: 6,
    gap: 0,
  },
  metricLabel: {
    fontSize: 8,
    fontWeight: '800',
    color: Brand.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  metricValue: { fontSize: 14, fontWeight: '800', color: Brand.primaryDeep },
  unit: { fontSize: 9, fontWeight: '700', color: Brand.textMuted },
  arrow: {
    width: 34,
    height: 34,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
