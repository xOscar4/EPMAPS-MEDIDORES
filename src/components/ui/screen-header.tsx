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
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        {subtitle ? (
          <Text style={styles.subtitle} numberOfLines={1}>
            {subtitle}
          </Text>
        ) : null}
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
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 12,
    backgroundColor: 'rgba(252,254,255,0.96)',
    borderBottomWidth: 1,
    borderBottomColor: Brand.glassBorder,
  },
  back: {
    width: 42,
    height: 42,
    borderRadius: Radius.pill,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: Brand.glassBorder,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.card,
  },
  pressed: { opacity: 0.7 },
  titles: { flex: 1, minWidth: 0, gap: 2 },
  title: { fontSize: 19, fontWeight: '800', color: Brand.text, letterSpacing: -0.3 },
  subtitle: { fontSize: 11, color: Brand.primary, fontWeight: '700', letterSpacing: 0.2 },
});
