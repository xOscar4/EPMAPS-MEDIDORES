/** Movimiento horizontal de error para formularios de autenticación. */
import { useCallback } from 'react';
import {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

export function useShake() {
  const desplazamiento = useSharedValue(0);

  const agitar = useCallback(() => {
    desplazamiento.set(
      withSequence(
        withTiming(-10, { duration: 55 }),
        withTiming(10, { duration: 55 }),
        withTiming(-7, { duration: 55 }),
        withTiming(7, { duration: 55 }),
        withTiming(0, { duration: 55 }),
      ),
    );
  }, [desplazamiento]);

  const estilo = useAnimatedStyle(() => ({
    transform: [{ translateX: desplazamiento.value }],
  }));

  return { agitar, estilo };
}
