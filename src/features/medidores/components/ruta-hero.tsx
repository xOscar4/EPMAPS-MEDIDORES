import { StyleSheet, Text, View } from 'react-native';

import { AppIcon } from '@/components/ui/app-icon';
import { ProgressBar } from '@/components/ui/progress-bar';
import { Brand } from '@/constants/brand';
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
    <View style={styles.hero}>
      <View style={styles.bubbleBig} />
      <View style={styles.bubbleSmall} />

      <Text style={styles.fecha}>{fechaLarga().toUpperCase()}</Text>
      <Text style={styles.saludo}>
        {saludo()}, {primerNombre}
      </Text>
      <View style={styles.zoneRow}>
        <AppIcon name={Icons.route} size={14} color="#8FDDE4" />
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
    </View>
  );
}

const styles = StyleSheet.create({
  hero: {
    backgroundColor: Brand.primaryDark,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
    overflow: 'hidden',
    gap: 3,
  },
  bubbleBig: {
    position: 'absolute',
    right: -70,
    top: -80,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(18,166,180,0.20)',
  },
  bubbleSmall: {
    position: 'absolute',
    left: -40,
    bottom: -50,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  fecha: { color: '#8FDDE4', fontSize: 10, fontWeight: '800', letterSpacing: 1.3 },
  saludo: { color: '#FFFFFF', fontSize: 26, fontWeight: '800', lineHeight: 32 },
  zoneRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 14 },
  zona: { color: '#C9DEEA', fontSize: 12, fontWeight: '600' },
  progressCard: {
    backgroundColor: 'rgba(255,255,255,0.10)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    padding: 14,
    gap: 8,
  },
  progressTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  progressLabel: { color: '#EAF6FB', fontSize: 12, fontWeight: '700' },
  progressPct: { color: '#FFFFFF', fontSize: 13, fontWeight: '800' },
  stats: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  stat: { flex: 1, alignItems: 'center', gap: 1 },
  statValue: { color: '#FFFFFF', fontSize: 19, fontWeight: '800' },
  statValueAlert: { color: '#FFD9A3' },
  statLabel: { color: '#A9C8D8', fontSize: 9, fontWeight: '700', textTransform: 'uppercase' },
  statDivider: { width: 1, height: 24, backgroundColor: 'rgba(255,255,255,0.16)' },
  net: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 },
  netOffline: { opacity: 0.95 },
  netText: { color: '#C9DEEA', fontSize: 10, fontWeight: '600', flex: 1 },
});
