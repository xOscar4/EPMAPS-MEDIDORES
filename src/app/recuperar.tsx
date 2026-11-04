import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Text, View } from 'react-native';

import { SuccessCheck } from '@/components/animations/success-check';
import { AppButton } from '@/components/ui/app-button';
import { AppIcon } from '@/components/ui/app-icon';
import { AppInput } from '@/components/ui/app-input';
import { Brand } from '@/constants/brand';
import { Icons } from '@/constants/icons';
import { useAuth } from '@/features/auth/auth-provider';
import { AuthScreen } from '@/features/auth/components/auth-screen';
import { mensajeDeError } from '@/features/auth/errores-firebase';
import { validarCorreo } from '@/features/auth/validaciones';

export default function RecuperarScreen() {
  const { enviarCorreoRecuperacion } = useAuth();
  const router = useRouter();
  const params = useLocalSearchParams<{ correo?: string }>();

  const [correo, setCorreo] = useState(params.correo ?? '');
  const [errorCorreo, setErrorCorreo] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);

  const enviar = async () => {
    setError('');
    const validacion = validarCorreo(correo);
    setErrorCorreo(validacion);
    if (validacion) return;

    setEnviando(true);
    try {
      await enviarCorreoRecuperacion(correo);
      setEnviado(true);
    } catch (e) {
      setError(mensajeDeError(e));
    } finally {
      setEnviando(false);
    }
  };

  if (enviado) {
    return (
      <AuthScreen
        eyebrow="EPMAPS · RECUPERAR ACCESO"
        title="Revisa tu correo"
        subtitle="Enviamos un enlace para crear una contraseña nueva."
        onBack={() => router.replace('/')}
        footer={
          <AppButton
            title="Volver al inicio de sesión"
            variant="ghost"
            icon={Icons.arrowBack}
            onPress={() => router.replace('/')}
          />
        }
      >
        <View className="items-center gap-3 py-2">
          <SuccessCheck size={76} />
          <Text className="text-center text-[18px] font-extrabold text-brand-text">
            Correo enviado
          </Text>
          <Text className="text-center text-[13px] leading-5 text-brand-muted">
            Si <Text className="font-bold text-brand-primary">{correo.trim()}</Text>{' '}
            está registrado, recibirás un enlace de Firebase para restablecer la
            contraseña. Revisa también la carpeta de spam.
          </Text>
        </View>
      </AuthScreen>
    );
  }

  return (
    <AuthScreen
      eyebrow="EPMAPS · RECUPERAR ACCESO"
      title="Olvidé mi contraseña"
      subtitle="Escribe tu correo y te enviaremos un enlace para cambiarla."
      onBack={() => router.replace('/')}
      footer={
        <View className="flex-row items-center justify-center gap-1">
          <Text className="text-[12px] text-brand-muted">¿La recordaste?</Text>
          <Text
            accessibilityRole="link"
            onPress={() => router.replace('/')}
            className="text-[12px] font-extrabold text-brand-primary"
          >
            Inicia sesión
          </Text>
        </View>
      }
    >
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
        error={errorCorreo ?? undefined}
        returnKeyType="done"
        onSubmitEditing={() => void enviar()}
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
        Por seguridad, Firebase no indica si el correo existe o no. Si no llega
        el mensaje, revisa que esté bien escrito y vuelve a intentarlo.
      </Text>

      <AppButton
        title="Enviar enlace"
        icon={Icons.arrowForward}
        loading={enviando}
        onPress={() => void enviar()}
      />
    </AuthScreen>
  );
}
