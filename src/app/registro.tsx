import { Redirect, useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Keyboard,
  Pressable,
  Text,
  View,
} from 'react-native';

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
  validarCorreo,
  validarNombre,
} from '@/features/auth/validaciones';

type Errores = Partial<
  Record<'nombre' | 'correo' | 'clave' | 'confirmacion', string | null>
>;

export default function RegistroScreen() {
  const { usuario, tecnico, cargando, emailVerificado, registrarse } = useAuth();
  const router = useRouter();

  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [clave, setClave] = useState('');
  const [confirmacion, setConfirmacion] = useState('');
  const [verClave, setVerClave] = useState(false);
  const [errores, setErrores] = useState<Errores>({});
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);

  if (cargando) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator color={Brand.primary} size="large" />
      </View>
    );
  }

  if (usuario && !emailVerificado) return <Redirect href="/verificar-correo" />;
  if (tecnico) return <Redirect href="/rutas" />;

  const crearCuenta = async () => {
    Keyboard.dismiss();
    setError('');

    const nuevosErrores: Errores = {
      nombre: validarNombre(nombre),
      correo: validarCorreo(correo),
      clave: validarClave(clave),
      confirmacion: validarConfirmacion(clave, confirmacion),
    };
    setErrores(nuevosErrores);
    if (Object.values(nuevosErrores).some(Boolean)) return;

    setEnviando(true);
    try {
      await registrarse(nombre, correo, clave);
    } catch (e) {
      setError(mensajeDeError(e));
    } finally {
      setEnviando(false);
    }
  };

  return (
    <AuthScreen
      eyebrow="EPMAPS · CUENTA DE CAMPO"
      title="Crear cuenta"
      subtitle="Registra tus datos para ingresar a la ruta y enviar lecturas."
      onBack={() => router.replace('/')}
      footer={
        <View className="flex-row items-center justify-center gap-1">
          <Text className="text-[12px] text-brand-muted">¿Ya tienes cuenta?</Text>
          <Pressable
            accessibilityRole="link"
            onPress={() => router.replace('/')}
            hitSlop={8}
          >
            <Text className="text-[12px] font-extrabold text-brand-primary">
              Inicia sesión
            </Text>
          </Pressable>
        </View>
      }
    >
      <AppInput
        label="Nombre completo"
        value={nombre}
        onChangeText={setNombre}
        placeholder="Oscar Vásquez"
        autoCapitalize="words"
        autoComplete="name"
        textContentType="name"
        error={errores.nombre ?? undefined}
        returnKeyType="next"
      />

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

      <View className="gap-1.5">
        <AppInput
          label="Contraseña"
          value={clave}
          onChangeText={setClave}
          placeholder="Mínimo 8 caracteres"
          secureTextEntry={!verClave}
          autoCapitalize="none"
          autoCorrect={false}
          autoComplete="new-password"
          textContentType="newPassword"
          error={errores.clave ?? undefined}
          returnKeyType="next"
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
        <PasswordStrengthMeter clave={clave} />
      </View>

      <AppInput
        label="Repetir contraseña"
        value={confirmacion}
        onChangeText={setConfirmacion}
        placeholder="Escribe la misma contraseña"
        secureTextEntry={!verClave}
        autoCapitalize="none"
        autoCorrect={false}
        autoComplete="new-password"
        textContentType="newPassword"
        error={errores.confirmacion ?? undefined}
        returnKeyType="done"
        onSubmitEditing={() => void crearCuenta()}
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
        Al crear la cuenta te enviaremos un correo para verificar tu dirección.
        Debes abrirlo antes de ingresar a la ruta.
      </Text>

      <AppButton
        title="Crear mi cuenta"
        icon={Icons.person}
        loading={enviando}
        onPress={() => void crearCuenta()}
      />
    </AuthScreen>
  );
}
