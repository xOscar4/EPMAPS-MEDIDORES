import { LinearGradient } from "expo-linear-gradient";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { Brand, Shadows } from "@/constants/brand";
import { Icons } from "@/constants/icons";
import { AppIcon } from "./app-icon";

interface Props {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  right?: React.ReactNode;
}

/** Encabezado común de las pantallas fuera de las tabs. */
export function ScreenHeader({ title, subtitle, onBack, right }: Props) {
  return (
    <View style={styles.header}>
      {onBack ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Volver"
          onPress={onBack}
          style={({ pressed }) => [styles.back, pressed && styles.pressed]}
        >
          <AppIcon name={Icons.arrowBack} size={20} color={Brand.primaryDark} />
        </Pressable>
      ) : null}
      <View style={styles.titles}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        {subtitle ? (
          <Text style={styles.subtitle} numberOfLines={1}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      {right}
      <LinearGradient
        colors={[Brand.accentBright, Brand.accent, "rgba(15,166,180,0)"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.hairline}
        pointerEvents="none"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 14,
    backgroundColor: "rgba(255,255,255,0.96)",
    borderBottomWidth: 1,
    borderBottomColor: Brand.border,
    overflow: "hidden",
  },
  hairline: { position: "absolute", left: 0, right: 0, bottom: 0, height: 2 },
  back: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: "#F4FAFF",
    borderWidth: 1,
    borderColor: "rgba(13,94,140,0.12)",
    alignItems: "center",
    justifyContent: "center",
    ...Shadows.card,
  },
  pressed: { opacity: 0.7 },
  titles: { flex: 1, minWidth: 0, gap: 2 },
  title: {
    fontSize: 20,
    fontWeight: "800",
    color: Brand.text,
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 11,
    color: Brand.accentDeep,
    fontWeight: "700",
    letterSpacing: 0.2,
  },
});
