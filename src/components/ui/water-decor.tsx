import { View, type StyleProp, type ViewStyle } from 'react-native';

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
  { scale: 0.44, alpha: 0.1 },
  { scale: 0.3, alpha: 0.12 },
];

/** Mancha de agua difusa que da profundidad a los encabezados. */
export function WaterGlow({ tone = Brand.deepGlow, size = 240, style, opacity = 0.9 }: GlowProps) {
  return (
    <View pointerEvents="none" className="absolute" style={[{ width: size, height: size }, style]}>
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
    <View pointerEvents="none" className="absolute inset-0">
      <View
        className="absolute bottom-[-204px] left-[-260px] h-[260px] w-[720px] rotate-[-4deg] rounded-full"
        style={{ backgroundColor: tint, opacity: opacity * 0.55 }}
      />
      <View
        className="absolute bottom-[-228px] left-[-140px] h-[260px] w-[720px] rotate-[5deg] rounded-full"
        style={{ backgroundColor: Brand.accentBright, opacity: opacity * 0.5 }}
      />
      <View
        className="absolute bottom-[-492px] left-[-300px] h-[560px] w-[820px] rotate-[-2deg] rounded-full border-[1.5px]"
        style={{ borderColor: tint, opacity: opacity * 1.15 }}
      />
      <View
        className="absolute bottom-[-444px] left-[-120px] h-[480px] w-[700px] rotate-[3deg] rounded-full border-[1.5px]"
        style={{ borderColor: Brand.aqua, opacity: opacity * 0.95 }}
      />
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
    <View
      pointerEvents="none"
      className="absolute items-center justify-center"
      style={[{ width: size, height: size }, style]}
    >
      <View
        className="absolute border"
        style={{ width: size, height: size, borderRadius: size / 2, borderColor: tone }}
      />
      <View
        className="absolute border"
        style={{
          width: size * 0.72,
          height: size * 0.72,
          borderRadius: size * 0.36,
          borderColor: tone,
          opacity: 0.6,
        }}
      />
      <View
        className="absolute border"
        style={{
          width: size * 0.46,
          height: size * 0.46,
          borderRadius: size * 0.23,
          borderColor: tone,
          opacity: 0.4,
        }}
      />
    </View>
  );
}
