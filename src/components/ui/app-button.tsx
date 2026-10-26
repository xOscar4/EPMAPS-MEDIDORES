import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { Brand, Radius } from '@/constants/brand';
import type { IconName } from '@/constants/icons';
import { AppIcon } from './app-icon';

type Variante = 'primary' | 'secondary' | 'ghost' | 'danger';

interface Props {
  title: string;
  onPress: () => void;
  variant?: Variante;
  icon?: IconName;
  loading?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

const ESTILOS = {
  primary: { fondo: Brand.primary, texto: '#FFFFFF', borde: Brand.primary },
  secondary: { fondo: Brand.primaryLight, texto: Brand.primaryDark, borde: Brand.primaryLight },
  ghost: { fondo: 'transparent', texto: Brand.primary, borde: Brand.border },
  danger: { fondo: Brand.dangerSoft, texto: Brand.danger, borde: Brand.dangerSoft },
} as const;

export function AppButton({
  title,
  onPress,
  variant = 'primary',
  icon,
  loading = false,
  disabled = false,
  style,
}: Props) {
  const colores = ESTILOS[variant];
  const inactivo = disabled || loading;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: inactivo }}
      disabled={inactivo}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        { backgroundColor: colores.fondo, borderColor: colores.borde },
        pressed && styles.pressed,
        inactivo && styles.disabled,
        style,
      ]}>
      {loading ? (
        <ActivityIndicator color={colores.texto} />
      ) : (
        <>
          {icon ? <AppIcon name={icon} size={18} color={colores.texto} /> : null}
          <Text style={[styles.texto, { color: colores.texto }]}>{title}</Text>
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 52,
    borderRadius: Radius.md,
    borderWidth: 1,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  texto: { fontSize: 16, fontWeight: '700' },
  pressed: { opacity: 0.82, transform: [{ scale: 0.99 }] },
  disabled: { opacity: 0.5 },
});
