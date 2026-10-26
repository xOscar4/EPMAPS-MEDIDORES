import { Redirect, useRouter } from 'expo-router';
import { useState } from 'react';
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
} from 'react-native';

import { AppButton } from '@/components/ui/app-button';
import { AppIcon } from '@/components/ui/app-icon';
import { AppInput } from '@/components/ui/app-input';
import { Brand, Radius, Shadows } from '@/constants/brand';
import { Icons } from '@/constants/icons';
import { useAuth } from '@/features/auth/auth-provider';

export default function LoginScreen() {
  const { tecnico, cargando, iniciarSesion } = useAuth();
  const router = useRouter();
  const [codigo, setCodigo] = useState('');
  const [clave, setClave] = useState('');
  const [verClave, setVerClave] = useState(false);
  const [error, setError] = useState('');
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
    setError('');
    if (!codigo.trim() || !clave.trim()) {
      setError('Ingresa tu código de empleado y tu clave.');
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
      router.replace('/rutas');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo iniciar sesión.');
    } finally {
      setEnviando(false);
    }
  };

  const usarDemo = () => {
    setCodigo('EMP-001');
    setClave('epmaps2026');
    setError('');
  };

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.hero}>
          <View style={styles.bubbleBig} />
          <View style={styles.bubbleSmall} />
          <View style={styles.logo}>
            <AppIcon name={Icons.drop} size={34} color={Brand.primary} />
          </View>
          <Text style={styles.eyebrow}>EPMAPS · LECTURAS EN CAMPO</Text>
          <Text style={styles.title}>El agua se mide{'\n'}mejor con datos.</Text>
          <Text style={styles.heroText}>
            Registra la lectura, respalda con una foto y sincroniza cuando vuelva la señal.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Iniciar jornada</Text>
          <Text style={styles.cardSubtitle}>Identifícate con tu código de empleado.</Text>

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
                accessibilityLabel={verClave ? 'Ocultar clave' : 'Mostrar clave'}
                onPress={() => setVerClave((valor) => !valor)}
                hitSlop={10}>
                <AppIcon name={verClave ? Icons.eyeOff : Icons.eye} size={19} color={Brand.textMuted} />
              </Pressable>
            }
          />

          <Pressable onPress={usarDemo} hitSlop={8} style={styles.demoFill}>
            <AppIcon name={Icons.person} size={15} color={Brand.primary} />
            <Text style={styles.demoFillText}>Usar credenciales de demostración</Text>
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
        </View>

        <Text style={styles.footer}>ESFOT · Prueba I de desarrollo móvil</Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Brand.background },
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: Brand.background },
  content: { paddingBottom: 32 },
  hero: {
    backgroundColor: Brand.primaryDark,
    paddingHorizontal: 24,
    paddingTop: 36,
    paddingBottom: 54,
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,
    overflow: 'hidden',
    gap: 10,
  },
  bubbleBig: {
    position: 'absolute',
    right: -70,
    top: -60,
    width: 210,
    height: 210,
    borderRadius: 105,
    backgroundColor: 'rgba(18,166,180,0.22)',
  },
  bubbleSmall: {
    position: 'absolute',
    right: 40,
    bottom: -50,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  logo: {
    width: 62,
    height: 62,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  eyebrow: { color: '#8FDDE4', fontSize: 11, fontWeight: '800', letterSpacing: 1.4 },
  title: { color: '#FFFFFF', fontSize: 34, lineHeight: 39, fontWeight: '800' },
  heroText: { color: '#C9DEEA', fontSize: 14, lineHeight: 21, maxWidth: 320 },
  card: {
    marginHorizontal: 20,
    marginTop: -28,
    backgroundColor: Brand.surface,
    borderRadius: Radius.xl,
    padding: 20,
    gap: 14,
    ...Shadows.floating,
  },
  cardTitle: { fontSize: 22, fontWeight: '800', color: Brand.text },
  cardSubtitle: { fontSize: 13, color: Brand.textMuted, marginTop: -8, marginBottom: 2 },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Brand.dangerSoft,
    borderRadius: Radius.sm,
    padding: 10,
  },
  errorText: { flex: 1, color: Brand.danger, fontSize: 12, fontWeight: '600' },
  demoFill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 2,
  },
  demoFillText: { color: Brand.primary, fontSize: 12, fontWeight: '700' },
  footer: { textAlign: 'center', color: Brand.textMuted, fontSize: 11, marginTop: 24 },
});
