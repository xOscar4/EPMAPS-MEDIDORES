import { View } from 'react-native';

import { Brand } from '@/constants/brand';
import { AppGradient } from './app-gradient';

interface Props {
  value: number;
  tone?: string;
}

/** Barra de avance de la ruta: corriente de agua con brillo en la punta. */
export function ProgressBar({ value, tone = Brand.accent }: Props) {
  const porcentaje = Math.max(0, Math.min(1, value)) * 100;
  return (
    <View className="h-2.5 overflow-hidden rounded-full border border-white/20 bg-[rgba(4,38,60,0.30)]">
      <View
        className="h-full min-w-2 justify-center"
        style={{ width: `${porcentaje}%` }}
      >
        <AppGradient
          colors={[tone, Brand.mint]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          className="absolute inset-0 rounded-full"
        />
        <View className="absolute right-px h-1.5 w-1.5 rounded-full bg-white opacity-90" />
      </View>
    </View>
  );
}
