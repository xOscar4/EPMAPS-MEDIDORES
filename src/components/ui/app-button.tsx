import { LinearGradient } from 'expo-linear-gradient';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
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
  primary: { texto: '#FFFFFF', borde: 'rgba(255,255,255,0.26)', icono: 'rgba(255,255,255,0.18)' },
  secondary: { texto: Brand.primaryDark, borde: 'rgba(10,90,140,0.20)', icono: 'rgba(10,90,140,0.08)' },
  ghost: { texto: Brand.primary, borde: 'rgba(10,90,140,0.24)', icono: 'rgba(10,90,140,0.06)' },
  danger: { texto: Brand.danger, borde: 'rgba(168,35,28,0.24)', icono: 'rgba(168,35,28,0.08)' },
} as const;

const FONDOS: Record<Variante, string> = {
  primary: 'transparent',
  secondary: '#E7F4FB',
  ghost: '#FFFFFF',
  danger: '#FDF1EF',
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
          colors={[Brand.primaryDark, Brand.deepMid, Brand.deepEnd]}
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
          {icon ? (
            <View style={[styles.iconBox, { backgroundColor: colores.icono }]}>
              <AppIcon name={icon} size={16} color={colores.texto} />
            </View>
          ) : null}
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
    paddingHorizontal: 12,
    paddingVertical: 9,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    overflow: 'hidden',
  },
  iconBox: {
    width: 28,
    height: 28,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  texto: { fontSize: 15, fontWeight: '700', letterSpacing: 0.2, flexShrink: 1 },
  pressed: { opacity: 0.9, transform: [{ scale: 0.99 }] },
  disabled: { opacity: 0.55 },
});
