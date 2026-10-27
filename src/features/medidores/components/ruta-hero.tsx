import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View } from 'react-native';

import { AppIcon } from '@/components/ui/app-icon';
import { ProgressBar } from '@/components/ui/progress-bar';
import { StatTile } from '@/components/ui/stat-tile';
import { WaterGlow, WaterWaves } from '@/components/ui/water-decor';
import { Brand, Radius } from '@/constants/brand';
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
      <WaterGlow style={{ right: -80, top: -110 }} opacity={0.62} />
      <WaterGlow
        tone={Brand.aqua}
        size={180}
        style={{ left: -90, bottom: -60 }}
        opacity={0.34}
      />
      <WaterWaves opacity={0.16} />

      <View style={styles.topRow}>
        <View style={styles.brandPill}>
          <AppIcon name={Icons.drop} size={12} color="#CFF6FA" />
          <Text style={styles.brandPillText}>EPMAPS · CAMPO</Text>
        </View>
        <View style={[styles.netPill, !online && styles.netPillOff]}>
          <View style={[styles.netDot, !online && styles.netDotOff]} />
          <AppIcon name={online ? Icons.wifi : Icons.wifiOff} size={12} color="#FFFFFF" />
          <Text style={styles.netPillText}>{online ? 'En línea' : 'Sin señal'}</Text>
        </View>
      </View>

      <Text style={styles.fecha}>{fechaLarga().toUpperCase()}</Text>
      <Text style={styles.saludo}>
        {saludo()}, {primerNombre}
      </Text>
      <View style={styles.zoneRow}>
        <AppIcon name={Icons.route} size={13} color={Brand.aqua} />
        <Text style={styles.zona}>{tecnico.zona}</Text>
      </View>

      <View style={styles.board}>
        <View style={styles.boardTop}>
          <View style={styles.boardTexts}>
            <Text style={styles.boardEyebrow}>AVANCE DE HOY</Text>
            <Text style={styles.boardTitle}>
              {registrados} de {total} medidores
            </Text>
          </View>
          <View style={styles.pctBox}>
            <Text style={styles.pct}>{Math.round(avance * 100)}</Text>
            <Text style={styles.pctSign}>%</Text>
          </View>
        </View>

        <ProgressBar value={avance} />

        <View style={styles.tiles}>
          <StatTile
            value={total - registrados}
            label="Por visitar"
            icon={Icons.timer}
            appearance="glass"
          />
          <StatTile
            value={registrados}
            label="Registrados"
            icon={Icons.check}
            tone="success"
            appearance="glass"
          />
          <StatTile
            value={porEnviar}
            label="Por enviar"
            icon={Icons.cloudDone}
            tone={porEnviar > 0 ? 'warning' : 'neutral'}
            appearance="glass"
          />
        </View>
      </View>

      <View style={styles.netHint}>
        <AppIcon name={online ? Icons.sync : Icons.wifiOff} size={11} color="#BFE4EF" />
        <Text style={styles.netHintText} numberOfLines={2}>
          {online
            ? 'Con señal: la ruta y las lecturas se sincronizan solas'
            : 'Sin señal: sigues trabajando con la copia guardada'}
        </Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  hero: {
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 18,
    overflow: 'hidden',
    gap: 3,
    borderBottomWidth: 1,
    borderColor: 'rgba(255,255,255,0.16)',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 10,
  },
  brandPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.24)',
    backgroundColor: 'rgba(255,255,255,0.10)',
    borderRadius: Radius.pill,
    paddingHorizontal: 9,
    paddingVertical: 4,
    flexShrink: 1,
  },
  brandPillText: { color: '#DDF6FA', fontSize: 9, fontWeight: '800', letterSpacing: 1, flexShrink: 1 },
  netPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.28)',
    backgroundColor: 'rgba(255,255,255,0.14)',
    borderRadius: Radius.pill,
    paddingHorizontal: 9,
    paddingVertical: 4,
  },
  netPillOff: { borderColor: 'rgba(255,217,163,0.40)', backgroundColor: 'rgba(143,83,0,0.24)' },
  netDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#8CF0C4' },
  netDotOff: { backgroundColor: '#FFD9A3' },
  netPillText: { color: '#FFFFFF', fontSize: 10, fontWeight: '800', letterSpacing: 0.2 },
  fecha: { color: '#CDEDF4', fontSize: 10, fontWeight: '800', letterSpacing: 1.4 },
  saludo: { color: '#FFFFFF', fontSize: 27, fontWeight: '800', lineHeight: 33, letterSpacing: -0.5 },
  zoneRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 14 },
  zona: { color: '#D3EDF5', fontSize: 12, fontWeight: '600', flexShrink: 1 },
  board: {
    backgroundColor: 'rgba(255,255,255,0.14)',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.26)',
    padding: 14,
    gap: 9,
  },
  boardTop: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  boardTexts: { flex: 1, minWidth: 0, gap: 1 },
  boardEyebrow: { color: '#D7EFF6', fontSize: 9, fontWeight: '800', letterSpacing: 1.2 },
  boardTitle: { color: '#FFFFFF', fontSize: 16, fontWeight: '800', letterSpacing: -0.2 },
  pctBox: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: 'rgba(4,38,60,0.30)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.20)',
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  pct: { color: '#FFFFFF', fontSize: 24, fontWeight: '800', letterSpacing: -0.6, lineHeight: 28 },
  pctSign: { color: '#B9E7EF', fontSize: 12, fontWeight: '800', marginBottom: 4 },
  tiles: { flexDirection: 'row', gap: 7, marginTop: 2 },
  netHint: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 11 },
  netHintText: { color: '#DBF0F6', fontSize: 10, fontWeight: '600', flex: 1, minWidth: 0 },
});
