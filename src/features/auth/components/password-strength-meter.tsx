/** Barra animada que indica si la contraseña es débil, media o fuerte. */
import { useEffect } from 'react';
import { Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { Brand } from '@/constants/brand';
import { medirClave, type NivelClave } from '../password-strength';

const COLORES: Record<NivelClave, string> = {
  debil: Brand.danger,
  media: Brand.warning,
  fuerte: Brand.success,
};

interface Props {
  clave: string;
}

export function PasswordStrengthMeter({ clave }: Props) {
  const { nivel, etiqueta, porcentaje, sugerencia } = medirClave(clave);
  const progreso = useSharedValue(0);

  useEffect(() => {
    progreso.value = withTiming(clave ? porcentaje : 0, { duration: 260 });
  }, [clave, porcentaje, progreso]);

  const relleno = useAnimatedStyle(() => ({
    width: `${progreso.value}%`,
  }));

  return (
    <View className="gap-1.5">
      <View className="h-1.5 overflow-hidden rounded-full bg-brand-border">
        <Animated.View
          className="h-1.5 rounded-full"
          style={[{ backgroundColor: COLORES[nivel] }, relleno]}
        />
      </View>
      <View className="flex-row items-center justify-between gap-2">
        <Text className="text-[11px] font-bold text-brand-muted">
          Seguridad:{' '}
          <Text style={{ color: COLORES[nivel] }} className="font-extrabold">
            {etiqueta}
          </Text>
        </Text>
        <Text className="flex-1 text-right text-[10px] text-brand-muted">
          {sugerencia}
        </Text>
      </View>
    </View>
  );
}
