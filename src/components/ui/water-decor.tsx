import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { Brand } from '@/constants/brand';

interface GlowProps {
  tone?: string;
  size?: number;
  style?: StyleProp<ViewStyle>;
  opacity?: number;
}

/** Capas concéntricas que simulan un resplandor radial suave, sin borde duro. */
const GLOW_LAYERS = [
  { scale: 1, alpha: 0.06 },
  { scale: 0.86, alpha: 0.07 },
  { scale: 0.72, alpha: 0.08 },
  { scale: 0.58, alpha: 0.09 },
  { scale: 0.44, alpha: 0.10 },
  { scale: 0.3, alpha: 0.12 },
];

/** Mancha de agua difusa que da profundidad a los encabezados. */
export function WaterGlow({ tone = Brand.deepGlow, size = 240, style, opacity = 0.9 }: GlowProps) {
  return (
    <View pointerEvents="none" style={[{ width: size, height: size }, styles.glow, style]}>
      {GLOW_LAYERS.map(({ scale, alpha }) => {
        const diametro = size * scale;
        return (
          <View
            key={scale}
            style={{
              position: 'absolute',
              width: diametro,
              height: diametro,
              borderRadius: diametro / 2,
              backgroundColor: tone,
              opacity: opacity * alpha,
              left: (size - diametro) / 2,
              top: (size - diametro) / 2,
            }}
          />
        );
      })}
    </View>
  );
}

interface WavesProps {
  tint?: string;
  opacity?: number;
}

/**
 * Corriente decorativa: dos crestas curvas y dos masas de agua al pie del
 * encabezado. No captura toques ni altera el contenido.
 */
export function WaterWaves({ tint = '#FFFFFF', opacity = 0.1 }: WavesProps) {
  return (
    <View pointerEvents="none" style={styles.waves}>
      <View style={[styles.swell, styles.swellBack, { backgroundColor: tint, opacity: opacity * 0.55 }]} />
      <View
        style={[styles.swell, styles.swellFront, { backgroundColor: Brand.accentBright, opacity: opacity * 0.5 }]}
      />
      <View style={[styles.crest, styles.crestBack, { borderColor: tint, opacity: opacity * 1.15 }]} />
      <View style={[styles.crest, styles.crestFront, { borderColor: Brand.aqua, opacity: opacity * 0.95 }]} />
    </View>
  );
}

interface RipplesProps {
  size?: number;
  tone?: string;
  style?: StyleProp<ViewStyle>;
}

/** Anillos concéntricos tipo gota cayendo en el agua. */
export function WaterRipples({ size = 116, tone = '#FFFFFF', style }: RipplesProps) {
  return (
    <View pointerEvents="none" style={[{ width: size, height: size }, styles.ripples, style]}>
      <View style={[styles.ring, { width: size, height: size, borderRadius: size / 2, borderColor: tone }]} />
      <View
        style={[
          styles.ring,
          {
            width: size * 0.72,
            height: size * 0.72,
            borderRadius: size * 0.36,
            borderColor: tone,
            opacity: 0.6,
          },
        ]}
      />
      <View
        style={[
          styles.ring,
          {
            width: size * 0.46,
            height: size * 0.46,
            borderRadius: size * 0.23,
            borderColor: tone,
            opacity: 0.4,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  glow: { position: 'absolute' },
  waves: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  swell: { position: 'absolute', width: 720, height: 260, borderRadius: 999 },
  swellBack: { left: -260, bottom: -204, transform: [{ rotate: '-4deg' }] },
  swellFront: { left: -140, bottom: -228, transform: [{ rotate: '5deg' }] },
  crest: { position: 'absolute', borderWidth: 1.5 },
  crestBack: { width: 820, height: 560, borderRadius: 410, left: -300, bottom: -492, transform: [{ rotate: '-2deg' }] },
  crestFront: { width: 700, height: 480, borderRadius: 350, left: -120, bottom: -444, transform: [{ rotate: '3deg' }] },
  ripples: { position: 'absolute', alignItems: 'center', justifyContent: 'center' },
  ring: { position: 'absolute', borderWidth: 1 },
});
