import { Modal, Text, View } from 'react-native';
import Animated, { FadeIn, SlideInDown } from 'react-native-reanimated';

import { SuccessCheck } from '@/components/animations/success-check';
import { AppButton } from '@/components/ui/app-button';
import { AppGradient } from '@/components/ui/app-gradient';
import { AppIcon } from '@/components/ui/app-icon';
import { Brand, Shadows } from '@/constants/brand';
import type { IconName } from '@/constants/icons';
import { Icons } from '@/constants/icons';

type Tono = 'success' | 'warning' | 'info';

interface Props {
  visible: boolean;
  icon?: IconName;
  tone?: Tono;
  title: string;
  message: string;
  primaryLabel: string;
  onPrimary: () => void;
  secondaryLabel?: string;
  onSecondary?: () => void;
  /** Se dispara con el botón atrás de Android; por defecto repite la acción principal. */
  onRequestClose?: () => void;
}

const TONOS = {
  success: { fondo: '#E2F6EC', icono: '#0E6B45' },
  warning: { fondo: Brand.warningSoft, icono: Brand.warning },
  info: { fondo: Brand.primaryLight, icono: Brand.primary },
} as const;

/** Diálogo modal del sistema visual: mismo vidrio, gota y botones que el resto. */
export function AppDialog({
  visible,
  icon = Icons.verified,
  tone = 'success',
  title,
  message,
  primaryLabel,
  onPrimary,
  secondaryLabel,
  onSecondary,
  onRequestClose,
}: Props) {
  const colores = TONOS[tone];

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      onRequestClose={onRequestClose ?? onPrimary}
    >
      {visible ? (
        <Animated.View
          entering={FadeIn.duration(180)}
          className="flex-1 justify-center p-[22px]"
        >
          <AppGradient
            colors={['rgba(4,41,63,0.74)', 'rgba(10,74,117,0.58)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="absolute inset-0"
          />
          <Animated.View entering={SlideInDown.springify().damping(18)}>
            <AppGradient
              colors={['#FFFFFF', '#F6FBFD']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              className="gap-2.5 overflow-hidden rounded-[28px] border border-brand-glass-border p-[22px]"
              style={Shadows.floating}
            >
              <View
                pointerEvents="none"
                className="absolute right-[-34px] top-[-24px] opacity-[0.06]"
              >
                <AppIcon name={Icons.drop} size={130} color={Brand.primary} />
              </View>

              {tone === 'success' ? (
                <SuccessCheck size={56} />
              ) : (
                <View
                  className="mb-0.5 h-14 w-14 items-center justify-center rounded-[18px] border border-brand-glass-border"
                  style={{ backgroundColor: colores.fondo }}
                >
                  <AppIcon name={icon} size={28} color={colores.icono} />
                </View>
              )}

              <Text className="text-[20px] font-extrabold leading-[25px] tracking-[-0.3px] text-brand-text">
                {title}
              </Text>
              <Text className="text-[13.5px] leading-5 text-brand-muted">
                {message}
              </Text>

              <View className="mt-2 gap-2">
                <AppButton title={primaryLabel} onPress={onPrimary} />
                {secondaryLabel && onSecondary ? (
                  <AppButton title={secondaryLabel} variant="ghost" onPress={onSecondary} />
                ) : null}
              </View>
            </AppGradient>
          </Animated.View>
        </Animated.View>
      ) : null}
    </Modal>
  );
}
