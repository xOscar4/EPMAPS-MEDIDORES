import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, View } from 'react-native';

import { Brand, Radius } from '@/constants/brand';

interface Props {
  value: number;
  tone?: string;
}

/** Barra de avance de la ruta: corriente de agua con brillo en la punta. */
export function ProgressBar({ value, tone = Brand.accent }: Props) {
  const porcentaje = Math.max(0, Math.min(1, value)) * 100;
  return (
    <View style={styles.track}>
      <View style={[styles.fillWrap, { width: `${porcentaje}%` }]}>
        <LinearGradient
          colors={[tone, Brand.mint]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.fill}
        />
        <View style={styles.tip} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    height: 10,
    borderRadius: Radius.pill,
    backgroundColor: 'rgba(4,38,60,0.30)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.20)',
    overflow: 'hidden',
  },
  fillWrap: { height: '100%', minWidth: 8, justifyContent: 'center' },
  fill: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, borderRadius: Radius.pill },
  tip: {
    position: 'absolute',
    right: 1,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FFFFFF',
    opacity: 0.9,
  },
});
