import { SymbolView, type SymbolViewProps } from 'expo-symbols';

import type { IconName } from '@/constants/icons';

interface Props {
  name: IconName;
  size?: number;
  color?: string;
}

/** Envuelve SymbolView para centralizar tamaño y color en toda la app. */
export function AppIcon({ name, size = 22, color = '#0E2635' }: Props) {
  return (
    <SymbolView
      name={name as SymbolViewProps['name']}
      size={size}
      tintColor={color}
      style={{ width: size, height: size }}
    />
  );
}
