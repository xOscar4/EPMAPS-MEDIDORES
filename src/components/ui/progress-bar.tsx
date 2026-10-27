import { StyleSheet, View } from 'react-native';

import { Brand, Radius } from '@/constants/brand';

interface Props {
  value: number;
  tone?: string;
}

/** Barra de avance de la ruta, sin librerías de animación. */
export function ProgressBar({ value, tone = Brand.accent }: Props) {
  const porcentaje = Math.max(0, Math.min(1, value)) * 100;
  return (
    <View style={styles.track}>
      <View style={[styles.fill, { width: `${porcentaje}%`, backgroundColor: tone }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    height: 9,
    borderRadius: Radius.pill,
    backgroundColor: 'rgba(255,255,255,0.30)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.26)',
    overflow: 'hidden',
  },
  fill: { height: '100%', borderRadius: Radius.pill, minWidth: 6 },
});
