import { Redirect, useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';

import { SuccessCheck } from '@/components/animations/success-check';
import { AppButton } from '@/components/ui/app-button';
import { AppIcon } from '@/components/ui/app-icon';
import { WaterGlow } from '@/components/ui/water-decor';
import { Brand } from '@/constants/brand';
import { Icons } from '@/constants/icons';
import { useAuth } from '@/features/auth/auth-provider';
import { AuthScreen } from '@/features/auth/components/auth-screen';
import { mensajeDeError } from '@/features/auth/errores-firebase';

export default function VerificarCorreoScreen() {
  const {
    usuario,
    correo,
    cargando,
    emailVerificado,
    enviarVerificacion,
    recargarUsuario,
    cerrarSesion,
  } = useAuth();
  const router = useRouter();

  const [reenviando, setReenviando] = useState(false);
  const [comprobando, setComprobando] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const [enviado, setEnviado] = useState(false);

  if (cargando) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator color={Brand.primary} size="large" />
      </View>
    );
  }

  if (!usuario) return <Redirect href="/" />;
  if (emailVerificado) return <Redirect href="/rutas" />;

  const reenviar = async () => {
    setError('');
    setMensaje('');
    setReenviando(true);
    try {
      await enviarVerificacion();
      setEnviado(true);
      setMensaje('Correo reenviado. Revisa tu bandeja y la carpeta de spam.');
    } catch (e) {
      setError(mensajeDeError(e));
    } finally {
      setReenviando(false);
    }
  };

  const comprobar = async () => {
    setError('');
    setMensaje('');
    setComprobando(true);
    try {
      const verificado = await recargarUsuario();
      if (verificado) {
        router.replace('/rutas');
        return;
      }
      setError(
        'Todavía no aparece como verificado. Abre el enlace del correo y vuelve a comprobar.',
      );
    } catch (e) {
      setError(mensajeDeError(e));
    } finally {
      setComprobando(false);
    }
  };

  const salir = async () => {
    await cerrarSesion();
    router.replace('/');
  };

  return (
    <AuthScreen
      eyebrow="EPMAPS · VERIFICACIÓN"
      title="Verifica tu correo"
      subtitle="Antes de entrar a la ruta necesitamos confirmar que el correo es tuyo."
    >
      <View className="items-center gap-2 py-1">
        {enviado ? (
          <SuccessCheck size={68} />
        ) : (
          <View className="h-[68px] w-[68px] items-center justify-center rounded-full bg-brand-primary-light">
            <AppIcon name={Icons.verified} size={34} color={Brand.primary} />
            <View className="absolute -right-1 -top-1 h-5 w-5 items-center justify-center rounded-full bg-brand-warning">
              <Text className="text-[10px] font-extrabold text-white">1</Text>
            </View>
          </View>
        )}
        <Text className="text-center text-[18px] font-extrabold text-brand-text">
          Revisa tu bandeja de entrada
        </Text>
        <Text className="text-center text-[13px] leading-5 text-brand-muted">
          Enviamos un enlace de verificación a{' '}
          <Text className="font-bold text-brand-primary">{correo}</Text>.
        </Text>
      </View>

      <View className="gap-2 rounded-[16px] border border-brand-glass-border bg-brand-surface-alt p-3.5">
        <Paso numero="1" texto="Abre el correo de Firebase (revisa spam)." />
        <Paso numero="2" texto="Toca el enlace para confirmar la dirección." />
        <Paso numero="3" texto="Vuelve a esta pantalla y comprueba." />
      </View>

      {mensaje ? (
        <View className="flex-row items-center gap-2 rounded-[12px] border border-[rgba(18,122,85,0.18)] bg-[rgba(18,122,85,0.08)] p-2.5">
          <AppIcon name={Icons.verified} size={17} color={Brand.success} />
          <Text className="flex-1 text-[12px] font-semibold text-brand-success">
            {mensaje}
          </Text>
        </View>
      ) : null}

      {error ? (
        <View className="flex-row items-center gap-2 rounded-[12px] border border-[rgba(184,59,52,0.18)] bg-[rgba(184,59,52,0.08)] p-2.5">
          <AppIcon name={Icons.error} size={17} color={Brand.danger} />
          <Text className="flex-1 text-[12px] font-semibold text-brand-danger">
            {error}
          </Text>
        </View>
      ) : null}

      <AppButton
        title="Ya verifiqué mi correo"
        icon={Icons.check}
        loading={comprobando}
        onPress={() => void comprobar()}
      />
      <AppButton
        title="Reenviar correo de verificación"
        icon={Icons.refresh}
        variant="secondary"
        loading={reenviando}
        onPress={() => void reenviar()}
      />

      <Pressable
        accessibilityRole="button"
        onPress={() => void salir()}
        hitSlop={8}
        className="mt-1 self-center py-1"
      >
        <Text className="text-[12px] font-bold text-brand-muted">
          Cerrar sesión
        </Text>
      </Pressable>

      <WaterGlow
        tone={Brand.primaryLight}
        size={120}
        style={{ right: -40, bottom: -40 }}
        opacity={0.5}
      />
    </AuthScreen>
  );
}

function Paso({ numero, texto }: { numero: string; texto: string }) {
  return (
    <View className="flex-row items-center gap-2.5">
      <View className="h-6 w-6 items-center justify-center rounded-full bg-brand-primary-light">
        <Text className="text-[11px] font-extrabold text-brand-primary">
          {numero}
        </Text>
      </View>
      <Text className="flex-1 text-[12px] leading-4 text-brand-text">{texto}</Text>
    </View>
  );
}
