import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View } from 'react-native';

import { AppIcon } from '@/components/ui/app-icon';
import { Card } from '@/components/ui/card';
import { Chip } from '@/components/ui/chip';
import { Brand, Radius, Shadows } from '@/constants/brand';
import { Icons } from '@/constants/icons';
import type { Medidor } from '@/types/models';
import { formatearFecha, formatearNumero } from '@/utils/format';

interface Props {
  medidor: Medidor;
  online: boolean;
  actualizando: boolean;
}

/** R3: los siete datos del medidor, con aviso de que están guardados localmente. */
export function MedidorDetalleCard({ medidor, online, actualizando }: Props) {
  return (
    <View style={styles.wrapper}>
      <LinearGradient
        colors={[Brand.deepStart, Brand.deepMid, Brand.deepEnd]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.hero}>
        <View style={styles.heroBubble} />
        <View pointerEvents="none" style={styles.heroDrop}>
          <AppIcon name={Icons.drop} size={140} color="#FFFFFF" />
        </View>
        <View style={styles.heroTop}>
          <Chip
            label={medidor.estado === 'activo' ? 'Servicio activo' : 'Servicio suspendido'}
            tone={medidor.estado === 'activo' ? 'success' : 'danger'}
            icon={medidor.estado === 'activo' ? Icons.check : Icons.block}
          />
          <Chip
            label={actualizando ? 'Actualizando' : online ? 'En línea' : 'Desde caché'}
            tone="info"
            icon={actualizando ? Icons.sync : online ? Icons.wifi : Icons.cloudOff}
          />
        </View>
        <Text style={styles.codigo}>{medidor.codigo}</Text>
        <Text style={styles.sector}>{medidor.sector}</Text>
        <View style={styles.addressRow}>
          <AppIcon name={Icons.location} size={15} color="#A9E7EE" />
          <Text style={styles.direccion}>{medidor.direccion}</Text>
        </View>
      </LinearGradient>

      <Card style={styles.dataCard}>
        <View style={styles.grid}>
          <Dato label="Cuenta" value={medidor.cuenta} icon={Icons.receipt} />
          <Dato
            label="Estado"
            value={medidor.estado === 'activo' ? 'Activo' : 'Suspendido'}
            icon={Icons.info}
          />
          <Dato
            label="Última lectura"
            value={`${formatearNumero(medidor.ultimaLectura, 0)} m³`}
            icon={Icons.speed}
          />
          <Dato
            label="Promedio mensual"
            value={`${formatearNumero(medidor.promedioMensual, 0)} m³`}
            icon={Icons.drop}
          />
          <Dato
            label="Fecha última"
            value={formatearFecha(medidor.fechaUltimaLectura)}
            icon={Icons.calendar}
          />
          <Dato label="Código" value={medidor.codigo} icon={Icons.list} />
        </View>
        <View style={styles.cacheRow}>
          <AppIcon name={Icons.cloudDone} size={14} color={Brand.success} />
          <Text style={styles.cacheText}>
            Guardado en el teléfono: puedes consultarlo otra vez sin señal.
          </Text>
        </View>
      </Card>
    </View>
  );
}

function Dato({ label, value, icon }: { label: string; value: string; icon: (typeof Icons)[keyof typeof Icons] }) {
  return (
    <View style={styles.dato}>
      <View style={styles.datoIcon}>
        <AppIcon name={icon} size={14} color={Brand.primary} />
      </View>
      <Text style={styles.datoLabel}>{label}</Text>
      <Text style={styles.datoValue} numberOfLines={1}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { gap: 12 },
  hero: {
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.22)',
    padding: 18,
    overflow: 'hidden',
    gap: 3,
    ...Shadows.floating,
  },
  heroBubble: {
    position: 'absolute',
    right: -50,
    top: -60,
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(27,184,198,0.28)',
  },
  heroDrop: { position: 'absolute', right: -26, bottom: -34, opacity: 0.10 },
  heroTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginBottom: 8, flexWrap: 'wrap' },
  codigo: { color: '#FFFFFF', fontSize: 26, fontWeight: '800', letterSpacing: 0.6, flexShrink: 1 },
  sector: { color: '#A9E7EE', fontSize: 13, fontWeight: '700' },
  addressRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 6 },
  direccion: { color: '#D6EAF3', fontSize: 12, flex: 1, minWidth: 0 },
  dataCard: { gap: 11 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  dato: {
    width: '47%',
    flexGrow: 1,
    minWidth: 0,
    backgroundColor: '#F7FBFD',
    borderWidth: 1,
    borderColor: Brand.glassBorder,
    borderRadius: 12,
    padding: 9,
    gap: 1,
  },
  datoIcon: {
    width: 26,
    height: 26,
    borderRadius: 9,
    backgroundColor: Brand.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 3,
  },
  datoLabel: { fontSize: 9, fontWeight: '700', color: Brand.textMuted, textTransform: 'uppercase', letterSpacing: 0.3 },
  datoValue: { fontSize: 12, fontWeight: '800', color: Brand.text },
  cacheRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  cacheText: { flex: 1, fontSize: 10, color: Brand.success, fontWeight: '600' },
});
