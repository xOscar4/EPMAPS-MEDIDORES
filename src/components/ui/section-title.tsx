import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, Text, View } from "react-native";

import { Brand } from "@/constants/brand";

interface Props {
  index: string;
  title: string;
  subtitle?: string;
}

/** Título de sección con gota numerada y filete de agua. */
export function SectionTitle({ index, title, subtitle }: Props) {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[Brand.deepMid, Brand.deepEnd, Brand.accentBright]}
        start={{ x: 0.2, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.index}
      >
        <Text style={styles.indexText}>{index}</Text>
      </LinearGradient>
      <View style={styles.texts}>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: "row", alignItems: "center", gap: 12 },
  index: {
    width: 32,
    height: 32,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.38)",
    alignItems: "center",
    justifyContent: "center",
  },
  indexText: { color: "#FFFFFF", fontSize: 12, fontWeight: "800" },
  texts: { flex: 1, minWidth: 0, gap: 1 },
  title: {
    fontSize: 16,
    fontWeight: "800",
    color: Brand.text,
    letterSpacing: -0.2,
  },
  subtitle: { fontSize: 11, color: Brand.textMuted, fontWeight: "600" },
});
