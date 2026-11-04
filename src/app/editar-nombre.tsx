import { Redirect, useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';

import { AppButton } from '@/components/ui/app-button';
import { AppDialog } from '@/components/ui/app-dialog';
import { AppIcon } from '@/components/ui/app-icon';
import { AppInput } from '@/components/ui/app-input';
import { Brand } from '@/constants/brand';
import { Icons } from '@/constants/icons';
import { useAuth } from '@/features/auth/auth-provider';
import { AuthScreen } from '@/features/auth/components/auth-screen';
import { mensajeDeError } from '@/features/auth/errores-firebase';
import { validarNombre } from '@/features/auth/validaciones';

export default function EditarNombreScreen() {
  const {
    usuario,
    tecnico,
    nombre,
    correo,
    cargando,
    emailVerificado,
    actualizarNombre,
  } = useAuth();
  const router = useRouter();

  const [nuevoNombre, setNuevoNombre] = useState(nombre ?? '');
  const [errorNombre, setErrorNombre] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [guardando, setGuardando] = useState(false);
  const [guardado, setGuardado] = useState(false);

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

  const guardar = async () => {
    setError('');
    const validacion = validarNombre(nuevoNombre);
    setErrorNombre(validacion);
    if (validacion) return;

    setGuardando(true);
    try {
      await actualizarNombre(nuevoNombre);
      setGuardado(true);
    } catch (e) {
      setError(mensajeDeError(e));
    } finally {
      setGuardando(false);
    }
  };

  const volver = () => {
    if (router.canGoBack()) router.back();
    else router.replace('/ajustes');
  };

  return (
    <>
      <AuthScreen
        eyebrow="EPMAPS · PERFIL"
        title="Editar nombre"
        subtitle="Este nombre se muestra en el saludo de tu ruta y en los ajustes."
        onBack={volver}
      >
        <View className="flex-row items-center gap-3 rounded-[16px] border border-brand-glass-border bg-brand-surface-alt p-3">
          <View className="h-11 w-11 items-center justify-center rounded-[14px] bg-brand-primary-light">
            <AppIcon name={Icons.person} size={22} color={Brand.primary} />
          </View>
          <View className="flex-1">
            <Text className="text-[10px] font-extrabold uppercase tracking-[0.8px] text-brand-muted">
              Nombre actual
            </Text>
            <Text className="text-[15px] font-extrabold text-brand-text">
              {nombre ?? 'Sin nombre'}
            </Text>
            <Text className="text-[11px] text-brand-muted">{correo}</Text>
          </View>
        </View>

        <AppInput
          label="Nuevo nombre"
          value={nuevoNombre}
          onChangeText={setNuevoNombre}
          placeholder="Escribe tu nombre"
          autoCapitalize="words"
          autoComplete="name"
          textContentType="name"
          error={errorNombre ?? undefined}
          hint="Mínimo 3 letras. Se guarda con updateProfile de Firebase."
          returnKeyType="done"
          onSubmitEditing={() => void guardar()}
        />

        {error ? (
          <View className="flex-row items-center gap-2 rounded-[12px] border border-[rgba(184,59,52,0.18)] bg-[rgba(184,59,52,0.08)] p-2.5">
            <AppIcon name={Icons.error} size={17} color={Brand.danger} />
            <Text className="flex-1 text-[12px] font-semibold text-brand-danger">
              {error}
            </Text>
          </View>
        ) : null}

        <AppButton
          title="Guardar nombre"
          icon={Icons.save}
          loading={guardando}
          onPress={() => void guardar()}
        />
        <AppButton
          title="Cancelar"
          variant="ghost"
          onPress={volver}
        />
      </AuthScreen>

      <AppDialog
        visible={guardado}
        tone="success"
        icon={Icons.person}
        title="Nombre actualizado"
        message={`Desde ahora aparecerás como ${nombre ?? nuevoNombre.trim()}.`}
        primaryLabel="Listo"
        onPrimary={() => {
          setGuardado(false);
          volver();
        }}
        onRequestClose={() => setGuardado(false)}
      />
    </>
  );
}
