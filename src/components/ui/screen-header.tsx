import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Brand, Radius } from '@/constants/brand';
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
    paddingBottom: 12,
  },
  back: {
    width: 40,
    height: 40,
    borderRadius: Radius.pill,
    backgroundColor: Brand.surface,
    borderWidth: 1,
    borderColor: Brand.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: { opacity: 0.7 },
  titles: { flex: 1, gap: 2 },
  title: { fontSize: 20, fontWeight: '800', color: Brand.text },
  subtitle: { fontSize: 12, color: Brand.textMuted, fontWeight: '600' },
});
