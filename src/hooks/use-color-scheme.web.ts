import { useSyncExternalStore } from 'react';
import { useColorScheme as useRNColorScheme } from 'react-native';

const suscribir = () => () => {};

/**
 * To support static rendering, this value needs to be re-calculated on the client side for web.
 * `useSyncExternalStore` devuelve `false` en el servidor y `true` al hidratar, sin un efecto.
 */
export function useColorScheme() {
  const hasHydrated = useSyncExternalStore(
    suscribir,
    () => true,
    () => false,
  );

  const colorScheme = useRNColorScheme();

  if (hasHydrated) {
    return colorScheme;
  }

  return 'light';
}
