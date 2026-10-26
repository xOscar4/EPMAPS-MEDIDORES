import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Brand, Radius } from '@/constants/brand';

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
    backgroundColor: Brand.surfaceAlt,
    borderRadius: Radius.md,
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
  itemActive: { backgroundColor: Brand.surface, borderWidth: 1, borderColor: Brand.border },
  label: { fontSize: 13, fontWeight: '700', color: Brand.textMuted },
  labelActive: { color: Brand.primaryDark },
  badge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    paddingHorizontal: 5,
    backgroundColor: Brand.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeActive: { backgroundColor: Brand.primaryLight },
  badgeText: { fontSize: 10, fontWeight: '800', color: Brand.textMuted },
  badgeTextActive: { color: Brand.primary },
});
