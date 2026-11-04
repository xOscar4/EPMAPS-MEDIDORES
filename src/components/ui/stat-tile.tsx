import { Text, View, type StyleProp, type ViewStyle } from 'react-native';

import { Brand, Shadows } from '@/constants/brand';
import type { IconName } from '@/constants/icons';
import { AppIcon } from './app-icon';

type Tono = 'neutral' | 'brand' | 'warning' | 'success';

interface Props {
  value: string | number;
  label: string;
  icon?: IconName;
  tone?: Tono;
  appearance?: 'glass' | 'solid';
  style?: StyleProp<ViewStyle>;
}

/**
 * Indicador numérico reutilizable. `glass` se usa sobre encabezados oscuros y
 * `solid` sobre el fondo claro, siempre con cifras grandes y legibles al sol.
 */
export function StatTile({
  value,
  label,
  icon,
  tone = 'neutral',
  appearance = 'glass',
  style,
}: Props) {
  const glass = appearance === 'glass';
  const color = glass ? GLASS_VALUES[tone] : SOLID_VALUES[tone];
  const labelColor = glass ? '#E1F2F8' : Brand.textMuted;
  const iconColor = glass ? GLASS_ICONS[tone] : SOLID_VALUES[tone];

  return (
    <View
      className={`min-w-0 flex-1 items-center rounded-[16px] border px-2 ${
        glass
          ? 'gap-px border-white/20 bg-white/10 py-2'
          : 'gap-0.5 border-brand-glass-border bg-white py-2.5'
      }`}
      style={[!glass && Shadows.tile, style]}
    >
      {icon ? (
        <View
          className={`mb-px h-[22px] w-[22px] items-center justify-center rounded-full ${
            glass ? 'bg-white/[0.15]' : 'bg-brand-primary-soft'
          }`}
        >
          <AppIcon name={icon} size={12} color={iconColor} />
        </View>
      ) : null}
      <Text
        className="text-[21px] font-extrabold leading-[25px] tracking-[-0.4px]"
        style={{ color }}
        numberOfLines={1}
        adjustsFontSizeToFit
      >
        {value}
      </Text>
      <Text
        className="text-center text-[9px] font-extrabold uppercase tracking-[0.5px]"
        style={{ color: labelColor }}
        numberOfLines={2}
      >
        {label}
      </Text>
    </View>
  );
}

const GLASS_VALUES: Record<Tono, string> = {
  neutral: '#FFFFFF',
  brand: '#CFF6FA',
  warning: '#FFD9A3',
  success: '#B4F2D4',
};

const GLASS_ICONS: Record<Tono, string> = {
  neutral: '#DCF3F9',
  brand: '#CFF6FA',
  warning: '#FFD9A3',
  success: '#B4F2D4',
};

const SOLID_VALUES: Record<Tono, string> = {
  neutral: Brand.primaryDeep,
  brand: Brand.primary,
  warning: Brand.warning,
  success: Brand.success,
};
