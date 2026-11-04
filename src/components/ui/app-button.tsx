import { LinearGradient } from "expo-linear-gradient";
import {
    ActivityIndicator,
    Pressable,
    Text,
    View,
    type StyleProp,
    type ViewStyle,
} from "react-native";
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from "react-native-reanimated";

import { Brand, Shadows } from "@/constants/brand";
import type { IconName } from "@/constants/icons";
import { AppIcon } from "./app-icon";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type Variante = "primary" | "secondary" | "ghost" | "danger";

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
  primary: {
    texto: "#FFFFFF",
    borde: "rgba(255,255,255,0.20)",
    icono: "rgba(255,255,255,0.14)",
  },
  secondary: {
    texto: Brand.primaryDark,
    borde: "rgba(13,94,140,0.14)",
    icono: "rgba(13,94,140,0.08)",
  },
  ghost: {
    texto: Brand.primary,
    borde: "rgba(13,94,140,0.20)",
    icono: "rgba(13,94,140,0.06)",
  },
  danger: {
    texto: Brand.danger,
    borde: "rgba(184,59,52,0.18)",
    icono: "rgba(184,59,52,0.08)",
  },
} as const;

const FONDOS: Record<Variante, string> = {
  primary: "transparent",
  secondary: "#EEF7FC",
  ghost: "#F9FBFD",
  danger: "#FFF4F3",
};

export function AppButton({
  title,
  onPress,
  variant = "primary",
  icon,
  loading = false,
  disabled = false,
  style,
}: Props) {
  const colores = ESTILOS[variant];
  const inactivo = disabled || loading;

  // Animación de escala al presionar: feedback inmediato en todos los botones.
  const escala = useSharedValue(1);
  const estiloEscala = useAnimatedStyle(() => ({
    transform: [{ scale: escala.value }],
  }));

  const presionar = () => {
    if (!inactivo) {
      escala.set(withSpring(0.96, { damping: 16, stiffness: 320 }));
    }
  };

  const soltar = () => {
    escala.set(withSpring(1, { damping: 16, stiffness: 320 }));
  };

  return (
    <AnimatedPressable
      accessibilityRole="button"
      accessibilityState={{ disabled: inactivo }}
      disabled={inactivo}
      onPress={onPress}
      onPressIn={presionar}
      onPressOut={soltar}
      className="min-h-[52px] flex-row items-center justify-center gap-2 overflow-hidden rounded-[16px] border px-3.5 py-2.5"
      style={[
        { backgroundColor: FONDOS[variant], borderColor: colores.borde },
        variant === "primary" && Shadows.card,
        inactivo && { opacity: 0.55 },
        estiloEscala,
        style,
      ]}
    >
      {variant === "primary" ? (
        <LinearGradient
          colors={[Brand.primaryDark, Brand.deepMid, Brand.deepEnd]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ position: "absolute", top: 0, right: 0, bottom: 0, left: 0 }}
          pointerEvents="none"
        />
      ) : null}

      {loading ? (
        <ActivityIndicator color={colores.texto} />
      ) : (
        <>
          {icon ? (
            <View
              className="h-[30px] w-[30px] items-center justify-center rounded-[10px]"
              style={{ backgroundColor: colores.icono }}
            >
              <AppIcon name={icon} size={16} color={colores.texto} />
            </View>
          ) : null}
          <Text
            className="shrink text-[15px] font-extrabold tracking-[0.2px]"
            style={{ color: colores.texto }}
            numberOfLines={2}
          >
            {title}
          </Text>
        </>
      )}
    </AnimatedPressable>
  );
}
