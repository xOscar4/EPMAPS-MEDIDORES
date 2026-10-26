import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AppIcon } from '@/components/ui/app-icon';
import { Brand, Radius } from '@/constants/brand';
import { Icons } from '@/constants/icons';
import type { EstadoMedidor } from '@/types/models';

interface Opcion {
  key: EstadoMedidor;
  label: string;
  hint: string;
  icon: (typeof Icons)[keyof typeof Icons];
}

/** R5: los tres estados posibles, con lo que exige cada uno. */
const OPCIONES: Opcion[] = [
  { key: 'normal', label: 'Normal', hint: 'Toma lectura', icon: Icons.check },
  { key: 'inaccesible', label: 'Inaccesible', hint: 'Solo motivo', icon: Icons.block },
  { key: 'danado', label: 'Dañado', hint: 'Foto y detalle', icon: Icons.waterDamage },
];

interface Props {
  value: EstadoMedidor | null;
  onChange: (valor: EstadoMedidor) => void;
  error?: string;
}

export function EstadoPicker({ value, onChange, error }: Props) {
  return (
    <View style={styles.wrapper}>
      <View style={styles.row}>
        {OPCIONES.map((opcion) => {
          const activo = value === opcion.key;
          return (
            <Pressable
              key={opcion.key}
              accessibilityRole="radio"
              accessibilityState={{ selected: activo }}
              onPress={() => onChange(opcion.key)}
              style={({ pressed }) => [
                styles.card,
                activo && styles.cardActive,
                pressed && styles.pressed,
              ]}>
              <View style={[styles.iconBox, activo && styles.iconBoxActive]}>
                <AppIcon name={opcion.icon} size={20} color={activo ? Brand.primaryDark : Brand.textMuted} />
              </View>
              <Text style={[styles.label, activo && styles.labelActive]}>{opcion.label}</Text>
              <Text style={styles.hint}>{opcion.hint}</Text>
            </Pressable>
          );
        })}
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { gap: 7 },
  row: { flexDirection: 'row', gap: 8 },
  card: {
    flex: 1,
    minHeight: 118,
    borderRadius: Radius.md,
    borderWidth: 1.5,
    borderColor: Brand.border,
    backgroundColor: Brand.surface,
    padding: 10,
    alignItems: 'center',
    gap: 4,
  },
  cardActive: { borderColor: Brand.primary, backgroundColor: Brand.primaryLight },
  pressed: { opacity: 0.85 },
  iconBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: Brand.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  iconBoxActive: { backgroundColor: '#FFFFFF' },
  label: { fontSize: 12, fontWeight: '800', color: Brand.text, textAlign: 'center' },
  labelActive: { color: Brand.primaryDark },
  hint: { fontSize: 10, color: Brand.textMuted, textAlign: 'center' },
  error: { color: Brand.danger, fontSize: 12, fontWeight: '600' },
});
