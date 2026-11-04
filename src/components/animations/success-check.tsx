/** Animación visual para confirmar que una operación terminó bien. */
import { useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { AppIcon } from '@/components/ui/app-icon';
import { Brand } from '@/constants/brand';
import { Icons } from '@/constants/icons';

interface Props {
  size?: number;
  tone?: 'success' | 'primary';
}

export function SuccessCheck({ size = 72, tone = 'success' }: Props) {
  const escala = useSharedValue(0);
  const marca = useSharedValue(0);

  useEffect(() => {
    // El círculo aparece con rebote y la marca se dibuja un instante después.
    escala.value = withSpring(1, { damping: 12, stiffness: 180 });
    marca.value = withDelay(
      140,
      withTiming(1, { duration: 220, easing: Easing.out(Easing.cubic) }),
    );
  }, [escala, marca]);

  const circulo = useAnimatedStyle(() => ({
    transform: [{ scale: escala.value }],
  }));

  const check = useAnimatedStyle(() => ({
    opacity: marca.value,
    transform: [{ scale: 0.5 + marca.value * 0.5 }],
  }));

  const fondo = tone === 'success' ? Brand.successSoft : Brand.primaryLight;
  const color = tone === 'success' ? Brand.success : Brand.primary;

  return (
    <View style={{ width: size, height: size }} className="items-center justify-center">
      <Animated.View
        className="absolute items-center justify-center rounded-full"
        style={[
          { width: size, height: size, backgroundColor: fondo },
          circulo,
        ]}
      />
      <Animated.View style={check}>
        <AppIcon name={Icons.check} size={size * 0.5} color={color} />
      </Animated.View>
    </View>
  );
}
