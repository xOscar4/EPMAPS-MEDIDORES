import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, type StyleProp, type ViewStyle } from 'react-native';

import { Brand, Radius, Shadows } from '@/constants/brand';

interface Props {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  padded?: boolean;
  elevated?: boolean;
}

/** Superficie de vidrio reutilizada por todas las tarjetas. */
export function Card({ children, style, padded = true, elevated = true }: Props) {
  return (
    <LinearGradient
      colors={[Brand.glassStrong, Brand.glassSoft]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0.9, y: 1 }}
      style={[styles.card, padded && styles.padded, elevated && Shadows.card, style]}>
      {children}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Brand.glassBorder,
    overflow: 'hidden',
  },
  padded: { padding: 16 },
});
