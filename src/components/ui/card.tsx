import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { Brand, Radius, Shadows } from '@/constants/brand';

interface Props {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  padded?: boolean;
  elevated?: boolean;
}

export function Card({ children, style, padded = true, elevated = true }: Props) {
  return (
    <View style={[styles.card, padded && styles.padded, elevated && Shadows.card, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Brand.surface,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Brand.border,
  },
  padded: { padding: 18 },
});
