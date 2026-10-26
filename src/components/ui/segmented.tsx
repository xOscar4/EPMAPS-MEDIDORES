import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Brand, Radius, Shadows } from '@/constants/brand';

interface Opcion {
  key: string;
  label: string;
  count?: number;
}

interface Props {
  options: Opcion[];
  value: string;
  onChange: (key: string) => void;
}

export function Segmented({ options, value, onChange }: Props) {
  return (
    <View style={styles.container}>
      {options.map((opcion) => {
        const activa = opcion.key === value;
        return (
          <Pressable
            key={opcion.key}
            accessibilityRole="button"
            accessibilityState={{ selected: activa }}
            onPress={() => onChange(opcion.key)}
            style={[styles.item, activa && styles.itemActive]}>
            <Text style={[styles.label, activa && styles.labelActive]}>{opcion.label}</Text>
            {typeof opcion.count === 'number' ? (
              <View style={[styles.badge, activa && styles.badgeActive]}>
                <Text style={[styles.badgeText, activa && styles.badgeTextActive]}>{opcion.count}</Text>
              </View>
            ) : null}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.42)',
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Brand.glassBorderSoft,
    padding: 4,
    gap: 4,
  },
  item: {
    flex: 1,
    minHeight: 42,
    borderRadius: Radius.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  itemActive: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderWidth: 1,
    borderColor: Brand.glassBorder,
    ...Shadows.card,
  },
  label: { fontSize: 12, fontWeight: '700', color: Brand.textMuted },
  labelActive: { color: Brand.primaryDark, fontWeight: '800' },
  badge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    paddingHorizontal: 5,
    backgroundColor: 'rgba(10,92,142,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeActive: { backgroundColor: 'rgba(18,166,180,0.16)' },
  badgeText: { fontSize: 10, fontWeight: '800', color: Brand.textMuted },
  badgeTextActive: { color: Brand.accent },
});
