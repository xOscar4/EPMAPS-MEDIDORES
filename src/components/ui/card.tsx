import { View, type StyleProp, type ViewStyle } from "react-native";

import { Brand, Shadows } from "@/constants/brand";
import { AppGradient } from "./app-gradient";

type Variante = "glass" | "plain" | "accent";

interface Props {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  padded?: boolean;
  elevated?: boolean;
  /** `glass` = vidrio, `plain` = superficie blanca sin sombra, `accent` = filete de agua. */
  variant?: Variante;
}

/** Superficie reutilizada por todas las tarjetas, con tres acabados del sistema. */
export function Card({
  children,
  style,
  padded = true,
  elevated = true,
  variant = "glass",
}: Props) {
  if (variant === "plain") {
    return (
      <View
        className={`overflow-hidden rounded-[24px] border border-brand-border bg-white ${
          padded ? "p-[18px]" : ""
        }`}
        style={[elevated && Shadows.card, style]}
      >
        {children}
      </View>
    );
  }

  return (
    <AppGradient
      colors={
        variant === "accent"
          ? ["#FFFFFF", "#F4FBFD"]
          : [Brand.glassStrong, Brand.glassSoft]
      }
      start={{ x: 0, y: 0 }}
      end={{ x: 0.9, y: 1 }}
      className={`overflow-hidden rounded-[24px] border border-brand-border bg-white/95 ${
        padded ? "p-[18px]" : ""
      } ${variant === "accent" ? "pt-5" : ""}`}
      style={[elevated && Shadows.card, style]}
    >
      {variant === "accent" ? (
        <AppGradient
          colors={[Brand.accentBright, Brand.deepEnd, Brand.primary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          className="absolute left-0 right-0 top-0 h-[5px]"
          pointerEvents="none"
        />
      ) : null}
      {children}
    </AppGradient>
  );
}
