import { Redirect, useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useShake } from '@/components/animations/use-shake';
import { AppButton } from '@/components/ui/app-button';
import { AppGradient } from '@/components/ui/app-gradient';
import { AppIcon } from '@/components/ui/app-icon';
import { AppInput } from '@/components/ui/app-input';
import {
  WaterGlow,
  WaterRipples,
  WaterWaves,
} from '@/components/ui/water-decor';
import { Brand, Shadows } from '@/constants/brand';
import { Icons } from '@/constants/icons';
import { useAuth } from '@/features/auth/auth-provider';
import { mensajeDeError } from '@/features/auth/errores-firebase';
import { validarClave, validarCorreo } from '@/features/auth/validaciones';

export default function LoginScreen() {
  const { usuario, tecnico, cargando, emailVerificado, iniciarSesion } = useAuth();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { agitar, estilo: estiloSacudida } = useShake();

  const [correo, setCorreo] = useState('');
  const [clave, setClave] = useState('');
  const [verClave, setVerClave] = useState(false);
  const [errores, setErrores] = useState<{
    correo?: string | null;
    clave?: string | null;
  }>({});
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);

  if (cargando) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator color={Brand.primary} size="large" />
      </View>
    );
  }

  // Con sesión pero sin verificar, primero se confirma el correo.
  if (usuario && !emailVerificado) return <Redirect href="/verificar-correo" />;
  if (tecnico) return <Redirect href="/rutas" />;

  const entrar = async () => {
    Keyboard.dismiss();
    setError('');

    const nuevosErrores = {
      correo: validarCorreo(correo),
      clave: validarClave(clave),
    };
    setErrores(nuevosErrores);
    if (nuevosErrores.correo || nuevosErrores.clave) {
      agitar();
      return;
    }

    setEnviando(true);
    try {
      // Al iniciar sesión, onAuthStateChanged actualiza el estado y la
      // navegación reacciona sola (rutas o verificación de correo).
      await iniciarSesion(correo, clave);
    } catch (e) {
      setError(mensajeDeError(e));
      agitar();
    } finally {
      setEnviando(false);
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={{ paddingBottom: 28 + insets.bottom }}
        keyboardShouldPersistTaps="handled"
      >
        <AppGradient
          colors={[Brand.deepStart, Brand.deepMid, Brand.deepEnd]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="gap-2.5 overflow-hidden rounded-b-[36px] px-6 pb-[68px] pt-[34px]"
        >
          <WaterGlow style={{ right: -90, top: -80 }} opacity={0.62} />
          <WaterRipples
            size={200}
            tone="rgba(255,255,255,0.14)"
            style={{ right: -66, top: -18 }}
          />
          <WaterWaves opacity={0.16} />

          <View
            className="mb-2 h-[68px] w-[68px] items-center justify-center rounded-[22px] border border-white/90 bg-white/95"
            style={Shadows.floating}
          >
            <AppIcon name={Icons.drop} size={34} color={Brand.primary} />
          </View>
          <Text className="text-[11px] font-extrabold tracking-[1.5px] text-[#B9E7EF]">
            EPMAPS · LECTURAS EN CAMPO
          </Text>
          <Text className="text-[34px] font-extrabold leading-[39px] tracking-[-0.6px] text-white">
            El agua se mide{'\n'}mejor con datos.
          </Text>
          <Text className="max-w-[320px] text-[14px] leading-[21px] text-[#D6EAF3]">
            Registra la lectura, respalda con una foto y sincroniza cuando
            vuelva la señal.
          </Text>
        </AppGradient>

        <Animated.View style={[estiloSacudida, { marginHorizontal: 18, marginTop: -38 }]}>
          <AppGradient
            colors={['#FFFFFF', '#F7FBFD']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="gap-3 rounded-[30px] border border-brand-border p-5"
            style={Shadows.floating}
          >
            <View className="mb-1 h-1 w-12 self-center rounded-full bg-[#D7E8F4]" />
            <Text className="text-[22px] font-extrabold tracking-[-0.4px] text-brand-text">
              Iniciar jornada
            </Text>
            <Text className="-mt-2 mb-0.5 text-[13px] text-brand-muted">
              Ingresa con tu correo institucional.
            </Text>

            <AppInput
              label="Correo electrónico"
              value={correo}
              onChangeText={setCorreo}
              placeholder="nombre.apellido@epn.edu.ec"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="email"
              textContentType="emailAddress"
              error={errores.correo ?? undefined}
              returnKeyType="next"
            />

            <AppInput
              label="Contraseña"
              value={clave}
              onChangeText={setClave}
              placeholder="••••••••"
              secureTextEntry={!verClave}
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="current-password"
              textContentType="password"
              error={errores.clave ?? undefined}
              returnKeyType="done"
              onSubmitEditing={() => void entrar()}
              right={
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={
                    verClave ? 'Ocultar contraseña' : 'Mostrar contraseña'
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

            <Pressable
              accessibilityRole="link"
              onPress={() =>
                router.push({
                  pathname: '/recuperar',
                  params: correo ? { correo } : undefined,
                })
              }
              hitSlop={8}
              className="-mt-1 self-end py-1"
            >
              <Text className="text-[12px] font-bold text-brand-primary">
                ¿Olvidaste tu contraseña?
              </Text>
            </Pressable>

            {error ? (
              <View className="flex-row items-center gap-2 rounded-[12px] border border-[rgba(184,59,52,0.18)] bg-[rgba(184,59,52,0.08)] p-2.5">
                <AppIcon name={Icons.error} size={17} color={Brand.danger} />
                <Text className="flex-1 text-[12px] font-semibold text-brand-danger">
                  {error}
                </Text>
              </View>
            ) : null}

            <AppButton
              title="Entrar a mi ruta"
              icon={Icons.arrowForward}
              loading={enviando}
              onPress={() => void entrar()}
            />

            <View className="mt-1 flex-row items-center justify-center gap-1">
              <Text className="text-[12px] text-brand-muted">
                ¿No tienes cuenta?
              </Text>
              <Pressable
                accessibilityRole="link"
                onPress={() => router.push('/registro')}
                hitSlop={8}
              >
                <Text className="text-[12px] font-extrabold text-brand-primary">
                  Regístrate
                </Text>
              </Pressable>
            </View>
          </AppGradient>
        </Animated.View>

        <Text className="mt-6 text-center text-[11px] text-brand-muted">
          ESFOT · Deber 5 de desarrollo móvil · EPMAPS
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
