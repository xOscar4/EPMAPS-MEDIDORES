import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Brand, Radius, Shadows } from '@/constants/brand';
import { Icons } from '@/constants/icons';
import { AppIcon } from './app-icon';

interface Props {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  right?: React.ReactNode;
}

/** Encabezado común de las pantallas fuera de las tabs. */
export function ScreenHeader({ title, subtitle, onBack, right }: Props) {
  return (
    <View style={styles.header}>
      {onBack ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Volver"
          onPress={onBack}
          style={({ pressed }) => [styles.back, pressed && styles.pressed]}>
          <AppIcon name={Icons.arrowBack} size={20} color={Brand.primaryDark} />
        </Pressable>
      ) : null}
      <View style={styles.titles}>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
      {right}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 14,
    backgroundColor: 'rgba(255,255,255,0.50)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.65)',
  },
  back: {
    width: 42,
    height: 42,
    borderRadius: Radius.pill,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderWidth: 1,
    borderColor: Brand.glassBorder,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.card,
  },
  pressed: { opacity: 0.7 },
  titles: { flex: 1, gap: 2 },
  title: { fontSize: 20, fontWeight: '800', color: Brand.text, letterSpacing: -0.3 },
  subtitle: { fontSize: 11, color: Brand.primary, fontWeight: '700', letterSpacing: 0.2 },
});
