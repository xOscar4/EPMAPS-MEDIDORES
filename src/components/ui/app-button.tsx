import { LinearGradient } from "expo-linear-gradient";
import {
    ActivityIndicator,
    Pressable,
    StyleSheet,
    Text,
    View,
    type StyleProp,
    type ViewStyle,
} from "react-native";

import { Brand, Shadows } from "@/constants/brand";
import type { IconName } from "@/constants/icons";
import { AppIcon } from "./app-icon";

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

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: inactivo }}
      disabled={inactivo}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        { backgroundColor: FONDOS[variant], borderColor: colores.borde },
        variant === "primary" && Shadows.card,
        pressed && styles.pressed,
        inactivo && styles.disabled,
        style,
      ]}
    >
      {variant === "primary" ? (
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
          <Text
            style={[styles.texto, { color: colores.texto }]}
            numberOfLines={2}
          >
            {title}
          </Text>
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 52,
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    overflow: "hidden",
  },
  iconBox: {
    width: 30,
    height: 30,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  texto: { fontSize: 15, fontWeight: "800", letterSpacing: 0.2, flexShrink: 1 },
  pressed: { opacity: 0.92, transform: [{ scale: 0.99 }] },
  disabled: { opacity: 0.55 },
});
