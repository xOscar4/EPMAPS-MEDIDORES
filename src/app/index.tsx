import { LinearGradient } from "expo-linear-gradient";
import { Redirect, useRouter } from "expo-router";
import { useState } from "react";
import {
    ActivityIndicator,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AppButton } from "@/components/ui/app-button";
import { AppIcon } from "@/components/ui/app-icon";
import { AppInput } from "@/components/ui/app-input";
import {
    WaterGlow,
    WaterRipples,
    WaterWaves,
} from "@/components/ui/water-decor";
import { Brand, Radius, Shadows } from "@/constants/brand";
import { Icons } from "@/constants/icons";
import { useAuth } from "@/features/auth/auth-provider";

export default function LoginScreen() {
  const { tecnico, cargando, iniciarSesion } = useAuth();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [codigo, setCodigo] = useState("");
  const [clave, setClave] = useState("");
  const [verClave, setVerClave] = useState(false);
  const [error, setError] = useState("");
  const [enviando, setEnviando] = useState(false);

  if (cargando) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={Brand.primary} size="large" />
      </View>
    );
  }

  if (tecnico) return <Redirect href="/rutas" />;

  const entrar = async () => {
    Keyboard.dismiss();
    setError("");
    if (!codigo.trim() || !clave.trim()) {
      setError("Ingresa tu código de empleado y tu clave.");
      return;
    }
    // Se limpian espacios y se muestran los valores que realmente se validan.
    const codigoLimpio = codigo.trim().toUpperCase();
    const claveLimpia = clave.trim();
    setCodigo(codigoLimpio);
    setClave(claveLimpia);
    setEnviando(true);
    try {
      await iniciarSesion(codigoLimpio, claveLimpia);
      router.replace("/rutas");
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo iniciar sesión.");
    } finally {
      setEnviando(false);
    }
  };

  const usarDemo = () => {
    setCodigo("EMP-001");
    setClave("epmaps2026");
    setError("");
  };

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: 28 + insets.bottom },
        ]}
        keyboardShouldPersistTaps="handled"
      >
        <LinearGradient
          colors={[Brand.deepStart, Brand.deepMid, Brand.deepEnd]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.hero}
        >
          <WaterGlow style={{ right: -90, top: -80 }} opacity={0.62} />
          <WaterRipples
            size={200}
            tone="rgba(255,255,255,0.14)"
            style={{ right: -66, top: -18 }}
          />
          <WaterWaves opacity={0.16} />
          <View style={styles.logo}>
            <AppIcon name={Icons.drop} size={34} color={Brand.primary} />
          </View>
          <Text style={styles.eyebrow}>EPMAPS · LECTURAS EN CAMPO</Text>
          <Text style={styles.title}>
            El agua se mide{"\n"}mejor con datos.
          </Text>
          <Text style={styles.heroText}>
            Registra la lectura, respalda con una foto y sincroniza cuando
            vuelva la señal.
          </Text>
        </LinearGradient>

        <LinearGradient
          colors={["#FFFFFF", "#F7FBFD"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.card}
        >
          <View style={styles.grabber} />
          <Text style={styles.cardTitle}>Iniciar jornada</Text>
          <Text style={styles.cardSubtitle}>
            Identifícate con tu código de empleado.
          </Text>

          <AppInput
            label="Código de empleado"
            value={codigo}
            onChangeText={setCodigo}
            placeholder="EMP-001"
            autoCapitalize="characters"
            autoCorrect={false}
            autoComplete="off"
            importantForAutofill="no"
            hint="Demo: EMP-001"
            returnKeyType="next"
          />

          <AppInput
            label="Clave"
            value={clave}
            onChangeText={setClave}
            placeholder="••••••••"
            secureTextEntry={!verClave}
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="off"
            importantForAutofill="no"
            hint="Demo: epmaps2026"
            returnKeyType="done"
            onSubmitEditing={() => void entrar()}
            right={
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={
                  verClave ? "Ocultar clave" : "Mostrar clave"
                }
                onPress={() => setVerClave((valor) => !valor)}
                hitSlop={10}
              >
                <AppIcon
                  name={verClave ? Icons.eyeOff : Icons.eye}
                  size={19}
                  color={Brand.textMuted}
                />
              </Pressable>
            }
          />

          <Pressable onPress={usarDemo} hitSlop={8} style={styles.demoFill}>
            <AppIcon name={Icons.person} size={15} color={Brand.primary} />
            <Text style={styles.demoFillText}>
              Usar credenciales de demostración
            </Text>
          </Pressable>

          {error ? (
            <View style={styles.errorBox}>
              <AppIcon name={Icons.error} size={17} color={Brand.danger} />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          <AppButton
            title="Entrar a mi ruta"
            icon={Icons.arrowForward}
            loading={enviando}
            onPress={() => void entrar()}
          />
        </LinearGradient>

        <Text style={styles.footer}>ESFOT · Prueba I de desarrollo móvil</Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "transparent" },
  loading: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  content: { paddingBottom: 34 },
  hero: {
    paddingHorizontal: 24,
    paddingTop: 34,
    paddingBottom: 68,
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,
    overflow: "hidden",
    gap: 10,
  },
  logo: {
    width: 68,
    height: 68,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.96)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.86)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
    ...Shadows.floating,
  },
  eyebrow: {
    color: "#B9E7EF",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1.5,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 34,
    lineHeight: 39,
    fontWeight: "800",
    letterSpacing: -0.6,
  },
  heroText: { color: "#D6EAF3", fontSize: 14, lineHeight: 21, maxWidth: 320 },
  card: {
    marginHorizontal: 18,
    marginTop: -38,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: Brand.border,
    padding: 20,
    gap: 13,
    ...Shadows.floating,
  },
  grabber: {
    alignSelf: "center",
    width: 48,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#D7E8F4",
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: Brand.text,
    letterSpacing: -0.4,
  },
  cardSubtitle: {
    fontSize: 13,
    color: Brand.textMuted,
    marginTop: -8,
    marginBottom: 2,
  },
  errorBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "rgba(184,59,52,0.08)",
    borderWidth: 1,
    borderColor: "rgba(184,59,52,0.18)",
    borderRadius: Radius.sm,
    padding: 10,
  },
  errorText: { flex: 1, color: Brand.danger, fontSize: 12, fontWeight: "600" },
  demoFill: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    minHeight: 42,
    paddingHorizontal: 12,
    borderRadius: 14,
    backgroundColor: Brand.primaryLight,
    borderWidth: 1,
    borderColor: "rgba(13,94,140,0.12)",
  },
  demoFillText: {
    color: Brand.primary,
    fontSize: 12,
    fontWeight: "700",
    flexShrink: 1,
  },
  footer: {
    textAlign: "center",
    color: Brand.textMuted,
    fontSize: 11,
    marginTop: 24,
  },
});
