import { usePathname, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Modal, Text, View } from 'react-native';
import Animated, { FadeIn, SlideInDown } from 'react-native-reanimated';

import { AppButton } from '@/components/ui/app-button';
import { AppGradient } from '@/components/ui/app-gradient';
import { AppIcon } from '@/components/ui/app-icon';
import { Brand, Shadows } from '@/constants/brand';
import { Icons } from '@/constants/icons';
import type { BorradorLectura } from '@/types/models';
import { useAuth } from '@/features/auth/auth-provider';
import { borrarBorrador, leerBorrador } from './draft';

/**
 * R8: al abrir la app se ofrece continuar o descartar el registro inconcluso.
 * Se oculta si el técnico ya está dentro de la pantalla de lectura.
 */
export function DraftGate() {
  const { tecnico } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [borrador, setBorrador] = useState<BorradorLectura | null>(null);

  useEffect(() => {
    if (!tecnico || pathname.startsWith('/lectura')) return;
    let activo = true;
    leerBorrador().then((guardado) => {
      if (activo && guardado) setBorrador(guardado);
    });
    return () => {
      activo = false;
    };
  }, [tecnico, pathname]);

  if (!borrador) return null;

  const continuar = () => {
    const codigo = borrador.codigo;
    setBorrador(null);
    router.push({ pathname: '/lectura/[codigo]', params: { codigo, continuar: '1' } });
  };

  const descartar = async () => {
    await borrarBorrador();
    setBorrador(null);
  };

  return (
    <Modal transparent visible animationType="none" onRequestClose={continuar}>
      <Animated.View
        entering={FadeIn.duration(180)}
        className="flex-1 justify-center p-6"
      >
        <AppGradient
          colors={['rgba(4,41,63,0.74)', 'rgba(10,74,117,0.58)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="absolute inset-0"
        />
        <Animated.View entering={SlideInDown.springify().damping(18)}>
          <AppGradient
            colors={['#FFFFFF', '#F7FBFD']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="gap-3 overflow-hidden rounded-[28px] border border-brand-glass-border p-6"
            style={Shadows.floating}
          >
            <View
              pointerEvents="none"
              className="absolute right-[-30px] top-[-20px] opacity-[0.06]"
            >
              <AppIcon name={Icons.drop} size={120} color={Brand.primary} />
            </View>
            <View className="h-[60px] w-[60px] items-center justify-center rounded-[19px] border border-brand-glass-border bg-[#FFF4DF]">
              <AppIcon name={Icons.timer} size={30} color={Brand.warning} />
            </View>
            <Text className="text-[20px] font-extrabold tracking-[-0.3px] text-brand-text">
              Tienes un registro sin terminar
            </Text>
            <Text className="mb-1.5 text-[14px] leading-[21px] text-brand-muted">
              Empezaste la lectura del medidor{' '}
              <Text className="font-extrabold text-brand-primary">{borrador.codigo}</Text>. Puedes
              continuar donde la dejaste o descartarla.
            </Text>
            <AppButton title="Continuar registro" icon={Icons.arrowForward} onPress={continuar} />
            <AppButton title="Descartar y empezar de nuevo" variant="ghost" onPress={() => void descartar()} />
          </AppGradient>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}
