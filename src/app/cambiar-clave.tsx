import { Redirect, useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';

import { SuccessCheck } from '@/components/animations/success-check';
import { AppButton } from '@/components/ui/app-button';
import { AppIcon } from '@/components/ui/app-icon';
import { AppInput } from '@/components/ui/app-input';
import { Brand } from '@/constants/brand';
import { Icons } from '@/constants/icons';
import { useAuth } from '@/features/auth/auth-provider';
import { AuthScreen } from '@/features/auth/components/auth-screen';
import { PasswordStrengthMeter } from '@/features/auth/components/password-strength-meter';
import { mensajeDeError } from '@/features/auth/errores-firebase';
import {
  validarClave,
  validarConfirmacion,
} from '@/features/auth/validaciones';

type Errores = Partial<Record<'actual' | 'nueva' | 'confirmacion', string | null>>;

export default function CambiarClaveScreen() {
  const { usuario, tecnico, cargando, emailVerificado, cambiarClave } = useAuth();
  const router = useRouter();

  const [actual, setActual] = useState('');
  const [nueva, setNueva] = useState('');
  const [confirmacion, setConfirmacion] = useState('');
  const [verClaves, setVerClaves] = useState(false);
  const [errores, setErrores] = useState<Errores>({});
  const [error, setError] = useState('');
  const [guardando, setGuardando] = useState(false);
  const [cambiada, setCambiada] = useState(false);

  if (cargando) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator color={Brand.primary} size="large" />
      </View>
    );
  }

  if (!usuario) return <Redirect href="/" />;
  if (!emailVerificado) return <Redirect href="/verificar-correo" />;
  if (!tecnico) return null;

  const volver = () => {
    if (router.canGoBack()) router.back();
    else router.replace('/ajustes');
  };

  const guardar = async () => {
    setError('');
    const nuevosErrores: Errores = {
      actual: actual ? null : 'Escribe tu contraseña actual.',
      nueva: validarClave(nueva),
      confirmacion: validarConfirmacion(nueva, confirmacion),
    };
    setErrores(nuevosErrores);
    if (Object.values(nuevosErrores).some(Boolean)) return;

    setGuardando(true);
    try {
      await cambiarClave(actual, nueva);
      setCambiada(true);
    } catch (e) {
      setError(
        mensajeDeError(e, {
          'auth/invalid-credential': 'La contraseña actual no es correcta.',
          'auth/wrong-password': 'La contraseña actual no es correcta.',
        }),
      );
    } finally {
      setGuardando(false);
    }
  };

  if (cambiada) {
    return (
      <AuthScreen
        eyebrow="EPMAPS · SEGURIDAD"
        title="Contraseña actualizada"
        subtitle="Tu nueva contraseña ya está activa en Firebase."
      >
        <View className="items-center gap-3 py-2">
          <SuccessCheck size={76} />
          <Text className="text-center text-[18px] font-extrabold text-brand-text">
            Cambio completado
          </Text>
          <Text className="text-center text-[13px] leading-5 text-brand-muted">
            La próxima vez que inicies sesión usa la contraseña nueva. La sesión
            actual sigue abierta.
          </Text>
        </View>
        <AppButton title="Volver a ajustes" icon={Icons.check} onPress={volver} />
      </AuthScreen>
    );
  }

  return (
    <AuthScreen
      eyebrow="EPMAPS · SEGURIDAD"
      title="Cambiar contraseña"
      subtitle="Confirma tu contraseña actual y elige una nueva."
      onBack={volver}
    >
      <AppInput
        label="Contraseña actual"
        value={actual}
        onChangeText={setActual}
        placeholder="••••••••"
        secureTextEntry={!verClaves}
        autoCapitalize="none"
        autoCorrect={false}
        autoComplete="current-password"
        textContentType="password"
        error={errores.actual ?? undefined}
        returnKeyType="next"
      />

      <View className="gap-1.5">
        <AppInput
          label="Contraseña nueva"
          value={nueva}
          onChangeText={setNueva}
          placeholder="Mínimo 8 caracteres"
          secureTextEntry={!verClaves}
          autoCapitalize="none"
          autoCorrect={false}
          autoComplete="new-password"
          textContentType="newPassword"
          error={errores.nueva ?? undefined}
          returnKeyType="next"
        />
        <PasswordStrengthMeter clave={nueva} />
      </View>

      <AppInput
        label="Repetir contraseña nueva"
        value={confirmacion}
        onChangeText={setConfirmacion}
        placeholder="Escribe la misma contraseña"
        secureTextEntry={!verClaves}
        autoCapitalize="none"
        autoCorrect={false}
        autoComplete="new-password"
        textContentType="newPassword"
        error={errores.confirmacion ?? undefined}
        returnKeyType="done"
        onSubmitEditing={() => void guardar()}
        right={
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={
              verClaves ? 'Ocultar contraseñas' : 'Mostrar contraseñas'
            }
            onPress={() => setVerClaves((valor) => !valor)}
            hitSlop={10}
          >
            <AppIcon
              name={verClaves ? Icons.eyeOff : Icons.eye}
              size={19}
              color={Brand.textMuted}
            />
          </Pressable>
        }
      />

      {error ? (
        <View className="flex-row items-center gap-2 rounded-[12px] border border-[rgba(184,59,52,0.18)] bg-[rgba(184,59,52,0.08)] p-2.5">
          <AppIcon name={Icons.error} size={17} color={Brand.danger} />
          <Text className="flex-1 text-[12px] font-semibold text-brand-danger">
            {error}
          </Text>
        </View>
      ) : null}

      <Text className="text-[11px] leading-4 text-brand-muted">
        Por seguridad, Firebase pide confirmar la contraseña actual antes de
        cambiarla (reauthenticateWithCredential).
      </Text>

      <AppButton
        title="Guardar contraseña nueva"
        icon={Icons.save}
        loading={guardando}
        onPress={() => void guardar()}
      />
    </AuthScreen>
  );
}
