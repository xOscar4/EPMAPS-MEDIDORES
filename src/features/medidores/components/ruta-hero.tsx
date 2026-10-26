import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View } from 'react-native';

import { AppIcon } from '@/components/ui/app-icon';
import { ProgressBar } from '@/components/ui/progress-bar';
import { Brand, Radius, Shadows } from '@/constants/brand';
import { Icons } from '@/constants/icons';
import type { Tecnico } from '@/types/models';
import { fechaLarga, saludo } from '@/utils/format';

interface Props {
  tecnico: Tecnico;
  total: number;
  registrados: number;
  porEnviar: number;
  online: boolean;
}

/** Encabezado de la jornada: saludo, avance y estado de la cola. */
export function RutaHero({ tecnico, total, registrados, porEnviar, online }: Props) {
  const avance = total > 0 ? registrados / total : 0;
  const primerNombre = tecnico.nombre.split(' ')[0];

  return (
    <LinearGradient
      colors={[Brand.deepStart, Brand.deepMid, Brand.deepEnd]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.hero}>
      <View style={styles.bubbleBig} />
      <View style={styles.bubbleSmall} />
      <View pointerEvents="none" style={styles.dropMark}>
        <AppIcon name={Icons.drop} size={150} color="#FFFFFF" />
      </View>

      <Text style={styles.fecha}>{fechaLarga().toUpperCase()}</Text>
      <Text style={styles.saludo}>
        {saludo()}, {primerNombre}
      </Text>
      <View style={styles.zoneRow}>
        <AppIcon name={Icons.route} size={14} color="#A9E7EE" />
        <Text style={styles.zona}>{tecnico.zona}</Text>
      </View>

      <View style={styles.progressCard}>
        <View style={styles.progressTop}>
          <Text style={styles.progressLabel}>
            {registrados} de {total} medidores registrados
          </Text>
          <Text style={styles.progressPct}>{Math.round(avance * 100)}%</Text>
        </View>
        <ProgressBar value={avance} />
        <View style={styles.stats}>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{total - registrados}</Text>
            <Text style={styles.statLabel}>Por visitar</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.stat}>
            <Text style={styles.statValue}>{registrados}</Text>
            <Text style={styles.statLabel}>Registrados</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.stat}>
            <Text style={[styles.statValue, porEnviar > 0 && styles.statValueAlert]}>{porEnviar}</Text>
            <Text style={styles.statLabel}>Por enviar</Text>
          </View>
        </View>
      </View>

      <View style={[styles.net, !online && styles.netOffline]}>
        <AppIcon name={online ? Icons.wifi : Icons.wifiOff} size={13} color="#FFFFFF" />
        <Text style={styles.netText}>
          {online ? 'Con señal: la ruta se actualiza sola' : 'Sin señal: sigues trabajando con la caché'}
        </Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  hero: {
    marginHorizontal: 12,
    marginTop: 10,
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.22)',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
    overflow: 'hidden',
    gap: 3,
    ...Shadows.card,
  },
  bubbleBig: {
    position: 'absolute',
    right: -70,
    top: -80,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(27,184,198,0.24)',
  },
  bubbleSmall: {
    position: 'absolute',
    left: -40,
    bottom: -50,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  dropMark: { position: 'absolute', right: -22, top: 30, opacity: 0.10 },
  fecha: { color: '#A9E7EE', fontSize: 10, fontWeight: '800', letterSpacing: 1.4 },
  saludo: { color: '#FFFFFF', fontSize: 26, fontWeight: '800', lineHeight: 32, letterSpacing: -0.4 },
  zoneRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 14 },
  zona: { color: '#CDE6F1', fontSize: 12, fontWeight: '600' },
  progressCard: {
    backgroundColor: 'rgba(255,255,255,0.13)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.24)',
    padding: 14,
    gap: 8,
  },
  progressTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  progressLabel: { color: '#EFF9FD', fontSize: 12, fontWeight: '700' },
  progressPct: { color: '#FFFFFF', fontSize: 13, fontWeight: '800' },
  stats: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  stat: { flex: 1, alignItems: 'center', gap: 1 },
  statValue: { color: '#FFFFFF', fontSize: 19, fontWeight: '800' },
  statValueAlert: { color: '#FFD9A3' },
  statLabel: { color: '#B7D4E2', fontSize: 9, fontWeight: '700', textTransform: 'uppercase' },
  statDivider: { width: 1, height: 24, backgroundColor: 'rgba(255,255,255,0.18)' },
  net: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 10,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.22)',
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: Radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  netOffline: { opacity: 0.95, borderColor: 'rgba(255,217,163,0.35)' },
  netText: { color: '#E6F4FA', fontSize: 10, fontWeight: '600', flexShrink: 1 },
});
