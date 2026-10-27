import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Brand } from '@/constants/brand';

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
            style={styles.item}>
            {activa ? (
              <LinearGradient
                colors={['#FFFFFF', '#F1FAFD']}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={styles.activePill}
                pointerEvents="none"
              />
            ) : null}
            <Text style={[styles.label, activa && styles.labelActive]} numberOfLines={1}>
              {opcion.label}
            </Text>
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
    backgroundColor: '#E9F3F9',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: Brand.glassBorder,
    padding: 4,
    gap: 4,
  },
  item: {
    flex: 1,
    minWidth: 0,
    minHeight: 44,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingHorizontal: 2,
    overflow: 'hidden',
  },
  activePill: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(10,90,140,0.10)',
  },
  label: { fontSize: 11, fontWeight: '700', color: Brand.textMuted, flexShrink: 1 },
  labelActive: { color: Brand.primaryDeep, fontWeight: '800' },
  badge: {
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    paddingHorizontal: 4,
    backgroundColor: '#DCEBF4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeActive: { backgroundColor: '#D3EFF2' },
  badgeText: { fontSize: 9, fontWeight: '800', color: Brand.textMuted },
  badgeTextActive: { color: Brand.accentDeep },
});
