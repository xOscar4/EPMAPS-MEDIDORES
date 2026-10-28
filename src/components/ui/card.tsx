import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";

import { Brand, Shadows } from "@/constants/brand";

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
        style={[
          styles.card,
          styles.plain,
          padded && styles.padded,
          elevated && Shadows.card,
          style,
        ]}
      >
        {children}
      </View>
    );
  }

  return (
    <LinearGradient
      colors={
        variant === "accent"
          ? ["#FFFFFF", "#F4FBFD"]
          : [Brand.glassStrong, Brand.glassSoft]
      }
      start={{ x: 0, y: 0 }}
      end={{ x: 0.9, y: 1 }}
      style={[
        styles.card,
        padded && styles.padded,
        elevated && Shadows.card,
        variant === "accent" && styles.accentCard,
        style,
      ]}
    >
      {variant === "accent" ? (
        <LinearGradient
          colors={[Brand.accentBright, Brand.deepEnd, Brand.primary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.rail}
          pointerEvents="none"
        />
      ) : null}
      {children}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 24,
    borderWidth: 1,
    borderColor: Brand.border,
    overflow: "hidden",
    backgroundColor: "rgba(255,255,255,0.96)",
  },
  plain: { backgroundColor: "#FFFFFF" },
  accentCard: { paddingTop: 20 },
  padded: { padding: 18 },
  rail: { position: "absolute", top: 0, left: 0, right: 0, height: 5 },
});
