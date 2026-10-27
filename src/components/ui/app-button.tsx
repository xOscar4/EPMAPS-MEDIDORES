import { LinearGradient } from 'expo-linear-gradient';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { Brand, Radius, Shadows } from '@/constants/brand';
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

/**
 * Cada variante tiene relleno propio y suficiente contraste: ningún botón
 * depende del fondo para distinguirse.
 */
const ESTILOS = {
  primary: { texto: '#FFFFFF', borde: 'rgba(255,255,255,0.28)' },
  secondary: { texto: Brand.primaryDeep, borde: 'rgba(11,92,142,0.22)' },
  ghost: { texto: Brand.primary, borde: 'rgba(11,92,142,0.26)' },
  danger: { texto: Brand.danger, borde: 'rgba(179,38,30,0.26)' },
} as const;

const FONDOS: Record<Variante, string> = {
  primary: 'transparent',
  secondary: '#E3F2FB',
  ghost: '#FFFFFF',
  danger: '#FDECEA',
};

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
        { backgroundColor: FONDOS[variant], borderColor: colores.borde },
        variant === 'primary' && Shadows.card,
        pressed && styles.pressed,
        inactivo && styles.disabled,
        style,
      ]}>
      {variant === 'primary' ? (
        <LinearGradient
          colors={[Brand.deepMid, Brand.deepEnd]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
          pointerEvents="none"
        />
      ) : null}

      {loading ? (
        <ActivityIndicator color={colores.texto} />
      ) : (
        <>
          {icon ? <AppIcon name={icon} size={18} color={colores.texto} /> : null}
          <Text style={[styles.texto, { color: colores.texto }]} numberOfLines={2}>
            {title}
          </Text>
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 50,
    borderRadius: Radius.md,
    borderWidth: 1,
    paddingHorizontal: 18,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    overflow: 'hidden',
  },
  texto: { fontSize: 15, fontWeight: '700', letterSpacing: 0.2, flexShrink: 1 },
  pressed: { opacity: 0.88 },
  disabled: { opacity: 0.5 },
});
