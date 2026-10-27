import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';

import { Brand, Radius, Shadows } from '@/constants/brand';
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
    <View style={[glass ? styles.glass : styles.solid, style]}>
      {icon ? (
        <View style={[styles.iconBox, glass ? styles.iconGlass : styles.iconSolid]}>
          <AppIcon name={icon} size={12} color={iconColor} />
        </View>
      ) : null}
      <Text style={[styles.value, { color }]} numberOfLines={1} adjustsFontSizeToFit>
        {value}
      </Text>
      <Text style={[styles.label, { color: labelColor }]} numberOfLines={2}>
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

const styles = StyleSheet.create({
  glass: {
    flex: 1,
    minWidth: 0,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.22)',
    backgroundColor: 'rgba(255,255,255,0.13)',
    paddingVertical: 8,
    paddingHorizontal: 8,
    alignItems: 'center',
    gap: 1,
  },
  solid: {
    flex: 1,
    minWidth: 0,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Brand.glassBorder,
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    paddingHorizontal: 8,
    alignItems: 'center',
    gap: 2,
    ...Shadows.tile,
  },
  iconBox: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 1,
  },
  iconGlass: { backgroundColor: 'rgba(255,255,255,0.16)' },
  iconSolid: { backgroundColor: Brand.primarySoft },
  value: { fontSize: 21, fontWeight: '800', letterSpacing: -0.4, lineHeight: 25 },
  label: {
    fontSize: 9,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    textAlign: 'center',
  },
});
