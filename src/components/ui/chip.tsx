import { StyleSheet, Text, View } from 'react-native';

import { Brand, Radius } from '@/constants/brand';
import type { IconName } from '@/constants/icons';
import { AppIcon } from './app-icon';

type Tono = 'neutral' | 'success' | 'warning' | 'danger' | 'info';

interface Props {
  label: string;
  tone?: Tono;
  icon?: IconName;
}

const TONOS = {
  neutral: { fondo: '#F2F8FB', texto: '#3F5D6E', borde: 'rgba(11,92,142,0.14)' },
  success: { fondo: '#E3F6EC', texto: Brand.success, borde: 'rgba(17,112,74,0.22)' },
  warning: { fondo: '#FFF4DF', texto: Brand.warning, borde: 'rgba(154,91,0,0.24)' },
  danger: { fondo: '#FDECEA', texto: Brand.danger, borde: 'rgba(179,38,30,0.22)' },
  info: { fondo: '#E6F3FA', texto: Brand.primary, borde: 'rgba(11,92,142,0.20)' },
} as const;

export function Chip({ label, tone = 'neutral', icon }: Props) {
  const colores = TONOS[tone];
  return (
    <View style={[styles.chip, { backgroundColor: colores.fondo, borderColor: colores.borde }]}>
      {icon ? <AppIcon name={icon} size={13} color={colores.texto} /> : null}
      <Text style={[styles.label, { color: colores.texto }]} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    borderRadius: Radius.pill,
    borderWidth: 1,
    paddingHorizontal: 9,
    paddingVertical: 4,
    alignSelf: 'flex-start',
    flexShrink: 1,
  },
  label: { fontSize: 10, fontWeight: '800', letterSpacing: 0.3, flexShrink: 1 },
});
